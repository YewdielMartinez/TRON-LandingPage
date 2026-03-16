import { useState, useEffect, useCallback } from 'react'

export type Lang = 'en' | 'es'

export function useLanguage() {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('language') as Lang) || 'es'
  })

  // Set default if empty, so it's consistent
  useEffect(() => {
    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', 'es')
    }
  }, [])

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'en' ? 'es' : 'en'
      localStorage.setItem('language', next)
      window.dispatchEvent(
        new CustomEvent('languageChange', { detail: { lang: next } })
      )
      return next
    })
  }, [])

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const event = e as CustomEvent
      if (event.detail && event.detail.lang) {
        setLang(event.detail.lang)
      }
    }
    window.addEventListener('languageChange', handleLangChange)
    return () => window.removeEventListener('languageChange', handleLangChange)
  }, [])

  return { lang, toggleLang }
}
