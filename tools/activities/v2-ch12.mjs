export const lessonId='v2-ch12';
export const types=['linewidths'];
export function massWidths(T,turb){
 const k=1.380649e-23,mu=1.66053906660e-27,c=299792458;
 return [12,48,56].map(A=>{const thermal2=2*k*T/(A*mu)/1e6,total2=thermal2+turb*turb,xi=Math.sqrt(total2);return {A,thermal2,total2,xi,deltaNm:500*xi*1000/c};});
}
export function render(a,{frame,range}){
 return frame(a,{title:'原子质量、热运动与微湍动宽度',prompt:'先改变温度，观察总宽度平方对1/A的斜率；再改变共同微湍动，观察截距与三种元素的速度宽度。',controls:range({key:'T',label:'动理学温度',min:4000,max:14000,step:100,value:8000,unit:'K'})+range({key:'turb',label:'共同微湍动宽度',min:0,max:8,step:.1,value:2,unit:'km/s'}),caption:'同一等温代表气层、高斯局部多普勒模型，ξ²为热项2kT/(A mᵤ)与共同微湍动宽度平方之和。A取C=12、Ti=48、Fe=56；质量近似为A mᵤ。ξ是exp[−(v/ξ)²]的宽度参数，不是一维标准差。纵轴单位(km/s)²，固定范围0–100；读数用共同参考波长500 nm换算多普勒宽度。不是实际谱线或观测拟合，不含阻尼、自转、仪器及形成深度差异。',legend:'实线与标记：总宽度平方；虚线：纯热项；点线：共同微湍动项。○ C；□ Ti；◇ Fe。'});
}
export const browserScript=String.raw`(()=>{
 const U=StellarActivityUI,k=1.380649e-23,mu=1.66053906660e-27,c=299792458;
 U.mount('linewidths',({lab,svg,values:v})=>{
  lab.querySelector('.lab-layout').style.gridTemplateColumns='minmax(0,1fr)';
  Object.assign(lab.querySelector('.lab-controls').style,{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,240px),1fr))',borderLeft:'0',paddingLeft:'0',borderTop:'1px solid #405165',paddingTop:'12px'});
  svg.setAttribute('viewBox','0 0 700 390');
  const slope=2*k*v.T/mu/1e6,intercept=v.turb*v.turb;
  const a=U.axes(svg,'1 / A（无量纲）','ξ² / (km/s)²',.1,100);
  for(const value of [0,.05,.1])U.label(svg,a.x(value),340,U.fmt(value,2),{'text-anchor':'middle'});
  for(const value of [0,25,50,75,100]){U.label(svg,56,a.y(value)+5,String(value),{'text-anchor':'end'});if(value)U.line(svg,65,a.y(value),660,a.y(value),'#34475a',{'stroke-width':1});}
  U.curve(svg,[[a.x(0),a.y(0)],[a.x(.1),a.y(slope*.1)]],'#8ccac8',true);
  U.line(svg,a.x(0),a.y(intercept),a.x(.1),a.y(intercept),'#b9c3cc',{'stroke-dasharray':'2 6'});
  U.curve(svg,[[a.x(0),a.y(intercept)],[a.x(.1),a.y(slope*.1+intercept)]],'#eab76f');
  const elements=[['C',12,'circle'],['Ti',48,'rect'],['Fe',56,'diamond']];
  const readings=[];
  for(const [name,A,shape]of elements){
   const thermal2=slope/A,total2=thermal2+intercept,xi=Math.sqrt(total2),x=a.x(1/A),y=a.y(total2);
   if(shape==='circle')U.node(svg,'circle',{cx:x,cy:y,r:6,fill:'#eab76f',stroke:'#142538','stroke-width':1});
   else if(shape==='rect')U.node(svg,'rect',{x:x-6,y:y-6,width:12,height:12,fill:'#eab76f',stroke:'#142538','stroke-width':1});
   else U.node(svg,'path',{d:'M'+x+' '+(y-7)+'L'+(x+7)+' '+y+'L'+x+' '+(y+7)+'L'+(x-7)+' '+y+'Z',fill:'#eab76f',stroke:'#142538','stroke-width':1});
   const lx=name==='C'?x+28:name==='Ti'?260:110,ly=name==='C'?y-12:name==='Ti'?y-40:y-18;
   U.line(svg,x,y,lx,ly,'#9aaebb',{'stroke-width':1});U.label(svg,lx,ly-5,name,{'text-anchor':'middle'});
   readings.push(name+'：ξ='+U.fmt(xi,2)+' km/s，多普勒宽度='+U.fmt(500*xi*1000/c,4)+' nm');
  }
  const difference=slope*(1/12-1/56);
  const labels=svg.querySelectorAll('text');labels[0].setAttribute('y','375');labels[1].setAttribute('y','30');
  const scaleLabels=()=>{for(const label of svg.querySelectorAll('text'))label.style.fontSize=(svg.getBoundingClientRect().width<500?32:20)+'px';};
  scaleLabels();
  if(!lab.linewidthResizeObserver){lab.linewidthResizeObserver=new ResizeObserver(scaleLabels);lab.linewidthResizeObserver.observe(svg);}
  return '斜率 2kT/mᵤ='+U.fmt(slope,2)+' (km/s)²；截距 共同微湍动宽度平方='+U.fmt(intercept,2)+' (km/s)²。'+readings.join('；')+'。ξ²(C)−ξ²(Fe)='+U.fmt(difference,2)+' (km/s)²；固定温度时该差不随共同微湍动改变。';
 });
})();`;
