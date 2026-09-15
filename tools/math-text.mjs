// Format only recognized notation; all other text remains escaped plain text.
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sub=(base,index)=>`<msub><mi>${base}</mi><mi>${index}</mi></msub>`;
const atoms=new Map([
 ['λ_p',sub('λ','p')],['ν_p',sub('ν','p')],['T_eff',sub('T','eff')],
 ...['I','B','F','κ','ε','τ','S'].flatMap(x=>['λ','ν'].map(y=>[x+y,sub(x,y)])),
 ...['B','V'].flatMap(y=>['f','Z'].map(x=>[x+'_'+y,sub(x,y)])),
 ['N_II',sub('N','II')],['N_I',sub('N','I')],['nₑ',sub('n','e')]
]);
const specials=new Map([
 ['λ_pν_p=c',`<mrow>${sub('λ','p')}${sub('ν','p')}<mo>=</mo><mi>c</mi></mrow>`],
 ['Bλ λ²/c',`<mfrac><mrow>${sub('B','λ')}<msup><mi>λ</mi><mn>2</mn></msup></mrow><mi>c</mi></mfrac>`],
 ['N_II/N_I',`<mfrac>${sub('N','II')}${sub('N','I')}</mfrac>`],
 ['f_B/f_V',`<mfrac>${sub('f','B')}${sub('f','V')}</mfrac>`],
 ['1/nₑ',`<mfrac><mn>1</mn>${sub('n','e')}</mfrac>`]
]);
const tokens=new Map([...specials,...atoms]);
const pattern=new RegExp([...tokens.keys()].sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
export function mathText(text){let out='',end=0;for(const m of String(text).matchAll(pattern)){out+=escape(text.slice(end,m.index));out+=`<math xmlns="http://www.w3.org/1998/Math/MathML" displaystyle="true" aria-label="${escape(m[0])}">${tokens.get(m[0])}</math>`;end=m.index+m[0].length;}return out+escape(text.slice(end));}
