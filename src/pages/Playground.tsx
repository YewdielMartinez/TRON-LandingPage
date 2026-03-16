import { useLanguage } from '../hooks/useLanguage'
import { PLAYGROUND_DATA } from '../data/translations'

export function Playground() {
  const { lang } = useLanguage()
  const content = PLAYGROUND_DATA[lang]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 56px)', padding: 24, gap: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg)', marginBottom: 4 }}>
            {content.title}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            {content.subtitle}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>{content.btnReset}</button>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>{content.btnExec}</button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, gap: 24 }}>
        {/* Input Pane */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'var(--hover-bg)', padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 500, color: 'var(--fg)' }}>
            {content.inputTitle}
          </div>
          <textarea
            style={{ flex: 1, padding: 16, backgroundColor: 'var(--bg)', color: 'var(--fg)', border: 'none', resize: 'none', fontFamily: 'monospace', fontSize: 13, outline: 'none' }}
            defaultValue='{\n  "id": 12053,\n  "nombre": "Producto Alpha",\n  "rol": "Admin"\n}'
          />
        </section>

        {/* Output Pane */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'var(--hover-bg)', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg)' }}>{content.outputTitle}</span>
            <span style={{ fontSize: 11, color: 'var(--fg)', backgroundColor: 'var(--border)', padding: '2px 8px', borderRadius: 999 }}>
              -74% {content.savedBadge}
            </span>
          </div>
          <textarea
            readOnly
            style={{ flex: 1, padding: 16, backgroundColor: 'var(--bg)', color: 'var(--fg)', border: 'none', resize: 'none', fontFamily: 'monospace', fontSize: 13, outline: 'none' }}
            value='DEF H2A:[id,nombre,rol]\n0|12053|Producto Alpha|0'
          />
        </section>
      </div>
    </div>
  )
}
