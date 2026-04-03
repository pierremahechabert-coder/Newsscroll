import { useState } from 'react'

const ALL_INTERETS = [
  'Politique', 'Sport', 'Économie', 'Culture',
  'Monde', 'Sciences', 'Technologie', 'Environnement', 'Santé',
]

export default function Onboarding({ onComplete }) {
  const [step, setStep]         = useState(1)
  const [prenom, setPrenom]     = useState('')
  const [dob, setDob]           = useState('')
  const [interets, setInterets] = useState([])
  const [error, setError]       = useState('')

  function toggleInteret(i) {
    setInterets(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
    setError('')
  }

  function handleStep1() {
    if (!prenom.trim()) return setError('Entre ton prénom.')
    if (!dob) return setError('Entre ta date de naissance.')
    setError('')
    setStep(2)
  }

  function handleStep2() {
    if (interets.length < 3) return setError('Choisis au moins 3 centres d\'intérêt.')
    setError('')
    setStep(3)
  }

  function handleFinish() {
    onComplete({ prenom: prenom.trim(), dateNaissance: dob, interets })
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: '#f0f0f0' }}>
        <div style={{
          height: '100%',
          width: `${(step / 3) * 100}%`,
          background: '#111',
          transition: 'width 0.35s ease',
        }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 24px 32px' }}>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <StepLabel>Étape 1 sur 3</StepLabel>
            <h1 style={styles.h1}>Qui es-tu ?</h1>
            <p style={styles.sub}>Pour personnaliser ton feed d'actu.</p>

            <label style={styles.label}>Ton prénom</label>
            <input
              type="text"
              placeholder="ex. Marie"
              value={prenom}
              onChange={e => { setPrenom(e.target.value); setError('') }}
              style={styles.input}
              autoFocus
            />

            <label style={styles.label}>Date de naissance</label>
            <input
              type="date"
              value={dob}
              onChange={e => { setDob(e.target.value); setError('') }}
              style={styles.input}
              max={new Date().toISOString().slice(0, 10)}
            />

            {error && <p style={styles.error}>{error}</p>}
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <StepLabel>Étape 2 sur 3</StepLabel>
            <h1 style={styles.h1}>Tes centres d'intérêt</h1>
            <p style={styles.sub}>Choisis au moins 3 thèmes qui t'intéressent.</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
              {ALL_INTERETS.map(i => {
                const selected = interets.includes(i)
                return (
                  <button
                    key={i}
                    onClick={() => toggleInteret(i)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 24,
                      border: selected ? '2px solid #111' : '2px solid #e0e0e0',
                      background: selected ? '#111' : '#fafafa',
                      color: selected ? '#fff' : '#333',
                      fontSize: 14,
                      fontWeight: selected ? 700 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {i}
                  </button>
                )
              })}
            </div>

            <p style={{ marginTop: 16, fontSize: 13, color: '#aaa' }}>
              {interets.length} sélectionné{interets.length !== 1 ? 's' : ''} · minimum 3
            </p>
            {error && <p style={styles.error}>{error}</p>}
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
            <h1 style={{ ...styles.h1, fontSize: 28 }}>Ton feed est prêt,<br />{prenom} !</h1>
            <p style={{ ...styles.sub, marginTop: 8 }}>
              Tu suivras en priorité : {interets.slice(0, 3).join(', ')}{interets.length > 3 ? '…' : ''}
            </p>
            <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {interets.map(i => (
                <span key={i} style={{
                  background: '#f5f5f5', borderRadius: 20,
                  padding: '6px 14px', fontSize: 13, color: '#555',
                }}>
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA button */}
      <div style={{ padding: '16px 24px 32px' }}>
        <button
          onClick={step === 1 ? handleStep1 : step === 2 ? handleStep2 : handleFinish}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 16, border: 'none',
            background: '#111', color: '#fff',
            fontSize: 16, fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {step === 3 ? 'Commencer →' : 'Continuer →'}
        </button>
      </div>
    </div>
  )
}

function StepLabel({ children }) {
  return (
    <p style={{ fontSize: 12, fontWeight: 600, color: '#bbb', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>
      {children}
    </p>
  )
}

const styles = {
  h1: { fontSize: 32, fontWeight: 800, color: '#111', lineHeight: 1.15, margin: '0 0 8px' },
  sub: { fontSize: 15, color: '#888', margin: 0 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginTop: 24, marginBottom: 8 },
  input: {
    width: '100%', padding: '14px 16px',
    borderRadius: 12, border: '2px solid #e8e8e8',
    fontSize: 16, color: '#111', background: '#fafafa',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  error: { marginTop: 10, fontSize: 13, color: '#c62828', fontWeight: 500 },
}
