import { useState } from 'react'
import Feed from './components/Feed'
import Detail from './components/Detail'
import SubthemePage from './components/SubthemePage'
import Profile from './components/Profile'
import Onboarding from './components/Onboarding'
import depeches from './depeches_reformatees.json'

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}

function computeStreak(stored) {
  const today = new Date().toISOString().slice(0, 10)
  if (!stored) return { count: 1, lastVisit: today }
  if (stored.lastVisit === today) return stored
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  return stored.lastVisit === yesterday
    ? { count: stored.count + 1, lastVisit: today }
    : { count: 1, lastVisit: today }
}

export default function App() {
  const [profile, setProfile] = useState(() => loadJSON('ns_profile', null))
  const [saved, setSaved]     = useState(() => loadJSON('ns_saved', []))
  const [streak]              = useState(() => {
    const updated = computeStreak(loadJSON('ns_streak', null))
    localStorage.setItem('ns_streak', JSON.stringify(updated))
    return updated
  })

  const [view, setView]                   = useState('feed')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [selectedTag, setSelectedTag]     = useState(null)
  const [remaining, setRemaining]         = useState(4)

  function saveProfile(p) {
    setProfile(p)
    localStorage.setItem('ns_profile', JSON.stringify(p))
  }

  function toggleSave(article) {
    setSaved(prev => {
      const exists = prev.some(a => a.titre === article.titre)
      const next = exists ? prev.filter(a => a.titre !== article.titre) : [...prev, article]
      localStorage.setItem('ns_saved', JSON.stringify(next))
      return next
    })
  }

  function openDetail(article) {
    setSelectedArticle(article)
    setRemaining(r => Math.max(0, r - 1))
    setView('detail')
  }

  function openSubtheme(tag) {
    setSelectedTag(tag)
    setView('subtheme')
  }

  function logout() {
    localStorage.clear()
    setProfile(null)
    setSaved([])
    setView('feed')
  }

  // "Pour toi" : articles des catégories choisies en premier
  const sortedArticles = profile?.interets?.length
    ? [...depeches].sort((a, b) => {
        const aIn = profile.interets.includes(a.categorie) ? 0 : 1
        const bIn = profile.interets.includes(b.categorie) ? 0 : 1
        return aIn - bIn
      })
    : depeches

  if (!profile) {
    return (
      <div style={{ maxWidth: 430, margin: '0 auto', height: '100dvh', overflow: 'hidden', background: '#fff' }}>
        <Onboarding onComplete={saveProfile} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', height: '100dvh', overflow: 'hidden', position: 'relative', background: '#000' }}>
      {view === 'feed' && (
        <Feed
          articles={sortedArticles}
          onSelect={openDetail}
          onSwipeRight={openSubtheme}
          onProfile={() => setView('profile')}
          saved={saved}
          onToggleSave={toggleSave}
        />
      )}
      {view === 'detail' && (
        <Detail
          article={selectedArticle}
          onBack={() => setView('feed')}
          remaining={remaining}
        />
      )}
      {view === 'subtheme' && (
        <SubthemePage
          tag={selectedTag}
          articles={depeches}
          onSelect={openDetail}
          onBack={() => setView('feed')}
        />
      )}
      {view === 'profile' && (
        <Profile
          profile={profile}
          saved={saved}
          streak={streak.count}
          onBack={() => setView('feed')}
          onLogout={logout}
          onUpdateInterets={interets => saveProfile({ ...profile, interets })}
          onSelectArticle={openDetail}
        />
      )}
    </div>
  )
}
