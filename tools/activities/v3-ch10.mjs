import fs from 'node:fs';
import {scenes} from '../v3-ch10-scenes.mjs';
import {labFrame,labRuntime} from '../v3-lab-ui.mjs';
export const lessonId='v3-ch10';
export const types=['v3homology','v3composition','v3contraction'];
export function homologous(M,mu,kappa,nu,alpha=.5,beta=2.5){const d=nu+3+3*alpha-beta,a=(nu-1-beta+alpha)/d,b=(nu-beta-4)/d,R=kappa**(1/d)*mu**b*M**a,L=kappa**-1*mu**(beta+4)*M**(beta+3-alpha)*R**(3*alpha-beta);return {R,L,T:(L/R**2)**.25,Tc:mu*M/R,a,l:beta+3-alpha+(3*alpha-beta)*a};}
export function contraction(R){return {L:1/R,T:R**-.75,Tc:1/R,rho:R**-3,P:R**-4,heat:1/R-1,elapsed:-Math.log(R)};}
export function render(a,ui){const r=ui.range,select=ui.select;
 if(a.type==='v3homology')return labFrame(a,ui,{title:'同源恒星：质量改变，结构怎样缩放',prompt:'质量增加一倍，半径、光度和中心温度会按相同比例增加吗？选择核反应和不透明度近似，再调整质量，比较两颗星的大小与四个倍率读数。',controls:select({key:'nu',label:'产能指数',options:[['16','CN：ν=16'],['4','pp：ν=4']]})+select({key:'opacity',label:'不透明度幂律',options:[['fit','α=0.5，β=2.5'],['kramers','Kramers：α=1，β=3.5']]})+r({key:'M',label:'M / M参考',min:.7,max:2,step:.01,value:1}),legend:'两颗星使用相同的半径标尺；下方四条刻度分别表示温度、半径与光度倍数，白线标记参考值 1。AI 生成的表面纹理仅作示意，颜色与亮度不用于定量测温。',caption:'气体压强占优、均匀组成、全辐射输运、同源分层。不透明度和核产能采用正文中的幂律，固定两者的系数与平均分子量。所有读数相对同一族的参考星，不把参考星指定为太阳；曲线是幂律结果，不是观测拟合。播放扫描不同质量恒星，不代表一颗星增重。'},true);
 if(a.type==='v3composition')return labFrame(a,ui,{title:'组成变化：同质量与同温度的两种比较',prompt:'贫金属星在同质量时更亮，为什么主序却可以在图上更低？先固定 μ 降低 Z，再切换“固定质量”和“固定有效温度”，观察白框位置与光度比的变化。',controls:select({key:'compare',label:'比较条件',options:[['mass','固定质量'],['temperature','固定有效温度']]})+r({key:'mu',label:'μ / μ参考',min:1,max:1.2,step:.005,value:1})+r({key:'Z',label:'Z / Z参考',min:.5,max:1.5,step:.01,value:1}),legend:'灰色虚线为参考组成，青色实线为当前组成；金点为当前星，白框为参考星。切换比较条件，红色虚线连接所选的一对恒星；温度向左增加。',caption:'pp 产能 ν=4，α=0.5、β=2.5，κ0/κ0参考=Z/Z参考。μ、Z 独立变化，暂固定 ε0；仅隔离组成的结构效应。真实混合燃烧还会改变 X 和 ε0，自由—自由吸收也使 κ0 不严格正比 Z，因此本图不能外推至纯氦星或极贫金属星。'},false);
 return labFrame(a,ui,{title:'辐射收缩：变小、升温与向外放能',prompt:'恒星在辐射能量时，中心温度还能升高吗？播放收缩，比较半径、中心温度、辐射能和热能，再观察释放的引力能如何分给热能与辐射。',controls:r({key:'R',label:'R / R初始',min:.5,max:1,step:.005,value:1}),legend:'左侧剖面中的层和蓝点标记同一组物质，随半径等比收缩；虚圆为初态，箭头仅表示辐射方向。右侧三柱共用能量刻度，热能与辐射之和等于引力能释放。壳层着色不代表实际温度分布。',caption:'质量与组成不变，理想单原子气体、准静态同源收缩、无核能、无深对流区。α=0.5、β=2.5 给出 L/L初始=R初始/R；有效温度比是半径比的 −3/4 次方。能量单位 A=|Ω初始|/2，ΔU=Q辐射=A(1/R比−1)。自洽时间为 t/(A/L初始)=−ln(R比)；播放匀速改变半径，因此播放秒数不是物理时间。'},true);
}
const surfaceTexture='data:image/png;base64,'+fs.readFileSync(new URL('../../assets/stellar-photosphere.png',import.meta.url)).toString('base64');
export const browserScript=`(()=>{${labRuntime}\n const homologous=${homologous.toString()},contraction=${contraction.toString()},surfaceTexture=${JSON.stringify(surfaceTexture)};\n${scenes}\n})();`;
