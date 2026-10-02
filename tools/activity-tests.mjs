import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {activityTypes} from './explorers.mjs';
import {createActivityRegistry,validateCustomActivity,customActivityHTML,customActivityScripts} from './activity-modules.mjs';
import {frame,range,select} from './activity-ui.mjs';
import {parseLesson,renderLesson,validateHTML,ROOT} from './build.mjs';

function entry(id='fixture-a',types=['fixture-alpha','fixture-beta']){
 return {filename:id+'.mjs',module:{lessonId:id,types,render:a=>'rendered '+a.id,browserScript:'// '+id+' module\n(()=>{})();'}};
}
test('独立活动拒绝错误归属、重复及既有类型、非字符串类型和不可内嵌脚本',()=>{
 const a=entry();
 assert.throws(()=>createActivityRegistry([{...a,filename:'other.mjs'}]),/lessonId/);
 assert.throws(()=>createActivityRegistry([a,entry('fixture-b',['fixture-alpha'])]),/重复/);
 assert.throws(()=>createActivityRegistry([entry('fixture-a',['fixture-alpha','fixture-alpha'])]),/重复/);
 for(const type of ['parallax',...activityTypes,undefined,null,12,{},'invalid type'])assert.throws(()=>createActivityRegistry([entry('fixture-a',[type])]),/重复或无效/);
 for(const script of ['"</script>"','"</SCRIPT data-x>"','"</script/>"'])assert.throws(()=>createActivityRegistry([{...a,module:{...a.module,browserScript:script}}]),/关闭 script/);
 assert.throws(()=>createActivityRegistry([{...a,module:{...a.module,browserScript:'(()=>{'}}]),/脚本语法错误/);
 assert.equal(createActivityRegistry([{...a,module:{...a.module,browserScript:'const text="</scripture>";'}}]).size,2);
});
test('自定义活动只可由所属课调用，既有活动仍交回既有渲染器',()=>{
 const registry=createActivityRegistry([entry()]);
 assert.equal(validateCustomActivity({type:'fixture-alpha'},'fixture-a',registry),true);
 assert.throws(()=>validateCustomActivity({type:'fixture-alpha'},'fixture-b',registry),/只属于课程 fixture-a/);
 assert.equal(validateCustomActivity({type:'parallax'},'fixture-a',registry),false);
 assert.equal(customActivityHTML({id:'lab-a',type:'fixture-alpha'},registry),'rendered lab-a');
 assert.equal(customActivityHTML({type:'parallax'},registry),null);
});
test('内嵌脚本只包括实际引用的模块，同模块多类型和多实例只嵌入一次',()=>{
 const registry=createActivityRegistry([entry(),entry('fixture-b',['fixture-gamma'])]);
 assert.equal(customActivityScripts([{type:'parallax'}],registry),'');
 const script=customActivityScripts([{type:'fixture-alpha'},{type:'fixture-beta'},{type:'fixture-alpha'},{type:'parallax'}],registry);
 assert.equal((script.match(/const StellarActivityUI=/g)||[]).length,1);
 assert.equal((script.match(/fixture-a module/g)||[]).length,1);
 assert.ok(!script.includes('fixture-b module'));
 const both=customActivityScripts([{type:'fixture-gamma'},{type:'fixture-alpha'}],registry);
 assert.equal((both.match(/const StellarActivityUI=/g)||[]).length,1);
 assert.equal((both.match(/fixture-b module/g)||[]).length,1);
 new vm.Script(both);
});
test('活动外壳和控件转义文本及属性，单位同时用于可见读数和无障碍名称',()=>{
 const unsafe='"<&\'>';const escaped='&quot;&lt;&amp;&#39;&gt;';
 const controls=range({key:unsafe,label:unsafe,min:0,max:10,value:3,unit:'km/s'})+select({key:'mode',label:unsafe,options:[[unsafe,unsafe]]});
 const html=frame({id:unsafe,type:unsafe},{title:unsafe,prompt:unsafe,controls,caption:unsafe,svgLabel:unsafe,legend:unsafe});
 assert.ok(!html.includes(unsafe));
 assert.ok(html.includes(`id="${escaped}"`));
 assert.ok(html.includes(`data-param="${escaped}"`));
 assert.ok(html.includes(`aria-label="${escaped}（km/s）"`));
 assert.ok(html.includes('>3 km/s</output>'));
 assert.ok(html.includes(`value="${escaped}">${escaped}</option>`));
 assert.ok(html.includes(`aria-label="${escaped}"></svg>`));
 assert.ok(html.includes(`data-label="${escaped}"`));
 const unitHTML=range({key:'unit-test',label:'温度',min:0,max:10,value:3,unit:unsafe});
 assert.ok(!unitHTML.includes(unsafe));assert.ok(unitHTML.includes(`data-unit="${escaped}"`));
 const selectHTML=select({key:unsafe,label:'模型',options:[[unsafe,unsafe]]});
 assert.ok(!selectHTML.includes(unsafe));assert.ok(selectHTML.includes(`data-param="${escaped}"`));
});

function runtime(labs){
 const document={querySelectorAll:selector=>labs.filter(lab=>selector===`[data-lesson-activity="${lab.type}"]`)};
 return vm.runInNewContext(fs.readFileSync(new URL('./activity-runtime.js',import.meta.url),'utf8')+'\nStellarActivityUI',{document});
}
function lab(type){
 const number={tagName:'INPUT',dataset:{param:'T"[]',unit:'K'},value:'6000',listeners:{},addEventListener(event,fn){this.listeners[event]=fn;}};
 const mode={tagName:'SELECT',dataset:{param:'mode'},value:'2',listeners:{},addEventListener(event,fn){this.listeners[event]=fn;}};
 const output={dataset:{out:'T"[]'},textContent:''};
 const svg={children:[],attrs:{},replaceChildren(){this.children=[];},setAttribute(key,value){this.attrs[key]=value;}};
 const result={textContent:''};
 const title={textContent:'计算活动'};
 return {type,number,mode,output,svg,result,querySelectorAll(selector){if(selector==='[data-param]')return [number,mode];if(selector==='[data-out]')return [output];throw Error('Unexpected selector: '+selector);},querySelector(selector){if(selector==='svg')return svg;if(selector==='.lab-result')return result;if(selector==='h3')return title;throw Error('Unexpected selector: '+selector);}};
}
test('runtime 的初始和输入更新保持数值、选择值与单位，并隔离同页各实例',()=>{
 const first=lab('fixture-alpha'),second=lab('fixture-alpha'),other=lab('fixture-gamma');
 const ui=runtime([first,second,other]),readings=[];
 ui.mount('fixture-alpha',({svg,values})=>{readings.push(values);svg.children.push('new curve');return values['T"[]']+' / '+values.mode;});
 assert.equal(readings.length,2);
 assert.equal(readings[0]['T"[]'],6000);assert.equal(readings[0].mode,'2');
 assert.equal(first.output.textContent,'6000 K');
 assert.equal(first.svg.attrs['aria-label'],'计算活动。6000 / 2');
 assert.equal(other.output.textContent,'');
 first.number.value='7000';first.number.listeners.input();
 assert.equal(first.output.textContent,'7000 K');assert.equal(first.result.textContent,'7000 / 2');
 assert.equal(first.svg.children.length,1);assert.equal(second.result.textContent,'6000 / 2');
 first.mode.value='non-numeric';first.mode.listeners.input();
 assert.equal(first.result.textContent,'7000 / non-numeric');
 first.number.dataset.unit='';first.number.listeners.input();assert.equal(first.output.textContent,'7000');
});

const actualEntries=[];
for(const filename of fs.readdirSync(new URL('./activities/',import.meta.url)).filter(name=>name.endsWith('.mjs')).sort())actualEntries.push({filename,module:await import(new URL('./activities/'+filename,import.meta.url))});
test('实际模块可注册、单课解析渲染且不能借给其他课程',()=>{
 const registry=createActivityRegistry(actualEntries);
 const fixture=fs.readFileSync(`${ROOT}/tools/fixtures/demo-parallax.md`,'utf8');
 for(const {module}of actualEntries){
  new vm.Script(module.browserScript,{filename:fileURLToPath(new URL('./activities/'+module.lessonId+'.mjs',import.meta.url))});
  for(const type of module.types){
   const source=fixture.replace(/"id"\s*:\s*"[^"]+"/,`"id":"${module.lessonId}"`).replace(/^```activity\s*\n[\s\S]*?\n```/m,'```activity\n'+JSON.stringify({id:'fixture-lab',type})+'\n```');
   const data=parseLesson(source),html=renderLesson(data,`${ROOT}/lessons`);
   validateHTML(html);assert.ok(html.includes('data-lesson-activity="'+type+'"'));
   const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
   new vm.Script(scripts.at(-1)[1]);
   assert.throws(()=>parseLesson(source.replace(`"id":"${module.lessonId}"`,'"id":"other-course"')),/只属于课程/);
   assert.equal(validateCustomActivity({type},module.lessonId,registry),true);
  }
 }
});
