import {dependency} from './deps.mjs';
import {ROOT,parseLesson} from './build.mjs';
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import os from 'node:os';import assert from 'node:assert/strict';
const pw=await dependency('playwright'),{chromium}=pw.default??pw;
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'stellar-continuous-')),ids=fs.readdirSync(path.join(ROOT,'lessons')).filter(f=>f.endsWith('.md')).map(f=>f.slice(0,-3)).sort();
const server=http.createServer((req,res)=>{const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(p==='/favicon.ico'){res.writeHead(204);res.end();return;}const f=path.resolve(ROOT,'site',p.replace(/^\/stellar-course\//,''));if(!p.startsWith('/stellar-course/')||!f.startsWith(path.join(ROOT,'site')+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type','text/html;charset=utf-8');res.end(fs.readFileSync(f));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;let browser;const errors=[],outbound=[];
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.STELLAR_CHROMIUM||(fs.existsSync(chromium.executablePath())?chromium.executablePath():'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')});const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route('**/*',r=>{const u=r.request().url();if(/^https?:/.test(u)&&!u.startsWith(origin)){outbound.push(u);return r.abort();}return r.continue();});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/stellar-course/index.html');
 assert.equal(await page.locator('.book-link').count(),2);
 for(const size of [{width:1440,height:1000},{width:390,height:844}]){
  await page.setViewportSize(size);await page.goto(origin+'/stellar-course/index.html');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:path.join(scratch,'home-'+size.width+'.png'),fullPage:true});
  for(const volume of ['volume2','volume3']){
   await page.goto(origin+'/stellar-course/index.html');
   const cover=page.locator('.book-link[href="'+volume+'.html"]');await cover.focus();await page.keyboard.press('Enter');
   await page.waitForURL('**/'+volume+'.html');
   assert.equal(await page.locator('.chapter-row').count(),volume==='volume2'?16:20);
   assert.equal(await page.locator('.start-learning').count(),ids.filter(id=>id.startsWith(volume==='volume2'?'v2-':'v3-')).length);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:path.join(scratch,volume+'-'+size.width+'.png')});
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 for(const id of ids){const data=parseLesson(fs.readFileSync(path.join(ROOT,'lessons',id+'.md'),'utf8'));await page.goto(origin+'/stellar-course/index.html');assert.equal(await page.locator('a[download]').count(),0);await page.locator('.book-link[href="volume2.html"]').click();await page.locator(`a[href="lessons/${id}.html"]`).click();assert.ok((await page.locator('.topbar').innerText()).includes('更新于 '+data.meta.updated));assert.equal(await page.locator('.lesson-section:visible').count(),data.sections.length);assert.equal(await page.locator('[data-reading-mode],[data-next],[data-prev]').count(),0);assert.equal(await page.locator('.lesson-section').last().getAttribute('id'),'exercises');assert.equal(await page.locator('#exercises [data-question]').count(),data.quizzes.length);assert.equal(await page.locator('[data-question]').count(),data.quizzes.length);assert.doesNotMatch(await page.locator('body').innerText(),/离线学习|先预测，再操作|STELLAR PHYSICS|可下载|Ref|版本|1\.2\.1/);await page.screenshot({path:path.join(scratch,id+'-desktop.png')});
 for(const card of await page.locator('.lesson-section details').all()){await card.locator('summary').click();assert.ok(await card.evaluate(n=>n.open));}
 for(const lab of await page.locator('[data-explorer]').all()){const before=await lab.locator('.lab-result').textContent();for(const slider of await lab.locator('input').all()){await slider.fill(await slider.getAttribute('max'));await slider.dispatchEvent('input');}for(const select of await lab.locator('select').all())await select.selectOption({index:await select.locator('option').count()-1});assert.notEqual(await lab.locator('.lab-result').textContent(),before);assert.doesNotMatch(await lab.locator('.lab-result').textContent(),/NaN|Infinity/);}
 for(const q of data.quizzes){const f=page.locator('#'+q.id);const wrong=q.options.find(o=>o.id!==q.answer);await f.locator(`input[value="${wrong.id}"]`).check();await f.locator('button[type=submit]').click();assert.match(await f.locator('.answer-note').textContent(),/回答有误/);await f.locator(`input[value="${q.answer}"]`).check();await f.locator('button[type=submit]').click();assert.match(await f.locator('.answer-note').textContent(),/回答正确/);}assert.equal(await page.locator('[data-correct]').textContent(),String(data.quizzes.length));await page.reload();assert.equal(await page.locator('[data-correct]').textContent(),String(data.quizzes.length));await page.locator('[data-reset-quiz]').click();assert.equal(await page.locator('[data-answered]').textContent(),'0');
 const q=data.quizzes[0];await page.locator(`[data-feedback="${q.id}"]`).click();assert.equal(await page.locator('#feedback-dialog').isVisible(),true);const url=JSON.parse(fs.readFileSync(path.join(ROOT,'tools/feedback.json'),'utf8')).formUrl;if(url){assert.equal(await page.locator('[data-feedback-form-link]').getAttribute('href'),url);assert.match(await page.locator('[data-feedback-location]').inputValue(),new RegExp(q.id));assert.ok((await page.locator('[data-feedback-location]').inputValue()).includes(data.meta.updated));}else{assert.ok(await page.locator('[data-feedback-unavailable]').isVisible());assert.equal(await page.locator('[data-feedback-form-link]').getAttribute('href'),null);}await page.getByRole('button',{name:'关闭反馈'}).click();await page.waitForFunction(id=>document.activeElement?.dataset.feedback===id,q.id);

 // Exercise native keyboard behavior and verify visible focus on every teaching control.
 for(const slider of await page.locator('[data-explorer] input[type=range]').all()){
  await slider.fill(await slider.getAttribute('min'));await slider.dispatchEvent('input');await slider.focus();
  const before=await slider.inputValue();await slider.press('ArrowRight');assert.notEqual(await slider.inputValue(),before,id+' '+await slider.getAttribute('data-param')+' active='+await page.evaluate(()=>document.activeElement.outerHTML));
  assert.ok(await slider.evaluate(e=>e.matches(':focus-visible')&&getComputedStyle(e).outlineStyle!=='none'));
 }
 // Native macOS select popup did not respond in headless Chrome; report it as unverified.
 // Selection/input rendering is covered by selectOption in the activity checks above.
 const firstSummary=page.locator('.lesson-section summary').first();await firstSummary.focus();
 const wasOpen=await firstSummary.evaluate(e=>e.parentElement.open);await page.keyboard.press('Space');
 assert.notEqual(await firstSummary.evaluate(e=>e.parentElement.open),wasOpen);
 assert.ok(await firstSummary.evaluate(e=>getComputedStyle(e).outlineStyle!=='none'));
 const firstForm=page.locator('#'+data.quizzes[0].id);await firstForm.locator('input').first().focus();await page.keyboard.press('Space');
 // Radio group is one Tab stop; Tab reaches submit, Enter checks the selected answer.
 await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.type),'submit');await page.keyboard.press('Enter');assert.ok(await firstForm.locator('.answer-note').isVisible());
 for(const section of await page.locator('.lesson-section').all()){
  await section.screenshot({path:path.join(scratch,id+'-'+await section.getAttribute('id')+'.png')});
 }
 await page.evaluate(()=>document.documentElement.style.zoom='2');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' 200% zoom overflow');
 await page.locator('#overview').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(scratch,id+'-zoom200.png')});
 await page.evaluate(()=>document.documentElement.style.zoom='');
 await page.setViewportSize({width:390,height:844});await page.goto(origin+'/stellar-course/lessons/'+id+'.html');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(scratch,id+'-mobile.png')});await page.locator('#exercises').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(scratch,id+'-quiz-mobile.png')});for(const lab of await page.locator('[data-explorer]').all()){await lab.screenshot({path:path.join(scratch,id+'-'+await lab.getAttribute('id')+'-mobile.png')});}await page.setViewportSize({width:1440,height:1000});
 }
 assert.deepEqual(errors,[]);assert.deepEqual(outbound,[]);console.log(JSON.stringify({status:'passed',chapters:ids.length,questions:ids.reduce((n,id)=>n+parseLesson(fs.readFileSync(path.join(ROOT,'lessons',id+'.md'),'utf8')).quizzes.length,0),activities:ids.reduce((n,id)=>n+parseLesson(fs.readFileSync(path.join(ROOT,'lessons',id+'.md'),'utf8')).activities.length,0),wrongAnswerRetry:'all',keyboard:'sliders-card-and-quiz',nativeSelectKeyboard:'not-verified-in-headless-macOS',zoom:'200-percent-CSS-zoom',feedback:JSON.parse(fs.readFileSync(path.join(ROOT,'tools/feedback.json'),'utf8')).formUrl?'link-configured-submission-not-tested':'pending-feishu-authorization',screenshots:scratch,errors,outbound},null,2));
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
