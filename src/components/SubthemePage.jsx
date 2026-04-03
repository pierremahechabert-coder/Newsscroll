import { useRef } from 'react'

const CATEGORY_COLORS = {
  Politique: '#1565c0', Sport: '#2e7d32', Économie: '#c62828',
  Culture: '#6a1b9a', Monde: '#ef6c00', Sciences: '#00838f',
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export default function SubthemePage({ tag, articles, onSelect, onBack }) {
  const filtered = articles.filter(a => (a.tags || []).includes(tag))

  // Swipe left to go back
  const touchStart = useRef(null)

  function onTouchStart(e) {
    touchStart.current = e.touches[0].clientX
  }
  function onTouchEnd(e) {
    if (!touchStart.current) return
    const dx = touchStart.current - e.changedTouches[0].clientX
    touchStart.current = null
    if (dx > 60) onBack()
  }

  return (
    <div
      style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#fff' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0,
        background: '#fff', borderBottom: '1px solid #f0f0f0',
        padding: '14px 16px 12px',
        display: 'flex', alignItems: 'center', gap: 12,
        zIndex: 10,
      }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#000', padding: '4px 8px 4px 0' }}
          aria-label="Retour"
        >
          ←
        </button>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>
            Sous-thème
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0 }}>
            #{tag}
          </h2>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#bbb', fontWeight: 500 }}>
          {filtered.length} article{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Swipe hint */}
      <div style={{ padding: '8px 16px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: '#ccc' }}>← Swipe gauche pour revenir</span>
      </div>

      {/* Article list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 32px' }}>
        {filtered.length === 0
          ? (
            <div style={{ textAlign: 'center', marginTop: 80, color: '#bbb', fontSize: 15 }}>
              Aucun article sur ce sous-thème.
            </div>
          )
          : filtered.map((article, i) => (
            <MiniCard key={i} article={article} onSelect={onSelect} />
          ))
        }
      </div>
    </div>
  )
}

function MiniCard({ article, onSelect }) {
  const color = CATEGORY_COLORS[article.categorie] || '#666'
  return (
    <div
      onClick={() => onSelect(article)}
      style={{
        background: '#fafafa', border: '1px solid #f0f0f0',
        borderRadius: 16, padding: '16px',
        marginBottom: 12, cursor: 'pointer',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
      onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          background: color, color: '#fff',
          borderRadius: 10, padding: '2px 10px',
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          {article.categorie}
        </span>
        <span style={{ fontSize: 11, color: '#bbb' }}>{formatDate(article.date)}</span>
      </div>
      <h3 style={{
        fontSize: 15, fontWeight: 700, color: '#111',
        lineHeight: 1.3, margin: '0 0 8px',
        textTransform: 'uppercase',
      }}>
        {article.titre}
      </h3>
      <p style={{ fontSize: 13, color: '#777', lineHeight: 1.5, margin: '0 0 10px',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {article.resume_ia}
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(article.tags || []).map((tag, i) => (
          <span key={i} style={{
            background: '#efefef', borderRadius: 10,
            padding: '3px 9px', fontSize: 11, color: '#555',
          }}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}
