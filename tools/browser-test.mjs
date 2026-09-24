import {dependency} from './deps.mjs';
import {ROOT,parseLesson} from './build.mjs';
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';
const pw=await dependency('playwright'),{chromium}=pw.default??pw;
const records=path.join(ROOT,'archive/work-records.local');fs.mkdirSync(records,{recursive:true});
const scratch=fs.mkdtempSync(path.join(records,'stellar-continuous-')),ids=fs.readdirSync(path.join(ROOT,'lessons')).filter(f=>f.endsWith('.md')).map(f=>f.slice(0,-3)).sort();
const server=http.createServer((req,res)=>{const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(p==='/favicon.ico'){res.writeHead(204);res.end();return;}const f=path.resolve(ROOT,'site',p.replace(/^\/stellar-course\//,''));if(!p.startsWith('/stellar-course/')||!f.startsWith(path.join(ROOT,'site')+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type','text/html;charset=utf-8');res.end(fs.readFileSync(f));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;let browser;const errors=[],outbound=[];
async function verifyQuizReturn(page,data,index,{keyboard=false,capture=''}={}){
 const q=data.quizzes[index],form=page.locator('#'+q.id),link=form.locator('.concept-link'),back=page.getByRole('button',{name:/返回课后题/});
 await form.locator(`input[value="${q.answer}"]`).check();await form.locator('button[type=submit]').click();
 const note=await form.locator('.answer-note').textContent(),answered=await page.locator('[data-answered]').textContent();
 await link.scrollIntoViewIfNeeded();
 const box=await link.boundingBox(),card=await form.boundingBox(),url=page.url();
 assert.ok(box.width<card.width*.7&&box.height>=44,'回看链接不占满整行，保留触控高度');
 await page.mouse.click(card.x+card.width-24,box.y+box.height/2);assert.equal(page.url(),url,'链接旁空白不跳转');
 if(keyboard){await link.focus();await page.keyboard.press('Enter');}else await link.click();
 await page.waitForURL(url=>url.hash==='#'+q.concept);
 await back.waitFor({state:'visible'});
 await page.waitForFunction(id=>{const r=document.getElementById(id).getBoundingClientRect();return r.top>=0&&r.top<100;},q.concept);
 assert.match(await back.textContent(),new RegExp(`第 ${index+1} 题`));
 const position=await back.boundingBox(),viewport=page.viewportSize();
 assert.ok(position.x>=0&&position.y>=0&&position.x+position.width<=viewport.width&&position.y+position.height<=viewport.height,'返回按钮位于屏幕内');
 if(capture)await page.screenshot({path:path.join(scratch,capture+'.png')});
 if(keyboard){await back.focus();assert.ok(await back.evaluate(e=>e.matches(':focus-visible')&&getComputedStyle(e).outlineStyle!=='none'));await page.keyboard.press('Enter');}else await back.click();
 await page.waitForFunction(id=>{
  const r=document.getElementById(id).getBoundingClientRect(),atEnd=Math.abs(document.documentElement.scrollHeight-innerHeight-scrollY)<2;
  return r.top>=0&&r.top<innerHeight&&(r.top<100||atEnd)&&document.activeElement.id===id;
 },q.id);
 assert.equal(new URL(page.url()).hash,'#'+q.id);assert.equal(await back.count(),0);
 assert.equal(await form.locator('input:checked').inputValue(),q.answer);assert.equal(await form.locator('.answer-note').textContent(),note);assert.equal(await page.locator('[data-answered]').textContent(),answered);
 if(keyboard){await page.keyboard.press('Tab');assert.ok(await form.locator('input:focus').count(),'返回后 Tab 可继续操作原题');}
}
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.STELLAR_CHROMIUM||(fs.existsSync(chromium.executablePath())?chromium.executablePath():'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')});const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route('**/*',r=>{const u=r.request().url();if(/^https?:/.test(u)&&!u.startsWith(origin)){outbound.push(u);return r.abort();}return r.continue();});const page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
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
 assert.equal(await page.getByRole('button',{name:/返回课后题/}).count(),0);
 for(let i=0;i<data.quizzes.length;i++)await verifyQuizReturn(page,data,i,{keyboard:i===0,capture:i===0?id+'-return-desktop':''});
 // Back/Forward and manually returning to the exercises also toggle the floating control.
 // Keep history restoration independent of an interrupted smooth-scroll animation.
 await page.emulateMedia({reducedMotion:'reduce'});
 const review=data.quizzes[0],returnButton=page.locator('[data-return-to-quiz]');
 await page.evaluate(id=>{location.hash=id;},review.id);
 await page.locator('#'+review.id).scrollIntoViewIfNeeded();
 await page.locator('#'+review.id+' .concept-link').click();await returnButton.waitFor({state:'visible'});
 await page.goBack();await returnButton.waitFor({state:'hidden'});
 await page.goForward();await returnButton.waitFor({state:'visible'});
 await page.locator('#'+review.id).scrollIntoViewIfNeeded();await returnButton.waitFor({state:'hidden'});
 await page.locator('#'+review.concept).scrollIntoViewIfNeeded();await returnButton.waitFor({state:'visible'});await returnButton.click();
 await page.emulateMedia({reducedMotion:'no-preference'});
 console.log('回看与返回通过：'+id);
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
 await verifyQuizReturn(page,data,0,{keyboard:true,capture:id+'-return-zoom200'});
 await page.evaluate(()=>document.documentElement.style.zoom='');
 await page.setViewportSize({width:390,height:844});await page.goto(origin+'/stellar-course/lessons/'+id+'.html');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(scratch,id+'-mobile.png')});await page.locator('#exercises').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(scratch,id+'-quiz-mobile.png')});await verifyQuizReturn(page,data,data.quizzes.length-1,{capture:id+'-return-mobile'});for(const lab of await page.locator('[data-explorer]').all()){await lab.screenshot({path:path.join(scratch,id+'-'+await lab.getAttribute('id')+'-mobile.png')});}await page.setViewportSize({width:1440,height:1000});
 if(id==='v2-ch04'){
  await page.evaluate(()=>localStorage.removeItem('stellar:highlights:v2-ch04'));
  await page.reload();
  await page.locator('#intensity > p').first().evaluate(element=>{
   const node=[...element.childNodes].find(child=>child.nodeType===Node.TEXT_NODE&&child.nodeValue.trim());
   const range=document.createRange(),length=Math.min(10,node.nodeValue.length);
   range.setStart(node,0);range.setEnd(node,length);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);document.dispatchEvent(new Event('selectionchange'));
  });
  await page.locator('[data-highlight-add]').click();
  assert.equal(await page.locator('mark.stellar-highlight').count(),1);
  assert.match(await page.locator('[data-highlight-status]').textContent(),/已保存 1 条高亮/);
  await page.reload();assert.equal(await page.locator('mark.stellar-highlight').count(),1);
  await page.locator('mark.stellar-highlight').first().evaluate(element=>{
   const range=document.createRange();range.selectNodeContents(element);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);document.dispatchEvent(new Event('selectionchange'));
  });
  await page.locator('[data-highlight-remove]').click();
  assert.equal(await page.locator('mark.stellar-highlight').count(),0);
 }
 }
 const noJS=await browser.newContext({javaScriptEnabled:false});const plain=await noJS.newPage();
 await plain.goto(origin+'/stellar-course/lessons/'+ids[0]+'.html');const plainLink=plain.locator('.concept-link').first();const target=await plainLink.getAttribute('href');await plainLink.click();assert.equal(new URL(plain.url()).hash,target);assert.equal(await plain.locator('[data-return-to-quiz]').isVisible(),false);await noJS.close();
 assert.deepEqual(errors,[]);assert.deepEqual(outbound,[]);console.log(JSON.stringify({status:'passed',chapters:ids.length,questions:ids.reduce((n,id)=>n+parseLesson(fs.readFileSync(path.join(ROOT,'lessons',id+'.md'),'utf8')).quizzes.length,0),activities:ids.reduce((n,id)=>n+parseLesson(fs.readFileSync(path.join(ROOT,'lessons',id+'.md'),'utf8')).activities.length,0),wrongAnswerRetry:'all',reviewReturn:'all questions; mobile; keyboard; zoom; Back/Forward; blank-area clicks; no-JS links',keyboard:'sliders-card-and-quiz',nativeSelectKeyboard:'not-verified-in-headless-macOS',zoom:'200-percent-CSS-zoom',feedback:JSON.parse(fs.readFileSync(path.join(ROOT,'tools/feedback.json'),'utf8')).formUrl?'link-configured-submission-not-tested':'pending-feishu-authorization',screenshots:scratch,errors,outbound},null,2));
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
