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
 const coarsePointer=window.matchMedia?.('(pointer: coarse)')?.matches;
 const addHighlight=highlightTools.querySelector('[data-highlight-add]');
 const removeHighlight=highlightTools.querySelector('[data-highlight-remove]');
 const clearHighlights=highlightTools.querySelector('[data-highlight-clear]');
 const exportHighlights=highlightTools.querySelector('[data-highlight-export]');
 const pdfExport=highlightTools.querySelector('[data-pdf-export]');
 const importHighlights=highlightTools.querySelector('[data-highlight-import]');
 const highlightStatus=highlightTools.querySelector('[data-highlight-status]');
 const helpToggle=highlightTools.querySelector('[data-highlight-help-toggle]');
 const helpPanel=highlightTools.querySelector('[data-highlight-help]');
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
  const first=blockFor(range.startContainer),last=blockFor(range.endContainer);
  if(!first||!last||!range.toString().trim())return null;
  const section=first.closest('.lesson-section');
  if(last.closest('.lesson-section')!==section)return null;
  // Keep each paragraph independently anchored in the existing backup format.
  // Reject mixed selections in full: never silently skip a formula or control.
  for(const node of section.querySelectorAll(excludedSelector+',h1,h2,h3,summary,button,input,select,textarea,svg,img'))if(intersects(range,node))return null;
  if(first===last)return {parts:[{block:first,range}]};
  if(first.tagName!=='P'||last.tagName!=='P')return null;
  const blocks=[...section.querySelectorAll('p')].filter(block=>intersects(range,block));
  const parts=[];
  for(const block of blocks){
   if(block.closest(excludedSelector))return null;
   const part=document.createRange();part.selectNodeContents(block);
   if(block===first)part.setStart(range.startContainer,range.startOffset);
   if(block===last)part.setEnd(range.endContainer,range.endOffset);
   if(part.toString().trim())parts.push({block,range:part});
  }
  // Between paragraph endpoints there may also be a list or a quotation.
  for(const node of section.querySelectorAll('li,blockquote,td'))if(intersects(range,node))return null;
  return parts.length?{parts}:null;
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
  const label=coarsePointer?'高亮选中文字':active?'退出连续高亮模式':'进入连续高亮模式';
  addHighlight.setAttribute('aria-label',label);
  addHighlight.title=label;
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
  refreshHighlightUI();
  if(range&&!range.collapsed&&!info&&!ids.length&&blockFor(range.startContainer))highlightStatus.textContent='请选择同一小节内的普通正文段落，避开公式、链接、代码和交互区域。';
 }
 function clearSelection(){cancelAutoHighlight();window.getSelection()?.removeAllRanges();pendingRange=null;updateHighlightSelection();}
 function applyPendingHighlight(){
  const info=selectionInfo(pendingRange),ids=marksFor(pendingRange);if(!info||ids.length)return false;
  const items=info.parts.map(makeHighlight);
  if(items.some(item=>!item||item.quote.length>10000||item.blockText.length>30000)){
   highlightStatus.textContent='选中文字过长，请缩小选区后重试。';return false;
  }
  if(highlightState.items.length+items.length>maxHighlights){
   highlightStatus.textContent='本课高亮最多保存 500 条，请先导出备份并取消部分高亮，再重试。';return false;
  }
  for(let i=0;i<items.length;i++)if(!wrapOffsets(info.parts[i].block,items[i].start,items[i].end,items[i].id)){
   for(const item of items)unwrapHighlight(item.id);
   highlightStatus.textContent='本次高亮未保存，请重新选择后重试。';return false;
  }
  highlightState.items.push(...items);
  saveHighlights();clearSelection();refreshHighlightUI();return true;
 }
 function queueAutoHighlight(){
  cancelAutoHighlight();if(!markingMode||coarsePointer)return;
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
  scheduleBubbleUpdate();
 });
 for(const button of [addHighlight,removeHighlight,clearHighlights,exportHighlights,pdfExport,helpToggle])button.addEventListener('pointerdown',event=>event.preventDefault());
 highlightModeToggle?.addEventListener('pointerdown',event=>event.preventDefault());
 addHighlight.addEventListener('click',()=>{
  if(coarsePointer){applyPendingHighlight();return;}
  if(markingMode){setMarkingMode(false);clearSelection();return;}
  setMarkingMode(true);
  applyPendingHighlight();
 });
 highlightModeToggle?.addEventListener('click',()=>{setMarkingMode(false);clearSelection();});
 function cancelHighlightIds(ids){
  for(const id of ids){unwrapHighlight(id);highlightState.items=highlightState.items.filter(item=>item.id!==id);}
  saveHighlights();clearSelection();refreshHighlightUI();
 }
 removeHighlight.addEventListener('click',()=>cancelHighlightIds(marksFor(pendingRange)));
 let clearArmed=false,clearTimer=0;
 function disarmClear(){if(!clearArmed)return;clearArmed=false;window.clearTimeout(clearTimer);clearTimer=0;clearHighlights.textContent='清空高亮';clearHighlights.removeAttribute('data-clear-armed');}
 clearHighlights.addEventListener('click',()=>{
  if(!clearArmed){clearArmed=true;clearHighlights.textContent='确认清空？';clearHighlights.setAttribute('data-clear-armed','');clearTimer=window.setTimeout(disarmClear,4000);return;}
  disarmClear();clearRenderedHighlights();highlightState.items=[];saveHighlights();clearSelection();refreshHighlightUI();
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
  hideHighlightBubble();
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
 const highlightBubble=document.createElement('div');
 highlightBubble.className='highlight-bubble';
 highlightBubble.setAttribute('data-highlight-bubble','');
 highlightBubble.hidden=true;
 const bubbleAdd=document.createElement('button');
 bubbleAdd.type='button';
 bubbleAdd.textContent='高亮';
 bubbleAdd.setAttribute('aria-label','高亮选中文字');
 bubbleAdd.setAttribute('data-highlight-bubble-add','');
 const bubbleButton=document.createElement('button');
 bubbleButton.type='button';
 bubbleButton.textContent='取消高亮';
 bubbleButton.setAttribute('aria-label','取消选中的高亮');
 bubbleButton.setAttribute('data-highlight-bubble-remove','');
 highlightBubble.append(bubbleAdd,bubbleButton);
 document.body.append(highlightBubble);
 let bubbleIds=[],bubbleTimer=0;
 function hideHighlightBubble(){window.clearTimeout(bubbleTimer);bubbleTimer=0;bubbleIds=[];highlightBubble.hidden=true;}
 function showHighlightBubble(ids,rect,anchor,addable){
  bubbleIds=ids;
  bubbleAdd.hidden=!addable;
  bubbleButton.hidden=ids.length===0;
  highlightBubble.hidden=false;
  const width=highlightBubble.offsetWidth||180,height=highlightBubble.offsetHeight||40;
  let x,y;
  if(coarsePointer){
   x=(anchor?.x??rect.left+rect.width/2)-width/2;
   y=rect.bottom+8;
   if(y+height>window.innerHeight-8)y=rect.top-height-56;
  }else if(anchor){
   x=anchor.x-width-6;y=anchor.y-height-6;
  }else{
   x=rect.left+rect.width/2-width/2;
   y=rect.top-height-8;
   if(y<8)y=rect.bottom+8;
  }
  y=Math.max(8,Math.min(y,Math.max(8,window.innerHeight-height-8)));
  x=Math.max(8,Math.min(x,Math.max(8,window.innerWidth-width-8)));
  highlightBubble.style.left=Math.round(x)+'px';highlightBubble.style.top=Math.round(y)+'px';
 }
 let pointerAnchor=null;
 document.addEventListener('pointerup',event=>{if(event.pointerType!=='touch')pointerAnchor={x:event.clientX,y:event.clientY};},true);
 function scheduleBubbleUpdate(){
  window.clearTimeout(bubbleTimer);
  bubbleTimer=window.setTimeout(()=>{
   bubbleTimer=0;
   const range=pendingRange;
   const ids=range&&!range.collapsed?marksFor(range):[];
   const info=ids.length?null:selectionInfo(range);
   const addable=!!info&&!markingMode;
   if(ids.length||addable)showHighlightBubble(ids,range.getBoundingClientRect(),coarsePointer?null:pointerAnchor,addable);
   else hideHighlightBubble();
  },280);
 }
 bubbleAdd.addEventListener('pointerdown',event=>event.preventDefault());
 bubbleAdd.addEventListener('click',()=>{hideHighlightBubble();applyPendingHighlight();});
 bubbleButton.addEventListener('pointerdown',event=>event.preventDefault());
 bubbleButton.addEventListener('click',()=>{const ids=bubbleIds;hideHighlightBubble();cancelHighlightIds(ids);});
 document.addEventListener('contextmenu',event=>{
  const mark=event.target?.closest?.('mark.stellar-highlight[data-highlight-id]');
  if(!mark)return;
  event.preventDefault();
  const range=document.createRange();range.selectNodeContents(mark);
  pendingRange=range;
  const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
  updateHighlightSelection();
  showHighlightBubble([mark.dataset.highlightId],mark.getBoundingClientRect(),{x:event.clientX,y:event.clientY});
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){hideHighlightBubble();hideHelpPanel();disarmClear();}});
 window.addEventListener('scroll',hideHighlightBubble,{passive:true,capture:true});
 window.addEventListener('resize',hideHighlightBubble,{passive:true});
 function hideHelpPanel(){if(helpPanel.hidden)return;helpPanel.hidden=true;helpToggle.setAttribute('aria-expanded','false');}
 helpToggle.addEventListener('click',()=>{helpPanel.hidden=!helpPanel.hidden;helpToggle.setAttribute('aria-expanded',String(!helpPanel.hidden));});
 document.addEventListener('click',event=>{if(!helpPanel.hidden&&!highlightTools.contains(event.target))hideHelpPanel();});
 setMarkingMode(false);
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
