import {labFrame,labRuntime} from '../v3-lab-ui.mjs';
export const lessonId='v3-ch02';
export const types=['v3force','v3pressure','v3virial','v3walk'];
export function imbalance(support,t){const acceleration=270*(support-1);return {acceleration,velocity:acceleration*t/1000,displacement:.5*acceleration*t*t/1000};}
export function uniformStar(M,R,x){
 const G=6.67e-11,m=M*2e30,r=R*7e8,rho=3*m/(4*Math.PI*r**3),pc=3*G*m*m/(8*Math.PI*r**4);
 return {rho,pc,pressure:pc*(1-x*x),mass:M*x**3,gravity:G*m/r**2*x,temperature:pc*(1-x*x)*.6*1.67e-27/(rho*1.38e-23)};
}
export function virial(M,R){const omega=-.6*6.67e-11*(M*2e30)**2/(R*7e8),initial=-.6*6.67e-11*(M*2e30)**2/(2*7e8);return {omega,U:-omega/2,total:omega/2,radiated:(initial-omega)/2,heat:(initial-omega)/2,time:-omega/2/4e26/3.156e7};}
// A reproducible ensemble of independent planar walks; every step has length one.
export function walks(N,count=96){let seed=314159;const random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};const paths=[];let square=0;for(let k=0;k<count;k++){let x=0,y=0;const path=[[0,0]];for(let n=0;n<N;n++){const angle=2*Math.PI*random();x+=Math.cos(angle);y+=Math.sin(angle);path.push([x,y]);}square+=x*x+y*y;paths.push(path);}return {paths,rms:Math.sqrt(square/count),expected:Math.sqrt(N)};}
export function render(a,ui){const r=ui.range;
 if(a.type==='v3force')return labFrame(a,ui,{title:'气柱失衡：位移怎样累积',prompt:'支持力只差10%，气柱的移动会很小吗？先比较两个力的箭头，再从静止开始播放。把支持比改为1后，重新观察气柱的位置和曲线。',controls:r({key:'support',label:'压强梯度支持 / 重力',min:.8,max:1.2,step:.01,value:.9})+r({key:'t',label:'从静止开始的时间',min:0,max:1000,step:1,value:0,unit:'s'}),legend:'青色箭头为净压强支持，红色箭头为重力。虚框是初始位置，短横线每隔200秒记录一次位置。右侧亮线为已走过的轨迹。',caption:'向上为外向。采用短时匀加速度模型：g=270 m/s²，a=(支持比−1)g，Δr=at²/2。净压强支持是上下两面的压强力之差。箭头按力比缩放；气柱内的点只标记这团气体，不模拟热运动。忽略运动后的压强重调，最长1000秒，最大位移约0.04R⊙。'},true);
 if(a.type==='v3pressure')return labFrame(a,ui,{title:'从恒星表面走向中心',prompt:'中心引力为零，压强也会为零吗？先把探针从表面移向中心，同时比较三条曲线。然后固定探针位置，改变总半径，观察实际压强读数。',controls:r({key:'M',label:'总质量',min:.5,max:3,step:.1,value:1,unit:'M⊙'})+r({key:'R',label:'半径',min:.5,max:2,step:.05,value:1,unit:'R⊙'})+r({key:'x',label:'探针 r/R',min:0,max:1,step:.01,value:.5}),legend:'左侧剖面的亮度表示P/Pc，虚圆经过探针。右侧实线为P/Pc，虚线为g/gR，点线为Mr/M；三种标记对应同一半径。',caption:'球对称、均匀密度、P(R)=0的解析模型。剖面始终按R归一化，亮度不是密度。Pc=3GM²/(8πR⁴)，ρ=3M/(4πR³)，温度由理想气体关系计算，取μ=0.6。G=6.67×10⁻¹¹ SI、M⊙=2×10³⁰ kg、R⊙=7×10⁸ m、k=1.38×10⁻²³ J/K、mH=1.67×10⁻²⁷ kg。播放扫描探针，并非物质向内运动。'},true);
 if(a.type==='v3virial')return labFrame(a,ui,{title:'收缩释放的能量怎样分配',prompt:'恒星向外辐射时，内部一定会降温吗？先比较初态与收缩后的能量读数。再观察热能和总能量是否向同一个方向变化。',controls:r({key:'M',label:'固定质量',min:.5,max:2,step:.1,value:1,unit:'M⊙'})+r({key:'R',label:'当前半径',min:.5,max:2,step:.01,value:2,unit:'R⊙'}),legend:'虚圆保留初态半径，内部分层随半径等比收缩。右侧空框保留初态能量，实条显示当前能量，单位为GM²/R⊙。',caption:'均匀密度球的准静态模型：Ω=−3GM²/(5R)，U=−Ω/2，E=Ω/2。假设理想单原子气体、无核能、无旋转，并忽略表面压强。初态R=2R⊙，Qrad=ΔU=−ΔΩ/2。外向短线示意辐射方向，不表示光子个数或光度；圆盘颜色仅提示升温。播放速度不是实际收缩速率。'},true);
 return labFrame(a,ui,{title:'随机游走：轨迹、端点与扩散',prompt:'步数增加4倍，离起点的距离也会增加4倍吗？先跟随一条亮色路径，比较总路程与净位移。再看96条路径的统计曲线，判断单条路径能否代表整体。',controls:r({key:'N',label:'每条轨迹步数 N',min:1,max:400,step:1,value:100}),legend:'左侧亮线为一条完整路径，箭头直接连接起点与终点，圆点为96个端点。金色虚圆和右侧虚线表示理论均方根，右侧实线为样本均方根。',caption:'无限二维介质、各向同性的独立方向、固定步长λ。左侧横纵轴均以λ计，金色圆不是逃逸边界。理论〈r²〉=Nλ²，样本统计允许偏离理论值。这里演示位移累积，不模拟太阳内部的真实输运时间。'},true);
}
export const browserScript=`(()=>{${labRuntime}
 const imbalance=${imbalance.toString()},uniformStar=${uniformStar.toString()},virial=${virial.toString()},walks=${walks.toString()};
 mountLab('v3force',(s,v)=>{
  const b=imbalance(v.support,v.t),cy=175-b.displacement/30000*60;
  const left=U.node(s,'g',{'data-pane':'left'}),right=U.node(s,'g',{'data-pane':'right'});s=left;
  text(s,150,25,'向外 ↑',{'text-anchor':'middle'});
  U.node(s,'rect',{x:105,y:151,width:90,height:48,fill:'none',stroke:C.muted,'stroke-dasharray':'4 5'});
  U.line(s,80,100,80,250,C.muted,{opacity:.5});
  for(let t=0;t<=v.t;t+=200){const y=175-imbalance(v.support,t).displacement/30000*60;U.line(s,73,y,87,y,C.gold,{'stroke-width':2});}
  U.node(s,'rect',{x:105,y:cy-24,width:90,height:48,fill:'#29464b',stroke:C.mint});
  for(let i=0;i<24;i++)dot(s,114+(i%8)*10,cy-14+Math.floor(i/8)*14,2,C.blue,{opacity:.65});
  arrow(s,125,cy-27,0,-52*v.support,C.mint);arrow(s,175,cy+27,0,52,C.red);text(s,40,320,'a = '+U.fmt(b.acceleration,1)+' m/s²');
  s=right;const a=chart(s,400,50,245,235,0,1000,-30,30,[0,500,1000],[-30,0,30]);text(s,400,25,'Δr / 千 km');text(s,515,340,'时间 / s',{'text-anchor':'middle'});
  U.curve(s,Array.from({length:101},(_,i)=>[a.x(i*10),a.y(imbalance(v.support,i*10).displacement/1000)]),C.muted,true);
  U.curve(s,Array.from({length:51},(_,i)=>[a.x(v.t*i/50),a.y(imbalance(v.support,v.t*i/50).displacement/1000)]),C.mint).setAttribute('stroke-width','4');dot(s,a.x(v.t),a.y(b.displacement/1000),7,C.gold);
  return 't = '+v.t+' s；外向速度 = '+U.fmt(b.velocity)+' km/s；外向位移 = '+U.fmt(b.displacement,0)+' km（负值为下落）。'+(v.support===1?'受力平衡，从静止保持静止。':'仅描述初始失衡的短时响应。');
 },{key:'t',rate:125,start:0});
 mountLab('v3pressure',(s,v)=>{
  const z=uniformStar(v.M,v.R,v.x),[left,right]=panes(s);
  text(left,175,25,'恒星剖面 · P/Pc',{'text-anchor':'middle'});
  for(let j=36;j>=1;j--){const f=j/36;dot(left,175,165,112*f,'hsl('+(12+30*(1-f*f))+' 80% '+(18+57*(1-f*f))+'%)');}
  U.node(left,'circle',{cx:175,cy:165,r:112*v.x,fill:'none',stroke:'#fff','stroke-dasharray':'4 4'});
  U.line(left,175,165,287,165,'#fff',{opacity:.6});dot(left,175+112*v.x,165,5,'#fff');
  text(left,175,305,'r/R = '+U.fmt(v.x),{'text-anchor':'middle'});
  text(left,175,335,'P/Pc = '+U.fmt(1-v.x*v.x),{'text-anchor':'middle',fill:C.gold});
  s=right;const a=chart(s,405,45,245,245,0,1,0,1,[0,.5,1],[0,.5,1]);text(s,405,23,'归一化量');text(s,525,345,'r/R',{'text-anchor':'middle'});
  for(const [fn,col,dash] of [[x=>1-x*x,C.mint,false],[x=>x,C.red,true],[x=>x**3,C.gold,true]]){const path=U.curve(s,Array.from({length:101},(_,i)=>[a.x(i/100),a.y(fn(i/100))]),col,dash);if(col===C.gold)path.setAttribute('stroke-dasharray','2 5');}
  U.line(s,a.x(v.x),45,a.x(v.x),290,'#fff',{'stroke-dasharray':'3 4'});dot(s,a.x(v.x),a.y(1-v.x*v.x),6,C.mint);
  U.node(s,'rect',{x:a.x(v.x)-4,y:a.y(v.x)-4,width:8,height:8,fill:C.red});
  U.node(s,'path',{d:'M'+a.x(v.x)+' '+(a.y(v.x**3)-6)+' l6 6 -6 6 -6 -6 Z',fill:C.gold});
  return 'ρ = '+U.fmt(z.rho,0)+' kg/m³；Pc = '+U.scientific(z.pc)+' Pa；探针 P = '+U.scientific(z.pressure)+' Pa，g = '+U.fmt(z.gravity,1)+' m/s²，Mr = '+U.fmt(z.mass,3)+' M⊙，T = '+U.scientific(z.temperature)+' K。';
 },{key:'x',rate:-.16,start:1});
 mountLab('v3virial',(s,v)=>{
  const b=virial(v.M,v.R),unit=6.67e-11*(v.M*2e30)**2/7e8;
  const left=U.node(s,'g',{'data-pane':'left'}),right=U.node(s,'g',{'data-pane':'right'});s=left;
  text(s,160,25,'半径与内部热能',{'text-anchor':'middle'});
  U.node(s,'circle',{cx:160,cy:155,r:96,fill:'none',stroke:C.muted,'stroke-dasharray':'4 5'});
  star(s,160,155,48*v.R,temperatureColor(5000*2/v.R),'virial-star');
  for(const f of [.3,.55,.8])U.node(s,'circle',{cx:160,cy:155,r:48*v.R*f,fill:'none',stroke:'#fff',opacity:.25});
  if(v.R<2)for(let i=0;i<12;i++){const p=i*Math.PI/6,r=48*v.R+10+((2-v.R)*90%26);U.line(s,160+r*Math.cos(p),155+r*Math.sin(p),160+(r+10)*Math.cos(p),155+(r+10)*Math.sin(p),C.gold,{'stroke-width':2,opacity:.8});}
  text(s,160,285,'R = '+U.fmt(v.R)+' R⊙',{'text-anchor':'middle'});
  const fraction=(2/v.R-1)/3;
  U.node(s,'rect',{x:40,y:305,width:120*fraction,height:9,fill:C.red});U.node(s,'rect',{x:160,y:305,width:120*fraction,height:9,fill:C.gold});
  text(s,90,343,'ΔU / 释放 = '+(v.R===2?'—':'½'),{'text-anchor':'middle','style':'font-size:15px'});text(s,240,343,'辐射 / 释放 = '+(v.R===2?'—':'½'),{'text-anchor':'middle','style':'font-size:15px'});
  s=right;const zero=560,scale=155;U.line(s,zero,40,zero,285,C.muted);text(s,zero,25,'0',{'text-anchor':'middle'});
  for(const [name,val,y,col,initial] of [['Ω',b.omega/unit,70,C.red,-.3],['U',b.U/unit,145,C.gold,.15],['E',b.total/unit,220,C.mint,-.15]]){const x=zero+val*scale;U.node(s,'rect',{x:Math.min(zero,x),y,width:Math.abs(val*scale),height:30,fill:col});U.node(s,'rect',{x:Math.min(zero,zero+initial*scale),y:y-4,width:Math.abs(initial*scale),height:38,fill:'none',stroke:'#fff','stroke-dasharray':'3 3',opacity:.65});text(s,355,y+22,name);text(s,400,y+55,U.fmt(val,3));}
  return 'Ω = '+U.scientific(b.omega)+' J；U = '+U.scientific(b.U)+' J；E = '+U.scientific(b.total)+' J。自2R⊙收缩以来：辐射 '+U.scientific(b.radiated)+' J，热能增加 '+U.scientific(b.heat)+' J。温度尺度 / 初态 = '+U.fmt(2/v.R)+'。';
 },{key:'R',rate:-.12,start:2});
 // Precompute full paths so animation prefixes are consistent across step counts.
 const ensemble=walks(400);
 const rms=Array.from({length:401},(_,n)=>Math.sqrt(ensemble.paths.reduce((sum,p)=>sum+p[n][0]**2+p[n][1]**2,0)/ensemble.paths.length));
 mountLab('v3walk',(s,v)=>{
  const [left,right]=panes(s);s=left;
  const a=chart(s,65,45,245,245,-60,60,-60,60,[-60,0,60],[-60,0,60]);text(s,65,23,'y/λ');text(s,190,345,'x/λ',{'text-anchor':'middle'});
  U.node(s,'circle',{cx:a.x(0),cy:a.y(0),r:Math.sqrt(v.N)*245/120,fill:C.gold,'fill-opacity':.05,stroke:C.gold,'stroke-width':2,'stroke-dasharray':'5 5'});
  ensemble.paths.forEach((path,k)=>{const [x,y]=path[v.N];if(k<6)U.curve(s,path.slice(0,v.N+1).map(([x,y])=>[a.x(x),a.y(y)]),k===0?'#fff':C.blue).setAttribute('opacity',k===0?'.9':'.15');dot(s,a.x(x),a.y(y),2.3,k===0?'#fff':C.mint,{opacity:k===0?1:.65});});
  const end=ensemble.paths[0][v.N];arrow(s,a.x(0),a.y(0),a.x(end[0])-a.x(0),a.y(end[1])-a.y(0),C.red);
  s=right;const b=chart(s,410,45,240,245,0,400,0,25,[0,200,400],[0,10,20]);text(s,410,23,'均方根位移 / λ');text(s,530,345,'步数 N',{'text-anchor':'middle'});
  U.curve(s,Array.from({length:401},(_,n)=>[b.x(n),b.y(Math.sqrt(n))]),C.gold,true);
  U.curve(s,rms.slice(0,v.N+1).map((r,n)=>[b.x(n),b.y(r)]),C.mint);dot(s,b.x(v.N),b.y(rms[v.N]),5,C.mint);
  return '每条路径总路程 = '+v.N+' λ；亮色路径净位移 = '+U.fmt(Math.hypot(...end))+' λ。理论均方根 = '+U.fmt(Math.sqrt(v.N))+' λ；96条路径的样本均方根 = '+U.fmt(rms[v.N])+' λ。单条路径可以折返，因此它的净位移不必一直增大。';
 },{key:'N',rate:35,start:1});
})();`;
