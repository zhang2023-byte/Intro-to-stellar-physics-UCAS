(()=>{
'use strict';
const data=JSON.parse(document.getElementById('lesson-data').textContent);
const storageKey=`stellar:${data.meta.id}:${data.meta.version}:${data.quizHash}`;
let answers={};
try{const stored=JSON.parse(localStorage.getItem(storageKey)||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))answers=stored;}catch{}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(answers));}catch{}}
function stats(){let done=0,correct=0;for(const q of data.quizzes){if(q.options.some(o=>o.id===answers[q.id])){done++;if(answers[q.id]===q.answer)correct++;}}for(const el of document.querySelectorAll('[data-answered]'))el.textContent=done;for(const el of document.querySelectorAll('[data-correct]'))el.textContent=correct;}
function showAnswer(form,q,value){const note=form.querySelector('.answer-note');const right=value===q.answer;note.hidden=false;note.classList.toggle('wrong',!right);note.textContent=(right?'回答正确。':'回答有误。')+' '+q.explanation;}
for(const q of data.quizzes){const form=document.getElementById(q.id);const value=answers[q.id];if(q.options.some(o=>o.id===value)){form.querySelector(`input[value="${value}"]`).checked=true;showAnswer(form,q,value);}form.addEventListener('submit',event=>{event.preventDefault();const value=new FormData(form).get(q.id);if(!q.options.some(o=>o.id===value))return;answers[q.id]=value;save();showAnswer(form,q,value);stats();});form.addEventListener('change',()=>{delete answers[q.id];form.querySelector('.answer-note').hidden=true;save();stats();});}
stats();
for(const reset of document.querySelectorAll('[data-reset-quiz]'))reset.addEventListener('click',()=>{answers={};save();for(const form of document.querySelectorAll('[data-question]')){form.reset();form.querySelector('.answer-note').hidden=true;}stats();});
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
