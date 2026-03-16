import type { ReactNode } from 'react'

interface Props { id: string; icon: ReactNode; title: string; desc: string; cta: string; href: string }

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

export function FeatureCard({ id, icon, title, desc, cta, href }: Props) {
  return (
    <article id={id} className="card">
      <div className="card-icon">{icon}</div>
      <h2 className="card-title">{title}</h2>
      <p className="card-desc">{desc}</p>
      <a href={href} className="card-link">{cta} <Arrow /></a>
    </article>
  )
}
