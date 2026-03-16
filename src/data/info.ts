export const INFO_DATA = {
  es: [
    {
      category: 'General',
      items: [
        {
          id: 'about',
          title: 'Acerca de TRON',
          content: {
            title: 'Acerca del Proyecto',
            body: [
              'El aumento del uso de Modelos de Lenguaje Grandes (LLMs) ha creado un cuello de botella fundamental: el costo por token y los límites de contexto.',
              'TRON nació como una solución de ingeniería de software para abordar directamente la redundancia estructural extrema que ocurre cuando herramientas o APIs interactúan con LLMs usando formato JSON estándar.'
            ],
            callout: {
              title: '¿Por qué un Middleware?',
              text: 'Un middleware permite interponer la transpilación sin requerir que las aplicaciones existentes cambien su código base. Siguen enviando JSON, pero el costo de red se reduce drásticamente en el "puente".'
            }
          }
        },
        {
          id: 'problem',
          title: 'El Problema del LLM',
          content: {
            title: 'La redudancia del JSON',
            body: [
              'Cada vez que la IA devuelve un objeto complejo, gasta en promedio el 40% de los tokens solo devolviendo llaves repetitivas (`"nombre":`, `"id":`, `"status":`). A gran escala, esto es dinero tirado a la basura.'
            ]
          }
        }
      ]
    },
    {
      category: 'Métricas',
      items: [
        {
          id: 'benchmarks',
          title: 'Benchmarks de compresión',
          content: {
            title: 'Resultados Prácticos',
            body: [
              'En una payload típica de e-commerce con 50 productos, TRON logra una reducción de tokens del 78% en comparación con el JSON original, y un 12% más de eficiencia comparado con el sistema TOON gracias al evitar el re-envío del esquema de llaves.'
            ]
          }
        }
      ]
    }
  ],
  en: [
    {
      category: 'General',
      items: [
        {
          id: 'about',
          title: 'About TRON',
          content: {
            title: 'About the Project',
            body: [
              'The surge in Large Language Model (LLM) adoption has created a fundamental bottleneck: cost per token and context limits.',
              'TRON was born as a software engineering solution to directly address the extreme structural redundancy that occurs when tools or APIs interact with LLMs using standard JSON format.'
            ],
            callout: {
              title: 'Why a Middleware?',
              text: 'A middleware allows interposing the transpilation without requiring existing applications to change their codebase. They keep sending standard JSON, but the network payload size is drastically reduced at the "bridge".'
            }
          }
        },
        {
          id: 'problem',
          title: 'The LLM Problem',
          content: {
            title: 'JSON Redundancy',
            body: [
              'Every time AI returns a complex object, it spends on average 40% of its tokens just echoing repetitive keys (`"name":`, `"id":`, `"status":`). At scale, this is essentially throwing money away.'
            ]
          }
        }
      ]
    },
    {
      category: 'Metrics',
      items: [
        {
          id: 'benchmarks',
          title: 'Compression Benchmarks',
          content: {
            title: 'Practical Results',
            body: [
              'In a typical e-commerce payload with 50 products, TRON achieves a 78% token reduction compared to native JSON, and is 12% more efficient than the TOON system because it entirely skips schema re-transmission.'
            ]
          }
        }
      ]
    }
  ]
}
