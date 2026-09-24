import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import {dependency} from './deps.mjs';
import {activityTypes,explorerHTML} from './explorers.mjs';
import {books,siteTitle} from './books.mjs';
import {mathText} from './math-text.mjs';
const {marked}=await dependency('marked');
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const validID=/^[A-Za-z][A-Za-z0-9_-]*$/;
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
export const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jsonHTML=o=>JSON.stringify(o).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
function need(test,message){if(!test)throw new Error(message);}
export function parseLesson(source){
 const metaMatch=source.match(/^```lesson\s*\n([\s\S]*?)\n```\s*\n/);
 need(metaMatch,'文件必须以 ```lesson JSON 元数据区块开始');
 const meta=JSON.parse(metaMatch[1]);
 need(validID.test(meta.id),'无效课程 ID');need(meta.demo===undefined||typeof meta.demo==='boolean','demo 必须为布尔值');need(/^\d+\.\d+\.\d+$/.test(meta.version),'版本使用 x.y.z');
 for(const k of ['title','summary','scope'])need(typeof meta[k]==='string'&&meta[k].trim(),`缺少 ${k}`);
 need(Array.isArray(meta.sources)&&meta.sources.length,'必须列出教材依据');
 need(meta.sources.every(x=>typeof x==='string'&&x.trim()),'sources 必须为书目定位字符串');
 let body=source.slice(metaMatch[0].length);const quizzes=[],activities=[];
 body=body.replace(/^```quiz\s*\n([\s\S]*?)\n```/gm,(_,s)=>{const q=JSON.parse(s);need(Array.isArray(q),'quiz 必须是题目数组');const start=quizzes.length;quizzes.push(...q);return `<div data-quiz-slot="${start}:${q.length}"></div>`;});
 body=body.replace(/^```activity\s*\n([\s\S]*?)\n```/gm,(_,s)=>{const a=JSON.parse(s);activities.push(a);return `<div data-activity-slot="${escapeHTML(a.id)}"></div>`;});
 need(quizzes.length>0,'至少一个概念题');
 const sectionRE=/^## (.+) \{#([A-Za-z][A-Za-z0-9_-]*)\}\s*$/gm;
 const sections=[...body.matchAll(sectionRE)].map(m=>({title:m[1],id:m[2],start:m.index,end:m.index+m[0].length}));
 need(sections.length>0,'正文须有 ## 标题 {#稳定ID}');
 need(!body.slice(0,sections[0].start).trim(),'正文从带 ID 的二级标题开始');
 need((body.match(/^## /gm)||[]).length===sections.length,'每个二级标题都需要稳定 ID');
 const sectionIDs=new Set(sections.map(s=>s.id));
 const ids=[...sectionIDs];need(sectionIDs.size===sections.length,'正文 ID 重复');
 for(const q of quizzes){
  need(validID.test(q.id)&&!ids.includes(q.id),`题目 ID 无效或重复：${q.id}`);ids.push(q.id);
  need(['choice','truefalse'].includes(q.type),`题目 ${q.id} 类型错误`);
  need(q.question&&q.explanation&&sectionIDs.has(q.concept),`题目 ${q.id} 缺少题干、解析或有效知识点`);
  need(Array.isArray(q.options)&&q.options.length>=2,`题目 ${q.id} 缺少选项`);
  need(q.options.every(o=>validID.test(o.id)&&typeof o.text==='string'&&o.text.trim()),`题目 ${q.id} 选项格式错误`);
  need(new Set(q.options.map(o=>o.id)).size===q.options.length,`题目 ${q.id} 选项 ID 重复`);
  need(q.options.some(o=>o.id===q.answer),`题目 ${q.id} 答案不在选项中`);
  if(q.type==='truefalse')need(q.options.length===2,`判断题 ${q.id} 应有两个选项`);
 }
 for(const a of activities){need(validID.test(a.id)&&!ids.includes(a.id),'活动 ID 无效或重复');ids.push(a.id);need(a.type==='parallax'||activityTypes.includes(a.type),'未知活动类型；新增活动需配套实现和测试');}
 need(!/\$\$|\\\[/.test(body),'展示公式请使用原生 MathML，不能留下未渲染的 LaTeX');
 need(!/<\s*(script|iframe|object|embed|link|style|form|input|button|meta|base)\b|\son\w+\s*=|javascript\s*:|\bid\s*=|\bstyle\s*=/i.test(body),'正文不能包含脚本、事件、控件、手写 ID 或外部样式；使用结构化区块和标题 ID');
 for(let i=0;i<sections.length;i++)sections[i].body=body.slice(sections[i].end,sections[i+1]?.start??body.length).trim();
 return {meta,quizzes,activities,sections,sourceHash:hash(source),quizHash:hash(JSON.stringify(quizzes))};
}
function embedImages(html,sourceDir){
 return html.replace(/<img\b[^>]*>/gi,tag=>{
  need(!/\bsrcset\s*=/i.test(tag),'不支持 srcset');
  const m=tag.match(/\bsrc="([^"]+)"/i);need(m,'图片缺少 src');let src=m[1];
  need(!/^(https?:|\/\/|file:)/i.test(src),'图片必须是本地原创/可公开素材');
  if(src.startsWith('data:')){need(/^data:image\/(png|jpeg|webp);base64,/.test(src),'内嵌图片只接受 PNG/JPEG/WebP');return tag;}
  const p=path.resolve(sourceDir,decodeURIComponent(src));
  const real=fs.realpathSync(p),rel=path.relative(ROOT,real);
  need(!rel.startsWith('..')&&!path.isAbsolute(rel)&&!rel.startsWith('library'+path.sep)&&!rel.startsWith('archive'+path.sep),'不得嵌入教材、归档或项目外图片');
  const type={'.png':'png','.jpg':'jpeg','.jpeg':'jpeg','.webp':'webp'}[path.extname(p).toLowerCase()];need(type,'图片仅支持 PNG/JPEG/WebP；矢量图使用正文内联 SVG');
  return tag.replace(m[0],`src="data:image/${type};base64,${fs.readFileSync(real).toString('base64')}"`);
 });
}
function feedbackButton(id,label){return `<button class="feedback-link" type="button" data-feedback="${escapeHTML(id)}" data-label="${escapeHTML(label)}">反馈</button>`;}
function highlightTools(){return `<div class="highlight-tools" aria-label="正文高亮工具"><button class="secondary" type="button" data-highlight-add disabled>高亮选区</button><button class="secondary" type="button" data-highlight-remove hidden>取消高亮</button><button class="secondary" type="button" data-highlight-clear disabled>清空本课高亮</button><button class="secondary" type="button" data-highlight-export>导出高亮</button><label class="secondary highlight-file">导入高亮<input type="file" accept="application/json,.json" data-highlight-import></label><span data-highlight-status role="status" aria-live="polite"></span></div>`;}
function quizHTML(quizzes){return `<div class="quiz-summary" role="status" aria-live="polite">全章已答 <span data-answered>0</span> 题 · 答对 <span data-correct>0</span> 题</div><div class="quiz-grid">`+quizzes.map((q,i)=>`<form class="quiz-card" id="${q.id}" data-question="${q.id}"><fieldset><legend><span class="eyebrow">${String(i+1).padStart(2,'0')} / ${q.type==='truefalse'?'判断':'单选'}</span>${mathText(q.question)}</legend>${q.options.map(o=>`<label class="option"><input type="radio" name="${q.id}" value="${o.id}" required><span>${mathText(o.text)}</span></label>`).join('')}</fieldset><div class="quiz-actions"><button class="primary" type="submit">检查答案</button>${feedbackButton(q.id,q.question)}</div><div class="answer-note" aria-live="polite" hidden></div><a class="concept-link" href="#${q.concept}">回看相关概念 ↑</a></form>`).join('')+'</div><button type="button" class="secondary" data-reset-quiz>重新练习本课</button>';}
function activityHTML(a){if(a.type!=='parallax')return explorerHTML(a);return `<div class="activity" id="${a.id}" data-parallax><div class="activity-head"><span class="eyebrow">动手观察 / PARALLAX LAB</span>${feedbackButton(a.id,'视差交互')}</div><label class="slider-label">恒星距离 <output data-distance>5</output> pc<input aria-label="恒星距离（pc）" type="range" min="1" max="50" step="1" value="5"></label><svg viewBox="0 0 700 300" role="img" aria-label="地球在相隔半年的两个位置观察同一颗恒星；视差角是最大角位移的一半"><circle cx="120" cy="150" r="55" fill="none" stroke="#8faaa7" stroke-dasharray="5 5"/><circle cx="120" cy="150" r="9" fill="#eab86b"/><text x="72" y="155">太阳</text><circle cx="120" cy="95" r="6" fill="#147a73"/><circle cx="120" cy="205" r="6" fill="#147a73"/><text x="14" y="86">地球：时刻 A</text><text x="14" y="230">地球：半年后 B</text><line x1="120" y1="95" x2="440" y2="150" stroke="#147a73" stroke-width="2" data-ray/><line x1="120" y1="205" x2="440" y2="150" stroke="#147a73" stroke-width="2" data-ray/><line x1="120" y1="150" x2="440" y2="150" stroke="#8faaa7" stroke-dasharray="6 5" data-ray/><circle cx="440" cy="150" r="8" fill="#df9257" data-star/><text x="430" y="120" data-star-label>恒星</text><text x="130" y="185">1 AU</text><text x="295" y="285">距离增大，夹角减小</text></svg><div class="readouts"><div><span>年周视差 p</span><strong data-parallax-value>0.200″</strong></div><div><span>最大角位移 2p</span><strong data-full-angle>0.400″</strong></div></div><p class="caption">采用圆形地球轨道、黄道极方向的理想化几何；角度在图中夸大，不按比例。数值按 d(pc) = 1 / p(角秒) 计算，忽略测量误差。</p></div>`;}
const styles=()=>fs.readFileSync(path.join(ROOT,'tools/lesson.css'),'utf8');
function documentHTML(title,body,script='',extraStyle=''){return `<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHTML(title)}</title><style>${styles()}${extraStyle}</style></head><body>${body}${script}</body></html>\n`;}
export function renderLesson(data,sourceDir){
 const {meta,sections,quizzes,activities}=data;
 if(meta.updated)need(/^\d{4}-\d{2}-\d{2}$/.test(meta.updated),'更新日期格式须为 YYYY-MM-DD');
 const book=books.find(b=>meta.id.startsWith(b.prefix+'-'));
 const directory=book?'../'+book.id+'.html':'../index.html';
 let content=sections.map((s,i)=>`<section class="lesson-section" id="${s.id}"><div class="section-heading"><span class="section-number">${String(i+1).padStart(2,'0')}</span><h2>${escapeHTML(s.title)}</h2>${feedbackButton(s.id,s.title)}</div>${embedImages(marked.parse(s.body),sourceDir)}</section>`).join('\n');
 content=content.replace(/<div data-quiz-slot="(\d+):(\d+)"><\/div>/g,(_,start,count)=>quizHTML(quizzes.slice(Number(start),Number(start)+Number(count))));
 for(const a of activities)content=content.replace(`<div data-activity-slot="${a.id}"></div>`,activityHTML(a));
 need(!/data-(?:quiz|activity)-slot/.test(content),'结构化区块未渲染');
 const body=`<a class="skip" href="#main">跳到正文</a><header class="topbar"><a href="../index.html">${siteTitle}</a><span>${meta.updated?"更新于 "+escapeHTML(meta.updated):""}</span></header><div class="page-grid"><aside class="sidebar"><a class="directory-link" href="${directory}">← ${book?book.volume+"目录":"课程目录"}</a><p class="nav-heading">本章目录</p><nav aria-label="章节">${sections.map((s,i)=>`<a href="#${s.id}"><small>${String(i+1).padStart(2,'0')}</small>${escapeHTML(s.title)}</a>`).join('')}</nav></aside><main id="main"><header class="hero"><h1>${escapeHTML(meta.title)}</h1><p class="lead">${escapeHTML(meta.summary)}</p><div class="hero-meta"><span>${escapeHTML(meta.scope)}</span></div>${highlightTools()}</header>${content}<footer class="sources"><h2>教材定位</h2><ul>${meta.sources.map(s=>`<li>${escapeHTML(s)}</li>`).join('')}</ul><a href="${directory}">返回${book?book.volume:"课程"}目录 ↑</a></footer></main></div><button class="quiz-return" type="button" data-return-to-quiz hidden>返回课后题 ↓</button><dialog id="feedback-dialog"><div class="dialog-heading"><h2>课程反馈</h2><button type="button" data-close-feedback aria-label="关闭反馈">×</button></div><p data-feedback-context></p><p data-feedback-unavailable hidden>反馈问卷尚未开放。</p><div data-feedback-ready hidden><label>课程位置<textarea data-feedback-location readonly rows="3" aria-label="课程位置"></textarea></label><div class="dialog-actions"><button type="button" class="secondary" data-copy-location>复制位置</button><a class="primary" data-feedback-form-link target="_blank" rel="noopener noreferrer">填写飞书问卷</a></div><p class="caption">将课程位置粘贴到问卷，填写姓名和反馈后提交。</p></div><p data-feedback-status role="status"></p></dialog>`;
 const feedback=JSON.parse(fs.readFileSync(path.join(ROOT,'tools/feedback.json'),'utf8'));
 need(Object.keys(feedback).every(k=>k==='formUrl'),'公开反馈配置只允许问卷URL');
 if(feedback.formUrl){const u=new URL(feedback.formUrl);need(u.protocol==='https:'&&['feishu.cn','larkoffice.com','larksuite.com'].some(d=>u.hostname===d||u.hostname.endsWith('.'+d))&&!u.username&&!u.password,'反馈地址必须是飞书公开问卷的HTTPS链接');}
 const publicData={meta,quizzes:quizzes.map(q=>({...q,explanationHTML:mathText(q.explanation)})),quizHash:data.quizHash,sourceHash:data.sourceHash,feedback};
 return documentHTML(meta.title,body,`<script type="application/json" id="lesson-data">${jsonHTML(publicData)}</script><script>${fs.readFileSync(path.join(ROOT,'tools/lesson.js'),'utf8')}\n${meta.study?fs.readFileSync(path.join(ROOT,'tools/physics.js'),'utf8')+'\n'+fs.readFileSync(path.join(ROOT,'tools/explorers.js'),'utf8'):''}</script>`,activities.some(a=>a.type==='transfer')?fs.readFileSync(path.join(ROOT,'tools/radiative-transfer.css'),'utf8'):'');
}
export function validateHTML(html){
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);need(new Set(ids).size===ids.length,'HTML ID 重复');
 for(const m of html.matchAll(/href="#([^"]+)"/g))need(ids.includes(m[1]),`失效锚点 ${m[1]}`);
 need(!/<(?:script|link|iframe|object|embed)\b[^>]*(?:src|href|data)=/i.test(html),'存在外部可执行依赖');
 for(const m of html.matchAll(/\b(?:src|poster)="([^"]+)"/g))need(m[1].startsWith('data:'),'存在非内嵌资源');
 need(!/url\s*\(\s*["']?(?:https?:|\/\/)/i.test(html),'存在外部 CSS 资源');
 need(!/(?:file:\/\/|\/Users\/|\.\.\/library\/)/.test(html),'输出含本机或教材私有路径');
 for(const tag of html.match(/<(?:image|use)\b[^>]*>/gi)||[]){const m=tag.match(/\b(?:xlink:)?href\s*=\s*["']?([^"'\s>]+)/i);if(m)need(m[1].startsWith('#')||m[1].startsWith('data:image/'),'SVG 存在外部资源');}
 return true;
}
export function build(id){
 need(validID.test(id),'无效课程 ID');const file=path.join(ROOT,'lessons',id+'.md');const source=fs.readFileSync(file,'utf8');const data=parseLesson(source);need(data.meta.id===id,'课程 ID 必须与文件名一致');
 const html=renderLesson(data,path.dirname(file));validateHTML(html);const out=path.join(ROOT,'site/lessons',id+'.html');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html);return {id,version:data.meta.version,bytes:Buffer.byteLength(html),sourceHash:data.sourceHash};
}
function coverHTML(book){
 const image=fs.readFileSync(path.join(ROOT,'assets/covers',book.cover)).toString('base64');
 return `<div class="book-cover"><img src="data:image/png;base64,${image}" alt="" width="1055" height="1491"><div class="cover-title"><span>恒星天体物理学导论</span><strong>${book.title}</strong><span class="cover-volume">${book.volume}</span></div><span class="cover-author">Erika Böhm-Vitense 著</span></div>`;
}
export function renderNavigation(){
 const entries=fs.readdirSync(path.join(ROOT,'lessons')).filter(n=>n.endsWith('.md')&&!n.endsWith('.local.md')).sort().map(n=>parseLesson(fs.readFileSync(path.join(ROOT,'lessons',n),'utf8')).meta);
 const pages=new Map();
 const covers=books.map(b=>`<article class="book-entry"><a class="book-link" href="${b.id}.html" aria-label="打开《恒星天体物理学导论》${b.volume}《${b.title}》目录">${coverHTML(b)}</a><div class="book-description"><h2>${b.volume} · ${b.title}</h2><p>${b.summary}</p><a class="catalog-link" href="${b.id}.html">阅读目录 <span aria-hidden="true">→</span></a></div></article>`).join('');
 const body=`<a class="skip" href="#main">跳到正文</a><header class="topbar"><span>UCAS · 自学课程</span><a class="github-project" href="https://github.com/zhang2023-byte/Intro-to-stellar-physics-UCAS" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.72.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.09 1.16a10.74 10.74 0 0 1 5.62 0c2.14-1.45 3.08-1.16 3.08-1.16.61 1.55.23 2.69.12 2.98.72.79 1.15 1.8 1.15 3.03 0 4.32-2.63 5.28-5.14 5.56.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.25 11.25 0 0 0 12 .75Z"/></svg>GitHub 项目</a></header><main id="main" class="library-home"><header class="library-heading"><p class="library-kicker">中国科学院大学 · 自学课程</p><h1>恒星内部结构<br>与演化</h1><p class="library-intro">以《恒星天体物理学导论》的恒星大气、恒星结构与演化两卷为主线，从观测辐射逐步走向恒星内部。</p></header><div class="bookshelf">${covers}</div><footer class="library-footer"><h2>教材与学习内容</h2><p>主线教材由 Erika Böhm-Vitense 编写，成书较早。课件采用 Carroll 与 Ostlie《当代天体物理学导论》（原书第二版）的相关内容补充解释与推导，并在“教材补充与更新”中注明来源。需要进一步查证的问题列为“拓展调研”。</p></footer></main>`;
 pages.set('index.html',documentHTML(siteTitle+' · 自学课程',body));
 for(const b of books){
  const rows=b.chapters.map(([title,summary],i)=>{
   const id=b.prefix+'-ch'+String(i+1).padStart(2,'0');
   const m=entries.find(m=>m.id===id&&fs.existsSync(path.join(ROOT,'site/lessons',id+'.html')));
   return `<li class="chapter-row${m?' available':''}" id="chapter-${i+1}"><span class="chapter-number">${String(i+1).padStart(2,'0')}</span><div><h2>${escapeHTML(m?.title??title)}</h2><p>${escapeHTML(m?.summary??summary)}</p></div>${m?`<a class="start-learning" href="lessons/${id}.html" aria-label="开始学习：${escapeHTML(m.title)}">开始学习 <span aria-hidden="true">↗</span></a>`:'<span class="chapter-pending">待制作</span>'}</li>`;
  }).join('');
  const body=`<a class="skip" href="#chapters">跳到目录</a><header class="topbar"><a href="index.html">${siteTitle}</a><a href="index.html">返回首页</a></header><main class="volume-layout"><aside class="volume-book">${coverHTML(b)}<p>《恒星天体物理学导论》${b.volume}</p></aside><div class="volume-content"><header class="volume-heading"><p class="library-kicker">${b.volume} · 课程目录</p><h1>${b.title}</h1><p>${b.summary}</p></header><ol id="chapters" class="chapter-list">${rows}</ol><footer class="sources"><p>目录按《恒星天体物理学导论》${b.volume}编排。标有“开始学习”的章节可进入课件。</p><a href="index.html">返回首页 ↑</a></footer></div></main>`;
  pages.set(b.id+'.html',documentHTML(b.title+' · '+siteTitle,body));
 }
 return pages;
}
export function buildIndex(){
 fs.mkdirSync(path.join(ROOT,'site'),{recursive:true});
 for(const [name,html] of renderNavigation()){validateHTML(html);fs.writeFileSync(path.join(ROOT,'site',name),html);}
}
export function checkAll(){
 const reports=[];
 for(const file of fs.readdirSync(path.join(ROOT,'lessons')).filter(n=>n.endsWith('.md')&&!n.endsWith('.local.md'))){
  const data=parseLesson(fs.readFileSync(path.join(ROOT,'lessons',file),'utf8'));const p=path.join(ROOT,'site/lessons',data.meta.id+'.html');const actual=fs.readFileSync(p,'utf8');validateHTML(actual);need(actual===renderLesson(data,path.join(ROOT,'lessons')),`${file} 的 HTML 未重新构建`);reports.push({id:data.meta.id,version:data.meta.version,questions:data.quizzes.length,bytes:Buffer.byteLength(actual)});
 }
 for(const [name,expected] of renderNavigation()){const actual=fs.readFileSync(path.join(ROOT,'site',name),'utf8');validateHTML(actual);need(actual===expected,`${name} 未重新构建`);for(const m of actual.matchAll(/href="([^"#]+\.html)"/g))need(fs.existsSync(path.join(ROOT,'site',m[1])),`${name} 链接无目标：${m[1]}`);}
 return reports;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const [cmd,arg]=process.argv.slice(2);if(cmd==='build'){console.log(build(arg));buildIndex();}else if(cmd==='all'){for(const n of fs.readdirSync(path.join(ROOT,'lessons')).filter(n=>n.endsWith('.md')&&!n.endsWith('.local.md')))console.log(build(n.slice(0,-3)));buildIndex();}else if(cmd==='index'){buildIndex();}else if(cmd==='check'){console.log(JSON.stringify(checkAll(),null,2));}else{throw new Error('用法：node tools/build.mjs build <ID> | all | index | check');}}catch(e){console.error(e.message);process.exitCode=1;}
}
