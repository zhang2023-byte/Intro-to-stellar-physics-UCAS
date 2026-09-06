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
 return {hydrogen,planck,planckNu,magnitude,apparent,luminosity,color,sigma};
})();
if(typeof module!=='undefined')module.exports=StellarPhysics;
