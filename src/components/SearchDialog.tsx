import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'iconoir-react'
import { useDialogTransition } from '../hooks/useDialogTransition'
import { useLanguage } from '../hooks/useLanguage'
import { DOCS_DATA } from '../data/docs'
import { INFO_DATA } from '../data/info'

export interface SearchDialogHandle {
  open: (e: React.MouseEvent<HTMLButtonElement>) => void
  close: () => void
}

export const SearchDialog = forwardRef<SearchDialogHandle, {}>((_props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { dialogRef, openDialog, closeDialog } = useDialogTransition()

  useImperativeHandle(ref, () => ({
    open: (e) => {
      document.body.style.overflow = 'hidden'
      openDialog(e).then(() => {
        setTimeout(() => inputRef.current?.focus(), 50)
      })
    },
    close: () => {
      document.body.style.overflow = ''
      closeDialog()
    }
  }))

  const { lang } = useLanguage()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // Mapeamos los datos para buscar
  const allDocs = DOCS_DATA[lang].flatMap(cat => cat.items.map(item => ({ ...item, section: cat.category, type: 'docs' })))
  const allInfo = INFO_DATA[lang].flatMap(cat => cat.items.map(item => ({ ...item, section: cat.category, type: 'info' })))
  
  const allData = [...allDocs, ...allInfo]

  const results = allData.filter(item => {
    const q = query.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.content.title.toLowerCase().includes(q) ||
      item.content.body.some(b => b.toLowerCase().includes(q))
    )
  })

  const handleSelect = (type: string, id: string) => {
    document.body.style.overflow = ''
    closeDialog()
    navigate(`/${type}?id=${id}`)
  }

  return (
    <dialog ref={dialogRef} className="search-dialog" onClick={(e) => {
        if (e.target === dialogRef.current) {
          document.body.style.overflow = ''
          closeDialog()
        }
    }}>
      <div className="search-dialog-inner" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <Search width={20} height={20} color="var(--muted)" data-vt-icon />
          <input 
            ref={inputRef}
            type="text" 
            placeholder={lang === 'en' ? 'Search documentation...' : 'Buscar en la documentación...'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-close" onClick={closeDialog}>esc</button>
        </div>
        
        {query.trim().length > 0 && (
          <div className="search-results">
            {results.length > 0 ? (
              results.map(res => (
                <button 
                  key={res.id} 
                  className="search-result-item"
                  onClick={() => handleSelect(res.type, res.id)}
                >
                  <div className="search-result-text">
                    <span className="search-result-title">{res.title}</span>
                    <span className="search-result-cat">{res.section}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="search-empty">
                {lang === 'en' ? 'No results found' : 'No se encontraron resultados'}
              </div>
            )}
          </div>
        )}
      </div>
    </dialog>
  )
})
