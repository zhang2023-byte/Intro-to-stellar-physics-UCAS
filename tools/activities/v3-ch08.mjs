import {labFrame,labRuntime} from '../v3-lab-ui.mjs';
export const lessonId='v3-ch08';
export const types=['v3gamow','v3catalyst','v3rates','v3turnoff'];
export function gamow(T,E){const kT=.0861733*T,b=22.2,peak=(b*kT/2)**(2/3);return {kT,peak,logThermal:-E/kT,logTunnel:-b/Math.sqrt(E),kernel:Math.exp(-E/kT-b/Math.sqrt(E)+3*peak/kT)};}
export function rateRatios(T,rho){return {pp:rho*T**4,cn:rho*T**16};}
export function turnoff(age){return (10/age)**.4;}
export function waitSeconds(factor){const year=365.25*86400;return [1e6*year,14*60,3e5*year,3e8*year*factor,82,1e4*year];}
export function catalyst(factor){const times=waitSeconds(factor),sum=times.reduce((a,b)=>a+b,0);return times.map(t=>t/sum);}
export function cycleStep(percent,factor){
 const times=waitSeconds(factor),weights=times.map(t=>1+Math.log10(t/82));
 let remaining=percent/100*weights.reduce((a,b)=>a+b,0);
 for(let i=0;i<weights.length;i++){
  if(remaining<weights[i]||i===weights.length-1)return {i,progress:Math.min(1,remaining/weights[i]),seconds:times[i]};
  remaining-=weights[i];
 }
}
// Relative speed in 1000 km/s; reduced mass of two protons in the CM frame.
export function speedEnergy(v){return .25*1.67262192369e-27*(v*1e6)**2/1.602176634e-16;}
export function render(a,ui){const r=ui.range;const common={};
 if(a.type==='v3gamow')return labFrame(a,ui,{...common,title:'Gamow 峰：在哪一段速度上相遇？',prompt:'升温后，哪条曲线会把峰推向更高速度？先移动探针，比较三条曲线，再调高温度，看峰的位置怎样变。',controls:r({key:'T',label:'温度 / 百万 K',min:8,max:25,step:.5,value:14})+r({key:'v',label:'相对速度 / 千 km/s',min:0,max:3.2,step:.01,value:1.47}),legend:'蓝色虚线：热运动因子；红色点线：穿透因子；绿色实线：二者的乘积。三条曲线各除以自己在图示范围内的最大值，比较峰位和形状，不比较绝对高度。金色竖线是探针。',caption:'参照教材图 8.2，用速度展示两个指数因子的竞争。这里画的是热运动的指数因子，不是三维速率分布；绿色曲线先乘原始因子，再归一化。横轴是质子对的相对速度，读数按约化质量换算为动能。图中没有计算绝对反应率。'},true);
 if(a.type==='v3catalyst')return labFrame(a,ui,{title:'碳氮循环：催化核回到起点',prompt:'核在哪一步等得最久？播放一圈，看亮点何时停留，再改变氮-14 的等待时间，对比稳态丰度。',controls:r({key:'phase',label:'演示进度',min:0,max:100,step:.1,value:0,unit:'%'})+r({key:'factor',label:'氮-14 等待时间 / 教材值',min:.1,max:2,step:.1,value:1}),legend:'金点标记当前步骤；环下方给出该步的实际平均等待时间。右侧横条按对数绘制，数字是稳态数量的百分比。',caption:'封闭 CN 主循环，固定质子供应。参考等待时间取自教材 §8.5。为让 82 秒和数亿年都看得见，每步画面时长按 1 加上“等待时间除以 82 秒”的常用对数分配；这不是物理时钟。丰度按真实等待时间计算，不按播放秒数计算。'},true);
 if(a.type==='v3rates')return labFrame(a,ui,{title:'升温 10%：两种核反应的响应',prompt:'相同的升温，会让 pp 和 CN 的产能增加相同倍数吗？先改变温度比，再固定温度改变密度，比较两条曲线与当前倍数。',controls:r({key:'T',label:'T / T参考',min:.8,max:1.2,step:.005,value:1})+r({key:'rho',label:'ρ / ρ参考',min:.5,max:2,step:.05,value:1}),legend:'青色实线为 pp，红色虚线为 CN；两者分别除以各自参考态的每单位质量产能率。左右图显示相同数据的曲线与横条。',caption:'固定组成，局部幂律 εpp∝ρT⁴、εCN∝ρT¹⁶。各自归一化为 1，不表示参考态二者产能相等，也不能据交点判断主导反应。温度指数只适用于教材讨论的局部范围。'},false);
 return labFrame(a,ui,{title:'星团年龄与主序转折质量',prompt:'星团变老时，主序上首先消失的是低质量星还是高质量星？增加年龄，观察虚线所标的转折质量和仍留在主序上的点。',controls:r({key:'age',label:'星团年龄',min:.03,max:10,step:.01,value:1,unit:'十亿年'}),legend:'亮点表示模型中仍处于主序的恒星；空圈表示已经离开主序的位置，并非演化后的真实位置。金色虚线标记转折质量。',caption:'共同形成、同组成的理想星团，假定全部已到主序，取一颗太阳质量的主序寿命为 10 Gyr，寿命与质量的 −2.5 次方成正比。横轴为质量，纵轴为主序光度，以太阳光度为单位，按质量的 3.5 次方计算；均为对数轴。未计算真实等龄线、主序前收缩、双星或质量损失；动画时间直接对应年龄滑块。'},true);
}
export const browserScript=`(()=>{${labRuntime}
 const gamow=${gamow.toString()},speedEnergy=${speedEnergy.toString()},rateRatios=${rateRatios.toString()},turnoff=${turnoff.toString()},waitSeconds=${waitSeconds.toString()},catalyst=${catalyst.toString()},cycleStep=${cycleStep.toString()};
 mountLab('v3gamow',(s,v)=>{
  s.dataset.customBox='0 0 520 320';
  const a=chart(s,48,55,430,188,0,3.2,0,1,[0,.8,1.6,2.4,3.2],[0,.5,1]),end=gamow(v.T,speedEnergy(3.2));
  const sample=x=>{const g=gamow(v.T,speedEnergy(x));return [Math.exp(g.logThermal),Math.exp(g.logTunnel-end.logTunnel),g.kernel];};
  const g=gamow(v.T,speedEnergy(v.v)),peak=Math.sqrt(g.peak/speedEnergy(1));
  text(s,48,26,'相对高度');text(s,265,301,'相对速度 / 千 km/s',{'text-anchor':'middle'});
  for(const [i,c,dash] of [[0,C.blue,'8 5'],[1,C.red,'2 5'],[2,C.mint,'']]){
   const pts=Array.from({length:201},(_,j)=>{const x=3.2*j/200;return [a.x(x),a.y(sample(x)[i])];});
   const path=U.curve(s,pts,c);if(dash)path.setAttribute('stroke-dasharray',dash);
  }
  text(s,a.x(peak),45,'Gamow 峰',{'text-anchor':'middle',fill:C.mint});
  U.line(s,a.x(v.v),55,a.x(v.v),243,C.gold,{'stroke-dasharray':'4 5'});
  for(const [i,c] of [[0,C.blue],[1,C.red],[2,C.mint]])dot(s,a.x(v.v),a.y(sample(v.v)[i]),4,c);
  return '探针动能 '+U.fmt(speedEnergy(v.v),2)+' keV；峰值动能 '+U.fmt(g.peak,2)+' keV（相对速度 '+U.fmt(1000*peak,0)+' km/s）；探针处的乘积为峰值的 '+U.fmt(100*g.kernel,1)+'%。';
 },{key:'v',rate:.32,start:0,loop:true});
 mountLab('v3catalyst',(s,v)=>{
  const [l,r]=panes(s),names=['¹²C','¹³N','¹³C','¹⁴N','¹⁵O','¹⁵N'],reactions=['¹²C + p → ¹³N + γ','¹³N → ¹³C + e⁺ + ν','¹³C + p → ¹⁴N + γ','¹⁴N + p → ¹⁵O + γ','¹⁵O → ¹⁵N + e⁺ + ν','¹⁵N + p → ¹²C + ⁴He'];
  const f=catalyst(v.factor),step=cycleStep(v.phase,v.factor),n=step.i;
  const wait=step.seconds<120?step.seconds+' 秒':step.seconds<86400?step.seconds/60+' 分钟':U.fmt(step.seconds/(365.25*86400*10000),0)+' 万年';
  const points=names.map((_,i)=>[175+112*Math.cos(-Math.PI/2+i*Math.PI/3),155+110*Math.sin(-Math.PI/2+i*Math.PI/3)]);
  points.forEach((p,i)=>U.line(l,...p,...points[(i+1)%6],C.muted,{'stroke-width':2}));
  points.forEach((p,i)=>{dot(l,...p,23,i===3?C.red:'#263f43');text(l,p[0],p[1]+6,names[i],{'text-anchor':'middle',fill:i===3?'#10191d':'#eef4f5'});});
  const p=points[n],q=points[(n+1)%6],t=Math.max(0,(step.progress-.8)*5);
  dot(l,...p,27,'none',{stroke:C.muted,'stroke-width':1});
  dot(l,...p,27,'none',{stroke:C.gold,'stroke-width':3,pathLength:100,'stroke-dasharray':(100*step.progress)+' 100',transform:'rotate(-90 '+p.join(' ')+')'});
  dot(l,p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t-22,5,C.gold);
  text(l,175,147,'第 '+(n+1)+' 步',{'text-anchor':'middle'});text(l,175,178,'等待 '+wait,{'text-anchor':'middle',fill:C.gold});
  text(l,175,321,reactions[n],{'text-anchor':'middle'});
  text(r,380,25,'稳态催化核比例 / %');
  for(let i=0;i<6;i++){const y=58+i*42,w=200*Math.max(0,Math.log10(f[i])+15)/15;text(r,365,y+6,names[i]);U.line(r,411,y,411+w,y,i===3?C.red:C.mint,{'stroke-width':12});text(r,690,y+6,f[i]>.001?U.fmt(f[i]*100,2):U.scientific(f[i]*100,1),{'text-anchor':'end','style':'font-size:14px'});}
  text(r,412,329,'横条为对数刻度',{'style':'font-size:16px'});
  return '第 '+(n+1)+' 步：'+reactions[n]+'，平均等待 '+wait+'。稳态氮-14 与碳-12 的数量比为 '+U.fmt(300*v.factor,0)+'，碳-12 与碳-13 的数量比为 3.33。';
 },{key:'phase',rate:5,start:0,loop:true});
 mountLab('v3rates',(s,v)=>{const [l,r]=panes(s),a=chart(l,55,55,265,230,.8,1.2,-2,2,[.8,1,1.2],[-2,0,2]),z=rateRatios(v.T,v.rho);text(l,45,25,'log₁₀(产能率 / 参考值)');text(l,180,330,'T / T参考',{'text-anchor':'middle'});for(const [key,color,dash] of [['pp',C.mint,false],['cn',C.red,true]]){U.curve(l,Array.from({length:81},(_,i)=>{const t=.8+i*.005;return [a.x(t),a.y(Math.log10(rateRatios(t,v.rho)[key]))];}),color,dash);dot(l,a.x(v.T),a.y(Math.log10(z[key])),6,color);}text(r,390,40,'当前响应');for(const [i,key,color] of [[0,'pp',C.mint],[1,'cn',C.red]]){const y=110+i*105;text(r,390,y-28,key==='pp'?'pp 链':'CN 循环');U.line(r,390,y,390+230*z[key]/37,y,color,{'stroke-width':18});text(r,390,y+35,U.fmt(z[key],3)+' 倍');}return 'pp='+U.fmt(z.pp,3)+' 倍；CN='+U.fmt(z.cn,3)+' 倍。密度线性进入每克产能率，而温度对 CN 的影响更强。';});
 mountLab('v3turnoff',(s,v)=>{const [l,r]=panes(s),m=turnoff(v.age),a=chart(r,405,55,265,230,-.3,1.1,-1.05,3.85,[0,.5,1],[0,2]);text(r,405,25,'log₁₀(L / L⊙)');text(r,525,330,'log₁₀(M / M⊙)',{'text-anchor':'middle'});text(l,175,30,'同龄恒星的主序寿命',{'text-anchor':'middle'});for(let i=0;i<32;i++){const log=-.3+1.4*i/31,M=10**log,alive=M<=m;dot(r,a.x(log),a.y(3.5*log),4,alive?C.mint:'none',{stroke:alive?C.mint:C.muted});const x=40+i%8*38,y=92+Math.floor(i/8)*49;dot(l,x,y,3+Math.log10(M+1)*6,alive?C.gold:'none',{stroke:alive?C.gold:C.muted,opacity:alive?1:.35});}U.line(r,a.x(Math.log10(m)),55,a.x(Math.log10(m)),285,C.gold,{'stroke-dasharray':'5 5'});text(l,175,315,'转折质量 '+U.fmt(m,2)+' M⊙',{'text-anchor':'middle'});return '年龄='+U.fmt(v.age,2)+' Gyr；转折质量='+U.fmt(m,2)+' M⊙。更高质量恒星已耗尽本模型的主序燃料。';},{key:'age',rate:.6,start:.03});
})();`;
