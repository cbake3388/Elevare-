export const handler = async (event) => {
  if(event.httpMethod!=='POST') return {statusCode:405, body:JSON.stringify({error:'Method not allowed'})}
  try{
    const body=JSON.parse(event.body||"{}"); const { notes='', plan=null, history=[] }=body; const key=process.env.OPENAI_API_KEY
    const heuristic=()=>{ const t=(notes||'').toLowerCase(); const s=[]; if(/easy|easier|too light|breeze/.test(t)) s.push("Increase load 2.5–5% on compounds; add +1 weekly set for lagging muscles.");
      if(/hard|too much|fried|wiped|overtrain/.test(t)) s.push("Reduce 2–4 weekly sets; keep 1–3 RIR; consider deload."); if(/stalled|plateau|stuck/.test(t)) s.push("Swap a main variation and reset reps."); if(!s.length) s.push("Continue progression."); return {suggestions:s,used:'heuristic'} };
    if(!key) return {statusCode:200, body:JSON.stringify(heuristic())}
    const prompt=`You are Elevare's hypertrophy coach. Return JSON with suggestions (3-6 bullets), volume_delta (-2..+2), load_change ("up"|"down"|"hold"). Notes: ${notes}`;
    const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model:"gpt-4o-mini",response_format:{type:"json_object"},messages:[{role:"system",content:"Be concise, safe, evidence-aware coach."},{role:"user",content:prompt}],temperature:0.3})});
    if(!r.ok){ return {statusCode:200, body:JSON.stringify(heuristic())} } const data=await r.json(); let parsed; try{ parsed=JSON.parse(data.choices?.[0]?.message?.content||"{}") }catch{ parsed=null }
    if(!parsed||!parsed.suggestions){ return {statusCode:200, body:JSON.stringify(heuristic())} } return {statusCode:200, body:JSON.stringify({...parsed,used:"openai"})}
  }catch(e){ return {statusCode:200, body:JSON.stringify({error:String(e)})} }
}
