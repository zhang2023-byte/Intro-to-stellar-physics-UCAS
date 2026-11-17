import test from 'node:test';
import assert from 'node:assert/strict';
import {parcelState,opacityState} from './activities/v3-ch05.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
test('v3-ch05：上升与下降的浮力方向、零位移及中性边界',()=>{
 for(const q of [.8,1.2]){
  const unstable=parcelState(.5,.4,q),stable=parcelState(.3,.4,q);
  assert.equal(unstable.stability,'unstable');assert.equal(stable.stability,'stable');
  assert.ok(unstable.acceleration*(1-q)>0);assert.ok(stable.acceleration*(1-q)<0);
  close(parcelState(.4,.4,q).density,1);
 }
 close(parcelState(.5,.4,1).acceleration,0);
 close(parcelState(.5,.4,.8).density,.8**.1);
});
test('v3-ch05：灰模型的严格失稳阈值与深层极限',()=>{
 close(opacityState(1,.4,2).gradient,.375);
 close(opacityState(1,.4,2).boundary,8/3);
 assert.equal(opacityState(1,.4,8/3).stability,'neutral');
 assert.equal(opacityState(1,.4,3).stability,'unstable');
 for(const tau of [.1,1,20,1e6])assert.equal(opacityState(.6,.4,tau).stability,'stable');
 assert.equal(opacityState(.6,.4,20).boundary,null);
 close(opacityState(0,.4,1).limit,.25);
 assert.equal(opacityState(0,.1,20).stability,'unstable');
});
