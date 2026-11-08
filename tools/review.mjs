// 课程审读辅助：prose 输出可读正文，style 报告讲解写法信号。只读源码，不参与构建。
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ROOT,parseLesson} from './build.mjs';

const lessonIDs=()=>fs.readdirSync(path.join(ROOT,'lessons')).filter(n=>n.endsWith('.md')&&!n.endsWith('.local.md')).map(n=>n.slice(0,-3)).sort();
const load=(id,source)=>parseLesson(source??fs.readFileSync(path.join(ROOT,'lessons',`${id}.md`),'utf8'));
const decode=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
const label=tag=>(tag.match(/aria-label="([^"]*)"/)||[])[1]||'';

// 把一段正文 Markdown/HTML 转成纯文本，公式与图示留下无障碍说明。
export function plain(md){
 return decode(md
  .replace(/<!--[\s\S]*?-->/g,'')
  .replace(/<math\b[^>]*>[\s\S]*?<\/math>/g,m=>`〔式：${label(m)}〕`)
  .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/g,m=>`〔图：${label(m)}〕`)
  .replace(/<summary>([\s\S]*?)<\/summary>/g,'【折叠：$1】\n')
  .replace(/<\/?(sub|sup|i|em|strong|b)>/g,'')
  .replace(/<\/p>\s*/g,'\n\n')
  .replace(/<[^>]+>/g,''))
  .replace(/\n{3,}/g,'\n\n').trim();
}

export function prose(id){
 const d=load(id),out=[`# ${d.meta.title}（${id} ${d.meta.version}）`,''];
 for(const s of d.sections){
  out.push(`## ${s.title} {#${s.id}}`,'');
  let body=s.body.replace(/<div data-activity-slot="([^"]+)"><\/div>/g,(_,a)=>{const x=d.activities.find(v=>v.id===a);return `〔交互：${a}（${x?.type}）〕`;});
  body=body.replace(/<div data-quiz-slot="(\d+):(\d+)"><\/div>/g,(_,a,n)=>d.quizzes.slice(+a,+a+ +n).map((q,i)=>`Q${+a+i+1} [${q.id}→#${q.concept}] ${q.question}\n  ${q.options.map(o=>`${o.id}. ${o.text}`).join(' / ')}  答案 ${q.answer}\n  解析：${q.explanation}`).join('\n\n'));
  out.push(plain(body),'');
 }
 return out.join('\n');
}

const CAVEAT=/不能|不等于|不应|不可|须核对|需核对|须检查/g;
const META=/本课(采用|把|不把|据此|使用|只)|本页(不|采用|按)|勘读|排版与量纲/;
const ABSTRACT=/提供[^。；]{0,12}(基准|入口|条件|桥梁)|接到[^。；]{0,8}上|承担[^。；]{0,8}任务|可检查的|铺路/;
const NUMBER=/\d[\d.]*\s*(×\s*10|K\b|eV|nm|μm|Å|倍|%|km|pc|M⊙|R⊙)|10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g;
const PREDICT=/预测|先猜|会[^。]{0,16}吗|？/;
const len=s=>s.replace(/\s/g,'').length;

// 启发式信号，只提示需要人工判断的位置，不作为构建或合并门槛。
export function style(id,source){
 const d=load(id,source),signals=[];let chars=0,caveats=0,numbers=0;
 for(const s of d.sections){
  if(s.body.includes('data-quiz-slot'))continue;
  const main=s.body.replace(/<details>[\s\S]*?<\/details>/g,'');
  // 公式、图示和表格不计入段落；列表每一项按一段计。
  const paras=main.replace(/<math\b[\s\S]*?<\/math>|<svg\b[\s\S]*?<\/svg>|<figure\b[\s\S]*?<\/figure>/g,' ')
   .split(/\n\s*\n|\n(?=\s*(?:[-*]|\d+\.)\s)/).map(p=>p.trim())
   .filter(p=>p&&!/^(\||<div data-|阅读：|###|<div class="read-book")/.test(p));
  const text=plain(paras.join('\n\n'));
  chars+=len(text);caveats+=(text.match(CAVEAT)||[]).length;const n=(text.match(NUMBER)||[]).length;numbers+=n;
  if(!n&&s.id!=='overview')signals.push([s.id,'正文没有具体数值或算例','']);
  for(const p of paras){
   const t=plain(p),head=t.slice(0,28);
   if(len(t)>220)signals.push([s.id,`段落约 ${len(t)} 字，考虑拆分`,head]);
   const c=(t.match(CAVEAT)||[]).length;if(c>1)signals.push([s.id,`一段含 ${c} 处告诫，只留最关键的一条`,head]);
   if(META.test(t))signals.push([s.id,'正文含编写或勘读说明，移入折叠块或过程记录',t.match(META)[0]]);
   if(ABSTRACT.test(t))signals.push([s.id,'抽象概括，补出具体过程',t.match(ABSTRACT)[0]]);
  }
  const after=[...main.matchAll(/<div data-activity-slot="([^"]+)"><\/div>\s*\n\s*\n([^\n]+)/g)];
  for(const [,a,p] of after)if(!PREDICT.test(p)&&(p.match(NUMBER)||[]).length)signals.push([s.id,`交互 ${a} 的说明在操作前给出读数，改为先预测`,plain(p).slice(0,28)]);
 }
 for(const q of d.quizzes)if(len(q.explanation)<70)signals.push([q.id,`解析约 ${len(q.explanation)} 字，补出误解为何诱人`,'']);
 return {id,version:d.meta.version,chars,caveatsPerK:+(caveats*1000/Math.max(chars,1)).toFixed(1),numbers,signals};
}

function printStyle(r){
 console.log(`${r.id} ${r.version}：正文约 ${r.chars} 字，告诫 ${r.caveatsPerK}/千字，具体数值 ${r.numbers} 处，信号 ${r.signals.length} 条`);
 for(const [where,what,ex] of r.signals)console.log(`  #${where}  ${what}${ex?`  「${ex}」`:''}`);
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [cmd,arg]=process.argv.slice(2);
  if(cmd==='prose'&&arg)console.log(prose(arg));
  else if(cmd==='style'&&arg==='all'){console.log('课程\t正文字数\t告诫/千字\t具体数值\t信号');for(const id of lessonIDs()){const r=style(id);console.log(`${id}\t${r.chars}\t${r.caveatsPerK}\t${r.numbers}\t${r.signals.length}`);}}
  else if(cmd==='style'&&arg)printStyle(style(arg));
  else throw new Error('用法：node tools/review.mjs prose <ID> | style <ID|all>');
 }catch(e){console.error(e.message);process.exitCode=1;}
}
