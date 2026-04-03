import { useState } from 'react'

const CATEGORY_GRADIENTS = {
  Politique: 'linear-gradient(135deg, #1a237e 0%, #283593 40%, #1565c0 100%)',
  Sport:     'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)',
  Économie:  'linear-gradient(135deg, #b71c1c 0%, #c62828 40%, #d32f2f 100%)',
  Culture:   'linear-gradient(135deg, #4a148c 0%, #6a1b9a 40%, #7b1fa2 100%)',
  Monde:     'linear-gradient(135deg, #e65100 0%, #ef6c00 40%, #f57c00 100%)',
  Sciences:  'linear-gradient(135deg, #006064 0%, #00838f 40%, #0097a7 100%)',
}

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #212121 0%, #424242 100%)'

function getPhotoUrl(categorie, index) {
  const seed = `${(categorie || 'news').toLowerCase()}-${index}`
  return `https://picsum.photos/seed/${seed}/800/1200`
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Card({ article, index, onSelect }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [imgError, setImgError] = useState(false)
  const fallbackGradient = CATEGORY_GRADIENTS[article.categorie] || DEFAULT_GRADIENT
  const photoUrl = getPhotoUrl(article.categorie, index)

  return (
    <div
      style={{
        height: '100dvh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        position: 'relative',
        background: fallbackGradient,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      onClick={() => onSelect(article)}
    >
      {/* Background photo */}
      {!imgError && (
        <img
          src={photoUrl}
          alt=""
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Gradient overlay: transparent top → black bottom */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.15) 70%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Category badge */}
      <div style={{
        position: 'absolute', top: 60, left: 16,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 20,
        padding: '4px 12px',
        fontSize: 12,
        fontWeight: 600,
        color: '#fff',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      }}>
        {article.categorie}
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', padding: '0 16px 100px' }}>
        {/* Source + date */}
        <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>AFP</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>·</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            {formatDate(article.date)}
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 24,
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.2,
          letterSpacing: '-0.3px',
          textTransform: 'uppercase',
          marginBottom: 16,
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          {article.titre}
        </h2>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(article.tags || []).map((tag, i) => (
            <span key={i} style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 20,
              padding: '4px 10px',
              fontSize: 12,
              color: 'rgba(255,255,255,0.85)',
            }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right action bar */}
      <div
        style={{
          position: 'absolute',
          right: 12,
          bottom: 110,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          alignItems: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        <ActionBtn
          icon={liked ? '❤️' : '🤍'}
          label="12k"
          onClick={() => setLiked(v => !v)}
        />
        <ActionBtn icon="💬" label="348" onClick={() => {}} />
        <ActionBtn icon="↗️" label="Partager" onClick={() => {}} />
        <ActionBtn
          icon={bookmarked ? '🔖' : '🏷️'}
          label="Sauv."
          onClick={() => setBookmarked(v => !v)}
        />
      </div>

      {/* Streak badge */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 12,
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: '5px 12px',
        fontSize: 13,
        fontWeight: 700,
        color: '#fff',
      }}>
        🔥 12j
      </div>

      {/* Scroll hint on first card */}
      <div style={{
        position: 'absolute',
        bottom: 22,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.35)',
        fontSize: 11,
        letterSpacing: '0.5px',
      }}>
        ↓ swipe
      </div>
    </div>
  )
}

function ActionBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: 0,
      }}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{label}</span>
    </button>
  )
}
