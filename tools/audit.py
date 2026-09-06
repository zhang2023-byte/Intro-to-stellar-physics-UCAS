#!/usr/bin/env python3
"""Read-only local audit of migration, navigation, references and Git scope."""
from pathlib import Path
from urllib.parse import unquote
import re,json,hashlib,subprocess
from collections import Counter
from catalog import ROOT,COUNTS,books

def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
def main():
 report={};manifest=ROOT/'archive/migration-manifest.local.json'
 if manifest.exists():
  m=json.loads(manifest.read_text());bad=[r['after'] for r in m['files'] if not (ROOT/r['after']).is_file() or sha(ROOT/r['after'])!=r['sha256']]
  assert not bad, f'迁移内容不一致：{bad[:10]}'
  report['migration_verified_files']=len(m['files']);report['removed_tmp_bytes']=m['removed_tmp_bytes']
 report['tmp_removed']=not (ROOT/'tmp').exists()
 refs=0;missing=[]
 for md in (ROOT/'library').glob('Volume*/translated_outputs/*.md'):
  text=md.read_text()
  images=re.findall(r'!\[[^\]]*\]\(([^)]+)\)',text)+re.findall(r'<img\b[^>]*src=["\']([^"\']+)',text)
  for image in images:
   if image.startswith(('http:','https:','data:')):continue
   p=(md.parent/unquote(image.strip('<>'))).resolve();refs+=1
   if not p.is_file():missing.append(str(p))
 assert not missing, f'译文图片失效：{missing[:10]}'
 report['translated_image_references']=refs
 catalog=(ROOT/'mapping/catalog.md').read_text();anchors=set(re.findall(r'<a id="([^"]+)"',catalog));expected={f'{b.lower()}-ch{n:02d}' for b,count in COUNTS.items() for n in range(1,count+1)}
 assert anchors==expected, '四书目录章节锚点不完整'
 report['catalog_chapters']={b:len(cs) for b,_,cs,_ in books()}
 mappings={}
 for book,count in list(COUNTS.items())[:3]:
  text=(ROOT/f'mapping/{book}.md').read_text();chapters=[int(n) for n in re.findall(r'^## 第\s*(\d+)\s*章\s+',text,re.M)];assert chapters==list(range(1,count+1)),(book,chapters)
  states=Counter()
  for line in text.splitlines():
   if not line.startswith('|'):continue
   cells=[x.strip() for x in line.strip().strip('|').split('|')]
   if len(cells)!=5:continue
   if cells[-1].startswith('候选对应'):states['候选对应']+=1
   elif cells[-1].startswith('已核实'):states['已核实']+=1
   elif cells[-1].startswith('暂未找到'):states['暂未找到']+=1
  assert sum(states.values())>=count,(book,states)
  mappings[book]={'chapters':len(chapters),'rows':dict(states)}
 report['mapping']=mappings
 for md in (ROOT/'mapping').glob('*.md'):
  for target in re.findall(r'\]\(([^)]+)\)',md.read_text()):
   if re.match(r'\w+://',target):continue
   dest,_,anchor=unquote(target).partition('#');p=(md.parent/dest).resolve() if dest else md
   assert p.exists(),f'链接不存在：{md.name} {target}'
   if p.name=='catalog.md' and anchor:assert anchor in anchors,(md.name,anchor)
 candidates=subprocess.check_output(['git','ls-files','--cached','--others','--exclude-standard','-z'],cwd=ROOT).decode().split('\0');candidates=[p for p in candidates if p]
 banned=[];large=[]
 for s in candidates:
  p=Path(s)
  if p.parts[0]=='library' or 'MinerU_outputs' in p.parts or 'translated_outputs' in p.parts or 'feedback-raw' in p.parts or '.local.' in p.name or p.suffix.lower()=='.pdf' or p.name=='.env' or p.name.startswith('.env.') and p.name!='.env.example':banned.append(s)
  if (ROOT/p).is_file() and (ROOT/p).stat().st_size>5*1024*1024:large.append(s)
 assert not banned, f'不应进入Git：{banned}'
 assert not large, f'异常大文件：{large}'
 report['git']={'candidate_files':len(candidates),'banned_files':banned,'files_over_5MiB':large,'staged_files':subprocess.check_output(['git','diff','--cached','--name-only'],cwd=ROOT).decode().splitlines(),'tracked_files':subprocess.check_output(['git','ls-files'],cwd=ROOT).decode().splitlines()}
 print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
