import React, { useMemo, useState } from "react"
import TermsOfUse from './TermsOfUse'
import PrivacyPolicy from './PrivacyPolicy'
import CookiePolicy from './CookiePolicy'
import ProgressReview from './ProgressReview'
import { save } from './storage'

const label = "block text-sm font-medium text-gray-700"
const input = "mt-1 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none"
const section = "rounded-brand bg-white p-5 shadow-soft"

// Converters
const inToCm = (x)=> x*2.54; const lbToKg=(x)=>x/2.20462;

// Mifflin–St Jeor
function mifflin({sex,kg,cm,age}){ const base=10*kg+6.25*cm-5*age; return sex==="male"?base+5:base-161 }
const ACT={sedentary:1.2,light:1.375,moderate:1.55,heavy:1.725}

function computeMacros({goal,kg,tdee}){
  const pLow=1.6*kg, pHigh=2.2*kg, fat=(goal==="lose_fat"||goal==="lean_out"?0.7:0.8)*kg
  let cals=tdee; if(goal==="gain_muscle") cals=Math.round(tdee*1.1); if(goal==="lose_fat") cals=Math.round(tdee*0.85); if(goal==="lean_out") cals=Math.round(tdee*0.9); if(goal==="recomp") cals=Math.round(tdee*0.95)
  const protein=Math.round((pLow+pHigh)/2), kcalP=protein*4, kcalF=fat*9, carbs=Math.max(0,Math.round((cals-kcalP-kcalF)/4))
  return {proteinRange:[Math.round(pLow),Math.round(pHigh)], protein, fat:Math.round(fat), carbs, calories:cals}
}

const DEFAULT_VOL={ beginner:{small:10,large:12}, intermediate:{small:12,large:14}, advanced:{small:14,large:16} }
const GROUPS=[{key:"chest",size:"large"},{key:"back",size:"large"},{key:"quads",size:"large"},{key:"hamstrings",size:"large"},{key:"glutes",size:"large"},{key:"shoulders",size:"small"},{key:"biceps",size:"small"},{key:"triceps",size:"small"},{key:"calves",size:"small"},{key:"abs",size:"small"}]

function makePlan({days,exp,goal}){
  const vol=DEFAULT_VOL[exp]; const freq=Math.min(3,Math.max(2,Math.round(days/2)))
  const split=days>=5?"Upper/Lower/Push/Pull/Legs":days===4?"Upper/Lower x2":days===3?"Full Body x3":"Full Body x2"
  const per=Object.fromEntries(GROUPS.map(g=>[g.key,vol[g.size]]))
  const load=goal==="gain_muscle"?"Hypertrophy range 6–15 reps; keep sets near 0–3 RIR.":"Keep 6–15 reps; include some 4–8 for strength and 12–20 for pump."
  return {split,freq,per,load}
}

function pretty(s){ return s[0].toUpperCase()+s.slice(1) }

function HeroSection(){
  const go=()=>{ const el=document.getElementById('planner'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); window.location.hash='#/' }
  return (<section className="bg-gray-50">
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
      <div className="rounded-brand bg-white p-8 shadow-soft md:p-12">
        <p className="text-sm font-medium uppercase tracking-wider text-teal-700">Elevare</p>
        <h1 className="font-display mt-2 text-3xl font-extrabold text-gray-900 md:text-5xl">Your Adaptive Hypertrophy Coach</h1>
        <p className="mt-3 max-w-2xl text-gray-700 md:text-lg">Custom workout plans that evolve every two weeks — powered by your notes and AI coaching.</p>
        <div className="mt-6">
          <button onClick={go} className="rounded-brand bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-soft hover:bg-teal-700">Start My Plan</button>
          <span className="ml-3 text-sm text-gray-600">No signup needed • Free to try</span>
        </div>
      </div>
    </div>
  </section>)
}

export default function App(){
  const [view,setView]=useState(['#/terms','#/privacy','#/cookies'].includes(window.location.hash)?window.location.hash.replace('#/',''):'app')
  React.useEffect(()=>{ const onHash=()=>setView(['#/terms','#/privacy','#/cookies'].includes(window.location.hash)?window.location.hash.replace('#/',''):'app'); window.addEventListener('hashchange',onHash); return ()=>window.removeEventListener('hashchange',onHash)},[])

  const [metric,setMetric]=useState(true); const [sex,setSex]=useState("male"); const [age,setAge]=useState(30)
  const [height,setHeight]=useState(175); const [weight,setWeight]=useState(75); const [goalWeight,setGoalWeight]=useState(75)
  const [activity,setActivity]=useState("moderate"); const [experience,setExperience]=useState("beginner"); const [days,setDays]=useState(3); const [goal,setGoal]=useState("gain_muscle")

  const cm=metric?height:inToCm(height), kg=metric?weight:lbToKg(weight)
  const ree=Math.round(mifflin({sex,kg,cm,age})), tdee=Math.round(ree*ACT[activity])
  const macros=computeMacros({goal,kg,tdee}); const plan=makePlan({days,exp:experience,goal})

  return (<div className="min-h-screen bg-gray-50">
    <header className="bg-gradient-to-r from-teal-600 via-pink-400 to-rose-500 py-10 text-center text-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3">
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 32l10-12 8 9 12-17" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M36 12h4v12" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Elevare</h1>
      </div>
      <nav className="mt-4">
        <a href="#/" className="mx-2 text-white/90 underline-offset-2 hover:underline">Planner</a>
        <a href="#/terms" className="mx-2 text-white/90 underline-offset-2 hover:underline">Terms of Use</a>
        <a href="#/privacy" className="mx-2 text-white/90 underline-offset-2 hover:underline">Privacy</a>
        <a href="#/cookies" className="mx-2 text-white/90 underline-offset-2 hover:underline">Cookies</a>
      </nav>
    </header>

    {view==='app' && <HeroSection />}

    <main id="planner" className="mx-auto grid max-w-6xl gap-6 p-6 md:grid-cols-2">
      {view!=='app'?null:(<>
        <section className={section}>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Your Inputs</h2>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Units</span>
            <div className="flex gap-2">
              <button onClick={()=>setMetric(true)} className={`rounded-full px-3 py-1 text-sm ${metric?"bg-teal-600 text-white":"bg-gray-200"}`}>Metric</button>
              <button onClick={()=>setMetric(false)} className={`rounded-full px-3 py-1 text-sm ${!metric?"bg-teal-600 text-white":"bg-gray-200"}`}>Imperial</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={label}>Sex</label><select className={input} value={sex} onChange={e=>setSex(e.target.value)}><option value="male">Male</option><option value="female">Female</option></select></div>
            <div><label className={label}>Age</label><input className={input} type="number" min={13} max={90} value={age} onChange={e=>setAge(+e.target.value)} /></div>
            <div><label className={label}>Height ({metric?"cm":"in"})</label><input className={input} type="number" value={height} onChange={e=>setHeight(+e.target.value)} /></div>
            <div><label className={label}>Current Weight ({metric?"kg":"lb"})</label><input className={input} type="number" value={weight} onChange={e=>setWeight(+e.target.value)} /></div>
            <div><label className={label}>Goal Weight ({metric?"kg":"lb"})</label><input className={input} type="number" value={goalWeight} onChange={e=>setGoalWeight(+e.target.value)} /></div>
            <div><label className={label}>Activity Level</label><select className={input} value={activity} onChange={e=>setActivity(e.target.value)}><option value="sedentary">Sedentary</option><option value="light">Light</option><option value="moderate">Moderate</option><option value="heavy">Heavy</option></select></div>
            <div><label className={label}>Experience</label><select className={input} value={experience} onChange={e=>setExperience(e.target.value)}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
            <div><label className={label}>Days per Week</label><input className={input} type="number" min={2} max={6} value={days} onChange={e=>setDays(+e.target.value)} /></div>
            <div className="col-span-2"><label className={label}>Primary Goal</label><select className={input} value={goal} onChange={e=>setGoal(e.target.value)}><option value="lose_fat">Lose Weight</option><option value="lean_out">Lean Out</option><option value="recomp">Recomposition</option><option value="gain_muscle">Gain Muscle</option></select></div>
          </div>
        </section>

        <section className={section}>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Energy & Macros</h2>
          <p className="text-sm text-gray-600">REE: <b>{ree}</b> kcal/day • TDEE: <b>{tdee}</b> kcal/day</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-indigo-50 p-4"><div className="text-xs uppercase tracking-wide text-indigo-700">Target Calories</div><div className="text-2xl font-semibold text-indigo-900">{macros.calories} kcal</div><div className="text-xs text-indigo-800">Adjusted for goal</div></div>
            <div className="rounded-xl bg-purple-50 p-4"><div className="text-xs uppercase tracking-wide text-purple-700">Protein</div><div className="text-2xl font-semibold text-purple-900">{macros.protein} g</div><div className="text-xs text-purple-800">Range: {macros.proteinRange[0]}–{macros.proteinRange[1]} g/day</div></div>
            <div className="rounded-xl bg-emerald-50 p-4"><div className="text-xs uppercase tracking-wide text-emerald-700">Fat</div><div className="text-2xl font-semibold text-emerald-900">{macros.fat} g</div><div className="text-xs text-emerald-800">~{goal==="lose_fat"||goal==="lean_out"?0.7:0.8} g/kg</div></div>
            <div className="rounded-xl bg-amber-50 p-4"><div className="text-xs uppercase tracking-wide text-amber-700">Carbohydrates</div><div className="text-2xl font-semibold text-amber-900">{macros.carbs} g</div><div className="text-xs text-amber-800">Remainder of calories</div></div>
          </div>
          <p className="mt-3 text-xs text-gray-600">Spread protein over 3–5 meals; include one near training and one pre‑sleep.</p>
        </section>

        <section className="md:col-span-2">
          <div className={section}>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Training Plan Builder <span className="ml-2 rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-700">Notes‑aware</span></h2>
            <p className="text-sm text-gray-600">Suggested split: <b>{plan.split}</b> • Target frequency: {plan.freq}x per muscle/week</p>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
              {GROUPS.map(g=>(<div key={g.key} className="rounded-xl bg-gray-100 p-3 text-center">
                <div className="text-xs uppercase tracking-wide text-gray-600">{g.key[0].toUpperCase()+g.key.slice(1)}</div>
                <div className="text-2xl font-semibold text-gray-900">{plan.per[g.key]} sets</div>
                <div className="text-xs text-gray-600">/ week</div>
              </div>))}
            </div>
            <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">
              <ul className="list-inside list-disc">
                <li>Prioritize 6–15 reps; keep sets near 0–3 RIR. Strength work 4–8 reps as desired.</li>
                <li>Progression: add 1–2 reps weekly until top of range, then +2.5–5% load.</li>
                <li>1–2 compounds + 1–2 isolations per muscle weekly; rotate angles/grips.</li>
                <li>Deload every 4–8 weeks or when fatigue/performance dictates.</li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="md:col-span-2">
          <div className="rounded-2xl bg-gray-900 p-5 text-gray-100">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div><h3 className="text-lg font-semibold">Share or Customize</h3><p className="text-sm opacity-80">Export your settings as JSON to reuse later.</p></div>
              <button onClick={()=>{ const blob=new Blob([JSON.stringify({sex,age,height:metric?`${height} cm`:`${height} in`,weight:metric?`${weight} kg`:`${weight} lb`,goalWeight:metric?`${goalWeight} kg`:`${goalWeight} lb`,activity,experience,days,goal,ree,tdee,macros,plan},null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='elevare-plan.json'; a.click(); URL.revokeObjectURL(url); }} className="rounded-brand bg-white/90 px-4 py-2 text-sm font-medium text-gray-900 shadow-soft hover:bg-white">Export JSON</button>
            </div>
          </div>
        </footer>
      </>)}

      {view==='terms' ? <TermsOfUse/> : null}
      {view==='privacy' ? <PrivacyPolicy/> : null}
      {view==='cookies' ? <CookiePolicy/> : null}
    </main>

    {view==='app' && <section className="md:col-span-2 px-6 max-w-6xl mx-auto"><ProgressReview onAdapt={(entry,history)=>{
      const n=(entry.notes||'').toLowerCase(); let d=0; if(/easy|easier|too light/.test(n)) d=1; if(/hard|fried|wiped|too much/.test(n)) d=-1;
      if(d!==0){ try{ const keys=Object.keys(plan.per); keys.forEach(k=>plan.per[k]=Math.max(6,plan.per[k]+d)); save('elevare_plan',plan); alert(`Plan adjusted: weekly sets ${d>0?'+1':'-1'} per muscle based on your notes.`);}catch{} }
    }}/></section>}
  </div>)
}
