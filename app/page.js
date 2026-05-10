'use client'
import { useState, useEffect } from 'react'

const PKEY = 'opstreak_data'
const IDENTITIES = {
  athlete: { label: 'Athlete', icon: '🏃', desc: 'Peak physical excellence' },
  entrepreneur: { label: 'Entrepreneur', icon: '🚀', desc: 'Building something that matters' },
  artist: { label: 'Artist', icon: '🎨', desc: 'Creating what the world needs' },
  warrior: { label: 'Warrior', icon: '⚔️', desc: 'Discipline above everything' },
  scholar: { label: 'Scholar', icon: '🧠', desc: 'Knowledge as a superpower' },
  healer: { label: 'Healer', icon: '⚕️', desc: 'Precision, care, mastery' },
  creator: { label: 'Creator', icon: '✍️', desc: 'Words and ideas that move people' },
  leader: { label: 'Leader', icon: '🦅', desc: 'Building people, not just things' },
}

function load() {
  try {
    const keys = Object.keys(localStorage)
    let best = null, bestH = 0
    for (const k of keys) {
      try {
        const p = JSON.parse(localStorage.getItem(k))
        if (p && Array.isArray(p.habits) && p.habits.length > bestH) { best = p; bestH = p.habits.length }
      } catch(e) {}
    }
    if (best) { localStorage.setItem(PKEY, JSON.stringify(best)); return best }
  } catch(e) {}
  return null
}

function save(data) {
  try { localStorage.setItem(PKEY, JSON.stringify(data)) } catch(e) {}
}

function dk() { return new Date().toISOString().slice(0,10) }

const SUGGESTED = {
  athlete: [{name:'Morning workout / run',icon:'🏃'},{name:'Drink 3 litres of water',icon:'💧'},{name:'Eat clean — no junk',icon:'🥗'},{name:'Sleep 8 hours',icon:'😴'},{name:'Stretch & mobility',icon:'🧘'},{name:'Track training progress',icon:'📝'}],
  entrepreneur: [{name:'Deep work on main project — 2hr',icon:'💻'},{name:'Read business / growth content',icon:'📖'},{name:'Track revenue & key metrics',icon:'📊'},{name:'One meaningful outreach',icon:'🤝'},{name:'No mindless scrolling',icon:'🚫'},{name:'Journal — wins & lessons',icon:'✍️'}],
  artist: [{name:'Create for 1 focused hour',icon:'🎨'},{name:'Study great work in your field',icon:'📚'},{name:'Capture ideas — sketch or write',icon:'✏️'},{name:'Drink 3 litres of water',icon:'💧'},{name:'Walk — let the mind wander',icon:'🚶'},{name:'Share or document your work',icon:'📸'}],
  warrior: [{name:'Strength training',icon:'💪'},{name:'Cardio — 30 min minimum',icon:'🏃'},{name:'Cold shower',icon:'🚿'},{name:'Eat clean',icon:'🥗'},{name:'Read — 30 pages',icon:'📖'},{name:'Reflect — what did I win today',icon:'🪞'}],
  scholar: [{name:'Deep study — 2 focused hours',icon:'🧠'},{name:'Write to consolidate learning',icon:'✍️'},{name:'Read — books not feeds',icon:'📖'},{name:'Solve one hard problem',icon:'🔍'},{name:'No distractions after 9pm',icon:'🌙'},{name:'Review & revise yesterday',icon:'🔄'}],
  healer: [{name:'Study — clinical or research',icon:'📚'},{name:'Drink 3 litres of water',icon:'💧'},{name:'Exercise — 30 min',icon:'🏃'},{name:'Sleep 7-8 hours',icon:'😴'},{name:'Mindfulness — 10 min',icon:'🧘'},{name:'Eat nutritiously',icon:'🥗'}],
  creator: [{name:'Write 500+ words',icon:'✍️'},{name:'Read for 30 min',icon:'📖'},{name:'Capture 3 original ideas',icon:'💡'},{name:'Drink 3 litres of water',icon:'💧'},{name:'No social media before noon',icon:'🚫'},{name:'Publish or share something',icon:'📤'}],
  leader: [{name:'1 meaningful conversation',icon:'🤝'},{name:'Read — leadership or strategy',icon:'📚'},{name:'Exercise',icon:'💪'},{name:'Write — thoughts or plans',icon:'✍️'},{name:'Review team or project health',icon:'📊'},{name:'No reactive decisions before 10am',icon:'🧘'}],
}

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { background: #FFF8F2; font-family: sans-serif; min-height: 100vh; }
  input, textarea, button { font-family: inherit; }
  .btnp { background: #E8640A; color: white; border: none; border-radius: 100px; padding: 0.75rem 1.5rem; font-weight: 600; font-size: 0.9rem; cursor: pointer; width: 100%; margin-top: 0.5rem; }
  .btng { background: transparent; color: #E8640A; border: 1.5px solid #E8640A; border-radius: 100px; padding: 0.75rem 1.5rem; font-weight: 600; font-size: 0.9rem; cursor: pointer; width: 100%; margin-top: 0.5rem; }
  .inp { width: 100%; padding: 0.8rem 1rem; border-radius: 0.8rem; border: 1.5px solid rgba(232,100,10,0.2); font-size: 0.95rem; outline: none; background: #FFF8F2; color: #1C1008; margin-bottom: 0.6rem; }
  .page { max-width: 560px; margin: 0 auto; padding: 1.2rem; min-height: 100vh; }
  .hi { background: white; border: 1px solid rgba(28,16,8,0.08); border-radius: 1rem; padding: 0.9rem 1rem; display: flex; align-items: center; gap: 0.8rem; cursor: pointer; margin-bottom: 0.6rem; }
  .hi.done { border-color: #E8640A; background: #FFF5EA; }
  .hbub { width: 44px; height: 44px; border-radius: 50%; background: #FFE8D0; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
  .hi.done .hbub { background: #E8640A; }
  .idc { border: 1.5px solid rgba(28,16,8,0.08); border-radius: 1rem; padding: 1rem; cursor: pointer; background: white; }
  .idc.on { border-color: #E8640A; background: #FFF5EA; }
  .hsel { display: flex; align-items: center; gap: 0.8rem; padding: 0.85rem 1rem; background: white; border: 1.5px solid rgba(28,16,8,0.08); border-radius: 1rem; cursor: pointer; margin-bottom: 0.6rem; }
  .hsel.on { border-color: #E8640A; background: #FFF5EA; }
`

export default function App() {
  const [page, setPage] = useState('loading')
  const [S, setS] = useState(null)
  const [obStep, setObStep] = useState(1)
  const [obName, setObName] = useState('')
  const [obIdentity, setObIdentity] = useState('athlete')
  const [obGoal, setObGoal] = useState('')
  const [obDay, setObDay] = useState('')
  const [obHabits, setObHabits] = useState([])
  const [customHabit, setCustomHabit] = useState('')
  const [showShare, setShowShare] = useState(false)

useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const guest = params.get('guest')
    const saved = load()
    if (saved && saved.habits && saved.habits.length > 0) {
      if (!saved.log) saved.log = {}
      if (!saved.log[dk()]) saved.log[dk()] = saved.habits.map(() => false)
      setS(saved)
      setPage('today')
    } else if (guest) {
      setPage('onboard')
    } else {
      setPage('login')
    }
  }, [])

  function update(newS) { save(newS); setS({...newS}) }

  function toggle(i) {
    const newLog = [...(S.log[dk()] || [])]
    newLog[i] = !newLog[i]
    update({...S, log: {...S.log, [dk()]: newLog}})
  }

  function getDN() {
    const keys = Object.keys((S || {}).log || {}).sort()
    return ((S || {}).startDay || 1) + Math.max(0, keys.length - 1)
  }

  function getStreak() {
    const keys = Object.keys((S || {}).log || {}).sort()
    let s = 0
    for (let i = keys.length - 1; i >= 0; i--) {
      if (S.log[keys[i]] && S.log[keys[i]].some(Boolean)) s++
      else break
    }
    return s
  }

  function getHabitStreak(idx) {
    const keys = Object.keys((S || {}).log || {}).sort()
    let s = 0
    for (let i = keys.length - 1; i >= 0; i--) {
      if (S.log[keys[i]] && S.log[keys[i]][idx]) s++
      else break
    }
    return s
  }

  function finishOnboard() {
    const finalHabits = obHabits.length > 0 ? obHabits : (SUGGESTED[obIdentity] || SUGGESTED.athlete).slice(0, 5)
    const newS = {
      name: obName, alias: obName, identity: obIdentity,
      goal: obGoal || 'Build the best version of myself',
      startDay: parseInt(obDay) || 1,
      habits: finalHabits,
      log: {[dk()]: finalHabits.map(() => false)}
    }
    update(newS)
    setPage('today')
  }

  function resetApp() {
    const ok = confirm('Reset everything? This clears all your data.')
    if (ok) { localStorage.clear(); window.location.reload() }
  }

  function shareWA() {
    if (!S) return
    const log = S.log[dk()] || []
    const done = log.filter(Boolean).length
    const streak = getStreak()
    const dn = getDN()
    const id = IDENTITIES[S.identity] || IDENTITIES.athlete
    const lines = S.habits.map((h, i) => (log[i] ? '✅ ' : '⬜ ') + h.name).join('\n')
    const text = '🔥 OpStreak — Day ' + dn + (S.name ? ' · ' + S.name : '') + '\n' + id.icon + ' ' + id.label + ' · ' + done + '/' + S.habits.length + ' done · ' + streak + ' day streak 🔥\n\n' + lines + '\n\n👉 opstreak.com'
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
  }

  if (page === 'loading') return (
    <>
      <style>{CSS}</style>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#FFF8F2',textAlign:'center'}}>
        <div>
          <div style={{fontSize:'2.5rem',fontWeight:800,color:'#E8640A'}}>OpStreak</div>
          <div style={{fontSize:'0.85rem',color:'#999',marginTop:'0.3rem'}}>Loading...</div>
        </div>
      </div>
    </>
  )

  if (page === 'onboard') {
    const habits = SUGGESTED[obIdentity] || SUGGESTED.athlete
    return (
      <>
        <style>{CSS}</style>
        <div className="page" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',paddingTop:'3rem',paddingBottom:'3rem'}}>
          <div style={{fontSize:'2.2rem',fontWeight:800,color:'#E8640A',marginBottom:'0.3rem'}}>OpStreak</div>
          <div style={{fontSize:'0.82rem',color:'#999',marginBottom:'2.5rem'}}>Build your streak. Show up every day.</div>

          {obStep === 1 && (
            <div style={{width:'100%',maxWidth:'400px'}}>
              <div style={{fontSize:'0.68rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#E8640A',marginBottom:'0.4rem'}}>Welcome</div>
              <div style={{fontSize:'2rem',fontWeight:700,color:'#1C1008',marginBottom:'0.4rem'}}>What shall we call you?</div>
              <div style={{fontSize:'0.85rem',color:'#999',marginBottom:'1.5rem'}}>Your name or a power name — this is who shows up every day.</div>
              <input className="inp" placeholder="e.g. Priya, Maverick, The Wolf..." value={obName} onChange={e => setObName(e.target.value)} style={{textAlign:'center',fontSize:'1.1rem',fontWeight:600}} maxLength={25} />
              <button className="btnp" onClick={() => { if (!obName.trim()) { alert('Please enter your name'); return } setObStep(2) }}>Continue →</button>
            </div>
          )}

          {obStep === 2 && (
            <div style={{width:'100%',maxWidth:'420px'}}>
              <div style={{fontSize:'0.68rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#E8640A',marginBottom:'0.4rem'}}>Step 2 of 4</div>
              <div style={{fontSize:'2rem',fontWeight:700,color:'#1C1008',marginBottom:'0.4rem'}}>Who are you building?</div>
              <div style={{fontSize:'0.85rem',color:'#999',marginBottom:'1.5rem'}}>Not who you are today. Who you are committed to becoming.</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.6rem',marginBottom:'1rem',textAlign:'left'}}>
                {Object.entries(IDENTITIES).map(([k, v]) => (
                  <div key={k} className={'idc' + (obIdentity === k ? ' on' : '')} onClick={() => setObIdentity(k)}>
                    <div style={{fontSize:'1.5rem',marginBottom:'0.3rem'}}>{v.icon}</div>
                    <div style={{fontWeight:600,fontSize:'0.85rem',color:'#1C1008'}}>{v.label}</div>
                    <div style={{fontSize:'0.72rem',color:'#999',marginTop:'0.15rem'}}>{v.desc}</div>
                  </div>
                ))}
              </div>
              <button className="btnp" onClick={() => setObStep(3)}>Continue →</button>
            </div>
          )}

          {obStep === 3 && (
            <div style={{width:'100%',maxWidth:'400px'}}>
              <div style={{fontSize:'0.68rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#E8640A',marginBottom:'0.4rem'}}>Step 3 of 4</div>
              <div style={{fontSize:'2rem',fontWeight:700,color:'#1C1008',marginBottom:'0.4rem'}}>Your 6-month commitment.</div>
              <div style={{fontSize:'0.85rem',color:'#999',marginBottom:'1.5rem'}}>Not a wish. A decision. What will be true about you 6 months from now?</div>
              <textarea className="inp" placeholder="In 6 months I will be..." value={obGoal} onChange={e => setObGoal(e.target.value)} style={{minHeight:'90px',resize:'none'}} />
              <input className="inp" type="number" placeholder="What day are you on? (e.g. 125)" value={obDay} onChange={e => setObDay(e.target.value)} style={{textAlign:'center'}} />
              <button className="btnp" onClick={() => setObStep(4)}>See My Daily Habits →</button>
            </div>
          )}

          {obStep === 4 && (
            <div style={{width:'100%',maxWidth:'420px',textAlign:'left'}}>
              <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
                <div style={{fontSize:'0.68rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#E8640A',marginBottom:'0.4rem'}}>Step 4 of 4</div>
                <div style={{fontSize:'2rem',fontWeight:700,color:'#1C1008',marginBottom:'0.4rem'}}>Your daily non-negotiables.</div>
                <div style={{fontSize:'0.85rem',color:'#999'}}>Suggested for a {IDENTITIES[obIdentity] ? IDENTITIES[obIdentity].label : ''}. Select what you commit to.</div>
              </div>
              {habits.map((h, i) => {
                const sel = obHabits.find(x => x.name === h.name)
                return (
                  <div key={i} className={'hsel' + (sel ? ' on' : '')} onClick={() => { if (sel) setObHabits(obHabits.filter(x => x.name !== h.name)); else setObHabits([...obHabits, h]) }}>
                    <div style={{width:'36px',height:'36px',borderRadius:'50%',background:sel?'#E8640A':'#FFE8D0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0}}>{h.icon}</div>
                    <div style={{flex:1,fontWeight:600,fontSize:'0.88rem',color:'#1C1008'}}>{h.name}</div>
                    <div style={{width:'20px',height:'20px',borderRadius:'50%',border:'2px solid ' + (sel ? '#E8640A' : 'rgba(28,16,8,0.15)'),background:sel?'#E8640A':'transparent',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'0.7rem',flexShrink:0}}>{sel ? '✓' : ''}</div>
                  </div>
                )
              })}
              <div style={{display:'flex',gap:'0.5rem',marginTop:'0.5rem',marginBottom:'0.8rem'}}>
                <input className="inp" placeholder="Add your own habit..." value={customHabit} onChange={e => setCustomHabit(e.target.value)} style={{marginBottom:0,flex:1}} />
                <button onClick={() => { if (!customHabit.trim()) return; setObHabits([...obHabits, {name:customHabit.trim(),icon:'⭐'}]); setCustomHabit('') }} style={{padding:'0 1rem',borderRadius:'0.8rem',border:'none',background:'#E8640A',color:'white',fontWeight:600,cursor:'pointer',flexShrink:0}}>+ Add</button>
              </div>
              <button className="btnp" onClick={finishOnboard}>Start My Streak →</button>
            </div>
          )}
        </div>
      </>
    )
  }

  if (!S) return null

  const log = S.log[dk()] || []
  const done = log.filter(Boolean).length
  const total = S.habits.length
  const streak = getStreak()
  const dn = getDN()
  const allDone = done === total && total > 0
  const id = IDENTITIES[S.identity] || IDENTITIES.athlete

  if (showShare) return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:'100vh',background:'#FFF8F2'}}>
        <div style={{background:'linear-gradient(145deg,#1a0800,#2d1000)',padding:'2rem 1.5rem'}}>
          <div style={{maxWidth:'560px',margin:'0 auto'}}>
            <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',marginBottom:'0.6rem'}}>— OpStreak —</div>
            <div style={{fontSize:'3.5rem',fontWeight:700,color:'white',lineHeight:1}}>Day <span style={{color:'#E8640A'}}>{dn}</span></div>
            {S.name && <div style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.55)',marginTop:'0.3rem',fontStyle:'italic'}}>"{S.name}"</div>}
            <div style={{margin:'1rem 0'}}>
              {S.habits.map((h, i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.45rem'}}>
                  <div style={{width:'7px',height:'7px',borderRadius:'50%',background:log[i]?'#E8640A':'rgba(255,255,255,0.2)',flexShrink:0}}></div>
                  <span style={{fontSize:'0.85rem',fontWeight:500,color:log[i]?'white':'rgba(255,255,255,0.35)'}}>{h.icon} {h.name}</span>
                  {log[i] && <span style={{marginLeft:'auto',fontSize:'0.72rem',color:'#E8640A'}}>✓</span>}
                </div>
              ))}
            </div>
            <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:'0.8rem',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
              <div>
                <div style={{fontSize:'1.1rem',fontWeight:700,color:'#E8640A'}}>OpStreak</div>
                <div style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.25)'}}>opstreak.com</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'1.1rem',color:'#E8640A',fontWeight:700}}>{streak}🔥</div>
                <div style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.4)'}}>day streak</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{padding:'1.2rem',maxWidth:'560px',margin:'0 auto'}}>
          <button className="btnp" onClick={shareWA}>📲 Share on WhatsApp</button>
          <button className="btng" onClick={() => setShowShare(false)} style={{marginTop:'0.6rem'}}>← Back to Today</button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{CSS}</style>
      <div className="page">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',paddingTop:'0.8rem',marginBottom:'1.2rem'}}>
          <div>
            <div style={{fontSize:'0.68rem',fontWeight:600,color:'#E8640A',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.2rem'}}>{id.icon} {id.label}</div>
            <div style={{fontSize:'2.8rem',fontWeight:700,lineHeight:1,color:'#1C1008'}}>Day <span style={{color:'#E8640A'}}>{dn}</span></div>
            <div style={{fontSize:'0.76rem',color:'#999',marginTop:'0.25rem'}}>{new Date().toLocaleDateString('en-IN', {weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
            {S.name && <div style={{fontSize:'0.8rem',color:'#E8640A',marginTop:'0.2rem',fontStyle:'italic'}}>"{S.name}"</div>}
          </div>
          <div style={{background:'linear-gradient(135deg,#E8640A,#C44D00)',borderRadius:'1rem',padding:'0.8rem 1rem',textAlign:'center',color:'white',minWidth:'72px',boxShadow:'0 4px 16px rgba(232,100,10,0.3)'}}>
            <div style={{fontSize:'1.8rem',fontWeight:700,lineHeight:1}}>{streak}</div>
            <div style={{fontSize:'0.6rem',fontWeight:600,opacity:0.85,textTransform:'uppercase',letterSpacing:'0.06em',marginTop:'0.2rem'}}>🔥 Streak</div>
          </div>
        </div>

        <div style={{marginBottom:'1rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.4rem'}}>
            <span style={{fontSize:'0.75rem',fontWeight:600,color:'#999'}}>Today</span>
            <span style={{fontSize:'0.75rem',color:'#E8640A'}}>{done}/{total}</span>
          </div>
          <div style={{height:'5px',background:'#FFE8D0',borderRadius:'100px',overflow:'hidden'}}>
            <div style={{height:'100%',background:'linear-gradient(90deg,#E8640A,#C44D00)',borderRadius:'100px',width:String(total ? done/total*100 : 0) + '%',transition:'width 0.5s'}}></div>
          </div>
        </div>

        {allDone && (
          <div style={{background:'linear-gradient(135deg,#FFF8F2,#FFE8D0)',border:'1.5px solid #E8640A',borderRadius:'1rem',padding:'1rem',marginBottom:'1rem',textAlign:'center',cursor:'pointer'}} onClick={() => setShowShare(true)}>
            <div style={{fontSize:'1.4rem',fontWeight:700,color:'#E8640A'}}>🎉 Perfect Day!</div>
            <div style={{fontSize:'0.78rem',color:'#999',marginTop:'0.2rem'}}>All done — tap to share your streak!</div>
          </div>
        )}

        {S.habits.map((h, i) => (
          <div key={i} className={'hi' + (log[i] ? ' done' : '')} onClick={() => toggle(i)}>
            <div className="hbub">
              {log[i] ? <span style={{color:'white',fontSize:'1rem'}}>✓</span> : h.icon}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:'0.88rem',color:'#1C1008'}}>{h.name}</div>
              <div style={{fontSize:'0.7rem',color:'#999',marginTop:'0.1rem'}}>{getHabitStreak(i)}🔥 streak</div>
            </div>
            {log[i] && <div style={{fontSize:'0.68rem',fontWeight:600,color:'#E8640A',textTransform:'uppercase',letterSpacing:'0.05em'}}>Done ✓</div>}
          </div>
        ))}

        <div style={{background:'white',border:'1px solid rgba(232,100,10,0.15)',borderRadius:'1rem',padding:'1rem',textAlign:'center',marginTop:'0.4rem'}}>
          <div style={{fontSize:'0.68rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#999',marginBottom:'0.6rem'}}>Share Your Streak</div>
          <button className="btnp" onClick={() => setShowShare(true)} style={{marginTop:0}}>📤 Share Streak Card</button>
        </div>

        <div style={{textAlign:'center',marginTop:'1rem',paddingBottom:'2rem'}}>
          <button onClick={resetApp} style={{background:'none',border:'none',color:'#ccc',fontSize:'0.75rem',cursor:'pointer'}}>⚙ Reset Setup</button>
        </div>
      </div>
    </>
  )
}
