// Independent visual scenes; physical scaling remains in the chapter module.
export const scenes=String.raw`
 function ruler(s,x,y,label,value,color,max=2){
  text(s,x,y,label,{'style':'font-size:15px'});text(s,x+270,y,U.fmt(value,3)+' ×',{'text-anchor':'end','style':'font-size:16px',fill:color});
  U.line(s,x,y+13,x+270,y+13,'#34474c',{'stroke-width':7});U.line(s,x,y+13,x+270*Math.min(value/max,1),y+13,color,{'stroke-width':7});
  U.line(s,x+270/max,y+5,x+270/max,y+21,'#fff',{'stroke-width':1});
 }
 function photo(s,x,y,r,id){
  const defs=U.node(s,'defs',{}),clip=U.node(defs,'clipPath',{id});dot(clip,x,y,r,'white');
  const g=U.node(s,'g',{'clip-path':'url(#'+id+')'});
  U.node(g,'image',{href:surfaceTexture,x:x-r*1.25,y:y-r*1.25,width:r*2.5,height:r*2.5,preserveAspectRatio:'xMidYMid slice'});
  dot(s,x,y,r,'none',{stroke:C.gold,'stroke-width':1});
 }
 mountLab('v3homology',(s,v)=>{
  const [l,r]=panes(s),alpha=v.opacity==='kramers'?1:.5,beta=v.opacity==='kramers'?3.5:2.5,z=homologous(v.M,1,1,Number(v.nu),alpha,beta);
  text(l,175,25,'参考星 · M = 1',{'text-anchor':'middle'});text(r,525,25,'比较星 · M = '+U.fmt(v.M,2),{'text-anchor':'middle'});
  photo(l,175,125,53,'reference-photosphere');photo(r,525,125,53*z.R,'scaled-photosphere');
  for(const [g,cx,rad] of [[l,175,53],[r,525,53*z.R]]){U.line(g,cx-rad,219,cx+rad,219,C.muted);for(const x of [cx-rad,cx+rad])U.line(g,x,213,x,225,C.muted);}
  text(l,175,245,'R = 1 · L = 1',{'text-anchor':'middle'});text(r,525,245,'R = '+U.fmt(z.R,2)+' · L = '+U.fmt(z.L,2),{'text-anchor':'middle'});
  ruler(l,35,280,'内部温度比',z.Tc,C.red,2);ruler(l,35,328,'有效温度比',z.T,C.blue,3);
  ruler(r,385,280,'半径比',z.R,C.mint,2);ruler(r,385,328,'光度比',z.L,C.gold,50);
  return '同一长度标尺下比较：半径 '+U.fmt(z.R,3)+' 倍；光度 '+U.fmt(z.L,3)+' 倍。质量指数分别为 '+U.fmt(z.a,3)+' 与 '+U.fmt(z.l,3)+'；表面纹理只作示意，不以亮度表示光度。';
 },{key:'M',rate:.08,start:.7});
 mountLab('v3composition',(s,v)=>{
  s.dataset.customBox='0 0 440 450';const z=homologous(1,v.mu,v.Z,4),sameT=v.compare==='temperature',a=chart(s,65,65,325,285,.6,-.25,-1.1,2.9,[.6,.4,.2,0,-.2],[-1,0,1,2]);
  text(s,65,28,'光度 log₁₀(L/L参考)',{'style':'font-size:17px'});text(s,228,400,'← 更热    log₁₀(T有效/T参考)',{'text-anchor':'middle','style':'font-size:16px'});
  const defs=U.node(s,'defs',{}),clip=U.node(defs,'clipPath',{id:'composition-field'});U.node(clip,'rect',{x:65,y:65,width:325,height:285});const field=U.node(s,'g',{'clip-path':'url(#composition-field)'});
  for(const [mu,k,c,dash] of [[1,1,C.muted,true],[v.mu,v.Z,C.mint,false]]){
   const points=[];for(let i=0;i<=100;i++){const m=.6+i*.019,b=homologous(m,mu,k,4);points.push([a.x(Math.log10(b.T)),a.y(Math.log10(b.L))]);if(i%8===0)dot(field,a.x(Math.log10(b.T)),a.y(Math.log10(b.L)),2.5,c);}
   U.curve(field,points,c,dash);
  }
  const tx=Math.log10(z.T),ly=Math.log10(z.L),refL=sameT?z.T**(116/27):1,refT=sameT?z.T:1;
  const x=a.x(tx),y=a.y(ly),rx=a.x(Math.log10(refT)),ry=a.y(Math.log10(refL));
  U.line(field,rx,ry,x,y,C.red,{'stroke-width':3,'stroke-dasharray':'5 4'});dot(field,x,y,8,C.gold,{stroke:'#fff','stroke-width':1.5});
  U.node(field,'rect',{x:rx-5,y:ry-5,width:10,height:10,fill:'none',stroke:'#fff','stroke-width':2});
  text(s,228,430,sameT?'同温度：比较同一竖线上的亮度':'同质量：比较两颗质量相同的星',{'text-anchor':'middle','style':'font-size:16px'});
  return (sameT?'相同有效温度':'相同质量')+'：金点 / 白框的光度 = '+U.fmt(z.L/refL,3)+'。参考星质量比 = '+U.fmt(sameT?z.T**(8/9):1,3)+'；当前星质量比 = 1。灰色虚线是参考组成，青色实线是当前组成。';
 });
 mountLab('v3contraction',(s,v)=>{
  const [l,r]=panes(s),z=contraction(v.R),radius=115*v.R;
  text(l,175,25,'跟随同一组质量壳层',{'text-anchor':'middle'});
  dot(l,175,166,115,'none',{stroke:C.muted,'stroke-dasharray':'5 5'});
  for(let j=12;j>=1;j--){dot(l,175,166,radius*j/12,j%2?'#453131':'#593a30',{stroke:'#c78d61','stroke-width':.7});}
  dot(l,175,166,radius*.22,C.gold);
  for(let j=0;j<56;j++){const theta=j*2.39996,rr=radius*Math.sqrt((j+.5)/56)*.94;dot(l,175+rr*Math.cos(theta),166+rr*Math.sin(theta),2,C.blue);}
  for(let j=0;j<8;j++){const theta=j*Math.PI/4,rr=radius+9;arrow(l,175+rr*Math.cos(theta),166+rr*Math.sin(theta),13*Math.cos(theta),13*Math.sin(theta),C.gold);}
  text(l,175,313,'R '+U.fmt(v.R,2)+' ×  ·  ρ '+U.fmt(z.rho,2)+' ×',{'text-anchor':'middle'});text(l,175,340,'T中心 '+U.fmt(z.Tc,2)+' ×',{'text-anchor':'middle'});
  text(r,525,25,'释放的引力能分成两份',{'text-anchor':'middle'});
  const bars=[[414,2*z.heat,2,C.muted,'引力释放'],[520,z.heat,2,C.red,'热能增加'],[626,z.heat,2,C.gold,'向外辐射']];
  for(const [x,value,max,color,label] of bars){U.node(r,'rect',{x:x-25,y:80,width:50,height:170,fill:'none',stroke:'#4c6268'});U.node(r,'rect',{x:x-25,y:250-170*value/max,width:50,height:170*value/max,fill:color});text(r,x,275,label,{'text-anchor':'middle','style':'font-size:15px'});text(r,x,301,U.fmt(value,2)+' A',{'text-anchor':'middle',fill:color});}
  text(r,525,340,'ΔU + Q辐射 = −ΔΩ',{'text-anchor':'middle'});
  return '引力能释放 '+U.fmt(2*z.heat,3)+' A = 热能增加 '+U.fmt(z.heat,3)+' A + 辐射 '+U.fmt(z.heat,3)+' A。L='+U.fmt(z.L,3)+' 倍，T有效='+U.fmt(z.T,3)+' 倍；物理时间 t/(A/L初始)='+U.fmt(z.elapsed,3)+'。';
 },{key:'R',rate:-.04,start:1});
`;
