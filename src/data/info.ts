export const INFO_DATA = {
  es: [
    {
      category: 'General',
      items: [
        {
          id: 'about',
          title: 'Acerca de LOON',
          content: {
            title: 'Acerca del Proyecto',
            body: [
              'El uso creciente de Modelos de Lenguaje Grandes (LLMs) creó un cuello de botella: el costo por token y los límites de ventana de contexto. Cuando tu JSON pesa 100KB, pagas por 100KB de tokens, aunque buena parte sean llaves y estructura repetida.',
              'LOON (LLM-Optimized Object Notation) es una librería de serialización que comprime datos estructurados a un formato denso y, en su modo legible, auto-evidente para los modelos. Define la estructura una sola vez y transmite solo valores; el decoder reconstruye el JSON original sin pérdida.',
              'No es un servicio ni un sistema con base de datos: es un paquete npm (loon-core) que instalas y corre en navegador, edge o Node. Este sitio es la documentación + un playground de demostración.',
            ],
            callout: {
              title: 'Tres modos, un fallback',
              text: 'full = máxima compresión (acompaña con getSpec()). llm = legible y auto-evidente, sirve a modelos de nube y locales. compact = datos chicos / no-uniformes. compat = fallback JSON-hybrid universal ante cualquier forma rara.',
            },
          },
        },
        {
          id: 'team',
          title: 'Acerca de Nosotros',
          content: {
            title: 'Equipo y Contexto',
            body: [
              'LOON es un trabajo de tesis enfocado en evaluar la compresión semántica de datos estructurados para pipelines de LLM. El objetivo es medir, de forma reproducible, cuántos tokens se ahorran frente a JSON y otros formatos como TOON, manteniendo la fidelidad del round-trip.',
              'El proyecto se compone de la librería loon-core (el protocolo y su codec), una suite de benchmarks (comprehension-benchmark) y este sitio de demostración construido con React + Tailwind CSS.',
            ],
            callout: {
              title: 'Alcance honesto',
              text: 'LOON es una librería, no una plataforma transaccional. No requiere base de datos: los experimentos corren sobre un dataset estático de archivos JSON de distinta complejidad.',
            },
          },
        },
        {
          id: 'problem',
          title: 'El Problema del LLM',
          content: {
            title: 'La Redundancia del JSON',
            body: [
              'En JSON estándar, 1000 registros repiten cada nombre de campo 1000 veces. Multiplica por 10-20 campos típicos y gran parte del payload es estructura, no dato.',
              'Cada token cuesta dinero y consume ventana de contexto. LOON elimina la redundancia en la capa de transporte: estructura una vez, valores densos, reconstrucción exacta.',
            ],
            callout: {
              title: 'Round-trip garantizado',
              text: 'fromLOON() reconstruye el JSON original. Para salidas generadas por el LLM, validateDecode() verifica contra el esquema y repairHint() genera una pista mínima de reintento.',
            },
          },
        },
      ],
    },
    {
      category: 'Métricas',
      items: [
        {
          id: 'benchmarks',
          title: 'Benchmarks',
          content: {
            title: 'Resultados del Benchmark',
            body: [
              'Los benchmarks miden reducción de tokens (gpt-tokenizer y Gemini countTokens), tamaño de mensaje, throughput/latencia, fidelidad round-trip y accuracy en LLM. Se corren sobre datasets JSON reales en benchmarks/data.',
            ],
            callout: {
              title: 'Resultados de referencia',
              text: 'Dataset tabular de 50 registros (gpt-tokenizer): JSON = 1463 tokens. full = 315 tokens (−78%). llm = 824 tokens (−44%). El modo full maximiza la reducción; el modo llm prioriza legibilidad sin spec.',
            },
          },
        },
        {
          id: 'formula',
          title: 'Fórmula de Reducción',
          content: {
            title: 'Cómo se Calculan los Porcentajes',
            body: [
              'reduction% = round((1 − tokensOut / tokensIn) × 100), donde tokensIn son los del JSON minificado y tokensOut los de la cadena LOON. El playground usa una estimación chars/4; los benchmarks usan tokenizadores reales.',
              'Regla: alta repetición de claves/valores → reducción alta. Datos diversos/únicos → reducción moderada.',
            ],
            callout: {
              title: 'Verificación directa',
              text: 'Ejecuta los scripts de comprehension-benchmark (token-efficiency, multi-tokenizer, roundtrip-fidelity) para reproducir los números con datos reales.',
            },
          },
        },
        {
          id: 'use-cases',
          title: 'Casos de Uso',
          content: {
            title: 'Cuándo Usar LOON',
            body: [
              'Mayor impacto con alta redundancia estructural: datasets tabulares, logs de eventos, respuestas de APIs REST con esquema fijo, telemetría, inventarios, registros de usuarios.',
              'Para datos heterogéneos, un solo registro o esquemas muy variables, el modo compact sigue siendo más eficiente que JSON en la mayoría de los casos.',
            ],
            callout: {
              title: 'Regla práctica',
              text: 'Datos uniformes y consumo por LLM razonador → full + getSpec(). Modelos chicos/locales o legibilidad → llm. Pocos registros o forma irregular → compact (auto).',
            },
          },
        },
      ],
    },
    {
      category: 'Arquitectura',
      items: [
        {
          id: 'pipeline',
          title: 'Pipeline',
          content: {
            title: 'Cómo Funciona',
            body: [
              'El núcleo es stateless: flatten → selectMode → encode. El encoder adaptativo analiza columnas (constantes, secuencias, fixed-point, diccionarios, array-schema), construye headers y comprime filas.',
              'En decode, LOON auto-detecta el formato (JSON-hybrid, micro, adaptativo o compact), parsea headers y reconstruye filas, luego des-aplana a objetos anidados.',
            ],
            callout: {
              title: 'Fallback on-error',
              text: 'La codificación va en try/catch: si el modo elegido falla con una forma rara, LOON cae automáticamente a compat (JSON-hybrid), garantizando que siempre haya salida válida.',
            },
          },
        },
        {
          id: 'diagrams',
          title: 'Diagramas',
          content: {
            title: 'Diagramas de Arquitectura',
            body: [
              'Los diagramas PlantUML están en LOON/docs/diagrams/: arquitectura general y de núcleo, secuencia round-trip, flujo de procesamiento, clases, capas y el setup del dataset de benchmark.',
              'Se renderizan con la extensión PlantUML de VS Code o un servidor PlantUML. Reflejan la arquitectura actual de 3 modos (full/llm/compact) + compat.',
            ],
            callout: {
              title: 'Vista clave',
              text: 'El diagrama de secuencia round-trip resume el ciclo: toLOON() (flatten → selectMode → encode) → cadena LOON → fromLOON() (auto-detect → parse → reconstruct → unflatten) → JSON idéntico.',
            },
          },
        },
      ],
    },
  ],
  en: [
    {
      category: 'General',
      items: [
        {
          id: 'about',
          title: 'About LOON',
          content: {
            title: 'About the Project',
            body: [
              'The rise of Large Language Models (LLMs) created a bottleneck: cost per token and context-window limits. When your JSON weighs 100KB, you pay for 100KB of tokens, even though much of it is repeated keys and structure.',
              'LOON (LLM-Optimized Object Notation) is a serialization library that compresses structured data into a dense format that, in its readable mode, is self-evident to models. It declares the structure once and transmits only values; the decoder reconstructs the original JSON losslessly.',
              "It is not a service or a database-backed system: it's an npm package (loon-core) you install and run in the browser, edge or Node. This site is the documentation + a demo playground.",
            ],
            callout: {
              title: 'Three modes, one fallback',
              text: 'full = max compression (pair with getSpec()). llm = readable and self-evident, serving cloud and local models. compact = small / non-uniform data. compat = universal JSON-hybrid fallback for any odd shape.',
            },
          },
        },
        {
          id: 'team',
          title: 'About Us',
          content: {
            title: 'Team and Context',
            body: [
              'LOON is a thesis project focused on evaluating semantic compression of structured data for LLM pipelines. The goal is to measure, reproducibly, how many tokens are saved versus JSON and other formats like TOON, while preserving round-trip fidelity.',
              'The project comprises the loon-core library (the protocol and codec), a benchmark suite (comprehension-benchmark), and this demo site built with React + Tailwind CSS.',
            ],
            callout: {
              title: 'Honest scope',
              text: 'LOON is a library, not a transactional platform. It needs no database: experiments run on a static dataset of JSON files of varying complexity.',
            },
          },
        },
        {
          id: 'problem',
          title: 'The LLM Problem',
          content: {
            title: 'JSON Redundancy',
            body: [
              'In standard JSON, 1000 records repeat every field name 1000 times. Multiply by 10-20 typical fields and much of the payload is structure, not data.',
              'Every token costs money and consumes context window. LOON removes redundancy at the transport layer: structure once, dense values, exact reconstruction.',
            ],
            callout: {
              title: 'Guaranteed round-trip',
              text: 'fromLOON() reconstructs the original JSON. For LLM-generated output, validateDecode() checks against the schema and repairHint() builds a minimal retry hint.',
            },
          },
        },
      ],
    },
    {
      category: 'Metrics',
      items: [
        {
          id: 'benchmarks',
          title: 'Benchmarks',
          content: {
            title: 'Benchmark Results',
            body: [
              'Benchmarks measure token reduction (gpt-tokenizer and Gemini countTokens), message size, throughput/latency, round-trip fidelity and LLM accuracy. They run on real JSON datasets in benchmarks/data.',
            ],
            callout: {
              title: 'Reference results',
              text: 'Tabular dataset of 50 records (gpt-tokenizer): JSON = 1463 tokens. full = 315 tokens (−78%). llm = 824 tokens (−44%). full maximizes reduction; llm prioritizes readability without a spec.',
            },
          },
        },
        {
          id: 'formula',
          title: 'Reduction Formula',
          content: {
            title: 'How Percentages Are Calculated',
            body: [
              'reduction% = round((1 − tokensOut / tokensIn) × 100), where tokensIn is the minified JSON and tokensOut the LOON string. The playground uses a chars/4 estimate; the benchmarks use real tokenizers.',
              'Rule: high key/value repetition → high reduction. Diverse/unique data → moderate reduction.',
            ],
            callout: {
              title: 'Direct verification',
              text: 'Run the comprehension-benchmark scripts (token-efficiency, multi-tokenizer, roundtrip-fidelity) to reproduce the numbers with real data.',
            },
          },
        },
        {
          id: 'use-cases',
          title: 'Use Cases',
          content: {
            title: 'When to Use LOON',
            body: [
              'Greatest impact with high structural redundancy: tabular datasets, event logs, fixed-schema REST API responses, telemetry, inventories, user records.',
              'For heterogeneous data, a single record or highly variable schemas, compact mode is still more efficient than JSON in most scenarios.',
            ],
            callout: {
              title: 'Rule of thumb',
              text: 'Uniform data and a reasoning LLM → full + getSpec(). Small/local models or readability → llm. Few records or irregular shape → compact (auto).',
            },
          },
        },
      ],
    },
    {
      category: 'Architecture',
      items: [
        {
          id: 'pipeline',
          title: 'Pipeline',
          content: {
            title: 'How It Works',
            body: [
              'The core is stateless: flatten → selectMode → encode. The adaptive encoder analyzes columns (constants, sequences, fixed-point, dictionaries, array-schema), builds headers and compresses rows.',
              'On decode, LOON auto-detects the format (JSON-hybrid, micro, adaptive or compact), parses headers and reconstructs rows, then un-flattens to nested objects.',
            ],
            callout: {
              title: 'On-error fallback',
              text: 'Encoding runs in try/catch: if the chosen mode fails on an odd shape, LOON falls back to compat (JSON-hybrid), guaranteeing valid output.',
            },
          },
        },
        {
          id: 'diagrams',
          title: 'Diagrams',
          content: {
            title: 'Architecture Diagrams',
            body: [
              'PlantUML diagrams live in LOON/docs/diagrams/: general and core architecture, round-trip sequence, processing flow, classes, layers and the benchmark dataset setup.',
              'Render them with the VS Code PlantUML extension or a PlantUML server. They reflect the current 3-mode architecture (full/llm/compact) + compat.',
            ],
            callout: {
              title: 'Key view',
              text: 'The round-trip sequence diagram summarizes the cycle: toLOON() (flatten → selectMode → encode) → LOON string → fromLOON() (auto-detect → parse → reconstruct → unflatten) → identical JSON.',
            },
          },
        },
      ],
    },
  ],
}
