export const lessonId='v2-ch16';
export const types=['c16continuity','c16parker','c16eddington'];

export function windContinuity(logn,gain,x){
 const n0=10**logn,ratio=gain-(gain-1)/x,v0=2e6,r0=6.96e10,mH=1.67e-24;
 const n=n0/(ratio*x*x),mdot=4*Math.PI*r0*r0*n0*mH*v0;
 return {n0,n,ratio,velocity:20*ratio,mdot,solarPerYear:mdot*3.156e7/1.99e33};
}
export function parkerMach(x){
 if(Math.abs(x-1)<1e-10)return 1;
 const A=4*Math.log(x)+4/x-3;
 let lo=x<1?-A-2:0,hi=x<1?0:Math.log(A+1)+2;
 for(let i=0;i<90;i++){
  const mid=(lo+hi)/2,f=Math.exp(mid)-mid-A;
  if(x<1?(f>0):(f<0))lo=mid;else hi=mid;
 }
 return Math.exp((lo+hi)/4);
}
export function parkerState(Tmillion,compactness,r){
 const T=Tmillion*1e6,k=1.38e-16,mH=1.67e-24,G=6.67e-8,Ms=1.99e33,Rs=6.96e10;
 const sound=Math.sqrt(2*k*T/mH)/1e5,critical=G*Ms*compactness*mH/(4*k*T*Rs);
 return {T,sound,critical,mach:parkerMach(r/critical),valid:critical>1,upper:G*Ms*compactness*mH/(4*k*Rs)/1e6};
}
export function eddingtonState(lm,opacity){
 const limit=5e4*.25/opacity,gamma=lm/limit;
 return {limit,gamma,effective:1-gamma};
}

const stacked=html=>html.replace('<div class="lab-layout">','<div class="lab-layout" style="display:block">').replace('<div class="lab-controls">','<div class="lab-controls" style="border-left:0;border-top:1px solid #405165;padding:10px 0 0">');
export function render(a,{frame,range}){
 if(a.type==='c16continuity')return stacked(frame(a,{title:'球面膨胀、加速与密度下降',prompt:'先改变速度增益，比较实线与仅由球面面积扩张给出的虚线；再改变基部质子数密度和探测半径，观察质量损失率与当地密度分别怎样变化。',controls:range({key:'logn',label:'基部 log₁₀(n₀ / cm⁻³)',min:6,max:10,step:.25,value:8})+range({key:'gain',label:'速度远端增益 b',min:1,max:8,step:.5,value:4})+range({key:'r',label:'探测半径 r/r₀',min:1,max:10,step:.25,value:4}),legend:'实线：含加速的密度；虚线：恒速时的 x⁻²；○ 当前探测点。纵轴是密度比的十进对数。',caption:'连续性公式曲线，非观测。稳态、球对称、完全电离纯氢；r₀=6.96×10¹⁰ cm，v₀=20 km/s，x=r/r₀，指定 v/v₀=b−(b−1)/x，不由动力学求速度。改变n₀时速度律固定，归一化密度曲线不变，实际密度和质量流同时改变。采用mH=1.67×10⁻²⁴ g，M⊙=1.99×10³³ g，1年=3.156×10⁷ s。'}));
 if(a.type==='c16parker')return stacked(frame(a,{title:'等温 Parker 风的跨声速解',prompt:'改变温度或质量与半径之比，观察声点的位置和给定半径处的风速；用箭头键将温度升到声点进入恒星的范围，读出模型条件为何失效。',controls:range({key:'T',label:'等温温度 T',min:.2,max:8,step:.1,value:2,unit:'×10⁶ K'})+range({key:'compact',label:'(M/M⊙)/(R/R⊙)',min:.2,max:3,step:.1,value:1})+range({key:'r',label:'探测半径 r/R',min:1,max:30,step:1,value:10}),legend:'实线：跨声速分支 v/a；水平虚线：等温声速 v/a=1；□ 声点；○ 探测点。',caption:'式(16.25)的等温数值解，非观测拟合。完全电离纯氢、稳态、球对称、仅气压与引力；R固定为R⊙，通过改变M调整输入比值。a²=2kT/mH，声点半径=GM/(2a²)，曲线只画恒星表面至30R；严格等温解没有有限的无穷远终端速度。k=1.38×10⁻¹⁶ erg/K，G=6.67×10⁻⁸ cm³/(g s²)，其余常数同前活动。声点半径≤R时停止绘制，因为该分支不再具有恒星表面的亚声速入口。'}));
 return stacked(frame(a,{title:'辐射加速度与爱丁顿参数',prompt:'改变光度质量比和固定的质量消光系数，观察辐射力相对于引力的大小及交点位置；把系数加倍，检验允许的光度质量比为何减半。',controls:range({key:'lm',label:'光度质量比 (L/L⊙)/(M/M⊙)',min:5000,max:100000,step:5000,value:30000})+range({key:'opacity',label:'频率无关的质量消光系数 κ',min:.1,max:1,step:.05,value:.25,unit:'cm²/g'}),legend:'实线：辐射加速度/引力；水平虚线：引力基准1；○ 当前输入；□ 爱丁顿交点（在图内时）。',caption:'教材式(16.35)–(16.41)的灰色力平衡演示，非观测。采用教材κ=0.25 cm²/g时爱丁顿光度/质量≈5×10⁴ L⊙/M⊙的近似标定；更改κ仅模拟另一个频率无关系数，不求谱线驱动或电离平衡。横轴光度质量比以10⁴ L⊙/M⊙为单位，纵轴力比无量纲；不包含气压、磁场或能量方程，不能由交点计算质量损失率。'}));
}

export const browserScript=`(()=>{
 const U=StellarActivityUI;
 const windContinuity=${windContinuity.toString()};
 const parkerMach=${parkerMach.toString()};
 const parkerState=${parkerState.toString()};
 const eddingtonState=${eddingtonState.toString()};
 const ticks=(svg,a,xs,ys)=>{for(const x of xs)U.label(svg,a.x(x),323,String(x),{'text-anchor':'middle'});for(const y of ys)U.label(svg,57,a.y(y)+5,String(y),{'text-anchor':'end'});};
 const mathMount=(type,update)=>U.mount(type,args=>{
  const text=update(args),result=args.result,NS='http://www.w3.org/1998/Math/MathML';
  const tokens={r_c:['r','c'],g_r:['g','r'],g_g:['g','g'],g_eff:['g','eff'],L_Edd:['L','Edd']};
  result.replaceChildren();let end=0;
  for(const m of text.matchAll(/r_c|g_eff|g_r|g_g|L_Edd/g)){
   result.append(document.createTextNode(text.slice(end,m.index)));
   const math=document.createElementNS(NS,'math'),sub=document.createElementNS(NS,'msub');math.setAttribute('aria-label',m[0]);
   for(const symbol of tokens[m[0]]){const mi=document.createElementNS(NS,'mi');mi.textContent=symbol;sub.append(mi);}
   math.append(sub);result.append(math);end=m.index+m[0].length;
  }
  result.append(document.createTextNode(text.slice(end)));
 });
 const sonicLabel=(svg,x,y,value)=>{
  const label=U.label(svg,x,y,'声点 r'),sub=document.createElementNS('http://www.w3.org/2000/svg','tspan');
  sub.setAttribute('baseline-shift','sub');sub.setAttribute('font-size','.75em');sub.textContent='c';label.append(sub,document.createTextNode('/R='+U.fmt(value,2)));
 };
 const marker=(svg,x,y,kind,color)=>kind==='square'?U.node(svg,'rect',{x:x-6,y:y-6,width:12,height:12,fill:'#142538',stroke:color,'stroke-width':3}):U.node(svg,'circle',{cx:x,cy:y,r:6,fill:'#142538',stroke:color,'stroke-width':3});
 mathMount('c16continuity',({svg,values:v})=>{
  const base=U.axes(svg,'半径比 x=r/r₀（无量纲）','log₁₀(n/n₀)（无量纲）',9,3),a={x:x=>base.x(x-1),y:y=>base.y(y+3)};
  ticks(svg,a,[1,2,4,6,8,10],[0,-1,-2,-3]);
  const flow=[],geo=[];for(let i=0;i<=180;i++){const x=1+i/20,z=windContinuity(v.logn,v.gain,x);flow.push([a.x(x),a.y(Math.log10(z.n/z.n0))]);geo.push([a.x(x),a.y(-2*Math.log10(x))]);}
  U.curve(svg,flow,'#eab76f');U.curve(svg,geo,'#8ccac8',true);
  const s=windContinuity(v.logn,v.gain,v.r);marker(svg,a.x(v.r),a.y(Math.log10(s.n/s.n0)),'circle','#eab76f');
  return '探测点 v='+U.fmt(s.velocity,1)+' km/s，n='+U.scientific(s.n,2)+' cm⁻³，n/n₀='+U.fmt(s.n/s.n0,5)+'；全流场质量损失率='+U.scientific(s.mdot,2)+' g/s = '+U.scientific(s.solarPerYear,2)+' M⊙/年。'+(v.gain===1?'恒速：两条曲线重合，密度仅按面积扩张下降。':'加速使密度比恒速的x⁻²下降更快，但质量流守恒。');
 });
 mathMount('c16parker',({svg,values:v})=>{
  const s=parkerState(v.T,v.compact,v.r),base=U.axes(svg,'距中心 r/R（无量纲）','风速 v/a（无量纲）',29,4.5),a={x:x=>base.x(x-1),y:base.y};
  ticks(svg,a,[1,5,10,20,30],[0,1,2,3,4]);U.line(svg,a.x(1),a.y(1),a.x(30),a.y(1),'#8ccac8',{'stroke-dasharray':'7 6'});
  if(!s.valid){U.label(svg,120,150,'声点进入恒星：缺少亚声速入口');return 'a='+U.fmt(s.sound,1)+' km/s，r_c/R='+U.fmt(s.critical,3)+'。当前温度'+U.fmt(v.T,1)+'×10⁶ K达到或超过本组M/R的入口上限约'+U.fmt(s.upper,2)+'×10⁶ K，停止绘制Parker风。该条件限制本活动的无磁等温模型，不是所有星冕的普适温度上限。';}
  const pts=[];for(let i=0;i<=240;i++){const r=1+29*i/240;pts.push([a.x(r),a.y(parkerMach(r/s.critical))]);}U.curve(svg,pts,'#eab76f');
  if(s.critical<=30){marker(svg,a.x(s.critical),a.y(1),'square','#8ccac8');sonicLabel(svg,Math.min(520,a.x(s.critical)+10),a.y(1)-18,s.critical);}
  marker(svg,a.x(v.r),a.y(s.mach),'circle','#eab76f');
  return 'a='+U.fmt(s.sound,1)+' km/s，r_c/R='+U.fmt(s.critical,3)+'；探测r/R='+v.r+'处 v/a='+(s.mach<.001?U.scientific(s.mach,2):U.fmt(s.mach,3))+'，v='+(s.mach*s.sound<.1?U.scientific(s.mach*s.sound,2):U.fmt(s.mach*s.sound,1))+' km/s。'+(s.critical>30?'声点在图外，所画部分均为亚声速。':v.r<s.critical?'探测点在声点以内，属于亚声速加速段。':v.r>s.critical?'探测点在声点以外，属于超声速加速段。':'探测点恰在声点，v=a。')+'密度归一化尚未给定，不能据这条速度曲线独立求质量损失率。';
 });
 mathMount('c16eddington',({svg,values:v})=>{
  const s=eddingtonState(v.lm,v.opacity),a=U.axes(svg,'光度质量比 / (10⁴ L⊙/M⊙)','辐射/引力加速度比（无量纲）',10,8);
  ticks(svg,a,[0,2,4,6,8,10],[0,1,2,4,6,8]);U.line(svg,a.x(0),a.y(1),a.x(10),a.y(1),'#8ccac8',{'stroke-dasharray':'7 6'});
  U.curve(svg,[[a.x(0),a.y(0)],[a.x(10),a.y(eddingtonState(100000,v.opacity).gamma)]],'#eab76f');
  marker(svg,a.x(v.lm/1e4),a.y(s.gamma),'circle','#eab76f');if(s.limit<=1e5)marker(svg,a.x(s.limit/1e4),a.y(1),'square','#8ccac8');
  return 'Γ=g_r/g_g='+U.fmt(s.gamma,3)+'，向内有效重力 g_eff/g_g='+U.fmt(s.effective,3)+'；本近似 L_Edd/M='+U.fmt(s.limit,0)+' L⊙/M⊙。'+(s.gamma<1?'Γ<1：此辐射项仍小于引力；气压或谱线等其他作用仍可参与形成风。':Math.abs(s.gamma-1)<1e-8?'Γ=1：这一力平衡中辐射与引力相等，静态束缚的裕量消失。':'Γ>1：这一力平衡的净作用向外，静态束缚条件失效；活动不计算实际外流。');
 });
})();`;
