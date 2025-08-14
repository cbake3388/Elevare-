export const load=(k,f)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch{return f}};
export const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
export const nowIso=()=>new Date().toISOString();
export const twoWeeksFrom=(iso)=>{const d=new Date(iso||Date.now());d.setDate(d.getDate()+14);return d.toISOString()};
export const daysUntil=(iso)=>Math.ceil((new Date(iso)-new Date())/(1000*60*60*24));