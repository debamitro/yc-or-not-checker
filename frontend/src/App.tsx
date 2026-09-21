import { useState, useEffect } from 'react'
import './App.css'
import { getApiUrl } from './api'

type Verdict = 'yes' | 'no' | 'maybe'

interface CheckIdeaResponse {
  verdict: Verdict
  confidence: number
  probabilities: Record<string, number>
}

function App() {
  const [idea, setIdea] = useState('')
  const [batch, setBatch] = useState('')
  const [batches, setBatches] = useState<string[]>([])
  const [result, setResult] = useState<CheckIdeaResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(getApiUrl('/api/batches'))
      .then(res => res.json())
      .then(data => {
        setBatches(data.batches)
        if (data.batches.length > 0) {
          setBatch(data.batches[0])
        }
      })
      .catch(err => console.error('Failed to fetch batches:', err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(getApiUrl('/api/check_idea'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, batch }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const verdictEmoji: Record<Verdict, string> = {
    yes: '✅',
    no: '❌',
    maybe: '🤔',
  }

  const verdictLabel: Record<Verdict, string> = {
    yes: 'Yes',
    no: 'No',
    maybe: 'Maybe',
  }

  return (
    <div className="app">
      <header className="header">
        <h1>YC Idea Checker</h1>
        <p className="subtitle">Would your startup idea have made it into a YC batch?</p>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="idea">Your startup idea</label>
          <textarea
            id="idea"
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="e.g. AI-powered legal research assistant that helps lawyers find relevant case law in seconds"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="field">
          <label htmlFor="batch">YC Batch</label>
          <select
            id="batch"
            value={batch}
            onChange={e => setBatch(e.target.value)}
            disabled={loading}
          >
            {batches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={loading || !idea.trim()}>
          {loading ? 'Checking…' : 'Check My Idea'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className={`result result--${result.verdict}`}>
          <div className="verdict">
            <span className="verdict-emoji">{verdictEmoji[result.verdict]}</span>
            <span className="verdict-text">{verdictLabel[result.verdict]}</span>
          </div>
          <div className="confidence">
            Confidence: {Math.round(result.confidence * 100)}%
          </div>
          <div className="probabilities">
            {Object.entries(result.probabilities).map(([key, prob]) => (
              <div key={key} className="prob-row">
                <span className="prob-label">{verdictEmoji[key as Verdict]} {key}</span>
                <div className="prob-bar-container">
                  <div
                    className="prob-bar"
                    style={{ width: `${prob * 100}%` }}
                  />
                </div>
                <span className="prob-value">{Math.round(prob * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App

