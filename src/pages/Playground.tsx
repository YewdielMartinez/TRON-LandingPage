import { useState, useCallback } from 'react'
import { loon, type LoonMode } from 'loon-core'
import { useLanguage } from '../hooks/useLanguage'
import { PLAYGROUND_DATA } from '../data/translations'

const EXAMPLE = `[
  { "id": 1001, "name": "Alice", "role": "admin", "active": true },
  { "id": 1002, "name": "Bob", "role": "user", "active": true },
  { "id": 1003, "name": "Cara", "role": "user", "active": false },
  { "id": 1004, "name": "Dan", "role": "editor", "active": true },
  { "id": 1005, "name": "Eve", "role": "user", "active": false },
  { "id": 1006, "name": "Finn", "role": "user", "active": true }
]`

const MODES: LoonMode[] = ['full', 'llm', 'compact']

// Estimación de tokens ~ chars/4 (heurística estándar para EN/JSON).
const estTokens = (s: string) => Math.max(1, Math.round(s.length / 4))

export function Playground() {
  const { lang } = useLanguage()
  const content = PLAYGROUND_DATA[lang]

  const [input, setInput] = useState(EXAMPLE)
  const [mode, setMode] = useState<LoonMode>('full')
  const [output, setOutput] = useState('')
  const [savings, setSavings] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback((src: string, m: LoonMode) => {
    try {
      const parsed = JSON.parse(src)
      const arr = Array.isArray(parsed) ? parsed : [parsed]
      const encoded = loon.toLOON(arr, { mode: m })
      const jsonMin = JSON.stringify(parsed)
      const pct = Math.round((1 - estTokens(encoded) / estTokens(jsonMin)) * 100)
      setOutput(encoded)
      setSavings(pct)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setOutput('')
      setSavings(null)
    }
  }, [])

  const onExecute = () => run(input, mode)
  const onMode = (m: LoonMode) => { setMode(m); if (output || error) run(input, m) }
  const onReset = () => { setInput(EXAMPLE); setOutput(''); setSavings(null); setError(null) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 56px)', padding: 24, gap: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg)', marginBottom: 4 }}>
            {content.title}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>{content.subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Selector de modo */}
          <div style={{ display: 'flex', gap: 4, border: '1px solid var(--border)', borderRadius: 8, padding: 2 }}>
            {MODES.map(m => (
              <button
                key={m}
                onClick={() => onMode(m)}
                style={{
                  padding: '6px 12px', fontSize: 12, borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit',
                  backgroundColor: mode === m ? 'var(--fg)' : 'transparent',
                  color: mode === m ? 'var(--bg)' : 'var(--muted)',
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }} onClick={onReset}>{content.btnReset}</button>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={onExecute}>{content.btnExec}</button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, gap: 24, flexWrap: 'wrap' }}>
        {/* Input Pane */}
        <section style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'var(--hover-bg)', padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 500, color: 'var(--fg)' }}>
            {content.inputTitle}
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            spellCheck={false}
            style={{ flex: 1, minHeight: 320, padding: 16, backgroundColor: 'var(--bg)', color: 'var(--fg)', border: 'none', resize: 'none', fontFamily: 'monospace', fontSize: 13, outline: 'none' }}
          />
          {error && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', backgroundColor: 'rgba(220,38,38,0.08)', color: '#dc2626', fontSize: 12, fontFamily: 'monospace' }}>
              {content.errorLabel}: {error}
            </div>
          )}
        </section>

        {/* Output Pane */}
        <section style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'var(--hover-bg)', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg)' }}>{content.outputTitle}</span>
            {savings !== null && (
              <span style={{ fontSize: 11, color: 'var(--fg)', backgroundColor: 'var(--border)', padding: '2px 8px', borderRadius: 999 }}>
                {savings >= 0 ? '-' : '+'}{Math.abs(savings)}% {content.savedBadge}
              </span>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder={content.outputPlaceholder}
            style={{ flex: 1, minHeight: 320, padding: 16, backgroundColor: 'var(--bg)', color: 'var(--fg)', border: 'none', resize: 'none', fontFamily: 'monospace', fontSize: 13, outline: 'none' }}
          />
        </section>
      </div>
    </div>
  )
}
