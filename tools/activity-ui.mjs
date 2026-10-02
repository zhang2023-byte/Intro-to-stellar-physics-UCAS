// Trusted activity renderers use these helpers; lesson Markdown cannot supply HTML controls.
export const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function range({key,label,min,max,step=1,value,unit=''}){
 return `<label class="lab-control">${escapeHTML(label)} <output data-out="${escapeHTML(key)}">${escapeHTML(value)} ${escapeHTML(unit)}</output><input data-param="${escapeHTML(key)}" data-unit="${escapeHTML(unit)}" aria-label="${escapeHTML(label+(unit?'（'+unit+'）':''))}" type="range" min="${escapeHTML(min)}" max="${escapeHTML(max)}" step="${escapeHTML(step)}" value="${escapeHTML(value)}"></label>`;
}
export function select({key,label,options}){
 return `<label class="lab-control">${escapeHTML(label)}<select data-param="${escapeHTML(key)}" aria-label="${escapeHTML(label)}">${options.map(([value,text])=>`<option value="${escapeHTML(value)}">${escapeHTML(text)}</option>`).join('')}</select></label>`;
}
export function frame(a,{title,prompt,controls,caption,svgLabel=title,legend=''}){
 return `<div class="activity explorer" id="${escapeHTML(a.id)}" data-lesson-activity="${escapeHTML(a.type)}"><div class="activity-head"><button class="feedback-link" data-feedback="${escapeHTML(a.id)}" data-label="${escapeHTML(title)}" type="button">反馈</button></div><h3>${escapeHTML(title)}</h3><p class="prediction">${escapeHTML(prompt)}</p><div class="lab-layout"><div class="lab-plot">${legend?`<p class="caption">${escapeHTML(legend)}</p>`:''}<svg viewBox="0 0 700 360" role="img" aria-label="${escapeHTML(svgLabel)}"></svg><div class="lab-result" aria-live="polite"></div></div><div class="lab-controls">${controls}</div></div><p class="caption">${escapeHTML(caption)}</p></div>`;
}
