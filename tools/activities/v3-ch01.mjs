import {labFrame,labRuntime} from '../v3-lab-ui.mjs';
export const lessonId='v3-ch01';
export const types=['v3photometry','v3radius','v3binary'];
export function photometry(d,E){return {modulus:5*Math.log10(d)-5,extinction:3.2*E,shift:5*Math.log10(d)-5+3.2*E};}
export function luminosity(T,R){return R*R*(T/5800)**4;}
export function binary(m1,m2,a,inc,phase){
 const period=Math.sqrt(a**3/(m1+m2)),a1=a*m2/(m1+m2),a2=a*m1/(m1+m2),sin=Math.sin(inc*Math.PI/180),p=phase*Math.PI/180;
 const k1=2*Math.PI*a1/period*4.74047*sin,k2=2*Math.PI*a2/period*4.74047*sin;
 return {period,a1,a2,k1,k2,v1:k1*Math.cos(p),v2:-k2*Math.cos(p)};
}
export function render(a,ui){const r=ui.range;
 if(a.type==='v3photometry')return labFrame(a,ui,{title:'距离与尘埃：分开看两种移动',prompt:'把同一星团移远，颜色会跟着变红吗？先只改变距离，记录主序的移动方向。再增加色余，比较这次的方向与前一次有什么不同。',controls:r({key:'d',label:'共同距离 d',min:10,max:1000,step:10,value:100,unit:'pc'})+r({key:'E',label:'色余 E(B−V)',min:0,max:.6,step:.02,value:.2,unit:'mag'}),legend:'空心圆为10 pc且无尘埃时的位置。蓝色线段只计距离，红色线段再计消光；亮点为最终位置。',caption:'主序点由教学模型生成，所有星同距、同消光。坐标单位均为mag。mV=MV+5log₁₀(d/pc)−5+AV，观测色指数比本征值增加E(B−V)。按原书例值取AV/E(B−V)=3.2；实际观测须按视线确定。播放只扫描距离，不表示星团的实际运动。'},true);
 if(a.type==='v3radius')return labFrame(a,ui,{title:'恒星的大小、温度与光度',prompt:'同样的表面温度下，大星会比小星亮多少？先固定温度，比较面积读数与赫罗图位置。然后保持半径不变，再看升温带来的变化。',controls:r({key:'T',label:'有效温度',min:3000,max:30000,step:100,value:5800,unit:'K'})+r({key:'logR',label:'log₁₀(R/R⊙)',min:-2,max:2,step:.05,value:0}),legend:'左侧同时比较恒星与太阳的尺寸。右侧亮点为当前恒星，十字为太阳，虚线为等半径线。',caption:'L/L⊙=(R/R⊙)²(Teff/5800 K)⁴，太阳参考温度取5800 K。左侧两圆盘始终使用同一线性比例尺，较大的圆盘占满参考范围；极小圆盘可能难以辨认。颜色仅提示温度变化，纹理不表示表面活动。右侧温度向右降低。播放扫描半径，参数组合不一定对应真实恒星的演化过程。'},true);
 return labFrame(a,ui,{title:'双星轨道与同步视向速度',prompt:'更重的星绕得更远还是更近？先在相同倾角下比较两条轨道的大小。再把倾角降到0°，观察轨道仍在运动时，速度曲线变成什么样。',controls:r({key:'m1',label:'星 1 质量',min:.5,max:4,step:.1,value:2,unit:'M⊙'})+r({key:'m2',label:'星 2 质量',min:.5,max:4,step:.1,value:1,unit:'M⊙'})+r({key:'a',label:'两星间距 a',min:.5,max:4,step:.1,value:2,unit:'AU'})+r({key:'inc',label:'轨道倾角 i',min:0,max:90,value:60,unit:'°'})+r({key:'phase',label:'轨道相位',min:0,max:360,value:0,unit:'°'}),legend:'左为天空投影，短亮弧保留最近45°的轨迹，箭头沿投影运动方向。十字为质心。右为视向速度，实线/圆点对应星1，虚线/方点对应星2。',caption:'圆轨道解析模型：a=a₁+a₂，P²=a³/(M₁+M₂)，单位为年、AU、太阳质量。视向速度正值表示远离观测者。轨道按当前a归一化；星盘大小和颜色只作识别，箭头长度不是速度标尺。播放每秒前进45°，未模拟食或光变。'},true);
}
export const browserScript=`(()=>{${labRuntime}
 const photometry=${photometry.toString()},luminosity=${luminosity.toString()},binary=${binary.toString()};
 mountLab('v3photometry',(s,v)=>{
  s.dataset.customBox='0 0 420 400';
  const p=photometry(v.d,v.E),a=chart(s,55,45,320,290,-.5,2.5,23,-7,[-.5,0,1,2],[ -5,0,5,10,15,20]);
  const y=a.y;text(s,55,24,'V 星等（越上越亮）');text(s,215,390,'B−V / mag',{'text-anchor':'middle'});
  for(let i=0;i<26;i++){let c=-.3+i*.064,M=-3+7*(c+.3);const col=i<8?C.blue:i<18?C.gold:C.red;
   if(i%5===0){U.line(s,a.x(c),y(M),a.x(c),y(M+p.modulus),C.blue,{opacity:.5,'stroke-dasharray':'3 4'});U.line(s,a.x(c),y(M+p.modulus),a.x(c+v.E),y(M+p.shift),C.red,{opacity:.6});}
   dot(s,a.x(c),y(M),4,'none',{stroke:C.muted,'stroke-width':1.5});dot(s,a.x(c+v.E),y(M+p.shift),7,col,{opacity:.16});dot(s,a.x(c+v.E),y(M+p.shift),3.5,col);
  }
  const c=.5,M=2.6;arrow(s,a.x(c),y(M),0,y(M+p.modulus)-y(M),C.blue);arrow(s,a.x(c),y(M+p.modulus),a.x(c+v.E)-a.x(c),y(M+p.shift)-y(M+p.modulus),C.red);
  return '距离模数 = '+U.fmt(p.modulus)+' mag；Aᵥ = '+U.fmt(p.extinction)+' mag；整条序列向下 '+U.fmt(p.shift)+' mag，向右 '+U.fmt(v.E)+' mag。距离只改变亮度，差分消光也改变颜色。';
 },{key:'d',rate:75,start:10});
 mountLab('v3radius',(s,v)=>{
  const R=10**v.logR,L=luminosity(v.T,R),[left,right]=panes(s),scale=100/Math.max(1,R);
  text(left,175,25,'半径与发光面积',{'text-anchor':'middle'});
  star(left,175,152,scale*R,temperatureColor(v.T),'radius-current');
  U.node(left,'circle',{cx:175,cy:152,r:scale,fill:'none',stroke:'#fff','stroke-dasharray':'4 5','stroke-width':1.5});
  U.line(left,175,152,175+scale*R,152,'#fff',{'stroke-width':1});
  text(left,175,285,'实心：当前星 · 虚线：太阳',{'text-anchor':'middle'});
  text(left,175,320,'面积比 = '+U.scientific(R*R),{'text-anchor':'middle',fill:C.gold});
  s=right;const a=chart(s,410,45,245,245,Math.log10(3000),Math.log10(30000),-6,7,[],[-6,-3,0,3,6]);
  const x=T=>a.x(Math.log10(3000)+Math.log10(30000)-Math.log10(T));
  for(const T of [30000,10000,3000])text(s,x(T),320,T,{'text-anchor':'middle'});
  text(s,410,23,'log₁₀(L/L⊙)');text(s,530,350,'有效温度 / K',{'text-anchor':'middle'});
  for(const logR of [-2,-1,0,1,2]){const points=[];for(let i=0;i<=50;i++){const T=3000*10**(i/50);points.push([x(T),a.y(Math.log10(luminosity(T,10**logR)))]);}U.curve(s,points,C.muted,true);text(s,x(3200),a.y(Math.log10(luminosity(3200,10**logR)))-10,10**logR+' R⊙',{'text-anchor':'end','paint-order':'stroke',stroke:'#10191d','stroke-width':5});}
  U.line(s,x(5800)-5,a.y(0),x(5800)+5,a.y(0),'#fff');U.line(s,x(5800),a.y(0)-5,x(5800),a.y(0)+5,'#fff');
  U.line(s,x(v.T),45,x(v.T),290,C.gold,{'stroke-dasharray':'2 5',opacity:.4});dot(s,x(v.T),a.y(Math.log10(L)),7,C.gold,{stroke:'#fff','stroke-width':2});
  return 'R = '+U.fmt(R,3)+' R⊙；L = '+U.scientific(L)+' L⊙；表面通量 / 太阳参考 = '+U.fmt((v.T/5800)**4)+ '。等温时 L ∝ R²；等光度时 R ∝ T⁻²。';
 },{key:'logR',rate:.3,start:-2});
 mountLab('v3binary',(s,v)=>{
  const b=binary(v.m1,v.m2,v.a,v.inc,v.phase),p=v.phase*Math.PI/180,cosi=Math.cos(v.inc*Math.PI/180),scale=155/v.a;
  const left=U.node(s,'g',{'data-pane':'left'}),right=U.node(s,'g',{'data-pane':'right'});s=left;
  text(s,155,25,'天空投影',{'text-anchor':'middle'});
  for(const [r,col] of [[b.a1,C.mint],[b.a2,C.red]])U.node(s,'ellipse',{cx:165,cy:175,rx:r*scale,ry:Math.max(.1,r*scale*cosi),fill:'none',stroke:col,'stroke-dasharray':'5 5'});
  U.line(s,157,175,173,175,'#fff');U.line(s,165,167,165,183,'#fff');
  const x1=165+b.a1*scale*Math.cos(p),y1=175+b.a1*scale*Math.sin(p)*cosi,x2=165-b.a2*scale*Math.cos(p),y2=175-b.a2*scale*Math.sin(p)*cosi;
  for(const [r,sign,col] of [[b.a1,1,C.mint],[b.a2,-1,C.red]]){
   U.curve(s,Array.from({length:25},(_,j)=>{const q=p-(24-j)*Math.PI/96;return [165+sign*r*scale*Math.cos(q),175+sign*r*scale*Math.sin(q)*cosi];}),col).setAttribute('stroke-width','4');
  }
  U.line(s,x1,y1,x2,y2,C.muted,{'stroke-width':1});
  arrow(s,x1,y1,-22*Math.sin(p),22*Math.cos(p)*cosi,C.mint);arrow(s,x2,y2,22*Math.sin(p),-22*Math.cos(p)*cosi,C.red);
  star(s,x1,y1,11,C.mint,'binary-one');star(s,x2,y2,9,C.red,'binary-two');text(s,x1+13,y1-12,'1');text(s,x2+13,y2+24,'2');text(s,165,315,'a₁/a₂ = '+U.fmt(b.a1/b.a2),{'text-anchor':'middle'});
  s=right;text(s,500,25,'视向速度 / km s⁻¹',{'text-anchor':'middle'});
  const a=chart(s,400,60,245,220,0,360,-90,90,[0,180,360],[-90,0,90]);
  U.line(s,a.x(v.phase),60,a.x(v.phase),280,'#fff',{'stroke-dasharray':'3 4',opacity:.6});
  const pts=(key)=>Array.from({length:91},(_,i)=>[a.x(i*4),a.y(binary(v.m1,v.m2,v.a,v.inc,i*4)[key])]);U.curve(s,pts('v1'),C.mint);U.curve(s,pts('v2'),C.red,true);dot(s,a.x(v.phase),a.y(b.v1),5,C.mint);U.node(s,'rect',{x:a.x(v.phase)-5,y:a.y(b.v2)-5,width:10,height:10,fill:C.red});text(s,510,345,'相位 / °',{'text-anchor':'middle'});
  return 'P = '+U.fmt(b.period,3)+' 年；a₁ = '+U.fmt(b.a1,3)+' AU，a₂ = '+U.fmt(b.a2,3)+' AU；K₁ = '+U.fmt(b.k1)+' km/s，K₂ = '+U.fmt(b.k2)+' km/s。当前 v₁ = '+U.fmt(b.v1)+'，v₂ = '+U.fmt(b.v2)+' km/s。';
 },{key:'phase',rate:45,start:0,loop:true});
})();`;
