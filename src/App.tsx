import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { useViewTransitionRouter } from './hooks/useViewTransitionRouter'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Docs } from './pages/Docs'
import { Playground } from './pages/Playground'
import { Info } from './pages/Info'

// Un componente interno para poder usar el hook de router
function AppContent() {
  useViewTransitionRouter()
  return (
    <div style={{ paddingTop: 56 }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/info" element={<Info />} />
      </Routes>
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
