export const lessonId='v2-ch14';
export const types=['c14parcel','c14opacity','c14flux'];

export function parcel(env,ad,q){
 const atmosphere=q**env,bubble=q**ad;
 return {atmosphere,bubble,densityRatio:atmosphere/bubble,delta:bubble-atmosphere};
}
export function radiativeGradient(b,tau){return (b+1)*tau/(4*(tau+2/3));}
export function fluxModel(rad,rho,lKm){
 const g=274,T=10000,R=6400,cp=2.5*R,ad=.4,H=R*T/g,l=lKm*1000,total=5.670374419e-8*6000**4;
 const state=n=>{const excess=Math.max(0,n-ad),delta=T*excess*l/(2*H),speed=Math.sqrt(g*excess/H)*l/2,conv=rho*cp*speed*delta;return {n,delta,speed,conv,radiation:total*n/rad};};
 let lo=ad,hi=rad;
 if(rad>ad)for(let i=0;i<80;i++){const mid=(lo+hi)/2,s=state(mid);if(s.conv+s.radiation>total)hi=mid;else lo=mid;}
 const s=state(rad<=ad?rad:(lo+hi)/2);
 return {...s,ad,H,total,vmax:(total*g*l/(2*rho*cp*T))**(1/3),state};
}

export function render(a,{frame,range}){
 if(a.type==='c14parcel')return frame(a,{title:'上升气团的温度与浮力',prompt:'改变环境梯度、气团绝热梯度与到达层的压力比，比较气团和环境的温度，再判断浮力是否继续推动上升。',controls:range({key:'env',label:'环境对数温度梯度',min:.05,max:.65,step:.01,value:.45})+range({key:'ad',label:'气团绝热梯度',min:.05,max:.4,step:.01,value:.4})+range({key:'q',label:'到达层压力比 P₂/P₁',min:.5,max:.95,step:.01,value:.8}),caption:'公式曲线，非观测。理想气体、相同且固定的平均粒子质量；气团与环境压力平衡，气团绝热，两个梯度在路径上取常数。温度以出发层T₁归一化，纵轴显示0.6–1.05；横轴压力以P₁归一化；滑块中的绝热梯度是指定参数，未计算电离平衡。压力向左减小，表示上升。',legend:'实线：环境；虚线：气团绝热路径。○ 气团到达点；□ 同层环境。'});
 if(a.type==='c14opacity')return frame(a,{title:'不透明度增长与不稳定层',prompt:'改变 κ∝Pᵇ 的指数 b 和绝热梯度，沿光学深度比较辐射梯度与绝热阈值；观察改变探测深度能否跨过不稳定上边界。',controls:range({key:'b',label:'不透明度压力指数 b',min:0,max:2,step:.05,value:1})+range({key:'ad',label:'绝热梯度',min:.05,max:.4,step:.01,value:.4})+range({key:'tau',label:'探测光学深度 τ',min:0,max:10,step:.1,value:3}),caption:'灰大气辐射平衡公式曲线，非观测或精确恒星模型。平面平行、恒定重力、κ=A Pᵇ、表面气压忽略，∇ad取常数。横轴τ与纵轴梯度均无量纲。用式(14.19)演示诊断；实际大气须逐层使用真实不透明度和状态方程，光学薄处的扩散近似有限。',legend:'实线：∇rad；水平虚线：∇ad；○ 当前光学深度。实线在阈值之上表示不稳定。'});
 return frame(a,{title:'辐射与对流共同满足通量守恒',prompt:'改变密度、混合长或假想纯辐射梯度，观察守恒交点、实际梯度、速度和通量分担。先固定其他量，把密度提高十倍，检验实际梯度是否更接近绝热值。',controls:range({key:'logrho',label:'log₁₀(ρ / kg m⁻³)',min:-4,max:-2,step:.1,value:-3})+range({key:'l',label:'混合长 l',min:50,max:200,step:10,value:150,unit:'km'})+range({key:'rad',label:'假想纯辐射梯度',min:.2,max:.8,step:.01,value:.7}),caption:'教材局部绝热气团近似的数值演示，非观测拟合。T=10000 K，Teff=6000 K，g=274 m/s²，固定平均粒子质量的单原子理想气体，Rspec=6400 J/(kg K)，cp=16000 J/(kg K)，∇ad=0.4，Hp=Rspec T/g。路径l/2；忽略气团辐射损失、阻力及梯度随路径改变。密度变化时保持这些局部系数与输入∇rad，等效改变辐射导热条件，不能当作同一颗星的自洽分层。纵轴通量除以σTeff⁴；图只显示0–1.3范围。',legend:'点线：辐射；实线：对流；长虚线：两者之和。水平细线为总通量1；○ 为守恒交点。'});
}

export const browserScript=`(()=>{
 const U=StellarActivityUI;
 const parcel=${parcel.toString()};
 const radiativeGradient=${radiativeGradient.toString()};
 const fluxModel=${fluxModel.toString()};
 const ticks=(svg,a,xs,ys)=>{for(const x of xs)U.label(svg,a.x(x),324,U.fmt(x,2),{'text-anchor':'middle'});for(const y of ys)U.label(svg,56,a.y(y)+5,U.fmt(y,2),{'text-anchor':'end'});};
 U.mount('c14parcel',({svg,values:v})=>{
  const base=U.axes(svg,'P / P₁（向左为上升）','T / T₁（纵轴从0.6开始）',.5,.45),a={x:p=>base.x(p-.5),y:t=>base.y(t-.6)};
  ticks(svg,a,[.5,.75,1],[.6,.8,1]);
  const env=[],bu=[];for(let i=0;i<=100;i++){const q=.5+i/200;env.push([a.x(q),a.y(q**v.env)]);bu.push([a.x(q),a.y(q**v.ad)]);}
  U.curve(svg,env,'#eab76f');U.curve(svg,bu,'#8ccac8',true);
  const s=parcel(v.env,v.ad,v.q),x=a.x(v.q);
  U.line(svg,x,a.y(s.bubble),x,a.y(s.atmosphere),'#b9c3cc');
  U.node(svg,'circle',{cx:x,cy:a.y(s.bubble),r:6,fill:'#8ccac8'});
  U.node(svg,'rect',{x:x-5,y:a.y(s.atmosphere)-5,width:10,height:10,fill:'#eab76f'});
  const status=Math.abs(v.env-v.ad)<1e-8?'中性：温度与密度相同。':v.env>v.ad?'不稳定：气团更热、更轻，浮力继续推动上升。':'稳定：气团更冷、更重，浮力使它回落。';
  return 'T气团/T₁='+U.fmt(s.bubble,4)+'，T环境/T₁='+U.fmt(s.atmosphere,4)+'，温差/T₁='+U.fmt(s.delta,4)+'；同层ρ气团/ρ环境='+U.fmt(s.densityRatio,4)+'。'+status;
 });
 U.mount('c14opacity',({svg,values:v})=>{
  const a=U.axes(svg,'平均光学深度 τ（无量纲）','对数温度梯度（无量纲）',10,.8);ticks(svg,a,[0,2,4,6,8,10],[0,.2,.4,.6,.8]);
  const pts=[];for(let i=0;i<=150;i++){const t=i/15;pts.push([a.x(t),a.y(radiativeGradient(v.b,t))]);}U.curve(svg,pts,'#eab76f');
  U.line(svg,a.x(0),a.y(v.ad),a.x(10),a.y(v.ad),'#8ccac8',{'stroke-dasharray':'7 5'});
  const n=radiativeGradient(v.b,v.tau);U.node(svg,'circle',{cx:a.x(v.tau),cy:a.y(n),r:6,fill:'#eab76f'});
  const denom=v.b+1-4*v.ad,boundary=denom>0?(8*v.ad/3)/denom:Infinity;
  return '当前∇rad='+U.fmt(n,4)+'，∇ad='+U.fmt(v.ad,4)+'：'+(Math.abs(n-v.ad)<1e-8?'中性边界。':n>v.ad?'不稳定。':'稳定。')+' 深层极限∇rad→'+U.fmt((v.b+1)/4,3)+'。'+(Number.isFinite(boundary)?'解析上边界τ='+U.fmt(boundary,3)+'；更深处才满足严格不等式。':'此幂律模型在任何有限深度均达不到不稳定。');
 });
 U.mount('c14flux',({svg,values:v})=>{
  const rho=10**v.logrho,s=fluxModel(v.rad,rho,v.l),a=U.axes(svg,'实际梯度候选值 ∇（无量纲）','通量 / σTeff⁴',.8,1.3);ticks(svg,a,[0,.2,.4,.6,.8],[0,.5,1]);
  U.line(svg,a.x(0),a.y(1),a.x(.8),a.y(1),'#8a9eab',{'stroke-width':1});
  const curves=[[],[],[]];for(let i=0;i<=400;i++){const n=i*.8/400,z=s.state(n),ys=[z.radiation/s.total,z.conv/s.total,(z.radiation+z.conv)/s.total];ys.forEach((y,j)=>{if(y<=1.3)curves[j].push([a.x(n),a.y(y)]);});}
  if(curves[0].length>1)U.node(svg,'polyline',{points:curves[0].map(p=>p.join(',')).join(' '),fill:'none',stroke:'#8ccac8','stroke-width':3,'stroke-dasharray':'2 6'});
  if(curves[1].length>1)U.curve(svg,curves[1],'#eab76f');
  if(curves[2].length>1)U.node(svg,'polyline',{points:curves[2].map(p=>p.join(',')).join(' '),fill:'none',stroke:'#c7b8dd','stroke-width':3,'stroke-dasharray':'12 7'});
  U.node(svg,'circle',{cx:a.x(s.n),cy:a.y(1),r:7,fill:'#fff',stroke:'#eab76f','stroke-width':3});
  U.line(svg,a.x(s.ad),a.y(0),a.x(s.ad),a.y(1.3),'#7b8d9a',{'stroke-dasharray':'4 5'});U.label(svg,a.x(s.ad)+6,42,'∇ad=0.4');
  const fraction=s.conv/s.total,warning=s.delta/10000>.1?' 温差超过背景温度10%，局部小扰动近似需谨慎。':'';
  return 'ρ='+U.scientific(rho,2)+' kg/m³；守恒实际梯度='+U.fmt(s.n,4)+'；辐射'+U.fmt(100*s.radiation/s.total,2)+'%，对流'+U.fmt(100*fraction,2)+'%；平均速度='+U.fmt(s.speed/1000,3)+' km/s，温差='+U.fmt(s.delta,1)+' K。纯对流通量上限对应vmax='+U.fmt(s.vmax/1000,3)+' km/s，实际速度不超过它。'+(v.rad<=s.ad?'纯辐射分层稳定，对流通量为零。':'实际梯度位于0.4与输入∇rad之间。')+warning;
 });
})();`;
