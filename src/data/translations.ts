export const HOME_DATA = {
  es: {
    tagline: 'LLM-Optimized Object Notation · v1.0',
    title: 'LOON',
    subtitle: 'Serialización token-eficiente para pipelines de LLM',
    description: 'LOON comprime tus objetos JSON en un formato denso y legible por LLMs.',
    ctaPrimary: 'Leer la documentación',
    ctaSecondary: 'Abrir playground',
    ctaSpec: 'Descargar spec'
  },
  en: {
    tagline: 'LLM-Optimized Object Notation · v1.0',
    title: 'LOON',
    subtitle: 'Token-efficient serialization for LLM pipelines',
    description: 'LOON compresses your JSON objects into a dense, LLM-readable format.',
    ctaPrimary: 'Read the docs',
    ctaSecondary: 'Open playground',
    ctaSpec: 'Download spec'
  }
}

export const PLAYGROUND_DATA = {
  es: {
    title: 'Playground',
    subtitle: 'Prueba el encoder de LOON en tiempo real (corre en tu navegador).',
    btnReset: 'Restablecer',
    btnExec: 'Codificar',
    inputTitle: 'Entrada (JSON)',
    outputTitle: 'Salida (LOON)',
    outputPlaceholder: 'Pulsa "Codificar" para ver la salida LOON…',
    savedBadge: 'tokens (aprox.)',
    errorLabel: 'Error'
  },
  en: {
    title: 'Playground',
    subtitle: 'Test the LOON encoder in real time (runs in your browser).',
    btnReset: 'Reset',
    btnExec: 'Encode',
    inputTitle: 'Input (JSON)',
    outputTitle: 'Output (LOON)',
    outputPlaceholder: 'Press "Encode" to see the LOON output…',
    savedBadge: 'tokens (approx.)',
    errorLabel: 'Error'
  }
}

export const COMMONS = {
  es: {
    docsPath: 'Docs',
    infoPath: 'Acerca de',
    navLinks: [
      { label: 'Inicio', href: '/' },
      { label: 'Documentación', href: '/docs' },
      { label: 'Playground', href: '/playground' },
      { label: 'Acerca de', href: '/info' }
    ]
  },
  en: {
    docsPath: 'Docs',
    infoPath: 'About',
    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'Docs', href: '/docs' },
      { label: 'Playground', href: '/playground' },
      { label: 'About', href: '/info' }
    ]
  }
}
