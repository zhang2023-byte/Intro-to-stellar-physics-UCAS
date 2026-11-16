export const lessonId='v3-ch05';
export const types=['v3c05parcel','v3c05opacity'];

export function parcelState(env,ad,q){
 const bubble=q**ad,ambient=q**env,density=ambient/bubble;
 const acceleration=1/density-1;
 const stability=Math.abs(env-ad)<1e-10?'neutral':env>ad?'unstable':'stable';
 return {bubble,ambient,density,acceleration,stability};
}
export function opacityState(b,ad,tau){
 const gradient=(b+1)*tau/(4*(tau+2/3)),limit=(b+1)/4,denominator=b+1-4*ad;
 return {gradient,limit,boundary:denominator>1e-12?(8*ad/3)/denominator:null,stability:Math.abs(gradient-ad)<1e-10?'neutral':gradient>ad?'unstable':'stable'};
}
export function render(a,{frame,range}){
 if(a.type==='v3c05parcel')return frame(a,{title:'气团与环境：上升和下沉',prompt:'气团在上升时冷却，浮力还能向上吗？先预测环境梯度从0.3增到0.5后会怎样，再调压强比比较上升与下沉。',controls:range({key:'env',label:'环境对数温度梯度',min:.1,max:.6,step:.01,value:.5})+range({key:'q',label:'到达层压强比 q',min:.7,max:1.3,step:.01,value:.8}),caption:'公式曲线，非观测。固定组成、固定平均粒子质量的单原子理想气体，气团绝热梯度0.4；位移中保持压力平衡，梯度在路径上取常数。温度以出发层T₁归一化。q<1代表上升，q>1代表下沉；有限位移只演示常梯度路径，局部稳定性取微小位移极限。',legend:'实线＋方点：环境；虚线＋圆点：气团。温度轴从0.75起。'});
 return frame(a,{title:'不透明度增长与失稳边界',prompt:'b=0.6、绝热梯度0.4时，有限深度能否失稳？改变b与绝热阈值，再沿光学深度移动探测点。',controls:range({key:'b',label:'不透明度压强指数 b',min:0,max:2,step:.05,value:1})+range({key:'ad',label:'指定绝热梯度',min:.1,max:.4,step:.01,value:.4})+range({key:'tau',label:'探测光学深度',min:.1,max:20,step:.1,value:2}),caption:'解析灰模型，非观测或完整恒星模型。平面平行、重力和总通量固定，κR=κ₀Pgᵇ，表面气压忽略，T⁴∝τR+2/3。绝热梯度是外部指定参数，未求电离平衡。光学薄处仅作灰模型延拓；两梯度及横轴τR均无量纲。',legend:'实线：辐射梯度；虚线：绝热阈值；点线：深层辐射极限；圆点：当前深度。'});
}
export const browserScript=`(()=>{
 const U=StellarActivityUI,parcelState=${parcelState.toString()},opacityState=${opacityState.toString()};
 const words={stable:'稳定：有恢复浮力',unstable:'不稳定：扰动会增长',neutral:'中性：无温度差产生的恢复或驱动浮力'};
 U.mount('v3c05parcel',({svg,values:v})=>{
  const base=U.axes(svg,'压强比 q（向左上升，向右下沉）','温度 / T₁',.6,.5),a={x:q=>base.x(q-.7),y:t=>base.y(t-.75)};
  for(const q of [.7,.8,1,1.2,1.3])U.label(svg,a.x(q),323,U.fmt(q,1),{'text-anchor':'middle'});
  for(const t of [.75,1,1.25])U.label(svg,57,a.y(t)+4,U.fmt(t,2),{'text-anchor':'end'});
  const env=[],bu=[];for(let i=0;i<=120;i++){const q=.7+i*.005,s=parcelState(v.env,.4,q);env.push([a.x(q),a.y(s.ambient)]);bu.push([a.x(q),a.y(s.bubble)]);}
  U.curve(svg,env,'#eab76f');U.curve(svg,bu,'#8ccac8',true);
  const s=parcelState(v.env,.4,v.q),x=a.x(v.q);
  U.node(svg,'rect',{x:x-5,y:a.y(s.ambient)-5,width:10,height:10,fill:'#eab76f'});
  U.node(svg,'circle',{cx:x,cy:a.y(s.bubble),r:6,fill:'#8ccac8'});
  const direction=Math.abs(s.acceleration)<1e-10?'无净浮力':s.acceleration>0?'浮力向上':'浮力向下';
  return '气团T/T₁='+U.fmt(s.bubble,4)+'；环境T/T₁='+U.fmt(s.ambient,4)+'；气团/环境密度比='+U.fmt(s.density,4)+'。'+direction+'；'+words[s.stability]+'。'+(Math.abs(v.q-1)<1e-10?'当前尚未位移；稳定性文字描述小扰动后的响应。':'');
 });
 U.mount('v3c05opacity',({svg,values:v})=>{
  const a=U.axes(svg,'光学深度 τR（无量纲）','对数温度梯度（无量纲）',20,.8);
  for(const t of [0,5,10,15,20])U.label(svg,a.x(t),323,String(t),{'text-anchor':'middle'});
  for(const n of [0,.2,.4,.6,.8])U.label(svg,57,a.y(n)+4,U.fmt(n,1),{'text-anchor':'end'});
  const s=opacityState(v.b,v.ad,v.tau),pts=[];for(let i=0;i<=200;i++)pts.push([a.x(i/10),a.y(opacityState(v.b,v.ad,i/10).gradient)]);
  U.curve(svg,pts,'#eab76f');U.line(svg,a.x(0),a.y(v.ad),a.x(20),a.y(v.ad),'#8ccac8',{'stroke-dasharray':'8 5'});
  U.line(svg,a.x(0),a.y(s.limit),a.x(20),a.y(s.limit),'#c7b8dd',{'stroke-dasharray':'2 5'});
  U.node(svg,'circle',{cx:a.x(v.tau),cy:a.y(s.gradient),r:6,fill:'#eab76f'});
  const state=s.stability==='neutral'?'中性边界':s.stability==='unstable'?'不稳定':'稳定';
  return '当前辐射梯度='+U.fmt(s.gradient,4)+'；绝热梯度='+U.fmt(v.ad,4)+'；深层极限='+U.fmt(s.limit,4)+'。当前'+state+'。'+(s.boundary===null?'所有有限光学深度均不满足严格失稳条件。':'解析中性边界τR='+U.fmt(s.boundary,3)+'，更深处才失稳。');
 });
})();`;
