export function analyzeNotes(notes=''){
  const t=(notes||'').toLowerCase(); const s=[];
  if(/(easy|easier|too light|breez)/.test(t)) s.push('Increase load 2.5–5% on compounds; add +1 weekly set to lagging muscles.');
  if(/(hard|too much|overtrain|fried|wiped|sore for days|pain)/.test(t)) s.push('Reduce 2–4 sets for fatigued groups; keep 1–3 RIR; consider a 1‑week deload.');
  if(/(stalled|plateau|stuck)/.test(t)) s.push('Swap one main variation and reset to bottom of rep range.');
  if(/(sleep|insomnia|tired|fatigue)/.test(t)) s.push('Prioritize 7–9 h sleep; move heavy sessions earlier; manage caffeine.');
  if(/(hungry|cravings|missed macros|protein low|under ate|overate)/.test(t)) s.push('Protein 1.6–2.2 g/kg; 3–5 meals; adjust calories ±150–250 if trend off‑target.');
  if(/(elbow|shoulder|knee|back) (pain|ache|hurts|tender)/.test(t)) s.push('Swap aggravating lifts; pain‑free ROM; extra warm‑ups/mobility.');
  if(/(form|technique|range of motion|rom)/.test(t)) s.push('2–3 s eccentrics; full ROM; video a top set for review.');
  if(/(pr|personal record|new max)/.test(t)) s.push('Nice — consider microloading; maintain volume; progress reps then load.');
  if(!s.length) s.push('Continue progression: add 1–2 reps weekly toward top of range, then +2.5–5% load.');
  return {suggestions:s};
}
export async function analyzeNotesAI(notes,plan,history){
  try{
    let resp=await fetch('/api/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({notes,plan,history})});
    if(resp.status===404){resp=await fetch('/.netlify/functions/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({notes,plan,history})});}
    if(!resp.ok) throw new Error('API error'); return await resp.json();
  }catch(e){return null}
}
