import { useState } from 'react'

const ALL_INTERETS = [
  'Politique', 'Sport', 'Économie', 'Culture',
  'Monde', 'Sciences', 'Technologie', 'Environnement', 'Santé',
]

const CATEGORY_COLORS = {
  Politique: '#1565c0', Sport: '#2e7d32', Économie: '#c62828',
  Culture: '#6a1b9a', Monde: '#ef6c00', Sciences: '#00838f',
}

function calcAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Profile({ profile, saved, streak, onBack, onLogout, onUpdateInterets, onSelectArticle }) {
  const [editingInterets, setEditingInterets] = useState(false)
  const [tempInterets, setTempInterets]       = useState(profile.interets || [])
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const age = calcAge(profile.dateNaissance)

  function toggleInteret(i) {
    setTempInterets(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
  }

  function saveInterets() {
    if (tempInterets.length < 3) return
    onUpdateInterets(tempInterets)
    setEditingInterets(false)
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0,
        background: '#fff', borderBottom: '1px solid #f0f0f0',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12, zIndex: 10,
      }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#000', padding: '4px 8px 4px 0' }}
        >
          ←
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: 0 }}>Mon profil</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 40px' }}>
        {/* Identity card */}
        <div style={{ background: '#111', padding: '28px 20px 24px', textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: '3px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 14px',
          }}>
            👤
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
            {profile.prenom}
          </h2>
          {age !== null && (
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              {age} ans · membre depuis aujourd'hui
            </p>
          )}
          {/* Streak */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20, padding: '6px 16px', marginTop: 16,
          }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
              {streak} jour{streak !== 1 ? 's' : ''} de streak
            </span>
          </div>
        </div>

        {/* Interests */}
        <Section
          title="Centres d'intérêt"
          action={editingInterets ? null : { label: 'Modifier', onClick: () => { setTempInterets(profile.interets); setEditingInterets(true) } }}
        >
          {editingInterets ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {ALL_INTERETS.map(i => {
                  const sel = tempInterets.includes(i)
                  return (
                    <button key={i} onClick={() => toggleInteret(i)} style={{
                      padding: '8px 16px', borderRadius: 20,
                      border: sel ? '2px solid #111' : '2px solid #e0e0e0',
                      background: sel ? '#111' : '#fafafa',
                      color: sel ? '#fff' : '#333',
                      fontSize: 13, fontWeight: sel ? 700 : 400,
                      cursor: 'pointer',
                    }}>
                      {i}
                    </button>
                  )
                })}
              </div>
              {tempInterets.length < 3 && (
                <p style={{ fontSize: 12, color: '#c62828', margin: '0 0 10px' }}>Minimum 3 centres d'intérêt</p>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={saveInterets} style={{
                  flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                  background: '#111', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>
                  Sauvegarder
                </button>
                <button onClick={() => setEditingInterets(false)} style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  border: '2px solid #e0e0e0', background: '#fff',
                  color: '#333', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>
                  Annuler
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(profile.interets || []).map(i => (
                <span key={i} style={{
                  background: '#f5f5f5', borderRadius: 20,
                  padding: '6px 14px', fontSize: 13, color: '#333',
                }}>
                  {i}
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* Saved articles */}
        <Section title={`Articles sauvegardés (${saved.length})`}>
          {saved.length === 0
            ? <p style={{ fontSize: 14, color: '#bbb', margin: 0 }}>Aucun article sauvegardé pour l'instant.</p>
            : saved.map((article, i) => (
              <div
                key={i}
                onClick={() => onSelectArticle(article)}
                style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '12px 0', borderBottom: '1px solid #f5f5f5',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: CATEGORY_COLORS[article.categorie] || '#999',
                  marginTop: 6,
                }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: '0 0 3px', textTransform: 'uppercase', lineHeight: 1.3 }}>
                    {article.titre}
                  </p>
                  <p style={{ fontSize: 11, color: '#bbb', margin: 0 }}>
                    {article.categorie} · {formatDate(article.date)}
                  </p>
                </div>
              </div>
            ))
          }
        </Section>

        {/* Logout */}
        <div style={{ padding: '0 16px' }}>
          {showLogoutConfirm
            ? (
              <div style={{ background: '#fff5f5', border: '1px solid #ffcdd2', borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 14, color: '#c62828', fontWeight: 600, margin: '0 0 12px' }}>
                  Supprimer ton profil et tes données ?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={onLogout} style={{
                    flex: 1, padding: '11px', borderRadius: 10, border: 'none',
                    background: '#c62828', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  }}>
                    Confirmer
                  </button>
                  <button onClick={() => setShowLogoutConfirm(false)} style={{
                    flex: 1, padding: '11px', borderRadius: 10,
                    border: '2px solid #e0e0e0', background: '#fff',
                    color: '#333', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}>
                    Annuler
                  </button>
                </div>
              </div>
            )
            : (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  border: '2px solid #ffcdd2', background: '#fff',
                  color: '#c62828', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Se déconnecter
              </button>
            )
          }
        </div>
      </div>
    </div>
  )
}

function Section({ title, children, action }) {
  return (
    <div style={{ padding: '20px 16px 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>{title}</h3>
        {action && (
          <button onClick={action.onClick} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, color: '#555',
            textDecoration: 'underline', padding: 0,
          }}>
            {action.label}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
