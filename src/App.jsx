import { useState } from 'react'
import Feed from './components/Feed'
import Detail from './components/Detail'
import depeches from './depeches_reformatees.json'

export default function App() {
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [remaining, setRemaining] = useState(4)

  function openDetail(article) {
    setSelectedArticle(article)
    setRemaining(r => Math.max(0, r - 1))
  }

  function closeDetail() {
    setSelectedArticle(null)
  }

  return (
    <div style={{
      maxWidth: 430,
      margin: '0 auto',
      height: '100dvh',
      overflow: 'hidden',
      position: 'relative',
      background: '#000',
    }}>
      {selectedArticle
        ? <Detail article={selectedArticle} onBack={closeDetail} remaining={remaining} />
        : <Feed articles={depeches} onSelect={openDetail} />
      }
    </div>
  )
}
