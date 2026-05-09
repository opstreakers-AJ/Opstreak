'use client'
import { useState, useEffect } from 'react'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) return null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#FFF8F2',
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{color: '#E8640A', fontSize: '3rem', fontWeight: 800}}>
          OpStreak
        </h1>
        <p style={{color: '#666', marginTop: '0.5rem'}}>
          Build your streak. Show up every day.
        </p>
        <p style={{color: '#E8640A', marginTop: '1rem', fontSize: '0.9rem'}}>
          🚀 App loading soon...
        </p>
      </div>
    </div>
  )
}
