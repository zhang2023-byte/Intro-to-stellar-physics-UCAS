export const lessonId='v3-ch07';
export const types=['convdepth'];
const G=2.74e4;
const strat=(Teff,kappa,P)=>Teff*Math.pow(.75*kappa*P/G+.5,.25);
export function render(a,{frame,range}){
 return frame(a,{title:'温度分层与 6000 K 的交点',prompt:'先预测：把有效温度从 5800 K 降到 4500 K，6000 K 出现在更大还是更小的气体压强处？再把吸收系数调大，同一颗星的交点向哪边移？',controls:range({key:'Teff',label:'有效温度',min:4000,max:8000,step:100,value:5800,unit:'K'})+range({key:'kappa',label:'吸收系数 κ（cm² g⁻¹）',min:.2,max:2,step:.1,value:1}),caption:'灰大气近似：取式 (7.2)，表面处的温度四次方取有效温度四次方的一半；静力平衡下气体压强等于 gτ/κ，g=2.74×10⁴ cm s⁻²、κ 为常数。只描述外层大气的辐射平衡分层；对流区内部温度梯度更平，实际对流区比这里给出的更深。',legend:'金色实线：当前温度分层；灰色虚线：参考星（5800 K、κ=1）；青色虚线：6000 K 水平线；圆点：交点，即氢开始明显电离的层。',svgLabel:'温度随气体压强变化的曲线，与 6000 K 水平线的交点给出氢开始明显电离的位置'});
}
export const browserScript=String.raw`(()=>{
 const U=StellarActivityUI,G=2.74e4;
 const strat=(Teff,kappa,P)=>Teff*Math.pow(.75*kappa*P/G+.5,.25);
 const cross=(Teff,kappa)=>{
  const f=P=>strat(Teff,kappa,P)-6000;
  if(f(1e-3)>=0||f(1e9)<0)return null;
  let lo=1e-3,hi=1e9;
  for(let i=0;i<120;i++){const m=Math.sqrt(lo*hi);if(f(m)<0)lo=m;else hi=m;}
  return Math.sqrt(lo*hi);
 };
 U.mount('convdepth',({lab,svg,values:v})=>{
  const x0=78,x1=650,y0=282,y1=52;
  const X=P=>x0+(x1-x0)*(Math.log10(P)-3)/3;
  const Y=T=>y0-(y0-y1)*(T-2000)/28000;
  U.line(svg,x0,y0,x1,y0,'#7b8d9a',{'stroke-width':2});
  U.line(svg,x0,y0,x0,y1,'#7b8d9a',{'stroke-width':2});
  const ticks=[[1000,'10³'],[10000,'10⁴'],[100000,'10⁵'],[1000000,'10⁶']];
  for(const [P,text] of ticks){
   if(P>1000)U.line(svg,X(P),y0,X(P),y1,'#34475a',{'stroke-width':1});
   U.label(svg,X(P),y0+18,text,{'text-anchor':'middle'});
  }
  for(const T of [5000,10000,15000,20000,25000,30000]){
   U.line(svg,x0,Y(T),x1,Y(T),'#34475a',{'stroke-width':1});
   U.label(svg,x0-8,Y(T)+5,String(T),{'text-anchor':'end'});
  }
  U.label(svg,x0-6,38,'温度 T（K）',{'text-anchor':'start'});
  U.label(svg,364,326,'气体压强（dyn cm⁻²，对数）',{'text-anchor':'middle'});
  U.line(svg,x0,Y(6000),x1,Y(6000),'#8ccac8',{'stroke-width':2,'stroke-dasharray':'9 6'});
  const draw=(Teff,kappa,color,dash)=>{
   const points=[];
   for(let i=0;i<=90;i++){const P=Math.pow(10,3+3*i/90);points.push([X(P),Y(Math.min(29500,strat(Teff,kappa,P)))]);}
   U.curve(svg,points,color,dash);
  };
  draw(5800,1,'#b9c3cc',true);
  draw(v.Teff,v.kappa,'#eab76f',false);
  const Pc=cross(v.Teff,v.kappa);
  let text;
  if(Pc){
   const tau=v.kappa*Pc/G,Pr=cross(5800,1),ratio=Pr?Pc/Pr:1;
   U.line(svg,X(Pc),Y(6000),X(Pc),y0,'#8ccac8',{'stroke-width':1.5,'stroke-dasharray':'4 5'});
   U.node(svg,'circle',{cx:X(Pc),cy:Y(6000),r:6,fill:'#eab76f'});
   text='6000 K 出现在气体压强 '+U.scientific(Pc,1)+' dyn cm⁻²（对应 τ='+U.fmt(tau,2)+'）。参考星（5800 K、κ=1）的交点在 '+U.scientific(Pr,1)+'，本星是它的 '+U.fmt(ratio,2)+' 倍。';
  }else{
   U.node(svg,'circle',{cx:x0,cy:Y(strat(v.Teff,v.kappa,1e3)),r:6,fill:'#eab76f'});
   text='表面温度约 '+Math.round(.84*v.Teff)+' K（即 0.84×'+v.Teff+' K），已高过 6000 K：交点落在表面以外，对流从最外层就开始。';
  }
  return text;
 });
})();`;
