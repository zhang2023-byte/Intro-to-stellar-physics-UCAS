/* Pure teaching models. Units and approximations are exposed beside each activity. */
const StellarPhysics=(()=>{
 const h=6.62607015e-34,c=299792458,k=1.380649e-23,sigma=5.670374419e-8;
 const planck=(nm,T)=>{const l=nm*1e-9;return 2*h*c*c/(l**5*Math.expm1(h*c/(l*k*T)));};
 const planckNu=(hz,T)=>2*h*hz**3/(c*c*Math.expm1(h*hz/(k*T)));
 const magnitude=(ratio)=>-2.5*Math.log10(ratio);
 const apparent=(M,d,A=0)=>M+5*Math.log10(d/10)+A;
 const luminosity=(R,T)=>R*R*(T/5800)**4;
 const color=(T)=>magnitude((planck(440,T)/planck(550,T))/(planck(440,10000)/planck(550,10000)));
 const hydrogen=(T,ne)=>{const excited=4*Math.exp(-10.2*1.602176634e-19/(k*T));/* Z_I=2(1+excited), Z_II=1; the leading Saha factor 2 cancels the ground-state weight 2. */const ratio=(2*Math.PI*9.1093837e-31*k*T/(h*h))**1.5/ne*Math.exp(-13.6*1.602176634e-19/(k*T))/(1+excited);return {neutral:1/(1+ratio),excited:excited/(1+excited),lower:excited/(1+excited)/(1+ratio)};};
 const slab=(I0,S,tau)=>({transmitted:I0*Math.exp(-tau),emitted:S*(-Math.expm1(-tau)),total:I0*Math.exp(-tau)+S*(-Math.expm1(-tau))});
 const lineTau=(x,tc,tl)=>tc+tl*Math.exp(-x*x/2);
 // z increases inward, total continuum depth 8; S(z)=1+g(z/8-1/2).
 // Constant source within each cell, exact formal propagation from back to front.
 const stratified=(factor,g,N=240)=>{let I=1+g/2;const dt=8*factor/N;for(let i=N-1;i>=0;i--){const z=(i+.5)/N;I=slab(I,1+g*(z-.5),dt).total;}return I;};
 const limb=(mu,a,b,q=0)=>a+b*mu+2*q*mu*mu;
 const grey=(tau,Teff)=>Teff*(.75*(tau+2/3))**.25;
 const hydrogenEdge=n=>h*c/(13.6*1.602176634e-19/(n*n))*1e9;
 // Fixed grey background; Eddington-Barbier estimate only, no equilibrium iteration.
 const formation=(r,T,wave)=>{const tau=2/(3*r),temp=grey(tau,T);return {tau,temp,ratio:planck(wave,temp)/planck(wave,T)};};
 const rosselandTwo=(a,b,w)=>1/(w/a+(1-w)/b);
 const scaleHeight=(T,g,mu)=>k*T/(mu*1.6735575e-27*g);
 // kappa = kappa0 * (P/P0)^n; surface P=0, tau=0.
 const pressure=(tau,g,n,kappa0=.01,P0=10000)=>P0*((n+1)*g*tau/(kappa0*P0))**(1/(n+1));
 return {formation,rosselandTwo,scaleHeight,pressure,limb,grey,hydrogenEdge,slab,lineTau,stratified,hydrogen,planck,planckNu,magnitude,apparent,luminosity,color,sigma};
})();
if(typeof module!=='undefined')module.exports=StellarPhysics;
