const CATEGORY_COLORS = {
  Politique: '#1565c0',
  Sport:     '#2e7d32',
  Économie:  '#c62828',
  Culture:   '#6a1b9a',
  Monde:     '#ef6c00',
  Sciences:  '#00838f',
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Detail({ article, onBack, remaining }) {
  const color = CATEGORY_COLORS[article.categorie] || '#333'

  return (
    <div style={{
      height: '100dvh',
      overflowY: 'auto',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 22,
            padding: '4px 8px 4px 0',
            color: '#000',
          }}
          aria-label="Retour"
        >
          ←
        </button>

        {/* Remaining counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: remaining === 0 ? '#fce4ec' : '#f5f5f5',
          borderRadius: 20,
          padding: '5px 12px',
          fontSize: 13,
          fontWeight: 600,
          color: remaining === 0 ? '#c62828' : '#555',
        }}>
          <span>{remaining === 0 ? '🔒' : '📖'}</span>
          <span>{remaining} résumé{remaining !== 1 ? 's' : ''} restant{remaining !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 20px 40px', flex: 1 }}>
        {/* Category chip */}
        <div style={{
          display: 'inline-block',
          background: color,
          borderRadius: 20,
          padding: '4px 12px',
          fontSize: 11,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          {article.categorie}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#111',
          lineHeight: 1.25,
          letterSpacing: '-0.3px',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          {article.titre}
        </h1>

        {/* Source badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#f0f7ff',
            border: '1px solid #bbdefb',
            borderRadius: 20,
            padding: '5px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: '#1565c0',
          }}>
            <span>✓</span>
            <span>Source vérifiée · AFP</span>
          </div>
          <span style={{ fontSize: 12, color: '#999' }}>{formatDate(article.date)}</span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#f0f0f0', marginBottom: 20 }} />

        {/* Resume IA label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#999',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}>Résumé IA</span>
          <div style={{
            flex: 1, height: 1, background: '#f0f0f0',
          }} />
          <span style={{
            fontSize: 10,
            background: '#f5f5f5',
            borderRadius: 10,
            padding: '2px 8px',
            color: '#aaa',
            fontWeight: 600,
          }}>claude-sonnet</span>
        </div>

        {/* Summary text */}
        <p style={{
          fontSize: 16,
          lineHeight: 1.7,
          color: '#222',
          marginBottom: 28,
        }}>
          {article.resume_ia}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: '#f0f0f0', marginBottom: 20 }} />

        {/* Tags */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#999',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 10,
          }}>Sous-thèmes</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(article.tags || []).map((tag, i) => (
              <button
                key={i}
                style={{
                  background: '#f5f5f5',
                  border: '1px solid #e8e8e8',
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontSize: 13,
                  color: '#333',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
