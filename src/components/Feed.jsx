import { useState, useMemo } from 'react'
import Card from './Card'

const TABS = ['Pour toi', 'Politique', 'Sport', 'Économie', 'Culture', 'Monde', 'Sciences']

export default function Feed({ articles, onSelect }) {
  const [activeTab, setActiveTab] = useState('Pour toi')

  const filtered = useMemo(() => {
    if (activeTab === 'Pour toi') return articles
    return articles.filter(a => a.categorie === activeTab)
  }, [articles, activeTab])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000' }}>
      {/* Tabs */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: 'flex',
        overflowX: 'auto',
        gap: 4,
        padding: '12px 12px 8px',
        scrollbarWidth: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeTab === tab ? 700 : 400,
              background: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.18)',
              color: activeTab === tab ? '#000' : '#fff',
              transition: 'all 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable cards */}
      <div style={{
        flex: 1,
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        scrollbarWidth: 'none',
      }}>
        {filtered.length === 0
          ? (
            <div style={{
              height: '100dvh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 16,
            }}>
              Aucune dépêche dans cette catégorie
            </div>
          )
          : filtered.map((article, i) => (
            <Card key={i} index={i} article={article} onSelect={onSelect} />
          ))
        }
      </div>
    </div>
  )
}
