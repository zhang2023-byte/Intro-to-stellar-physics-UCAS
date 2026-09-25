(()=>{
'use strict';
const data=JSON.parse(document.getElementById('lesson-data').textContent);
const storageKey=`stellar:${data.meta.id}:${data.meta.version}:${data.quizHash}`;
let answers={};
try{const stored=JSON.parse(localStorage.getItem(storageKey)||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))answers=stored;}catch{}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(answers));}catch{}}
function stats(){let done=0,correct=0;for(const q of data.quizzes){if(q.options.some(o=>o.id===answers[q.id])){done++;if(answers[q.id]===q.answer)correct++;}}for(const el of document.querySelectorAll('[data-answered]'))el.textContent=done;for(const el of document.querySelectorAll('[data-correct]'))el.textContent=correct;}
function showAnswer(form,q,value){const note=form.querySelector('.answer-note');const right=value===q.answer;note.hidden=false;note.classList.toggle('wrong',!right);note.replaceChildren();const verdict=document.createElement('strong');verdict.textContent=right?'✓ 回答正确。':'✗ 回答有误。';note.append(verdict,document.createTextNode(' '));const explanation=document.createElement('span');explanation.innerHTML=q.explanationHTML;note.append(explanation);}
for(const q of data.quizzes){const form=document.getElementById(q.id);const value=answers[q.id];if(q.options.some(o=>o.id===value)){form.querySelector(`input[value="${value}"]`).checked=true;showAnswer(form,q,value);}form.addEventListener('submit',event=>{event.preventDefault();const value=new FormData(form).get(q.id);if(!q.options.some(o=>o.id===value))return;answers[q.id]=value;save();showAnswer(form,q,value);stats();});form.addEventListener('change',()=>{delete answers[q.id];form.querySelector('.answer-note').hidden=true;save();stats();});}
stats();
for(const reset of document.querySelectorAll('[data-reset-quiz]'))reset.addEventListener('click',()=>{answers={};save();for(const form of document.querySelectorAll('[data-question]')){form.reset();form.querySelector('.answer-note').hidden=true;}stats();});
const highlightTools=document.querySelector('.highlight-tools');
if(highlightTools){
 const highlightKey=`stellar:highlights:${data.meta.id}`;
 const addHighlight=highlightTools.querySelector('[data-highlight-add]');
 const removeHighlight=highlightTools.querySelector('[data-highlight-remove]');
 const clearHighlights=highlightTools.querySelector('[data-highlight-clear]');
 const exportHighlights=highlightTools.querySelector('[data-highlight-export]');
 const pdfExport=highlightTools.querySelector('[data-pdf-export]');
 const importHighlights=highlightTools.querySelector('[data-highlight-import]');
 const highlightStatus=highlightTools.querySelector('[data-highlight-status]');
 const highlightModeToggle=document.querySelector('[data-highlight-mode-toggle]');
 const blockSelector='p,li,blockquote,td';
 const excludedSelector='math,a,code,pre,.activity,.quiz-card,.section-heading,.sources';
 const maxHighlights=500;
 let storageAvailable=true;
 let pendingRange=null;
 let markingMode=false;
 let autoHighlightTimer=0;
 let highlightState={schema:1,lessonId:data.meta.id,version:data.meta.version,sourceHash:data.sourceHash,items:[]};
 function cleanHighlight(item){
  if(!item||typeof item!=='object'||typeof item.id!=='string'||typeof item.sectionId!=='string'||typeof item.quote!=='string')return null;
  if(!item.quote.trim()||item.quote.length>10000)return null;
  return {id:item.id.slice(0,100),sectionId:item.sectionId.slice(0,200),quote:item.quote,blockText:typeof item.blockText==='string'?item.blockText.slice(0,30000):'',start:Number.isInteger(item.start)?item.start:null,end:Number.isInteger(item.end)?item.end:null,prefix:typeof item.prefix==='string'?item.prefix.slice(-160):'',suffix:typeof item.suffix==='string'?item.suffix.slice(0,160):'',version:typeof item.version==='string'?item.version:'',sourceHash:typeof item.sourceHash==='string'?item.sourceHash:'',createdAt:typeof item.createdAt==='string'?item.createdAt:new Date().toISOString(),status:'stale'};
 }
 try{
  const stored=JSON.parse(localStorage.getItem(highlightKey)||'null');
  const items=Array.isArray(stored)?stored:stored?.lessonId===data.meta.id?stored.items:[];
  if(Array.isArray(items))highlightState.items=items.map(cleanHighlight).filter(Boolean).slice(0,maxHighlights);
 }catch{storageAvailable=false;}
 function saveHighlights(){
  try{localStorage.setItem(highlightKey,JSON.stringify(highlightState));return true;}
  catch{storageAvailable=false;return false;}
 }
 function nodeElement(node){return node?.nodeType===Node.ELEMENT_NODE?node:node?.parentElement;}
 function blockFor(node){
  const block=nodeElement(node)?.closest(blockSelector);
  return block&&!block.closest(excludedSelector)&&block.closest('.lesson-section')?block:null;
 }
 function intersects(range,node){try{return range.intersectsNode(node);}catch{return false;}}
 function marksFor(range){
  if(!range)return[];
  const ids=new Set();
  for(const mark of document.querySelectorAll('mark.stellar-highlight[data-highlight-id]'))if(intersects(range,mark))ids.add(mark.dataset.highlightId);
  return [...ids];
 }
 function selectionInfo(range){
  if(!range||range.collapsed)return null;
  const block=blockFor(range.startContainer);
  if(!block||blockFor(range.endContainer)!==block||!range.toString().trim())return null;
  for(const node of block.querySelectorAll('math,a,code,pre'))if(intersects(range,node))return null;
  return {block,range};
 }
 function boundaryOffset(block,container,offset){
  const before=document.createRange();
  before.selectNodeContents(block);
  try{before.setEnd(container,offset);return before.toString().length;}catch{return -1;}
 }
 function makeHighlight(info){
  const {block,range}=info,start=boundaryOffset(block,range.startContainer,range.startOffset),end=boundaryOffset(block,range.endContainer,range.endOffset),blockText=block.textContent||'',quote=blockText.slice(start,end);
  if(start<0||end<=start||!quote.trim())return null;
  const section=block.closest('.lesson-section');
  return {id:typeof crypto?.randomUUID==='function'?crypto.randomUUID():`h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,sectionId:section.id,quote,blockText,start,end,prefix:blockText.slice(Math.max(0,start-160),start),suffix:blockText.slice(end,end+160),version:data.meta.version,sourceHash:data.sourceHash,createdAt:new Date().toISOString(),status:'active'};
 }
 function selectableTextNodes(block){
  const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT);
  const nodes=[];let node;
  while(node=walker.nextNode())nodes.push(node);
  return nodes;
 }
 function wrapOffsets(block,start,end,id){
  const nodes=selectableTextNodes(block),ranges=[];
  let cursor=0;
  for(const node of nodes){
   const length=node.nodeValue.length,nodeStart=cursor,nodeEnd=cursor+length;cursor=nodeEnd;
   const localStart=Math.max(start-nodeStart,0),localEnd=Math.min(end-nodeStart,length);
   if(localEnd<=localStart||node.parentElement?.closest('mark,a,code,pre,math'))continue;
   ranges.push({node,localStart,localEnd});
  }
  if(!ranges.length)return false;
  for(let i=ranges.length-1;i>=0;i--){
   const part=ranges[i],range=document.createRange();range.setStart(part.node,part.localStart);range.setEnd(part.node,part.localEnd);
   const mark=document.createElement('mark');mark.className='stellar-highlight';mark.dataset.highlightId=id;mark.title='选择后可取消高亮';
   mark.append(range.extractContents());range.insertNode(mark);
  }
  return true;
 }
 function unwrapHighlight(id){
  for(const mark of [...document.querySelectorAll('mark.stellar-highlight[data-highlight-id]')].filter(mark=>mark.dataset.highlightId===id))mark.replaceWith(...mark.childNodes);
 }
 function clearRenderedHighlights(){for(const mark of [...document.querySelectorAll('mark.stellar-highlight')])mark.replaceWith(...mark.childNodes);}
 function findPositions(text,quote){
  const positions=[];let from=0;
  while(quote&&from<=text.length){const position=text.indexOf(quote,from);if(position<0)break;positions.push(position);from=position+Math.max(quote.length,1);}
  return positions;
 }
 function contextMatches(text,start,item){
  return (!item.prefix||text.slice(Math.max(0,start-item.prefix.length),start).endsWith(item.prefix))&&(!item.suffix||text.slice(start+item.quote.length,start+item.quote.length+item.suffix.length).startsWith(item.suffix));
 }
 function locateHighlight(item){
  const section=document.getElementById(item.sectionId);if(!section)return null;
  let blocks=[...section.querySelectorAll(blockSelector)].filter(block=>!block.closest(excludedSelector));
  const exact=item.blockText?blocks.filter(block=>block.textContent===item.blockText):[];
  if(exact.length)blocks=exact;
  const matches=[];
  for(const block of blocks){
   const text=block.textContent||'',positions=findPositions(text,item.quote);
   for(const start of positions)if(contextMatches(text,start,item))matches.push({block,start,end:start+item.quote.length});
  }
  if(matches.length===1)return matches[0];
  if(Number.isInteger(item.start)&&Number.isInteger(item.end)){
   const exactPosition=matches.find(match=>match.start===item.start&&match.end===item.end);
   if(exactPosition)return exactPosition;
  }
  return null;
 }
 function restoreHighlights(){
  clearRenderedHighlights();
  const applied=[];
  for(const item of highlightState.items){
   const match=locateHighlight(item);
   const overlaps=match&&applied.some(previous=>previous.block===match.block&&match.start<previous.end&&previous.start<match.end);
   if(!match||overlaps||!wrapOffsets(match.block,match.start,match.end,item.id)){item.status='stale';continue;}
   item.status='active';item.version=data.meta.version;item.sourceHash=data.sourceHash;applied.push(match);
  }
  highlightState.version=data.meta.version;highlightState.sourceHash=data.sourceHash;saveHighlights();refreshHighlightUI();
 }
 function cancelAutoHighlight(){if(autoHighlightTimer){window.clearTimeout(autoHighlightTimer);autoHighlightTimer=0;}}
 function setMarkingMode(active){
  markingMode=active;
  document.body.classList.toggle('highlight-mode-active',active);
  if(highlightModeToggle){
   highlightModeToggle.hidden=!active;
   highlightModeToggle.setAttribute('aria-pressed',String(active));
   highlightModeToggle.setAttribute('aria-label',active?'退出连续高亮模式':'进入连续高亮模式');
   highlightModeToggle.title=active?'退出连续高亮模式':'进入连续高亮模式';
  }
  addHighlight.setAttribute('aria-label',active?'退出连续高亮模式':'进入连续高亮模式');
  addHighlight.title=active?'退出连续高亮模式':'进入连续高亮模式';
  refreshHighlightUI();
 }
 function refreshHighlightUI(){
  const active=highlightState.items.filter(item=>item.status==='active').length,stale=highlightState.items.filter(item=>item.status==='stale').length;
  clearHighlights.disabled=highlightState.items.length===0;
  if(!storageAvailable){highlightStatus.textContent='本机保存不可用。';return;}
  const modeText=markingMode?'；连续高亮已开启':'';
  highlightStatus.textContent=active||stale?`已保存 ${active} 条高亮${stale?`；${stale} 条位置待核实`:''}${modeText}`:(markingMode?'连续高亮已开启':'暂无高亮');
 }
 function updateHighlightSelection(){
  const range=pendingRange,info=selectionInfo(range),ids=marksFor(range);
  addHighlight.disabled=false;
  removeHighlight.hidden=ids.length===0;
  removeHighlight.disabled=ids.length===0;
 }
 function clearSelection(){cancelAutoHighlight();window.getSelection()?.removeAllRanges();pendingRange=null;updateHighlightSelection();}
 function applyPendingHighlight(){
  const info=selectionInfo(pendingRange),ids=marksFor(pendingRange);if(!info||ids.length)return false;
  const item=makeHighlight(info);if(!item||!wrapOffsets(info.block,item.start,item.end,item.id))return false;
  highlightState.items.push(item);if(highlightState.items.length>maxHighlights)highlightState.items=highlightState.items.slice(-maxHighlights);
  saveHighlights();clearSelection();refreshHighlightUI();return true;
 }
 function queueAutoHighlight(){
  cancelAutoHighlight();if(!markingMode)return;
  autoHighlightTimer=window.setTimeout(()=>{
   autoHighlightTimer=0;
   if(markingMode)applyPendingHighlight();
  },420);
 }
 document.addEventListener('selectionchange',()=>{
  const selection=window.getSelection(),range=selection?.rangeCount?selection.getRangeAt(0):null;
  if(range&&!range.collapsed){pendingRange=range.cloneRange();queueAutoHighlight();}
  else {cancelAutoHighlight();if(!highlightTools.contains(document.activeElement))pendingRange=null;}
  updateHighlightSelection();
 });
 for(const button of [addHighlight,removeHighlight,clearHighlights,exportHighlights,pdfExport])button.addEventListener('pointerdown',event=>event.preventDefault());
 highlightModeToggle?.addEventListener('pointerdown',event=>event.preventDefault());
 addHighlight.addEventListener('click',()=>{
  if(markingMode){setMarkingMode(false);clearSelection();return;}
  setMarkingMode(true);
  applyPendingHighlight();
 });
 highlightModeToggle?.addEventListener('click',()=>{setMarkingMode(false);clearSelection();});
 removeHighlight.addEventListener('click',()=>{
  const ids=marksFor(pendingRange);if(!ids.length)return;
  for(const id of ids){unwrapHighlight(id);highlightState.items=highlightState.items.filter(item=>item.id!==id);}
  saveHighlights();clearSelection();refreshHighlightUI();
 });
 clearHighlights.addEventListener('click',()=>{
  clearRenderedHighlights();highlightState.items=[];saveHighlights();clearSelection();refreshHighlightUI();
 });
 exportHighlights.addEventListener('click',()=>{
  const payload={schema:1,lessonId:data.meta.id,title:data.meta.title,version:data.meta.version,sourceHash:data.sourceHash,items:highlightState.items.map(({status,...item})=>item)};
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),link=document.createElement('a');
  link.href=url;link.download=`${data.meta.id}-highlights.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),0);
 });
 function pdfFilename(){
  const chapter=data.meta.id.match(/(?:^|-)ch(\d+)$/i)?.[1],now=new Date(),pad=value=>String(value).padStart(2,'0');
  const stamp=`${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const name=`第${chapter?Number(chapter):''}章_${data.meta.title}_${stamp}`;
  return name.replace(/[\\/:*?"<>|]/g,'_').replace(/\s+/g,' ').trim();
 }
 pdfExport.addEventListener('click',()=>{
  cancelAutoHighlight();
  const details=[...document.querySelectorAll('details')],states=details.map(detail=>detail.open),oldTitle=document.title,name=pdfFilename();
  details.forEach(detail=>{detail.open=true;});
  document.title=name;
  highlightStatus.textContent=`已准备 ${name}.pdf；请在打印窗口选择“另存为 PDF”。`;
  const restore=()=>{
   details.forEach((detail,index)=>{detail.open=states[index];});
   document.title=oldTitle;refreshHighlightUI();window.removeEventListener('afterprint',restore);
  };
  window.addEventListener('afterprint',restore,{once:true});
  window.print();
 });
 importHighlights.addEventListener('change',async()=>{
  const file=importHighlights.files?.[0];importHighlights.value='';if(!file)return;
  try{
   const payload=JSON.parse(await file.text());
   if(payload?.lessonId!==data.meta.id||!Array.isArray(payload.items))throw Error('课程不匹配或文件格式不正确');
   const merged=new Map(highlightState.items.map(item=>[item.id,item]));
   for(const item of payload.items.map(cleanHighlight).filter(Boolean))merged.set(item.id,item);
   highlightState.items=[...merged.values()].slice(-maxHighlights);restoreHighlights();
  }catch(error){highlightStatus.textContent=`导入失败：${error.message}`;}
 });
 restoreHighlights();
}
const quizReturn=document.querySelector('[data-return-to-quiz]');
let reviewForm=null;
const visibleQuestions=new Set();
function updateQuizReturn(){quizReturn.hidden=!reviewForm||visibleQuestions.has(reviewForm);}
const quizObserver=new IntersectionObserver(entries=>{
 for(const entry of entries){if(entry.isIntersecting)visibleQuestions.add(entry.target);else visibleQuestions.delete(entry.target);}
 updateQuizReturn();
});
for(const form of document.querySelectorAll('[data-question]'))quizObserver.observe(form);
for(const [index,link] of [...document.querySelectorAll('.concept-link')].entries())link.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 reviewForm=link.closest('[data-question]');
 quizReturn.textContent=`返回课后题 · 第 ${index+1} 题 ↓`;
 updateQuizReturn();
});
quizReturn.addEventListener('click',()=>{
 if(!reviewForm)return;
 const form=reviewForm;
 reviewForm=null;updateQuizReturn();
 // Replace the concept anchor so reload stays at the question and Back still works.
 history.replaceState(history.state,'','#'+form.id);
 form.setAttribute('tabindex','-1');
 form.focus({preventScroll:true});
 form.scrollIntoView({block:'start'});
});
for(const activity of document.querySelectorAll('[data-parallax]')){const slider=activity.querySelector('input');function update(){const d=Number(slider.value),p=1/d,x=350+Math.log(d)*65;activity.querySelector('[data-distance]').textContent=d;activity.querySelector('[data-parallax-value]').textContent=p.toFixed(3)+'″';activity.querySelector('[data-full-angle]').textContent=(2*p).toFixed(3)+'″';activity.querySelector('[data-star]').setAttribute('cx',x);activity.querySelector('[data-star-label]').setAttribute('x',x-14);for(const ray of activity.querySelectorAll('[data-ray]'))ray.setAttribute('x2',x);}slider.addEventListener('input',update);update();}
const dialog=document.getElementById('feedback-dialog');let opener=null;
for(const button of document.querySelectorAll('[data-feedback]'))button.addEventListener('click',()=>{
 opener=button;const target=button.dataset.feedback,label=button.dataset.label;
 dialog.querySelector('[data-feedback-context]').textContent=label;
 dialog.querySelector('[data-feedback-status]').textContent='';
 const location=dialog.querySelector('[data-feedback-location]');
 location.value=`${data.meta.scope} | ${data.meta.id} | 更新于 ${data.meta.updated||"未标注"} | ${target}\n${label}\n内容指纹：${data.sourceHash}`;
 const url=data.feedback?.formUrl;dialog.querySelector('[data-feedback-ready]').hidden=!url;dialog.querySelector('[data-feedback-unavailable]').hidden=!!url;
 const link=dialog.querySelector('[data-feedback-form-link]');if(url)link.href=url;else link.removeAttribute('href');
 dialog.showModal();
});
 dialog.querySelector('[data-close-feedback]').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus());
 dialog.querySelector('[data-copy-location]').addEventListener('click',async()=>{const location=dialog.querySelector('[data-feedback-location]');try{await navigator.clipboard.writeText(location.value);dialog.querySelector('[data-feedback-status]').textContent='已复制课程位置。';}catch{location.focus();location.select();dialog.querySelector('[data-feedback-status]').textContent='请复制已选中的课程位置。';}});
})();
