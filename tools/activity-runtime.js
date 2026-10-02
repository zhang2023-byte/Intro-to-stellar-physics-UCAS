// Native SVG and controls only. No evaluation of strings or external requests.
const StellarActivityUI=(()=>{
 const NS='http://www.w3.org/2000/svg';
 function node(svg,tag,attrs={},text){const n=document.createElementNS(NS,tag);for(const [key,value]of Object.entries(attrs))n.setAttribute(key,String(value));if(text!==undefined)n.textContent=text;svg.append(n);return n;}
 const line=(svg,x1,y1,x2,y2,color='#7b8d9a',extra={})=>node(svg,'line',{x1,y1,x2,y2,stroke:color,'stroke-width':2,...extra});
 const label=(svg,x,y,text,extra={})=>node(svg,'text',{x,y,...extra},text);
 function axes(svg,xlabel,ylabel,xmax=1,ymax=1){line(svg,65,300,660,300);line(svg,65,300,65,40);label(svg,355,345,xlabel,{'text-anchor':'middle'});label(svg,65,23,ylabel);return {x:value=>65+595*value/xmax,y:value=>300-250*value/ymax};}
 function curve(svg,points,color='#eab76f',dash=false){return node(svg,'path',{d:points.map(([x,y],i)=>`${i?'L':'M'}${Number(x).toFixed(2)} ${Number(y).toFixed(2)}`).join(' '),fill:'none',stroke:color,'stroke-width':3,...(dash?{'stroke-dasharray':'7 6'}:{})});}
 const fmt=(value,digits=2)=>Number(value).toFixed(digits);
 const scientific=(value,digits=2)=>{const [mantissa,exponent]=Number(value).toExponential(digits).split('e');const supers={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};return mantissa+' × 10'+String(Number(exponent)).split('').map(c=>supers[c]).join('');};
 function values(lab){const result={};const outputs=[...lab.querySelectorAll('[data-out]')];for(const input of lab.querySelectorAll('[data-param]')){const key=input.dataset.param;result[key]=input.tagName==='SELECT'?input.value:Number(input.value);const output=outputs.find(output=>output.dataset.out===key);if(output)output.textContent=input.value+(input.dataset.unit?' '+input.dataset.unit:'');}return result;}
 function mount(type,update){for(const lab of document.querySelectorAll(`[data-lesson-activity="${type}"]`)){const svg=lab.querySelector('svg'),result=lab.querySelector('.lab-result');const refresh=()=>{svg.replaceChildren();const text=update({lab,svg,result,values:values(lab)});if(typeof text==='string')result.textContent=text;svg.setAttribute('aria-label',lab.querySelector('h3').textContent+'。'+result.textContent);};for(const input of lab.querySelectorAll('[data-param]'))input.addEventListener('input',refresh);refresh();}}
 return Object.freeze({node,line,label,axes,curve,fmt,scientific,values,mount});
})();
