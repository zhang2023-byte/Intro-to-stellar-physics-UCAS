import test from 'node:test';
import assert from 'node:assert/strict';
import {photometry,luminosity,binary} from './activities/v3-ch01.mjs';
import {imbalance,uniformStar,virial,walks} from './activities/v3-ch02.mjs';
const near=(x,y,tol=1e-10)=>assert.ok(Math.abs(x-y)<=tol*Math.max(1,Math.abs(y)),`${x} != ${y}`);
test('测光极限、光度面积和温度四次方',()=>{
 near(photometry(10,0).shift,0);near(photometry(100,.2).shift,5.64);
 near(luminosity(5800,1),1);near(luminosity(2900,100),625);near(luminosity(11600,.25),1);
});
test('双星满足质心、开普勒关系与投影极限',()=>{
 for(const m1 of [.5,2,4])for(const m2 of [.5,1,4])for(const a of [.5,2,4]){
  const b=binary(m1,m2,a,90,70);near(m1*b.a1,m2*b.a2);near(b.a1+b.a2,a);near(a**3/b.period**2,m1+m2);near(m1*b.v1+m2*b.v2,0);
  near(binary(m1,m2,a,0,70).k1,0);near(binary(m1,m2,a,30,0).k1,b.k1/2);
 }
});
test('失衡算例与平衡极限',()=>{near(imbalance(.9,1000).displacement,-13500);near(imbalance(.9,1000).velocity,-27);near(imbalance(1,1000).displacement,0);near(imbalance(.9,500).displacement,-3375);});
test('均匀球边界、梯度与位力积分',()=>{
 for(const M of [.5,1,3])for(const R of [.5,1,2]){
  near(uniformStar(M,R,1).pressure,0);near(uniformStar(M,R,0).gravity,0);
  const x=.37,h=1e-5,z=uniformStar(M,R,x),derivative=(uniformStar(M,R,x+h).pressure-uniformStar(M,R,x-h).pressure)/(2*h*R*7e8);near(derivative,-z.rho*z.gravity,1e-8);
  let U=0;const dr=R*7e8/10000;for(let i=0;i<10000;i++){const r=(i+.5)*dr;U+=1.5*uniformStar(M,R,r/(R*7e8)).pressure*4*Math.PI*r*r*dr;}
  near(U,virial(M,R).U,1e-7);
 }
 near(uniformStar(1,.5,0).pc/uniformStar(1,1,0).pc,16);
});
test('准静态收缩能量守恒与初态零辐射',()=>{
 near(virial(1,2).radiated,0);
 for(const R of [.5,1,1.5,2]){const b=virial(1,R);near(2*b.U+b.omega,0);near(b.total+b.radiated,virial(1,2).total);near(b.heat,b.radiated);}
});
test('独立随机游走每步长度和统计平方位移',()=>{
 const w=walks(400,4096);near(w.rms**2,400,.05);
 for(const p of w.paths.slice(0,4))for(let i=1;i<p.length;i++)near(Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]),1);
 assert.deepEqual(walks(3,2),walks(3,2));
});
