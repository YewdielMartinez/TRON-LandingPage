export const DOCS_DATA = {
  es: [
    {
      category: 'Introducción',
      items: [
        {
          id: 'what-is-tron',
          title: '¿Qué es TRON?',
          content: {
            title: 'Arquitectura del Middleware TRON',
            body: [
              'TRON se implementa como un patrón de diseño Adapter (Adaptador). El sistema cliente permanece agnóstico al formato de transmisión, operando exclusivamente con objetos JSON estándar.',
              'El módulo TRON intercepta la comunicación, realizando una transpilación bidireccional en tiempo real que optimiza la carga útil (payload) antes de llegar a la capa de transporte de la API del LLM.'
            ],
            sections: [
              {
                subtitle: 'El Cerebro de la Compresión',
                text: 'A diferencia de formatos sin estado como TOON, TRON emplea un análisis de estructura (State Check) que detecta si el esquema JSON ya ha sido transmitido en la sesión actual.'
              }
            ]
          }
        },
        {
          id: 'vs-toon',
          title: 'vs TOON',
          content: {
            title: 'TRON vs TOON',
            body: [
              'TOON elimina llaves y usa un formato posicional estricto, pero sufre con tipos de datos complejos y requiere retransmitir el esquema en cada mensaje.',
              'TRON soluciona esto guardando estado (Stateful), lo que significa que solo se transmiten los valores puros tras el primer intercambio.'
            ],
            sections: []
          }
        },
        {
          id: 'stateful',
          title: 'Arquitectura Stateful',
          content: {
            title: 'Arquitectura Stateful',
            body: [
              'TRON asigna identificadores únicos a cada esquema JSON que transfiere. La próxima vez que envíes datos con el mismo esquema, el LLM ya conoce la estructura, reduciendo el envío a un simple arreglo de valores.'
            ],
            sections: []
          }
        }
      ]
    },
    {
      category: 'Implementación',
      items: [
        {
          id: 'encoder',
          title: 'El Encoder',
          content: {
            title: 'El Encoder (De JSON a TRON)',
            body: [
              'Toma cualquier JSON, extrae sus keys de manera recursiva simulando un recorrido en profundidad (DFS) y emite un preámbulo de definición seguido de los valores separados por un delimitador seguro.'
            ],
            sections: []
          }
        },
        {
          id: 'decoder',
          title: 'El Decoder',
          content: {
            title: 'El Decoder (De TRON a JSON)',
            body: [
              'Al recibir datos del LLM en formato TRON, el Decoder usa la tabla de esquemas almacenada en memoria para rehidratar el objeto, devolviendo un JSON puro a tu aplicación.'
            ],
            sections: []
          }
        }
      ]
    }
  ],
  en: [
    {
      category: 'Introduction',
      items: [
        {
          id: 'what-is-tron',
          title: 'What is TRON?',
          content: {
            title: 'TRON Middleware Architecture',
            body: [
              'TRON is implemented as an Adapter design pattern. The client system remains agnostic to the transmission format, operating exclusively with standard JSON objects.',
              'The TRON module intercepts communication, performing real-time bi-directional transpilation that optimizes the payload before reaching the LLM API transport layer.'
            ],
            sections: [
              {
                subtitle: 'The Core of Compression',
                text: 'Unlike stateless formats such as TOON, TRON employs a structure analysis (State Check) that detects whether the JSON schema has already been transmitted in the current session.'
              }
            ]
          }
        },
        {
          id: 'vs-toon',
          title: 'vs TOON',
          content: {
            title: 'TRON vs TOON',
            body: [
              'TOON removes keys and uses a strict positional format, but struggles with complex data types and requires retransmitting the schema on every single message.',
              'TRON solves this by keeping state (Stateful), meaning only pure values are transmitted after the first exchange.'
            ],
            sections: []
          }
        },
        {
          id: 'stateful',
          title: 'Stateful Architecture',
          content: {
            title: 'Stateful Architecture',
            body: [
              'TRON assigns unique identifiers to each JSON schema it transfers. The next time you send data with the same schema, the LLM already knows the structure, reducing the payload to a simple array of values.'
            ],
            sections: []
          }
        }
      ]
    },
    {
      category: 'Implementation',
      items: [
        {
          id: 'encoder',
          title: 'The Encoder',
          content: {
            title: 'The Encoder (JSON to TRON)',
            body: [
              'Takes any JSON, recursively extracts its keys simulating a Depth-First Search (DFS), and emits a definition preamble followed by the values separated by a safe delimiter.'
            ],
            sections: []
          }
        },
        {
          id: 'decoder',
          title: 'The Decoder',
          content: {
            title: 'The Decoder (TRON to JSON)',
            body: [
              'Upon receiving data from the LLM in TRON format, the Decoder uses the schema table stored in memory to rehydrate the object, returning pure JSON to your application.'
            ],
            sections: []
          }
        }
      ]
    }
  ]
}
