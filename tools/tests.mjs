import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseLesson,renderLesson,validateHTML,checkAll,ROOT} from './build.mjs';
const text=fs.readFileSync(`${ROOT}/tools/fixtures/demo-parallax.md`,'utf8');
function source(meta={},question={}){const d=parseLesson(text);Object.assign(d.meta,meta);Object.assign(d.quizzes[0],question);return text.replace(/^```lesson\s*\n[\s\S]*?\n```/,`\`\`\`lesson\n${JSON.stringify(d.meta)}\n\`\`\``).replace(/^```quiz\s*\n[\s\S]*?\n```/m,`\`\`\`quiz\n${JSON.stringify(d.quizzes)}\n\`\`\``);}
test('示范有六道概念题，两种题型均存在且引用有效',()=>{const d=parseLesson(text);assert.equal(d.quizzes.length,6);assert.deepEqual(new Set(d.quizzes.map(q=>q.type)),new Set(['choice','truefalse']));assert.equal(d.activities[0].type,'parallax');});
test('答案不在选项、定位缺失、重复 ID 都会拒绝构建',()=>{assert.throws(()=>parseLesson(source({}, {answer:'MISSING'})),/答案/);assert.throws(()=>parseLesson(source({}, {concept:'missing'})),/知识点/);assert.throws(()=>parseLesson(text.replace('q-half-angle','q-nearer')),/重复/);assert.throws(()=>parseLesson(text.replace('{#parsec}','{#geometry}')),/重复/);});
test('未渲染公式、远程图片、手写脚本不得进入独立课件',()=>{assert.throws(()=>parseLesson(text.replace('## 这次要弄清什么','$$d=1/p$$\n## 这次要弄清什么')),/正文|LaTeX/);assert.throws(()=>parseLesson(text+'\n<script>alert(1)</script>'),/脚本/);assert.throws(()=>validateHTML('<svg><image href="https://example.invalid/a.png"></image></svg>'),/SVG/);assert.throws(()=>renderLesson(parseLesson(text+'\n![x](https://example.invalid/a.png)'),`${ROOT}/lessons`),/本地/);});
test('修改版本或题目会隔离浏览器答题数据',()=>{const a=parseLesson(text);const b=parseLesson(source({version:'9.0.0'}));const c=parseLesson(source({}, {answer:'A'}));assert.notEqual(a.meta.version,b.meta.version);assert.equal(a.quizHash,b.quizHash);assert.notEqual(a.quizHash,c.quizHash);assert.notEqual(a.sourceHash,b.sourceHash);});
test('嵌入 JSON 的尖括号不会关闭 script 标签',()=>{const d=parseLesson(source({title:'说明 </script> 测试'}));const h=renderLesson(d,`${ROOT}/lessons`);assert.ok(h.includes('\\u003c/script>'));assert.equal((h.match(/<script\b/g)||[]).length,2);validateHTML(h);});
test('已生成 HTML 与当前 Markdown 一致，首页无失效课程链接',()=>{const r=checkAll();assert.ok(r.length>=1);assert.deepEqual(r.map(x=>x.id),fs.readdirSync(`${ROOT}/lessons`).filter(f=>f.endsWith('.md')).map(f=>f.slice(0,-3)).sort());});
import vm from 'node:vm';
const physics=vm.runInNewContext(fs.readFileSync(`${ROOT}/tools/physics.js`,'utf8')+'\nStellarPhysics');
test('定量活动满足距离、星等、颜色与温度比例关系',()=>{assert.equal(physics.apparent(2,10),2);assert.equal(physics.apparent(2,100),7);assert.equal(physics.magnitude(100),-5);assert.ok(Math.abs(physics.color(10000))<1e-12);assert.ok(physics.color(4000)>physics.color(12000));assert.equal(physics.luminosity(2,5800),4);assert.equal(physics.luminosity(1,11600),16);});
test('Planck谱密度变换、数值峰值与全谱积分保持物理一致',()=>{const c=299792458,T=6000,nm=500,l=nm*1e-9;assert.ok(Math.abs(physics.planckNu(c/l,T)/(physics.planck(nm,T)*l*l/c)-1)<1e-12);let peakL=0,maxL=0,peakN=0,maxN=0;for(let x=100;x<2000;x+=.5){const a=physics.planck(x,T),b=physics.planckNu(x*1e12,T);if(a>maxL){maxL=a;peakL=x;}if(b>maxN){maxN=b;peakN=x;}}assert.ok(Math.abs(peakL*T/2.897771955e6-1)<.002);assert.ok(Math.abs(peakN*1e12/T/5.87892576e10-1)<.002);assert.ok(Math.abs(peakL*1e-9*peakN*1e12/c-1)>.3);let integral=0;const dlog=Math.log(1e6)/20000;for(let i=0;i<20000;i++){const nm=Math.exp((i+.5)*dlog);integral+=physics.planck(nm,T)*nm*1e-9*dlog;}assert.ok(Math.abs(Math.PI*integral/(physics.sigma*T**4)-1)<.0001);});
test('氢的两道门产生内部峰值，电子密度影响电离',()=>{const low=physics.hydrogen(4000,1e20),mid=physics.hydrogen(10000,1e20),hot=physics.hydrogen(25000,1e20);assert.ok(mid.lower>low.lower&&mid.lower>hot.lower);assert.ok(physics.hydrogen(12000,1e22).neutral>physics.hydrogen(12000,1e18).neutral);for(const x of [low,mid,hot])assert.ok(x.lower>=0&&x.lower<=x.neutral&&x.neutral<=1);});
test('三章覆盖21题8项活动，教材补充与更新保持可折叠',()=>{let questions=0,activities=0;for(const id of ['v2-ch01','v2-ch02','v2-ch03']){const source=fs.readFileSync(`${ROOT}/lessons/${id}.md`,'utf8'),d=parseLesson(source);assert.equal(d.meta.study,true);questions+=d.quizzes.length;activities+=d.activities.length;const html=renderLesson(d,`${ROOT}/lessons`);assert.ok(html.includes('<details><summary>教材补充与更新'));assert.ok(!html.includes('data-quiz-slot'));}assert.equal(questions,21);assert.equal(activities,8);});

test('常源函数：边界、收支、薄厚极限及分层合成一致',()=>{
 for(const I0 of [0,.2,1,2])for(const S of [0,.4,1,2]){
  assert.equal(physics.slab(I0,S,0).total,I0);
  assert.ok(Math.abs(physics.slab(I0,S,40).total-S)<1e-12);
  const t=1e-7,a=physics.slab(I0,S,t).total;
  assert.ok(Math.abs(a-(I0+t*(S-I0)))<2e-14);
  const one=physics.slab(I0,S,2).total,two=physics.slab(physics.slab(I0,S,.7).total,S,1.3).total;
  assert.ok(Math.abs(one-two)<1e-12);assert.ok(one>=Math.min(I0,S)&&one<=Math.max(I0,S));
 }
 assert.ok(Math.abs(physics.slab(.2,.8,Math.log(2)).total-.5)<1e-12);
});
test('谱线对比的解析因式、正负号和连续谱厚时的消失',()=>{
 for(const I0 of [0,.3,1])for(const S of [0,.6,1])for(const tc of [0,.1,8])for(const tl of [0,.01,2,12]){
  const diff=physics.slab(I0,S,tc+tl).total-physics.slab(I0,S,tc).total;
  assert.ok(Math.abs(diff-(S-I0)*Math.exp(-tc)*(-Math.expm1(-tl)))<1e-12);
 }
 assert.equal(physics.lineTau(0,.1,2),2.1);assert.equal(physics.lineTau(2,.1,2),physics.lineTau(-2,.1,2));
});
test('分层模型与线性源函数的解析积分对照，含有限底边界',()=>{
 // S(z)=a+bz; I_bottom=S(8). Integrating from z=0 to 8 gives a+b/f*(1-exp(-8f)).
 for(const g of [-1.5,0,1.5])for(const f of [1,5,12]){
  const exact=1-g/2+g/(8*f)*(-Math.expm1(-8*f));
  assert.ok(Math.abs(physics.stratified(f,g)-exact)<.00021);
  assert.ok(Math.abs(physics.stratified(f,g,480)-exact)<.000053);
 }
 assert.ok(physics.stratified(5,1)<physics.stratified(1,1));
 assert.ok(physics.stratified(5,-1)>physics.stratified(1,-1));
 assert.equal(physics.stratified(5,0),1);
});
test('第四章覆盖四项交互及全部核心概念，公式均带无障碍说明',()=>{
 const d=parseLesson(fs.readFileSync(`${ROOT}/lessons/v2-ch04.md`,'utf8'));
 assert.equal(d.activities.length,4);assert.equal(d.quizzes.length,13);
 for(const concept of ['intensity','balance','optical-depth','formal-solution','limits-lte','spectral-lines','stratified-atmosphere'])assert.ok(d.quizzes.some(q=>q.concept===concept));
 const h=renderLesson(d,`${ROOT}/lessons`);validateHTML(h);for(const tag of h.match(/<math[^>]*>/g))assert.match(tag,/aria-label=/);
});

import {mathText} from './math-text.mjs';
test('题目数学排版保留符号，分数及下标可读且拒绝注入HTML',()=>{
 const out=mathText('Bν=Bλ λ²/c；λ_pν_p=c；N_II/N_I；<img src=x onerror=alert(1)>');
 assert.match(out,/<mfrac>/);assert.match(out,/<msub><mi>λ<\/mi><mi>p<\/mi>/);
 assert.ok(!out.includes('<img'));assert.ok(out.includes('&lt;img'));
 assert.equal(mathText('a < b & c'), 'a &lt; b &amp; c');
 for(const id of ['v2-ch01','v2-ch02','v2-ch03','v2-ch04']){
  const d=parseLesson(fs.readFileSync(`${ROOT}/lessons/${id}.md`,'utf8'));
  for(const q of d.quizzes)assert.doesNotMatch(q.explanation,/判断正确|判断错误/);
 }
});
