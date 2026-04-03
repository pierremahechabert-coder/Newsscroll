import { useRef, useState } from 'react'

const CATEGORY_GRADIENTS = {
  Politique: 'linear-gradient(135deg, #1a237e 0%, #283593 40%, #1565c0 100%)',
  Sport:     'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)',
  Économie:  'linear-gradient(135deg, #b71c1c 0%, #c62828 40%, #d32f2f 100%)',
  Culture:   'linear-gradient(135deg, #4a148c 0%, #6a1b9a 40%, #7b1fa2 100%)',
  Monde:     'linear-gradient(135deg, #e65100 0%, #ef6c00 40%, #f57c00 100%)',
  Sciences:  'linear-gradient(135deg, #006064 0%, #00838f 40%, #0097a7 100%)',
}
const DEFAULT_GRADIENT = 'linear-gradient(135deg, #212121 0%, #424242 100%)'

const SWIPE_THRESHOLD = 60

function getPhotoUrl(article, index) {
  if (article.image) return article.image
  const seed = `${(article.categorie || 'news').toLowerCase()}-${index}`
  return `https://picsum.photos/seed/${seed}/800/1200`
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Card({ article, index, onSelect, onSwipeRight, isSaved, onToggleSave }) {
  const [imgError, setImgError] = useState(false)
  const [liked, setLiked]       = useState(false)
  const [swipeDx, setSwipeDx]   = useState(0)
  const [swiping, setSwiping]   = useState(false)

  const touchStart   = useRef(null)
  const swipeFired   = useRef(false)   // prevent click firing after swipe

  const fallbackGradient = CATEGORY_GRADIENTS[article.categorie] || DEFAULT_GRADIENT
  const photoUrl         = getPhotoUrl(article, index)
  const sousThem         = article.sous_theme

  /* ── touch handlers ───────────────────────────────────────────── */
  function handleTouchStart(e) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    swipeFired.current = false
    setSwipeDx(0)
    setSwiping(false)
  }

  function handleTouchMove(e) {
    if (!touchStart.current) return
    const dx = e.touches[0].clientX - touchStart.current.x
    const dy = e.touches[0].clientY - touchStart.current.y
    if (Math.abs(dx) > Math.abs(dy) && dx > 8) {
      setSwiping(true)
      setSwipeDx(Math.min(dx, 130))
    } else if (Math.abs(dy) > 10) {
      // vertical scroll dominates — cancel swipe tracking
      touchStart.current = null
      setSwiping(false)
      setSwipeDx(0)
    }
  }

  function handleTouchEnd(e) {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    setSwiping(false)
    setSwipeDx(0)

    if (dx > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) && sousThem) {
      swipeFired.current = true
      onSwipeRight(sousThem)
    }
  }

  function handleClick() {
    if (swipeFired.current) { swipeFired.current = false; return }
    onSelect(article)
  }

  /* ── render ───────────────────────────────────────────────────── */
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
        touchAction: 'pan-y',
        transform: swiping ? `translateX(${swipeDx * 0.28}px)` : 'translateX(0)',
        transition: swiping ? 'none' : 'transform 0.2s ease',
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background photo */}
      {!imgError && (
        <img
          src={photoUrl}
          alt=""
          onError={() => setImgError(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Dark gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.15) 70%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Swipe-right preview badge */}
      {swiping && sousThem && (
        <div style={{
          position: 'absolute', top: '50%', right: 20,
          transform: 'translateY(-50%)',
          background: '#fff',
          borderRadius: 14,
          padding: '10px 16px',
          fontSize: 13, fontWeight: 700, color: '#111',
          opacity: Math.min(swipeDx / SWIPE_THRESHOLD, 1),
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          {sousThem} →
        </div>
      )}

      {/* Category badge */}
      <div style={{
        position: 'absolute', top: 60, left: 16,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 20, padding: '4px 12px',
        fontSize: 12, fontWeight: 600, color: '#fff',
        letterSpacing: '0.5px', textTransform: 'uppercase',
      }}>
        {article.categorie}
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', padding: '0 70px 16px 16px' }}>
        {/* Source + date */}
        <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', textTransform: 'uppercase' }}>AFP</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>·</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{formatDate(article.date)}</span>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 24, fontWeight: 800, color: '#fff',
          lineHeight: 1.2, letterSpacing: '-0.3px',
          textTransform: 'uppercase', marginBottom: 14,
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          {article.titre}
        </h2>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {(article.tags || []).map((tag, i) => (
            <span key={i} style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 20, padding: '4px 10px',
              fontSize: 12, color: 'rgba(255,255,255,0.85)',
            }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* "Voir le thème" button — desktop fallback + visible hint */}
        {sousThem && (
          <button
            onClick={e => { e.stopPropagation(); onSwipeRight(sousThem) }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 20, padding: '6px 14px',
              fontSize: 12, fontWeight: 600, color: '#fff',
              cursor: 'pointer',
            }}
          >
            <span>{sousThem}</span>
            <span style={{ fontSize: 10 }}>→</span>
          </button>
        )}
      </div>

      {/* Right action bar */}
      <div
        style={{
          position: 'absolute', right: 12, bottom: 100,
          display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        <ActionBtn icon={liked ? '❤️' : '🤍'} label="12k" onClick={() => setLiked(v => !v)} />
        <ActionBtn icon="💬" label="348" onClick={() => {}} />
        <ActionBtn icon="↗️" label="Partager" onClick={() => {}} />
        <ActionBtn icon={isSaved ? '🔖' : '🏷️'} label="Sauv." onClick={() => onToggleSave(article)} />
      </div>

      {/* Streak badge */}
      <div style={{
        position: 'absolute', bottom: 16, right: 12,
        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 20, padding: '5px 12px',
        fontSize: 13, fontWeight: 700, color: '#fff',
      }}>
        🔥 12j
      </div>

      <div style={{
        position: 'absolute', bottom: 20, left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
      }}>
        ↓ swipe
      </div>
    </div>
  )
}

function ActionBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: 0,
    }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{label}</span>
    </button>
  )
}
