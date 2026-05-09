'use client'
import { useState, useEffect } from 'react'

const PKEY = 'opstreak_data'
const IDENTITIES = {
  athlete: { label: 'Athlete', icon: '🏃', desc: 'Peak physical excellence', color: '#E8640A' },
  entrepreneur: { label: 'Entrepreneur', icon: '🚀', desc: 'Building something that matters', color: '#E8640A' },
  artist: { label: 'Artist', icon: '🎨', desc: 'Creating what the world needs', color: '#E879F9' },
  warrior: { label: 'Warrior', icon: '⚔️', desc: 'Discipline above everything', color: '#E8640A' },
  scholar: { label: 'Scholar', icon: '🧠', desc: 'Knowledge as a superpower', color: '#378ADD' },
  healer: { label: 'Healer', icon: '⚕️', desc: 'Precision, care, mastery', color: '#1D9E75' },
  creator: { label: 'Creator', icon: '✍️', desc: 'Words and ideas that move people', color: '#E8640A' },
  leader: { label: 'Leader', icon: '🦅', desc: 'Building people, not just things', color: '#E8640A' },
}

const O = '#E8640A'
const s = (obj) => Object.assign({}, obj)

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

export default function App() {
  const [page, setPage] = useState('loading')
  const [S, setS] = useState(null)
  const [obStep, setObStep] = useState(1)
  const [obName, setObName] = useState('')
  const [obAlias, setObAlias] = useState('')
  const [obIdentity, setObIdentity] = useState('athlete')
  const [obGoal, setObGoal] = useState('')
  const [obDay, setObDay] = useState('')
  const [obHabits, setObHabits] = useState([])
  const [editHabit, setEditHabit] = useState(null)
  const [showShare, setShowShare] = useState(false)

  useEffect(() => {
    const saved = load()
    if (saved && saved.habits && saved.habits.length > 0) {
      if (!saved.log) saved.log = {}
      if (!saved.log[dk()]) saved.log[dk()] = saved.habits.map(() => false)
      setS(saved)
      setPage('today')
    } else {
      setPage('onboard')
    }
  }, [])

  function update(newS) { save(newS); setS({...newS}) }

  function toggle(i) {
    const newS = {...S, log: {...S.log, [dk()]: [...(S.log[dk()] || [])]}}
    newS.log[dk()][i] = !newS.log[dk()][i]
    update(newS)
  }

  function getDN() {
    const keys = Object.keys((S||{}).log || {}).sort()
    return ((S||{}).startDay || 1) + Math.max(0, keys.length - 1)
  }

  function getStreak() {
    const keys = Object.keys((S||{}).log || {}).sort()
    let s = 0
    for (let i = keys.length-1; i >= 0; i--) {
      if (S.log[keys[i]] && S.log[keys[i]].some(Boolean)) s++
      else break
    }
    return s
  }

  const CSS = `
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
    body{background:#FFF8F2;font-family:'DM Sans',sans-serif;min-height:100vh}
    input,textarea,button{font-family:'DM Sans',sans-serif}
    .btn-p{background:${O};color:white;border:none;border-radius:100px;padding:0.75rem 1.5rem;font-weight:600;font-size:0.9rem;cursor:pointer;width:100%;margin-top:0.5rem}
    .btn-g{background:transparent;color:${O};border:1.5px solid ${O};border-radius:100px;padding:0.75rem 1.5rem;font-weight:600;font-size:0.9rem;cursor:pointer;width:100%;margin-top:0.5rem}
    .inp{width:100%;padding:0.8rem 1rem;border-radius:0.8rem;border:1.5px solid rgba(232,100,10,0.2);font-size:0.95rem;outline:none;background:#FFF8F2;color:#1C1008;margin-bottom:0.6rem}
    .card{background:white;border:1px solid rgba(232,100,10,0.15);border-radius:1.2rem;padding:1.2rem;margin-bottom:0.8rem}
    .page{max-width:560px;margin:0 auto;padding:1.2rem;min-height:100vh}
    .hi{background:white;border:1px solid rgba(28,16,8,0.08);border-radius:1rem;padding:0.9rem 1rem;display:flex;align-items:center;gap:0.8rem;cursor:pointer;margin-bottom:0.6rem;transition:all 0.2s}
    .hi.done{border-color:${O};background:#FFF5EA}
    .hbub{width:44px;height:44px;border-radius:50%;background:#FFE8D0;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;transition:all 0.3s}
    .hi.done .hbub{background:${O};box-shadow:0 0 14px rgba(232,100,10,0.4)}
    .id-card{border:1.5px solid rgba(28,16,8,0.08);border-radius:1rem;padding:1rem;cursor:pointer;transition:all 0.2s;background:white}
    .id-card.on{border-color:${O};background:#FFF5EA}
    .dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.2);flex-shrink:0}
    .dot.done{background:${O}}
  `

  // ── LOADING ──
  if (page === 'loading') return (
    <>
      <style>{CSS}</style>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#FFF8F2'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2.5rem',fontWeight:700,color:O}}>OpStreak</div>
          <div style={{fontSize:'0.85rem',color:'#999',marginTop:'0.3rem'}}>Loading...</div>
        </div>
      </div>
    </>
  )

  // ── ONBOARDING ──
  if (page === 'onboard') {
    const suggestedHabits = {
      athlete: [{name:'Morning workout / run',icon:
