#!/usr/bin/env python3
"""Build a local-source navigation index; never modify the books."""
from pathlib import Path
import re, json, hashlib
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[1]
COUNTS={'Volume1':19,'Volume2':16,'Volume3':20,'Ref':30}
def books():
 for book,count in COUNTS.items():
  base=ROOT/'archive/library'/book
  manifest=json.loads((base/'按书签拆分/拆分清单.json').read_text())
  entries={x['文件']:x for x in manifest['文件']}
  chapters=[];aux=[]
  for md in sorted((base/'MinerU_outputs').glob('*/*.md')):
   stem=md.stem
   pat=r'^\d+_第\s*(\d+)\s*章\s*(.*)' if book=='Ref' else r'^\d+_(\d+)\s+(.*)'
   match=re.match(pat,stem)
   if not match:
    aux.append(md);continue
   n=int(match[1]);title=match[2]
   if not 1<=n<=count:continue
   pdf=base/'按书签拆分'/f'{stem}.pdf'
   assert pdf.is_file(),pdf
   headings=[]
   for ln,line in enumerate(md.read_text().splitlines(),1):
    h=re.match(r'^#{1,6}\s+(.+)',line)
    if h and re.match(rf'{n}\.\d',h[1]):headings.append((h[1],ln))
   # Some parsed subheadings have no Markdown heading markers.
   toc=list((base/'MinerU_outputs').glob('*Contents/*.md')) if book!='Ref' else list((base/'MinerU_outputs').glob('*_目录/*.md'))
   toc_lines=[]
   if toc:
    for line in toc[0].read_text().splitlines():
     s=re.sub(r'^#+\s*','',line.strip())
     if re.match(rf'^{n}\.\d',s):toc_lines.append(s)
   chapters.append(dict(book=book,n=n,title=title,md=md,pdf=pdf,range=entries.get(pdf.name,{}).get('原书页码','未核实'),headings=headings,toc=toc_lines))
  assert [c['n'] for c in chapters]==list(range(1,count+1)),(book,[c['n'] for c in chapters])
  yield book,manifest,chapters,aux

def link(p,label):return f'[{label}]({quote("../"+str(p.relative_to(ROOT)),safe="/")})'
def main():
 out=['# 四书目录与本地阅读入口','', '> 历史翻译对应资料；日常制课与修订请直接读取 [教材 PDF](../textbooks/pdf/README.md)，无需维护本表。', '', '本文件是导航，不是正文核实报告。小节标题来自 MinerU 正文及目录，可能含 OCR 误差。', '',
 '页码约定：拆分清单的“原书页码”字段实际记整卷 PDF 的 1 基页序，并非印刷页码；下文统一称整卷 PDF 页序。印刷页码须在使用时查看 PDF。', '',
 '教材版本：Volume1–3 为 E. Böhm-Vitense《Introduction to Stellar Astrophysics》三卷；Ref 为 Carroll 与 Ostlie《当代天体物理学导论》原书第二版中文本（版权页记中文出版 2023）。出版日期不保证内容为最新。', '',
 '读法：目录 / MinerU → 候选对应；逐课精读 → 拆分 PDF 核实；拆分异常 → 整卷 PDF 兜底。译文仅辅助理解。', '',
 '提示：辅助材料存在旧拆分边界异常的可能；如目录名称与正文不一致，须查整卷 PDF，不按文件名推断内容。','']
 for book,manifest,chapters,aux in books():
  original=(ROOT/'textbooks/pdf/Contemporary_Astrophysics_2e.zh-CN.pdf' if book=='Ref' else ROOT/f'textbooks/pdf/originals/Stellar_Astrophysics_Volume_{book[-1]}.en.pdf')
  out += [f'## {book}（{len(chapters)} 个正文编号章节）','',link(original,'整卷 PDF')+' · '+link(ROOT/'archive/library'/book/'按书签拆分/拆分清单.json','拆分清单'),'',f'原始 PDF SHA-256：`{hashlib.sha256(original.read_bytes()).hexdigest()}`','']
  for c in chapters:
   out += [f'<a id="{book.lower()}-ch{c["n"]:02d}"></a>',f'### 第 {c["n"]} 章 {c["title"]}','',link(c['md'],'MinerU 正文')+' · '+link(c['pdf'],'拆分 PDF')+f' · 整卷 PDF 页序 {c["range"]}','']
   if c['headings']:
    out += ['正文小节：']+[f'- {h}（Markdown 第 {ln} 行）' for h,ln in c['headings']]+['']
   if c['toc']:
    out += ['目录条目（末尾数字为目录转录，使用前核实）：']+[f'- {t}' for t in c['toc']]+['']
   if not c['headings'] and not c['toc']:out += ['- 未提取到编号小节，按章阅读。','']
  out += ['### 辅助资料（仅登记）','']+[f'- {link(p,p.stem)}' for p in aux]+['']
  supplemental=ROOT/'archive/library'/book/'supplemental_sources'
  if supplemental.exists():out += ['人工补充拆分（用于处理原拆分边界）：']+[f'- {link(p,p.name)}' for p in sorted(supplemental.glob('*.pdf'))]+['']
 dest=ROOT/'mapping/catalog.md';dest.write_text('\n'.join(out))
 print('catalog: 19 + 16 + 20 + 30 = 85 chapters')
if __name__=='__main__':main()
