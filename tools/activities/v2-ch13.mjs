export const lessonId='v2-ch13';
export const types=['nltelevels'];

// Rates are normalized to N_l A; equal statistical weights and x=2.
export function nlteModel(j,y,x=2){
 const t=Math.exp(-x),p=j/Math.expm1(x);
 const r=(p+y*t)/(1+p+y);
 const source=Math.expm1(x)*r/(1-r);
 const excitation=x/(-Math.log(r));
 const absorption=p,collUp=y*t,spontaneous=r,stimulated=r*p,collDown=r*y;
 return {r,source,excitation,absorption,collUp,spontaneous,stimulated,collDown,
  up:absorption+collUp,down:spontaneous+stimulated+collDown,
  netRadiative:absorption-spontaneous-stimulated,netCollisional:collUp-collDown};
}

export function render(a,{frame,range}){
 return frame(a,{
  title:'二能级布居：辐射与碰撞的竞争',
  prompt:'改变辐射比 j 和碰撞比 y，观察源函数曲线及各过程速率。比较总上下行速率与每类过程的净速率，检查统计平衡和细致平衡的区别。',
  controls:range({key:'j',label:'辐射比 j（线平均强度 / 本地 Planck 值）',min:.2,max:3,step:.1,value:.3})+
   range({key:'y',label:'碰撞比 y（碰撞去激发率 / 自发率）',min:0,max:100,step:1,value:0}),
  caption:'定常二能级原子，固定光子能量 / 本地 kT = 2、上下能级统计权重相等，Maxwell 电子与共同线轮廓。辐射比 j 和碰撞比 y 无量纲；速率以 NₗA 归一化。横轴按 log₁₀(1+y) 展开以观察弱碰撞区域。计算曲线不是观测谱线，也未联立整层辐射转移；模型没有额外泵浦，不能产生反转。',
  legend:'实线：当前辐射比下的源函数；虚线：本地 Planck 值；实心圆：当前碰撞比。',
  svgLabel:'源函数与碰撞比的计算曲线，圆点标记当前状态，虚线表示本地Planck值'
 });
}

export const browserScript=`(()=>{
 const calculate=${nlteModel.toString()};
 const U=StellarActivityUI;
 U.mount('nltelevels',({lab,svg,result,values:v})=>{
  const layout=lab.querySelector('.lab-layout'),controls=lab.querySelector('.lab-controls');
  layout.style.gridTemplateColumns='1fr';
  controls.style.borderLeft='0';controls.style.borderTop='1px solid #405165';controls.style.padding='16px 0 0';
  controls.style.display='grid';controls.style.gridTemplateColumns='repeat(auto-fit,minmax(min(100%,240px),1fr))';controls.style.gap='20px';
  const m=calculate(v.j,v.y),plot=U.axes(svg,'碰撞比 y（刻度非线性）','源函数 / 本地 Planck 值',Math.log10(101),3.3);
  for(const y of [0,1,3,10,30,100])U.label(svg,plot.x(Math.log10(1+y)),322,String(y),{'text-anchor':'middle'});
  for(const s of [0,1,2,3]){
   U.line(svg,65,plot.y(s),660,plot.y(s),'#34475a',{'stroke-width':1});
   U.label(svg,55,plot.y(s)+5,String(s),{'text-anchor':'end'});
  }
  U.line(svg,65,plot.y(1),660,plot.y(1),'#8ccac8',{'stroke-dasharray':'7 6','stroke-width':2});
  const points=[];
  for(let i=0;i<=150;i++){
   const z=Math.log10(101)*i/150,y=Math.pow(10,z)-1;
   points.push([plot.x(z),plot.y(calculate(v.j,y).source)]);
  }
  U.curve(svg,points,'#eab76f');
  U.node(svg,'circle',{cx:plot.x(Math.log10(1+v.y)),cy:plot.y(m.source),r:6,fill:'#fff',stroke:'#eab76f','stroke-width':3});
  U.label(svg,650,40,'虚线：热分布',{'text-anchor':'end'});
  result.replaceChildren();
  const p=document.createElement('p');
  p.textContent='r = '+U.fmt(m.r,4)+'；源函数 / Planck 值 = '+U.fmt(m.source,4)+'；激发温度 / 动力学温度 = '+U.fmt(m.excitation,3)+'。';
  result.append(p);
  const table=document.createElement('table');
  const caption=document.createElement('caption');caption.textContent='跃迁数 / (NₗA)：逐过程与总量';table.append(caption);
  for(const [name,value]of [
   ['↑ 辐射吸收',m.absorption],['↑ 碰撞激发',m.collUp],
   ['↓ 自发发射',m.spontaneous],['↓ 受激发射',m.stimulated],['↓ 碰撞去激发',m.collDown],
   ['↑ 总流入',m.up],['↓ 总流出',m.down]
  ]){
   const tr=document.createElement('tr'),th=document.createElement('th'),td=document.createElement('td');
   th.scope='row';th.style.background='transparent';th.textContent=name;td.textContent=U.fmt(value,4);tr.append(th,td);table.append(tr);
  }
  result.append(table);
  const note=document.createElement('p');
  const thermal=Math.abs(v.j-1)<1e-10;
  const sign=n=>Math.abs(n)<.00005?'0.0000':(n>=0?'+':'')+U.fmt(n,4);
  note.textContent='辐射净向上：'+sign(m.netRadiative)+'；碰撞净向上：'+sign(m.netCollisional)+'。'+
   (thermal?'此时辐射和碰撞各自的净速率为零，这对能级为热分布。':
    m.netRadiative>0?'辐射净激发由碰撞净去激发抵消：总量统计平衡，各过程未分别细致平衡。':
    '辐射净去激发由碰撞净激发抵消：总量统计平衡，各过程未分别细致平衡。');
  if(v.y===0)note.textContent='纯辐射极限：源函数等于线平均强度；辐射吸收与两类辐射发射共同平衡。';
  result.append(note);
 });
})();`;
