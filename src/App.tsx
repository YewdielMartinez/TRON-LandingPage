import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { useViewTransitionRouter } from './hooks/useViewTransitionRouter'
import { Navbar } from './components/Navbar'
// Initialize GSAP plugins once at the app level
import './lib/gsap'

// Route-level code splitting — each page loads as a separate chunk
const Home       = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Docs       = lazy(() => import('./pages/Docs').then(m => ({ default: m.Docs })))
const Playground = lazy(() => import('./pages/Playground').then(m => ({ default: m.Playground })))
const Info       = lazy(() => import('./pages/Info').then(m => ({ default: m.Info })))

// Un componente interno para poder usar el hook de router
function AppContent() {
  useViewTransitionRouter()
  return (
    <div style={{ paddingTop: 56 }}>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/docs"       element={<Docs />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/info"       element={<Info />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default function App() {
  const { isDark, toggle } = useTheme()

  return (
    <BrowserRouter>
      <Navbar isDark={isDark} onToggleTheme={toggle} />
      <AppContent />
    </BrowserRouter>
  )
}
