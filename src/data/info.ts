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
              'El aumento del uso de Modelos de Lenguaje Grandes (LLMs) ha creado un cuello de botella fundamental: el costo por token y los límites de contexto. Cuando tu JSON pesa 100KB, pagas por 100KB de tokens, aunque el 80% sean llaves y estructura repetida.',
              'TRON nació como una solución de ingeniería de software para abordar directamente la redundancia estructural extrema que ocurre cuando herramientas o APIs interactúan con LLMs usando formato JSON estándar.',
              'El resultado: con TRON, ese JSON de 100KB baja a ~2KB en datasets con alta repetición. Pagas hasta 50× menos en la API. El modelo responde más rápido. Y puede "recordar" 50× más datos dentro de su ventana de contexto.',
            ],
            callout: {
              title: '¿Por qué un Middleware?',
              text: 'Un middleware permite interponer la transpilación sin requerir que las aplicaciones existentes cambien su código base. Siguen enviando JSON, pero el costo de red se reduce drásticamente en el "puente". Zero cambios del lado del cliente.',
            },
          },
        },
        {
          id: 'problem',
          title: 'El Problema del LLM',
          content: {
            title: 'La Redundancia del JSON',
            body: [
              'En JSON estándar, si tienes 1,000 registros, el nombre del campo "name" se repite 1,000 veces. Solo esa clave desperdicia 1,000 × 8 bytes = 8,000 bytes. Multiplica eso por 10-20 campos típicos y estás pagando por ~100KB de estructura que no es dato.',
              'Cada vez que la IA devuelve un objeto complejo, gasta en promedio el 40% de los tokens solo devolviendo llaves repetitivas ("nombre:", "id:", "status:"). A gran escala, esto es dinero tirado a la basura.',
              'TRON elimina esta redundancia en la capa de transporte: define la estructura una sola vez, transmite solo valores, y el decoder reconstruye el JSON original sin pérdida de un solo bit.',
            ],
            callout: {
              title: 'El cálculo real',
              text: 'Dataset REPETITIVE de 1,000 registros: JSON original = 71,716 bytes. TRON HYPER = 1,361 bytes. Ratio = 98% de reducción. En términos de costo API: si pagas $10 por ese dataset en JSON, con TRON pagas $0.20.',
            },
          },
        },
        {
          id: 'versions',
          title: 'Versiones',
          content: {
            title: 'Historial de Versiones',
            body: [
              'TRON ha evolucionado iterativamente desde su concepto inicial hasta el protocolo HYPER actual. Cada versión mayor agrega capas de compresión sin romper compatibilidad hacia atrás.',
            ],
            callout: {
              title: 'Versión actual: v3.5 (HYPER)',
              text: 'v2.5 introdujo Schema Header, Base36 y Prefix Seeding (modo ULTRA). v3.0 estandarizó la arquitectura Stateful y el Block-Mode. v3.5 agrega Constants, Sequences, Defaults, RLE y Null Sentinel (modo HYPER), alcanzando 98% de reducción en datasets repetitivos.',
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
              'Los benchmarks miden reducción en bytes (longitud de string), no en tokens estimados. Esto garantiza resultados verificables de forma directa con cualquier herramienta. Ejecuta "npm run benchmark" para reproducir los números con datos reales.',
            ],
            callout: {
              title: 'Resultados actuales (v3.5)',
              text: 'REPETITIVE 1,000 registros: JSON 71,716 bytes → HYPER 1,361 bytes → 98% reducción. DIVERSE 1,000 registros: JSON 93,213 bytes → HYPER 8,156 bytes → 91% reducción. MEDIUM 50 registros: JSON 4,130 bytes → HYPER 606 bytes → 85% reducción. SMALL 3 registros (LITE): JSON 116 bytes → LITE 97 bytes → 16% reducción.',
            },
          },
        },
        {
          id: 'formula',
          title: 'Fórmula de Reducción',
          content: {
            title: 'Cómo se Calculan los Porcentajes',
            body: [
              'La fórmula central es: reduction% = Math.round((1 - outputBytes / inputBytes) * 100). Donde inputBytes = JSON.stringify(data).length y outputBytes = longitud del string TRON generado.',
              'Ejemplo con dataset REPETITIVE (1,000 registros): inputBytes = 71,716. outputBytes = 1,361. ratio = 1,361 / 71,716 = 0.0190. reduction = 1 - 0.0190 = 0.9810. reduction% = Math.round(98.10) = 98%.',
              'Regla de proporcionalidad: alta repetición de claves/valores → ratio bajo → reducción alta. Datos diversos/únicos → ratio alto → reducción moderada. La reducción mínima esperada es ~16% incluso en LITE con 3 registros.',
            ],
            callout: {
              title: 'Verificación directa',
              text: 'El script scripts/update-docs.ts imprime los bytes reales antes y después de cada transformación. Puedes auditar cada número del benchmark ejecutando el script y comparando con la salida en consola.',
            },
          },
        },
        {
          id: 'use-cases',
          title: 'Casos de Uso',
          content: {
            title: 'Cuándo Usar TRON',
            body: [
              'TRON tiene mayor impacto cuando los datos tienen alta redundancia estructural: datasets tabulares, logs de eventos, respuestas de APIs REST con esquemas fijos, telemetría de IoT, inventarios de productos, registros de usuarios.',
              'El impacto es menor (pero aún positivo) en datos heterogéneos como documentos de texto libre, esquemas altamente variables o respuestas con un solo registro. Para esos casos, el modo LITE sigue siendo más eficiente que JSON en la mayoría de los escenarios.',
            ],
            callout: {
              title: 'Regla práctica',
              text: 'Si tu payload tiene más de 10 registros con el mismo esquema, TRON HYPER te dará al menos 80% de reducción. Si tienes 1,000+ registros con campos repetitivos, espera 90-98%. Para un solo registro, usa LITE: ~16% de ahorro sin overhead.',
            },
          },
        },
      ],
    },
    {
      category: 'Arquitectura',
      items: [
        {
          id: 'efficiency-table',
          title: 'Tabla de Eficiencia',
          content: {
            title: 'Impacto por Técnica',
            body: [
              'Cada técnica de TRON apunta a un tipo específico de redundancia. La tabla muestra el impacto relativo de cada una en bytes eliminados por mensaje.',
            ],
            callout: {
              title: 'Desglose por técnica',
              text: 'Schema Decoupling: elimina repetición de nombres de claves (mayor impacto en datasets grandes). Block-Mode: elimina IDs de tabla por fila. Base36: compacta IDs y métricas numéricas ~50%. Prefix Seeding: compacta strings con raíces comunes. Constants: elimina columnas de valor fijo. Sequences: elimina columnas secuenciales. Defaults + Trailing Trim: omite valores frecuentes. RLE: colapsa filas repetidas a una línea.',
            },
          },
        },
        {
          id: 'diagrams',
          title: 'Diagramas',
          content: {
            title: 'Diagramas de Arquitectura',
            body: [
              'Los diagramas PlantUML están en docs/diagrams/ y cubren tres vistas: estructura de clases (class-diagram.puml), modelo entidad-relación (er-diagram.puml) y flujo completo de encode/decode (flow-diagram.puml).',
              'Para renderizarlos: usa la extensión PlantUML de VS Code, el servidor en línea de PlantUML, o ejecuta un servidor PlantUML local. Los diagramas se mantienen sincronizados con el código fuente manual y reflejan la arquitectura actual de v3.5.',
            ],
            callout: {
              title: 'Diagrama de flujo clave',
              text: 'El flow-diagram.puml describe el ciclo completo: JSON de entrada → Encoder (State Check → Mode Detection → Header Generation → Row Emission) → string TRON → Decoder (Header Parse → StateManager → Row Reconstruction → Base36/Prefix expansion) → JSON de salida bit-idéntico al original.',
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
          title: 'About TRON',
          content: {
            title: 'About the Project',
            body: [
              'The surge in Large Language Model (LLM) adoption has created a fundamental bottleneck: cost per token and context limits. When your JSON weighs 100KB, you pay for 100KB of tokens, even though 80% of that is repeated keys and structure.',
              'TRON was born as a software engineering solution to directly address the extreme structural redundancy that occurs when tools or APIs interact with LLMs using standard JSON format.',
              'The result: with TRON, that 100KB JSON drops to ~2KB on high-repetition datasets. You pay up to 50× less on the API. The model responds faster. And it can "remember" 50× more data within its context window.',
            ],
            callout: {
              title: 'Why a Middleware?',
              text: 'A middleware allows interposing the transpilation without requiring existing applications to change their codebase. They keep sending standard JSON, but the network payload is drastically reduced at the "bridge". Zero changes on the client side.',
            },
          },
        },
        {
          id: 'problem',
          title: 'The LLM Problem',
          content: {
            title: 'JSON Redundancy',
            body: [
              'In standard JSON, if you have 1,000 records, the field name "name" is repeated 1,000 times. That single key wastes 1,000 × 8 bytes = 8,000 bytes. Multiply that by 10-20 typical fields and you\'re paying for ~100KB of structure that isn\'t data.',
              'Every time AI returns a complex object, it spends on average 40% of its tokens just echoing repetitive keys ("name:", "id:", "status:"). At scale, this is essentially throwing money away.',
              'TRON eliminates this redundancy at the transport layer: defines the structure once, transmits only values, and the decoder reconstructs the original JSON without losing a single bit.',
            ],
            callout: {
              title: 'The real math',
              text: 'REPETITIVE dataset of 1,000 records: original JSON = 71,716 bytes. TRON HYPER = 1,361 bytes. Ratio = 98% reduction. In API cost terms: if you pay $10 for that dataset in JSON, with TRON you pay $0.20.',
            },
          },
        },
        {
          id: 'versions',
          title: 'Versions',
          content: {
            title: 'Version History',
            body: [
              'TRON has evolved iteratively from its initial concept to the current HYPER protocol. Each major version adds compression layers without breaking backward compatibility.',
            ],
            callout: {
              title: 'Current version: v3.5 (HYPER)',
              text: 'v2.5 introduced Schema Header, Base36, and Prefix Seeding (ULTRA mode). v3.0 standardized the Stateful architecture and Block-Mode. v3.5 adds Constants, Sequences, Defaults, RLE, and Null Sentinel (HYPER mode), reaching 98% reduction on repetitive datasets.',
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
              'Benchmarks measure reduction in bytes (string length), not estimated tokens. This guarantees results that are directly verifiable with any tool. Run "npm run benchmark" to reproduce the numbers with real data.',
            ],
            callout: {
              title: 'Current results (v3.5)',
              text: 'REPETITIVE 1,000 records: JSON 71,716 bytes → HYPER 1,361 bytes → 98% reduction. DIVERSE 1,000 records: JSON 93,213 bytes → HYPER 8,156 bytes → 91% reduction. MEDIUM 50 records: JSON 4,130 bytes → HYPER 606 bytes → 85% reduction. SMALL 3 records (LITE): JSON 116 bytes → LITE 97 bytes → 16% reduction.',
            },
          },
        },
        {
          id: 'formula',
          title: 'Reduction Formula',
          content: {
            title: 'How Percentages Are Calculated',
            body: [
              'The core formula is: reduction% = Math.round((1 - outputBytes / inputBytes) * 100). Where inputBytes = JSON.stringify(data).length and outputBytes = length of the generated TRON string.',
              'Example with REPETITIVE dataset (1,000 records): inputBytes = 71,716. outputBytes = 1,361. ratio = 1,361 / 71,716 = 0.0190. reduction = 1 - 0.0190 = 0.9810. reduction% = Math.round(98.10) = 98%.',
              'Proportionality rule: high key/value repetition → low ratio → high reduction. Diverse/unique data → high ratio → moderate reduction. Minimum expected reduction is ~16% even in LITE with 3 records.',
            ],
            callout: {
              title: 'Direct verification',
              text: 'The scripts/update-docs.ts script prints real bytes before and after each transformation. You can audit every benchmark number by running the script and comparing with the console output.',
            },
          },
        },
        {
          id: 'use-cases',
          title: 'Use Cases',
          content: {
            title: 'When to Use TRON',
            body: [
              'TRON has the greatest impact when data has high structural redundancy: tabular datasets, event logs, REST API responses with fixed schemas, IoT telemetry, product inventories, user records.',
              'Impact is lower (but still positive) for heterogeneous data like free-form text documents, highly variable schemas, or single-record responses. For those cases, LITE mode is still more efficient than JSON in most scenarios.',
            ],
            callout: {
              title: 'Practical rule of thumb',
              text: 'If your payload has more than 10 records with the same schema, TRON HYPER will give you at least 80% reduction. If you have 1,000+ records with repetitive fields, expect 90-98%. For a single record, use LITE: ~16% savings with no overhead.',
            },
          },
        },
      ],
    },
    {
      category: 'Architecture',
      items: [
        {
          id: 'efficiency-table',
          title: 'Efficiency Table',
          content: {
            title: 'Impact per Technique',
            body: [
              'Each TRON technique targets a specific type of redundancy. The breakdown shows the relative impact of each one in bytes eliminated per message.',
            ],
            callout: {
              title: 'Per-technique breakdown',
              text: 'Schema Decoupling: eliminates key name repetition (biggest impact on large datasets). Block-Mode: eliminates table IDs per row. Base36: compacts IDs and numeric metrics ~50%. Prefix Seeding: compacts strings with common roots. Constants: eliminates fixed-value columns. Sequences: eliminates sequential columns. Defaults + Trailing Trim: omits frequent values. RLE: collapses repeated rows to one line.',
            },
          },
        },
        {
          id: 'diagrams',
          title: 'Diagrams',
          content: {
            title: 'Architecture Diagrams',
            body: [
              'PlantUML diagrams are in docs/diagrams/ and cover three views: class structure (class-diagram.puml), entity-relationship model (er-diagram.puml), and full encode/decode flow (flow-diagram.puml).',
              'To render them: use the VS Code PlantUML extension, the PlantUML online server, or run a local PlantUML server. Diagrams are kept in sync with the source code manually and reflect the current v3.5 architecture.',
            ],
            callout: {
              title: 'Key flow diagram',
              text: 'The flow-diagram.puml describes the complete cycle: JSON input → Encoder (State Check → Mode Detection → Header Generation → Row Emission) → TRON string → Decoder (Header Parse → StateManager → Row Reconstruction → Base36/Prefix expansion) → JSON output bit-identical to the original.',
            },
          },
        },
      ],
    },
  ],
}
