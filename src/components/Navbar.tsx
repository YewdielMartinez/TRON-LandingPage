import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { useLanguage } from '../hooks/useLanguage'
import { COMMONS } from '../data/translations'
import { Search } from 'iconoir-react'
import { SearchDialog, type SearchDialogHandle } from './SearchDialog'

interface Props { isDark: boolean; onToggleTheme: () => void }

const PILL_THRESHOLD = 80

function buildDispMap(w: number, h: number, r: number, d: number): string {
  const rY = Math.ceil((r / h) * 15)
  const rX = Math.ceil((r / w) * 15)
  const svg = `<svg height="${h}" width="${w}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <style>.mx{mix-blend-mode:screen}</style>
    <defs>
      <linearGradient id="gY" x1="0" x2="0" y1="${rY}%" y2="${100 - rY}%">
        <stop offset="0%" stop-color="#0F0"/><stop offset="100%" stop-color="#000"/>
      </linearGradient>
      <linearGradient id="gX" x1="${rX}%" x2="${100 - rX}%" y1="0" y2="0">
        <stop offset="0%" stop-color="#F00"/><stop offset="100%" stop-color="#000"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#808080"/>
    <g filter="blur(2px)">
      <rect width="${w}" height="${h}" fill="#000080"/>
      <rect width="${w}" height="${h}" fill="url(#gY)" class="mx"/>
      <rect width="${w}" height="${h}" fill="url(#gX)" class="mx"/>
      <rect x="${d}" y="${d}" width="${w - 2 * d}" height="${h - 2 * d}"
        fill="#808080" rx="${r}" ry="${r}" filter="blur(${d}px)"/>
    </g>
  </svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

export function Navbar({ isDark, onToggleTheme }: Props) {
  const location = useLocation()
  const { lang, toggleLang } = useLanguage()
  const navLinks = COMMONS[lang].navLinks
  
  const searchDialogRef = useRef<SearchDialogHandle>(null)
  
  const [pillVisible, setPillVisible] = useState(false)
  const [barShadow, setBarShadow]     = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)

  const barPillRef = useRef<HTMLDivElement>(null)
  const dispMapRef = useRef<SVGFEImageElement>(null)

  const initLiquidGlass = useCallback(() => {
    const pill    = barPillRef.current
    const dispMap = dispMapRef.current
    if (!pill || !dispMap) return
    const w = Math.round(pill.offsetWidth)
    const h = Math.round(pill.offsetHeight)
    if (!w || !h) return
    const r = h / 2
    const d = Math.max(4, Math.round(h * 0.18))
    dispMap.setAttribute('width',  String(w))
    dispMap.setAttribute('height', String(h))
    dispMap.setAttribute('href',   buildDispMap(w, h, r, d))
  }, [])

  useEffect(() => {
    const updateNav = () => {
      const scrollY   = window.scrollY
      const isDesktop = window.innerWidth >= 768
      setBarShadow(scrollY > 10)
      setPillVisible(isDesktop && scrollY > PILL_THRESHOLD)
    }

    window.addEventListener('scroll', updateNav, { passive: true })
    window.addEventListener('resize', updateNav, { passive: true })
    updateNav()

    requestAnimationFrame(initLiquidGlass)
    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(initLiquidGlass, 150) }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateNav)
      window.removeEventListener('resize', updateNav)
      window.removeEventListener('resize', onResize)
    }
  }, [initLiquidGlass])

  useEffect(() => {
    if (pillVisible) requestAnimationFrame(initLiquidGlass)
  }, [pillVisible, initLiquidGlass])

  // Cierra el menú en móvil cuando la ruta cambia
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => location.pathname === path

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
      {/* ── Full bar ── */}
      <div className={`navbar-bar${barShadow ? ' bar-shadow' : ''}${pillVisible ? ' bar-hidden' : ''}`}>
        <div className="navbar-bar-inner">
          <Link to="/" className="navbar-logo">TRON</Link>

          <div className="navbar-links">
            {navLinks.map(({ label, href }) => (
              <Link key={href} to={href} className={`nav-link${isActive(href) ? ' active' : ''}`}>{label}</Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifySelf: 'flex-end' }}>
            <button className="search-btn" onClick={(e) => searchDialogRef.current?.open(e)} aria-label="Search">
              <Search width={16} height={16} data-vt-icon />
            </button>
            <button className="lang-toggle" onClick={toggleLang} aria-label="Toggle language">
              {lang.toUpperCase()}
            </button>
            <ThemeToggle isDark={isDark} onClick={onToggleTheme} />
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        {navLinks.map(({ label, href }) => (
          <Link key={href} to={href} className="mobile-nav-link">{label}</Link>
        ))}
      </div>

      {/* ── Floating pill ── */}
      <div
        ref={barPillRef}
        className={`nav-pill-glass${pillVisible ? ' pill-visible' : ''}`}
        style={{ position: 'fixed', top: 16, left: '50%' }}
      >
        {navLinks.map(({ label, href }) => (
          <Link key={href} to={href} className={`pill-link${isActive(href) ? ' active' : ''}`}>{label}</Link>
        ))}
        <div className="pill-divider" />
        <button className="search-btn" onClick={(e) => searchDialogRef.current?.open(e)} aria-label="Search">
          <Search width={16} height={16} data-vt-icon />
        </button>
        <button className="lang-toggle" onClick={toggleLang} aria-label="Toggle language">
          {lang.toUpperCase()}
        </button>
        <ThemeToggle isDark={isDark} onClick={onToggleTheme} />
      </div>

      {/* ── SVG displacement filter ── */}
      <svg aria-hidden focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <defs>
          <filter id="pill-displace" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
            <feImage ref={dispMapRef} x="0" y="0" result="dispMap" />
            <feDisplacementMap in="SourceGraphic" in2="dispMap" scale="28" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <SearchDialog ref={searchDialogRef} />
    </nav>
  )
}
