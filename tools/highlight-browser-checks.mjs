import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const key='stellar:highlights:v2-ch04';
async function selectParagraphs(page,{last=1,reverse=false}={}){
 await page.locator('#intensity > p').first().click();
 return page.evaluate(({last,reverse})=>{
  const paragraphs=document.querySelectorAll('#intensity > p');
  const first=paragraphs[0],end=paragraphs[last];
  const nodes=element=>{const walk=document.createTreeWalker(element,NodeFilter.SHOW_TEXT),out=[];let n;while(n=walk.nextNode())out.push(n);return out;};
  const a=nodes(first)[0],b=nodes(end).at(-1),offset=Math.max(1,b.length-2);
  const selection=getSelection();selection.removeAllRanges();
  selection.setBaseAndExtent(reverse?b:a,reverse?offset:2,reverse?a:b,reverse?2:offset);
  document.dispatchEvent(new Event('selectionchange'));
  return [first.textContent.slice(2),end.textContent.slice(0,-2)];
 },{last,reverse});
}
const stored=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).items,key);
const markIDs=page=>page.locator('mark.stellar-highlight').evaluateAll(marks=>[...new Set(marks.map(m=>m.dataset.highlightId))]);
async function clear(page){await page.locator('[data-highlight-clear]').click();await page.locator('[data-highlight-clear]').click();}

export async function verifyParagraphHighlights(browser,origin,scratch){
 const url=origin+'/stellar-course/lessons/v2-ch04.html';
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();page.setDefaultTimeout(10000);
 await page.goto(url);
 const before=await page.locator('#intensity').textContent();
 const expected=await selectParagraphs(page);
 const add=page.locator('[data-highlight-bubble-add]');
 await add.waitFor({state:'visible'});
 await add.click();
 assert.deepEqual((await stored(page)).map(item=>item.quote),expected,'跨段落选区按段完整保存，包括行内上下标');
 assert.equal((await markIDs(page)).length,2);assert.equal(await page.locator('#intensity').textContent(),before);
 await page.reload();assert.equal((await markIDs(page)).length,2,'刷新恢复两段');
 const downloadEvent=page.waitForEvent('download');await page.locator('[data-highlight-export]').click();
 const backup=path.join(scratch,'paragraph-highlights.json');await (await downloadEvent).saveAs(backup);
 const payload=JSON.parse(fs.readFileSync(backup,'utf8'));assert.equal(payload.schema,1);assert.equal(payload.items.length,2);
 await page.locator('mark.stellar-highlight').first().click({button:'right'});
 await page.locator('[data-highlight-bubble-remove]').click();
 assert.equal((await markIDs(page)).length,1,'每段可独立取消');
 await page.reload();assert.equal((await markIDs(page)).length,1);
 await page.locator('[data-highlight-import]').setInputFiles(backup);
 await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).items.length===2,key);
 assert.equal((await markIDs(page)).length,2,'合并导入恢复缺少的段落');
 await clear(page);await page.reload();assert.equal((await markIDs(page)).length,0);
 // Old backups keep their section/paragraph anchors after the navigation additions.
 for(const item of payload.items){item.version='1.2.0';item.sourceHash='previous-source';}
 const oldBackup=path.join(scratch,'previous-version-highlights.json');fs.writeFileSync(oldBackup,JSON.stringify(payload));
 await page.locator('[data-highlight-import]').setInputFiles(oldBackup);
 await page.waitForFunction(()=>document.querySelectorAll('mark.stellar-highlight').length>0);
 assert.equal((await stored(page)).filter(item=>item.status==='active').length,2);
 await clear(page);
 await page.locator('[data-highlight-add]').click();await selectParagraphs(page,{reverse:true});
 await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).items.length===2,key);
 await page.locator('[data-highlight-mode-toggle]').press('Enter');
 assert.equal(await page.locator('[data-highlight-mode-toggle]').isVisible(),false);
 await page.locator('#intensity').screenshot({path:path.join(scratch,'paragraph-highlights-desktop.png')});
 await clear(page);
 await selectParagraphs(page,{last:2}); // Includes the displayed dE formula.
 await page.waitForFunction(()=>document.querySelector('[data-highlight-status]').textContent.includes('请选择'));
 assert.equal(await add.isVisible(),false,'含公式的跨段落选区拒绝整体处理');
 assert.equal((await stored(page)).length,0);
 await page.locator('[data-highlight-import]').setInputFiles({name:'wrong-course.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...payload,lessonId:'v2-ch11'}))});
 await page.waitForFunction(()=>document.querySelector('[data-highlight-status]').textContent.includes('课程不匹配'));
 assert.equal((await stored(page)).length,0);
 await context.close();

 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
 const phone=await touch.newPage();phone.setDefaultTimeout(10000);await phone.goto(url);
 assert.ok(await phone.evaluate(()=>matchMedia('(pointer: coarse)').matches));
 assert.equal(await phone.locator('[data-highlight-add]').getAttribute('aria-label'),'高亮选中文字');
 await selectParagraphs(phone);await phone.locator('[data-highlight-bubble-add]').waitFor({state:'visible'});
 // Wait beyond the desktop automatic-marking delay to test touch's manual contract.
 await phone.waitForTimeout(650);assert.equal((await markIDs(phone)).length,0);
 await phone.locator('[data-highlight-bubble-add]').tap();assert.equal((await markIDs(phone)).length,2);
 assert.equal(await phone.locator('[data-highlight-mode-toggle]').isVisible(),false);
 await phone.reload();assert.equal((await markIDs(phone)).length,2);
 await phone.locator('#intensity > p').first().scrollIntoViewIfNeeded();
 await phone.screenshot({path:path.join(scratch,'paragraph-highlights-touch.png')});
 await clear(phone);await selectParagraphs(phone);await phone.locator('[data-highlight-add]').tap();
 assert.equal((await markIDs(phone)).length,2,'手机顶部按钮执行单次高亮');
 await touch.close();

 const blocked=await browser.newContext();await blocked.addInitScript(()=>{
  Storage.prototype.getItem=()=>{throw new Error('storage blocked');};
  Storage.prototype.setItem=()=>{throw new Error('storage blocked');};
 });
 const temporary=await blocked.newPage();await temporary.goto(url);await selectParagraphs(temporary);
 await temporary.locator('[data-highlight-bubble-add]').click();assert.equal((await markIDs(temporary)).length,2);
 assert.match(await temporary.locator('[data-highlight-status]').textContent(),/本机保存不可用/);
 await blocked.close();

 // A multi-paragraph selection must not evict saved or unresolved annotations.
 const capacity=await browser.newContext();
 const retained=Array.from({length:499},(_,i)=>({...payload.items[0],id:`unresolved-${i}`,sectionId:'removed-section'}));
 await capacity.addInitScript(({key,payload,retained})=>{
  if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({...payload,items:retained}));
 },{key,payload,retained});
 const full=await capacity.newPage();await full.goto(url);
 assert.match(await full.locator('[data-highlight-status]').textContent(),/499 条位置待核实/);
 await selectParagraphs(full);await full.locator('[data-highlight-bubble-add]').click();
 assert.equal((await markIDs(full)).length,0,'空间不足时整组选区不部分保存');
 assert.deepEqual((await stored(full)).map(item=>item.id),retained.map(item=>item.id),'保留全部原记录');
 assert.match(await full.locator('[data-highlight-status]').textContent(),/最多保存 500 条/);
 await full.reload();assert.equal((await stored(full)).length,499);
 await capacity.close();
 console.log('跨段落高亮通过：保存/刷新/逐段取消/导入导出/旧版本定位/反向连续选择/公式拒绝/触屏手动/存储不可用/容量保护');
}
