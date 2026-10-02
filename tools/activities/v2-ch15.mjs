export const lessonId='v2-ch15';
export const types=['chromocore','transitionbalance','coronaconduction'];

export function coreModel(u,emission,tau){
 const photo=1-.9/(1+(u/50)**2);
 const chromo=emission*Math.exp(-((u/15)**2));
 return {photo,chromo,total:(photo+chromo)*Math.exp(-tau*Math.exp(-((u/4)**2)))};
}
export function balanceModel(T,logP,beta,Q){
 const k=1.380649e-16,P=10**logP,T0=30000;
 const ne=P/(2*k*T),loss=1e-22*(T/T0)**beta*ne**2;
 const E0=1e-22*(P/(2*k*T0))**2;
 const root=Math.abs(beta-2)<1e-9?null:T0*Math.exp(Math.log(Q/E0)/(beta-2));
 return {P,ne,loss,E0,root};
}
export function conductionModel(zKm,logF,lambdaKm,wind){
 const z=zKm*1e5,L=lambdaKm*1e5,F=10**logF,eta=1e-6,T0=1e5;
 const turn=wind>0?-lambdaKm*Math.log(wind):Infinity;
 const flux=F*(Math.exp(-z/L)-wind);
 const integral=F*(L*(-Math.expm1(-z/L))-wind*z);
 const valid=zKm<=turn+1e-7;
 const T=valid?(T0**3.5+3.5/eta*integral)**(1/3.5):null;
 return {turn,valid,T,flux,gradient:valid?flux/(eta*T**2.5)*1e5:null};
}
export function render(a,{frame,range}){
 if(a.type==='chromocore')return frame(a,{
  title:'宽吸收线中的色球发射核',
  prompt:'先把发射峰降低到连续谱以下，再增加星际吸收。观察发射核是否仍可识别，以及中央凹口由什么产生。',
  controls:range({key:'emission',label:'色球发射峰 E₀ / 连续谱',min:0,max:1.4,step:.1,value:.4})+range({key:'tau',label:'星际线心光学厚度 τ₀',min:0,max:2,step:.1,value:0}),
  caption:'原创计算示例：宽光球吸收为 Lorentz 形，深度0.9、速度尺度50 km/s；薄色球发射为 Gaussian 形、速度尺度15 km/s；星际吸收速度尺度4 km/s。横轴为相对线心的视向速度，纵轴以光球连续谱归一化。各尺度为教学选择，不是 Mg II 观测拟合；未解 NLTE 与自吸收。',
  legend:'虚线：光球宽吸收；实线：叠加色球后再经过星际吸收；点线：连续谱。',
 });
 if(a.type==='transitionbalance')return frame(a,{
  title:'定压辐射损失与平衡温度',
  prompt:'改变气体压力、幂律斜率 β 和单位体积加热 Q，观察损失曲线与水平加热线的交点。特别检查 β=2 的退化情形。',
  controls:range({key:'logP',label:'log₁₀ 气体压力（dyn cm⁻²）',min:-1.1,max:-.6,step:.01,value:-.7})+range({key:'beta',label:'损失函数幂律斜率 β',min:1.2,max:3,step:.1,value:2.6})+range({key:'Q',label:'单位体积加热 Q',min:.01,max:.2,step:.005,value:.08,unit:'erg cm⁻³ s⁻¹'}),
  caption:'纯氢完全电离近似 nₑ=气体压力/(2kT)；f(T)=10⁻²²(T/30000 K)的β次方 erg cm³ s⁻¹，仅在30000–100000 K绘制。压力与Q在每条曲线上固定，E₀为30000 K处损失。默认β=2.6是教学选择，未拟合观测；本活动为局部平衡曲线，不是完整大气分层或时间演化。',
  legend:'实线：辐射损失/E₀；虚线：Q/E₀；圆点：范围内的平衡交点。横轴温度，纵轴无量纲。',
 });
 return frame(a,{
  title:'向下传导与向外升温的温度分层',
  prompt:'改变机械通量、阻尼长度和风带走的能量比例，观察温度分层、底部梯度以及向外升温分支的终点。',
  controls:range({key:'logF',label:'log₁₀ 底部机械通量（erg cm⁻² s⁻¹）',min:4,max:6,step:.1,value:5})+range({key:'lambda',label:'阻尼长度 λ',min:1000,max:15000,step:500,value:5000,unit:'km'})+range({key:'wind',label:'风能量损失 / 底部机械通量',min:0,max:.7,step:.05,value:.1}),
  caption:'按本章式(15.22)计算的教学模型：底部T₀=100000 K、η=10⁻⁶ erg cm⁻¹ s⁻¹ K⁻⁷/²，Fₘ=Fₘ₀ exp(−z/λ（阻尼）)，上方辐射损失忽略，风损失为固定wFₘ₀。只画传导余量 Fₘ−wFₘ₀≥0 的向外升温分支；终点以后不能继续使用这个分支，图线并不预言真实日冕突然截断。未含磁场几何、风动力学或非局部传导。',
  legend:'实线：当前参数的计算温度；虚线：底部温度；方形：分支终点（若在图内）。',
 });
}
export const browserScript=`(()=>{
 const core=${coreModel.toString()},balance=${balanceModel.toString()},conduction=${conductionModel.toString()};
 const U=StellarActivityUI;
 function layout(lab){
  const l=lab.querySelector('.lab-layout'),c=lab.querySelector('.lab-controls');
  l.style.gridTemplateColumns='1fr';c.style.borderLeft='0';c.style.borderTop='1px solid #405165';c.style.padding='16px 0 0';
  c.style.display='grid';c.style.gridTemplateColumns='repeat(auto-fit,minmax(min(100%,240px),1fr))';c.style.gap='20px';
 }
 function axes(svg,xlabel,ylabel,xmax,ymax){const a=U.axes(svg,xlabel,ylabel,xmax,ymax);svg.setAttribute('viewBox','0 0 700 420');svg.querySelector('text[y="345"]').setAttribute('y','395');return a;}
 function yticks(svg,a,values){for(const y of values){U.line(svg,65,a.y(y),660,a.y(y),'#34475a',{'stroke-width':1});U.label(svg,55,a.y(y)+5,U.fmt(y,1),{'text-anchor':'end'});}}
 U.mount('chromocore',({lab,svg,values:v})=>{
  layout(lab);const a=axes(svg,'相对线心速度 / km s⁻¹','强度 / 光球连续谱',240,2.5);yticks(svg,a,[0,.5,1,1.5,2]);
  for(const u of [-120,-60,0,60,120])U.label(svg,a.x(u+120),345,String(u),{'text-anchor':'middle'});
  U.line(svg,65,a.y(1),660,a.y(1),'#b4c9d4',{'stroke-dasharray':'2 5'});
  const p=[],q=[];let peak=0;
  for(let u=-120;u<=120;u+=.5){const m=core(u,v.emission,v.tau);p.push([a.x(u+120),a.y(m.photo)]);q.push([a.x(u+120),a.y(m.total)]);peak=Math.max(peak,m.total);}
  U.curve(svg,p,'#9ecaca',true);U.curve(svg,q,'#eab76f');
  const center=core(0,v.emission,v.tau).total;
  U.node(svg,'circle',{cx:a.x(120),cy:a.y(center),r:5,fill:'#fff',stroke:'#eab76f','stroke-width':2});
  return '线心强度 = '+U.fmt(center,3)+'；全图最高强度 = '+U.fmt(peak,3)+'。'+
   (v.emission===0?'没有色球发射：实线只含光球与星际吸收。':v.tau>0?'星际吸收在发射核中造成窄的中央凹口，不能据此把整条线归为纯光球吸收。':center<1?'发射核低于连续谱，仍高于没有色球时的线心0.100，能在宽吸收谷内识别。':'色球发射已把线心抬到光球连续谱之上。');
 });
 U.mount('transitionbalance',({lab,svg,values:v})=>{
  layout(lab);const m=balance(30000,v.logP,v.beta,v.Q),ratio=v.Q/m.E0;
  const ymax=Math.max(4,ratio*1.18),a=axes(svg,'温度 / 10⁴ K','损失与加热 / E₀',7,ymax);
  yticks(svg,a,[0,ymax/2,ymax]);for(const t of [3,5,7,10])U.label(svg,a.x(t-3),345,String(t),{'text-anchor':'middle'});
  const pts=[];for(let t=30000;t<=100000;t+=500)pts.push([a.x(t/1e4-3),a.y(balance(t,v.logP,v.beta,v.Q).loss/m.E0)]);
  U.curve(svg,pts,'#eab76f');U.line(svg,65,a.y(ratio),660,a.y(ratio),'#9ecaca',{'stroke-dasharray':'7 6','stroke-width':3});
  const inside=m.root!==null&&m.root>=30000&&m.root<=100000;
  if(inside)U.node(svg,'circle',{cx:a.x(m.root/1e4-3),cy:a.y(ratio),r:6,fill:'#fff',stroke:'#eab76f','stroke-width':3});
  const base='气体压力 = '+U.fmt(m.P,4)+' dyn cm⁻²；E₀ = '+U.fmt(m.E0,4)+' erg cm⁻³ s⁻¹；Q/E₀ = '+U.fmt(ratio,3)+'。';
  if(m.root===null)return base+'β=2：定压损失与温度无关。Q与E₀相等时所有图内温度均平衡，否则没有交点；该关系不能唯一确定温度。';
  return base+(inside?'平衡温度 = '+U.fmt(m.root,0)+' K。':'在30000–100000 K内没有交点；不把幂律外推得到的温度当作本模型结论。')+
   (v.beta>2?'定压升温使损失增加；同一Q下降低压力时，范围内交点移向更高温度。':'定压升温使损失下降；固定加热下不能靠升温增强冷却。');
 });
 U.mount('coronaconduction',({lab,svg,values:v})=>{
  layout(lab);const end=Math.min(20000,conduction(0,v.logF,v.lambda,v.wind).turn);
  const top=conduction(end,v.logF,v.lambda,v.wind),start=conduction(0,v.logF,v.lambda,v.wind),ymax=Math.max(.3,top.T/1e6*1.15);
  const a=axes(svg,'离底部高度 z / km','温度 / 10⁶ K',20000,ymax);yticks(svg,a,[0,ymax/2,ymax]);
  for(const z of [0,5000,10000,15000,20000])U.label(svg,a.x(z),345,String(z),{'text-anchor':'middle'});
  U.line(svg,65,a.y(.1),660,a.y(.1),'#9ecaca',{'stroke-dasharray':'7 6'});
  const pts=[];for(let i=0;i<=200;i++){const z=end*i/200;pts.push([a.x(z),a.y(conduction(z,v.logF,v.lambda,v.wind).T/1e6)]);}U.curve(svg,pts,'#eab76f');
  if(end<20000)U.node(svg,'rect',{x:a.x(end)-5,y:a.y(top.T/1e6)-5,width:10,height:10,fill:'#fff',stroke:'#eab76f','stroke-width':2});
  return '底部向下传导通量绝对值 = '+U.scientific(start.flux)+' erg cm⁻² s⁻¹；底部温度梯度 = '+U.fmt(start.gradient,0)+' K/km；图内最高温度 = '+U.scientific(top.T)+' K。'+
   (end<20000?'在 z = '+U.fmt(end,0)+' km，机械通量等于风损失，传导通量与梯度降为零；向外升温分支止于方形标记。':'图示范围内传导仍向下，温度仍向外增加。')+'增大Fₘ₀或λ（阻尼）提高同一高度温度，增大风损失降低传导余量与温度。';
 });
})();`;
