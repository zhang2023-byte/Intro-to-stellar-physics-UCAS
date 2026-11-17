import assert from 'node:assert/strict';
import path from 'node:path';
export async function verifyConvectionLesson(page,scratch){
 const parcel=page.locator('#parcel-lab'),opacity=page.locator('#opacity-lab');
 const set=async(lab,key,value)=>{const input=lab.locator(`[data-param="${key}"]`);await input.fill(String(value));await input.dispatchEvent('input');};
 await set(parcel,'env',.5);await set(parcel,'q',.8);
 assert.match(await parcel.locator('.lab-result').innerText(),/0\.9146.*0\.8944.*0\.9779.*浮力向上.*不稳定/);
 await set(parcel,'q',1.2);assert.match(await parcel.locator('.lab-result').innerText(),/浮力向下.*不稳定/);
 await set(parcel,'env',.3);assert.match(await parcel.locator('.lab-result').innerText(),/浮力向上.*稳定/);
 await set(parcel,'q',.8);assert.match(await parcel.locator('.lab-result').innerText(),/浮力向下.*稳定/);
 await set(parcel,'env',.4);assert.match(await parcel.locator('.lab-result').innerText(),/1\.0000.*无净浮力.*中性/);
 await set(parcel,'env',.5);await set(parcel,'q',1);assert.match(await parcel.locator('.lab-result').innerText(),/尚未位移/);
 await set(opacity,'b',1);await set(opacity,'ad',.4);await set(opacity,'tau',2);
 assert.match(await opacity.locator('.lab-result').innerText(),/0\.3750.*当前稳定.*2\.667/);
 await set(opacity,'tau',3);assert.match(await opacity.locator('.lab-result').innerText(),/当前不稳定/);
 await set(opacity,'b',.6);await set(opacity,'tau',20);assert.match(await opacity.locator('.lab-result').innerText(),/所有有限光学深度/);
 await set(opacity,'b',0);await set(opacity,'ad',.1);assert.match(await opacity.locator('.lab-result').innerText(),/当前不稳定/);
 for(const input of await page.locator('[data-lesson-activity] input').all()){
  await input.fill(await input.getAttribute('min'));await input.dispatchEvent('input');await input.focus();await input.press('Tab');await page.keyboard.press('Shift+Tab');
  const before=await input.inputValue();await page.keyboard.press('ArrowRight');assert.notEqual(await input.inputValue(),before);
  assert.ok(await input.evaluate(e=>e.matches(':focus-visible')&&getComputedStyle(e).outlineStyle!=='none'));
 }
 await set(parcel,'env',.5);await set(parcel,'q',.8);await set(opacity,'b',1);await set(opacity,'ad',.4);await set(opacity,'tau',3);
 for(const size of [{width:1440,height:1000},{width:390,height:844}]){
  await page.setViewportSize(size);
  for(const lab of [parcel,opacity]){
   await lab.scrollIntoViewIfNeeded();assert.doesNotMatch(await lab.locator('.lab-result').innerText(),/NaN|Infinity/);
   assert.ok(await lab.locator('svg').getAttribute('aria-label'));assert.ok(await lab.locator('svg [stroke-dasharray]').count());
   await lab.screenshot({path:path.join(scratch,await lab.getAttribute('id')+'-'+size.width+'.png')});
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.setViewportSize({width:1440,height:1000});
 for(const id of ['stability','adiabatic','composition','radiative','opacity','zones']){
  const section=page.locator('#'+id);await section.screenshot({path:path.join(scratch,'section-'+id+'.png')});
 }
 console.log('第三卷第五章专项通过：浮力方向、临界值、5个滑块键盘和窄屏图示');
}
