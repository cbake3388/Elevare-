import React, { useMemo, useState } from 'react'
import { load, save, nowIso, twoWeeksFrom, daysUntil } from './storage'
import { analyzeNotes, analyzeNotesAI } from './notesCoach'

export default function ProgressReview({ onAdapt }){
  const [history,setHistory]=useState(load('elevare_history',[]))
  const [weight,setWeight]=useState(''); const [waist,setWaist]=useState(''); const [notes,setNotes]=useState('')
  const [nextDue,setNextDue]=useState(load('elevare_next_due', twoWeeksFrom(nowIso())))
  const dueIn=daysUntil(nextDue); const { suggestions:localSug }=useMemo(()=>analyzeNotes(notes),[notes])
  const [aiSug,setAiSug]=useState(null)

  React.useEffect(()=>{ setAiSug(null); (async()=>{ const res=await analyzeNotesAI(notes,null,history); if(res&&res.suggestions)setAiSug(res.suggestions) })() },[notes])

  const submit=()=>{
    const entry={ at: nowIso(), weight: weight?Number(weight):null, waist: waist?Number(waist):null, notes }
    const newHist=[entry,...history]; setHistory(newHist); save('elevare_history',newHist)
    const next=twoWeeksFrom(entry.at); setNextDue(next); save('elevare_next_due',next)
    if(onAdapt) onAdapt(entry,newHist,(aiSug||localSug))
    setNotes('')
  }

  return (<div className="rounded-brand bg-white p-5 shadow-soft">
    <h2 className="font-display text-xl font-extrabold text-gray-900">2‑Week Check‑In</h2>
    <p className="mt-1 text-sm text-gray-600">Next review in <b>{dueIn}</b> day{dueIn===1?'':'s'}. Notes are the star ⭐ — the more you write, the smarter your plan gets.</p>
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div><label className="block text-sm font-medium text-gray-700">Weight</label><input className="mt-1 w-full rounded-xl border border-gray-300 p-3" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="e.g., 82.3" /></div>
      <div><label className="block text-sm font-medium text-gray-700">Waist</label><input className="mt-1 w-full rounded-xl border border-gray-300 p-3" value={waist} onChange={e=>setWaist(e.target.value)} placeholder="optional" /></div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Notes (make these the star ⭐)</label>
        <textarea className="mt-1 w-full rounded-xl border border-gray-300 p-3" rows={4} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What felt easy? What crushed you? Sleep, appetite, stress, joints, PRs…"></textarea>
        <button onClick={submit} className="mt-3 rounded-brand bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-soft hover:bg-teal-700">Save check‑in & adapt plan</button>
      </div>
    </div>
    <div className="mt-4 rounded-xl bg-gray-50 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-600">Coach Response (AI‑aided)</div>
      <ul className="mt-1 list-inside list-disc text-sm text-gray-800">{(aiSug||localSug).map((s,i)=>(<li key={i}>{s}</li>))}</ul>
      <p className="mt-2 text-xs text-gray-500">Uses local coach by default. Add an API key for full AI coaching.</p>
    </div>
    {history.length>0 && (<div className="mt-6"><h3 className="font-display text-lg font-extrabold text-gray-900">Your Check‑Ins</h3>
      <div className="mt-2 grid gap-3">{history.map((h,i)=>(<div key={i} className="rounded-xl border border-gray-200 bg-white p-3 text-sm"><div className="text-gray-500">{new Date(h.at).toLocaleString()}</div><div className="mt-1 text-gray-800">Weight: {h.weight??'—'} • Waist: {h.waist??'—'}</div><div className="mt-1 whitespace-pre-line text-gray-900">{h.notes||'—'}</div></div>))}</div>
    </div>)}
  </div>)
}
