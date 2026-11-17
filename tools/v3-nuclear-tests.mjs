import test from 'node:test';
import assert from 'node:assert/strict';
import {gamow,rateRatios,turnoff,catalyst} from './activities/v3-ch08.mjs';
import {shellProfile,gradient,central} from './activities/v3-ch09.mjs';
import {homologous,contraction} from './activities/v3-ch10.mjs';
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('隧穿核峰值、密度归一化与催化通量守恒',()=>{
 for(const T of [8,14,25]){const g=gamow(T,6);near(gamow(T,g.peak).kernel,1);assert.ok(gamow(T,g.peak*.9).kernel<1);assert.ok(gamow(T,g.peak*1.1).kernel<1);near(-1/g.kT+22.2/(2*g.peak**1.5),0);}
 near(rateRatios(1,3).pp,3);near(rateRatios(1,3).cn,3);near(rateRatios(1.1,1).cn,4.594972986357);
 for(const factor of [.1,1,2]){const f=catalyst(factor);near(f.reduce((a,b)=>a+b),1);near(f[3]/f[0],300*factor);near(f[0]/f[2],10/3);}
 near(turnoff(.3125),4);near(turnoff(10),1);
});
test('球壳积分的边界与导数、绝热稳定性和中心正则性',()=>{
 for(const k of [0,5,20]){near(shellProfile(k,0).f,0);near(shellProfile(k,1).f,1);assert.ok(shellProfile(k,.5).f>=.125);}
 for(const x of [.1,.4,.9])near(shellProfile(0,x).f,x**3,1e-8);
 const h=1e-4,k=7,x=.4,df=(shellProfile(k,x+h).f-shellProfile(k,x-h).f)/(2*h),dy=(shellProfile(k,.7+h).f-shellProfile(k,.7-h).f)/(2*h);near(df/dy,x*x*Math.exp(-k*x*x)/(.49*Math.exp(-k*.49)),1e-5);
 near(gradient(.4,.5).actual,.5**.4);assert.ok(gradient(.7,.5).actual>gradient(.7,.5).rad);near(central(.01,0).regular,.01);near(central(.01,1e-5).perturbed,.11);
});
test('同源缩放同时满足C D不变与Stefan关系',()=>{
 for(const [alpha,beta] of [[1,3.5],[.5,2.5]])for(const nu of [4,16])for(const M of [.7,1,2])for(const mu of [1,1.2])for(const kappa of [.5,1.5]){
  const z=homologous(M,mu,kappa,nu,alpha,beta);
  near(kappa*mu**(-beta-4)*z.L*z.R**(beta-3*alpha)*M**(-beta-3+alpha),1);
  near(mu**nu*M**(nu+2)/(z.L*z.R**(nu+3)),1);
  near(z.R**2*z.T**4,z.L);
 }
 near(homologous(2,1,1,16).a,13/18);near(homologous(1,1,.5,4).L,.5**(-7/6));
});
test('收缩能量守恒及物理时间与光度一致',()=>{
 for(const R of [.5,.7,1]){const z=contraction(R);near(z.heat+z.heat,2/R-2);near(Math.exp(-z.elapsed),R);near(z.T**4*R**2,z.L);const h=1e-6,energy=t=>-Math.exp(t);near(-(energy(z.elapsed+h)-energy(z.elapsed-h))/(2*h),z.L,1e-8);}
});
