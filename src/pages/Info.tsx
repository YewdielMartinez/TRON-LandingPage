import { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { INFO_DATA } from '../data/info'
import { COMMONS } from '../data/translations'

const codeBlockStyle: React.CSSProperties = {
  background: '#0d0d0d',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  padding: '16px 20px',
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace",
  fontSize: 13,
  lineHeight: 1.7,
  color: '#c9d1d9',
  overflowX: 'auto',
  whiteSpace: 'pre',
  marginBottom: 24,
  display: 'block',
}

export function Info() {
  const { lang } = useLanguage()
  const data = INFO_DATA[lang]
  const commons = COMMONS[lang]

  const [activeId, setActiveId] = useState(data[0].items[0].id)

  useEffect(() => {
    const exists = data.some(cat => cat.items.some(item => item.id === activeId))
    if (!exists) setActiveId(data[0].items[0].id)
  }, [lang, data, activeId])

  let activeCategoryName = ''
  let activeItemTitle = ''
  let activeContent = null as any

  data.forEach(cat => {
    cat.items.forEach(item => {
      if (item.id === activeId) {
        activeCategoryName = cat.category
        activeItemTitle = item.title
        activeContent = item.content
      }
    })
  })

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
      {/* Sidebar */}
      <aside className="page-sidebar" style={{
        width: 260, borderRight: '1px solid var(--border)', padding: '32px 24px',
        display: 'flex', flexDirection: 'column', gap: 32, position: 'sticky', top: 56,
        height: 'calc(100vh - 56px)', overflowY: 'auto'
      }}>
        {data.map(category => (
          <div key={category.category}>
            <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: 'var(--fg)', opacity: 0.6, marginBottom: 12, letterSpacing: 1 }}>
              {category.category}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {category.items.map(item => {
                const isActive = item.id === activeId
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveId(item.id)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '6px 12px', borderRadius: 6,
                        border: 'none', backgroundColor: isActive ? 'var(--hover-bg)' : 'transparent',
                        color: isActive ? 'var(--fg)' : 'var(--muted)',
                        fontSize: 14, fontWeight: isActive ? 500 : 400,
                        cursor: 'pointer', transition: 'all 0.2s ease'
                      }}
                    >
                      {item.title}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px 64px', maxWidth: 840 }}>
        {activeContent && (
          <div key={activeId} className="page-content-transition">
            <p style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 16 }}>
              {commons.infoPath} / {activeCategoryName} / <span style={{ color: 'var(--fg)' }}>{activeItemTitle}</span>
            </p>
            <h1 style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--fg)', marginBottom: 24 }}>
              {activeContent.title}
            </h1>

            {activeContent.body.map((paragraph: string, i: number) => (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 24 }}>
                {paragraph}
              </p>
            ))}

            {activeContent.sections?.map((sec: any, i: number) => (
              <div key={i}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--fg)', marginTop: 40, marginBottom: 12 }}>
                  {sec.subtitle}
                </h2>
                {sec.text && (
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', marginBottom: sec.code ? 12 : 24 }}>
                    {sec.text}
                  </p>
                )}
                {sec.code && (
                  <pre style={codeBlockStyle}>
                    <code>{sec.code}</code>
                  </pre>
                )}
              </div>
            ))}

            {activeContent.callout && (
              <div style={{ marginTop: 48, padding: 24, borderRadius: 12, border: '1px solid var(--border)', backgroundColor: 'var(--hover-bg)' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--fg)', marginBottom: 8 }}>
                  {activeContent.callout.title}
                </h2>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted)' }}>
                  {activeContent.callout.text}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
