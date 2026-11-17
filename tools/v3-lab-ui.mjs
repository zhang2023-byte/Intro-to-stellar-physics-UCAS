export function labFrame(a,ui,config,animate=false){
 let html=ui.frame(a,config).replace('class="activity explorer"','class="activity explorer v3lab" style="background:#10191d;border-radius:6px;border-top:3px solid #7de0bd"').replace('<div class="lab-layout">','<div class="lab-layout" style="display:block">').replace('<div class="lab-controls">','<div class="lab-controls" style="border-left:0;padding-left:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:0 22px">').replaceAll('<p class="caption">','<p class="caption" style="font-size:13px;line-height:1.8">');
 if(animate)html=html.replace('<div class="lab-result"', '<div style="display:flex;gap:10px;margin:16px 0"><button type="button" data-play aria-label="播放动画" title="播放动画" style="width:46px;height:46px;border:1px solid #7de0bd;border-radius:50%;background:#7de0bd;color:#10191d;font-size:19px">▶</button><button type="button" data-restart aria-label="重置动画" title="重置动画" style="width:46px;height:46px;border:1px solid #74878a;border-radius:50%;background:transparent;color:#eef4f5;font-size:24px">↺</button></div><div class="lab-result"');
 return html;
}

export const labRuntime=String.raw`
 const U=StellarActivityUI, C={mint:'#7de0bd',red:'#ff947e',gold:'#f5d56f',blue:'#9dccff',muted:'#9baeb0'};
 const text=(s,x,y,t,extra={})=>U.label(s,x,y,t,{'style':'font-size:18px',...extra});
 const dot=(s,x,y,r,color,extra={})=>U.node(s,'circle',{cx:x,cy:y,r,fill:color,...extra});
 const panes=s=>[U.node(s,'g',{'data-pane':'left'}),U.node(s,'g',{'data-pane':'right'})];
 function star(s,x,y,r,color,id){
  const defs=U.node(s,'defs',{}),g=U.node(defs,'radialGradient',{id,cx:'.35',cy:'.3',r:'.7'});
  for(const [offset,c] of [['0','#fff5cf'],['.35',color],['1','#3a222a']])U.node(g,'stop',{offset,'stop-color':c});
  dot(s,x,y,r,'url(#'+id+')',{stroke:color,'stroke-width':1.5});
  for(let k=0;k<55;k++){const angle=k*2.39996,q=r*.92*Math.sqrt((k+.5)/55);dot(s,x+q*Math.cos(angle),y+q*Math.sin(angle),Math.max(.7,r*.013),k%3?'#fff8df':'#34242b',{opacity:.17});}
 }
 const temperatureColor=T=>T<5000?'#ffac72':T<8000?'#ffe5a0':'#a9d9ff';
 const arrow=(s,x,y,dx,dy,color)=>{U.line(s,x,y,x+dx,y+dy,color,{'stroke-width':4});const n=Math.hypot(dx,dy);if(n>0){const ux=dx/n,uy=dy/n;U.node(s,'path',{d:'M'+(x+dx-10*ux+5*uy)+' '+(y+dy-10*uy-5*ux)+' L'+(x+dx)+' '+(y+dy)+' L'+(x+dx-10*ux-5*uy)+' '+(y+dy-10*uy+5*ux),fill:'none',stroke:color,'stroke-width':3});}};
 function chart(s,x0,y0,w,h,xmin,xmax,ymin,ymax,xs,ys){
  const x=v=>x0+w*(v-xmin)/(xmax-xmin),y=v=>y0+h-h*(v-ymin)/(ymax-ymin);
  for(const n of xs){U.line(s,x(n),y0,x(n),y0+h,'#3e5351',{'stroke-width':1});text(s,x(n),y0+h+24,n,{'text-anchor':'middle'});}
  for(const n of ys){U.line(s,x0,y(n),x0+w,y(n),'#3e5351',{'stroke-width':1});text(s,x0-10,y(n)+6,n,{'text-anchor':'end'});}
  return {x,y};
 }
 function mountLab(type,draw,animation){
  for(const lab of document.querySelectorAll('[data-lesson-activity="'+type+'"]')){
   const svg=lab.querySelector('svg'),result=lab.querySelector('.lab-result'),play=lab.querySelector('[data-play]');
   let running=false,raf=0,last=0,elapsed=0,position=0;
   const paint=()=>{svg.replaceChildren();const answer=draw(svg,U.values(lab));result.textContent=answer;svg.setAttribute('aria-label',lab.querySelector('h3').textContent+'。'+answer);
    const compact=lab.clientWidth<600,right=svg.querySelector('[data-pane="right"]');svg.setAttribute('viewBox',compact&&right?'0 0 350 720':svg.dataset.customBox||'0 0 700 360');
    if(right)right.setAttribute('transform',compact?'translate(-350 360)':'translate(0 0)');
    if(compact&&!right&&!svg.dataset.customBox)for(const label of svg.querySelectorAll('text'))label.style.fontSize='26px';
    svg.style.width='100%';svg.style.maxWidth=svg.dataset.customBox?'620px':'900px';
   };
   const stop=()=>{running=false;cancelAnimationFrame(raf);if(play){play.textContent='▶';play.setAttribute('aria-label','播放动画');play.title='播放动画';}result.setAttribute('aria-live','polite');};
   const step=time=>{if(!running)return;const dt=Math.min((time-last)/1000,.1);last=time;elapsed+=dt;
    if(elapsed>=.03){const input=lab.querySelector('[data-param="'+animation.key+'"]');let next=position+animation.rate*elapsed;elapsed=0;
     if(next>Number(input.max)){if(animation.loop)next=Number(input.min);else{next=Number(input.max);stop();}}
     if(next<Number(input.min)){next=Number(input.min);stop();}position=next;input.value=String(next);paint();}
    if(running)raf=requestAnimationFrame(step);
   };
   for(const input of lab.querySelectorAll('[data-param]'))input.addEventListener('input',()=>{stop();paint();});
   if(play){play.addEventListener('click',()=>{if(running){stop();return;}const input=lab.querySelector('[data-param="'+animation.key+'"]');if(!animation.loop&&((animation.rate>0&&Number(input.value)>=Number(input.max))||(animation.rate<0&&Number(input.value)<=Number(input.min))))input.value=animation.start;position=Number(input.value);elapsed=0;running=true;last=performance.now();play.textContent='Ⅱ';play.setAttribute('aria-label','暂停动画');play.title='暂停动画';result.setAttribute('aria-live','off');raf=requestAnimationFrame(step);});lab.querySelector('[data-restart]').addEventListener('click',()=>{stop();lab.querySelector('[data-param="'+animation.key+'"]').value=animation.start;paint();});}
   document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);window.addEventListener('beforeprint',stop);
   new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(lab);
   let width=0;new ResizeObserver(entries=>{const next=entries[0].contentRect.width;if(Math.abs(next-width)>1){width=next;paint();}}).observe(lab);
   paint();
  }
 }
`;
