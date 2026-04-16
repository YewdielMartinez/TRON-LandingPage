export const DOCS_DATA = {
  es: [
    {
      category: 'Empezar',
      items: [
        {
          id: 'install',
          title: 'Instalación',
          content: {
            title: 'Instalación',
            body: [
              'TRON Core está disponible como paquete npm. Requiere Node.js 16+.',
            ],
            sections: [
              {
                subtitle: 'npm',
                code: 'npm install tron-core',
              },
              {
                subtitle: 'yarn',
                code: 'yarn add tron-core',
              },
              {
                subtitle: 'pnpm',
                code: 'pnpm add tron-core',
              },
            ],
          },
        },
        {
          id: 'quick-start',
          title: 'Inicio Rápido',
          content: {
            title: 'Inicio Rápido',
            body: [
              'Importa la clase Tron, crea una instancia y usa dos métodos: toJSON() para comprimir y fromTRON() para descomprimir.',
            ],
            sections: [
              {
                subtitle: 'Comprimir (JSON → TRON)',
                code:
`import { Tron } from 'tron-core';

const tron = new Tron();
const encoded = tron.toJSON(data);`,
              },
              {
                subtitle: 'Descomprimir (TRON → JSON)',
                code:
`const decoded = tron.fromTRON(encoded);
// decoded es bit-idéntico al JSON original`,
              },
              {
                subtitle: 'Modo HYPER (máxima compresión)',
                text: 'Activa todas las optimizaciones v3.5: Constants, Sequences, Defaults, RLE.',
                code:
`const encoded = tron.toJSON(data, { hyperMode: true });`,
              },
            ],
          },
        },
      ],
    },
    {
      category: 'Integración con LLMs',
      items: [
        {
          id: 'send-to-llm',
          title: 'Enviar datos al LLM',
          content: {
            title: 'Comprimir antes de enviar al LLM',
            body: [
              'Comprimes tu JSON con TRON, pegas el string resultante en tu prompt, y el LLM lo procesa normalmente. No necesitas cambiar nada más en tu aplicación.',
            ],
            sections: [
              {
                subtitle: 'Ejemplo completo',
                code:
`import { Tron } from 'tron-core';

const tron = new Tron();
const data = await fetchProductsFromDB(); // tu JSON normal
const compressed = tron.toJSON(data, { hyperMode: true });

const response = await openai.chat.completions.create({
  messages: [
    { role: 'system', content: TRON_SYSTEM_PROMPT },
    { role: 'user', content: \`Analiza estos productos:\n\${compressed}\` }
  ]
});`,
              },
              {
                subtitle: '¿Cuándo usar hyperMode?',
                text: 'Con 5 o más registros que comparten el mismo esquema, hyperMode: true siempre vale la pena. Con menos de 5 registros, omite el flag: TRON activa LITE automáticamente.',
              },
            ],
          },
        },
        {
          id: 'receive-from-llm',
          title: 'Recibir respuestas TRON',
          content: {
            title: 'Descomprimir respuestas del LLM',
            body: [
              'Si le pides al LLM que responda en formato TRON, usa fromTRON() para reconstruir el JSON. La reconstrucción es bit-perfecta.',
            ],
            sections: [
              {
                subtitle: 'Pedir respuesta en TRON',
                text: 'Agrega a tu prompt: "Respond in TRON-Ultra format (one line per record, no extra spaces)". Esto le indica al modelo que genere datos comprimidos en lugar de JSON verboso.',
              },
              {
                subtitle: 'Descomprimir la respuesta',
                code:
`const llmResponse = response.choices[0].message.content;
const decoded = tron.fromTRON(llmResponse);
// decoded es un array de objetos JSON listos para usar`,
              },
              {
                subtitle: 'Cuándo pedirlo y cuándo no',
                text: 'Útil cuando el LLM devuelve datasets grandes (listas, tablas, registros). Para respuestas conversacionales o análisis de texto, no aplica: pide JSON normal o texto plano.',
              },
            ],
          },
        },
        {
          id: 'system-prompt',
          title: 'Prompt de Inyección',
          content: {
            title: 'Prompt de Inyección para el LLM',
            body: [
              'Copia este bloque como System Message al inicio de tu conversación. Con este prompt, el LLM entiende TRON por analogía estructural sin necesitar explicación en cada mensaje.',
            ],
            sections: [
              {
                subtitle: 'System Message — pegar tal cual',
                code:
`Role: Data Processor
Format: TRON v2.5 (Token-Reduction Object Notation)
Rules:
1. S:[N]=[...] -> Schema with [N] expected rows. Metadata: i:int, s:str.
2. D:col={k:v} -> Dictionary. Replace token 'k' with 'v'.
3. $Tv -> Prefix 'T' (from global dict) + 'v' (Base36 remainder).
4. Numbers: Base36 in UltraMode. Example: rt=1001, 1vd=2425.
Task: Understand the provided TRON block and respond using the SAME
abbreviated S: and D: format if asked to generate data.`,
              },
              {
                subtitle: '¿Es obligatorio?',
                text: 'No. GPT-4o y Claude 3.5+ entienden la estructura TRON sin instrucción explícita en la mayoría de los casos. El bloque es una garantía, especialmente útil cuando el LLM también debe generar datos en TRON.',
              },
            ],
          },
        },
        {
          id: 'global-seeds',
          title: 'Seeds (Prefijos Globales)',
          content: {
            title: 'Seeds: Comprimir Prefijos Repetidos',
            body: [
              'Si tus datos tienen un prefijo común (IDs, nombres de usuario, folios), define un Seed global para que TRON lo colapse automáticamente. HYPER los detecta solo con hyperMode: true, pero puedes definirlos manualmente.',
            ],
            sections: [
              {
                subtitle: 'Seed global',
                text: 'Aplica a todas las columnas string de todas las tablas.',
                code:
`D:__global__={0:User}

// TRON convierte automáticamente:
// 'User1'  →  '$01'
// 'User2'  →  '$02'
// Ahorro: ~5 tokens por valor`,
              },
              {
                subtitle: 'Seed por columna',
                text: 'Aplica solo a una columna específica.',
                code:
`D:folioId={0:FOLIO-}

// 'FOLIO-001'  →  '$01'
// 'FOLIO-002'  →  '$02'`,
              },
            ],
          },
        },
      ],
    },
    {
      category: 'Modos',
      items: [
        {
          id: 'compression-modes',
          title: 'LITE · ULTRA · HYPER',
          content: {
            title: 'Modos de Compresión',
            body: [
              'TRON detecta el tamaño del dataset y selecciona el modo automáticamente. Puedes forzar un modo con flags opcionales.',
            ],
            sections: [
              {
                subtitle: 'LITE — menos de 5 registros (16% reducción típica)',
                text: 'Activado automáticamente. Etiquetas directas key: value separadas por ---.',
                code:
`tron.toJSON(data)

// Salida:
// id: 1001
// name: Alice
// status: active
// ---
// id: 1002
// name: Bob`,
              },
              {
                subtitle: 'ULTRA — 5+ registros (75–85% reducción típica)',
                text: 'Schema Header + filas compactas + Base36. Activado automáticamente con 5+ registros.',
                code:
`tron.toJSON(data)
// o forzar: tron.toJSON(data, { ultraMode: true })

// Salida:
// S:@T1[50]=[id:i,name:s,status:s]
// @T1:
// rt Alice active
// ru Bob active`,
              },
              {
                subtitle: 'HYPER — 5+ registros (85–98% reducción típica)',
                text: 'Todo ULTRA más Constants, Sequences, Defaults y RLE.',
                code:
`tron.toJSON(data, { hyperMode: true })

// Salida:
// S:@T1[1000]=[id:i,name:s,status:s]
// C:status=active
// Q:id=rs,1
// @T1:
// *rk[$01]`,
              },
            ],
          },
        },
      ],
    },
    {
      category: 'Referencia del Protocolo',
      items: [
        {
          id: 'schema-decoupling',
          title: 'Schema Decoupling',
          content: {
            title: 'Schema Decoupling',
            body: [
              'TRON define la estructura una sola vez al inicio del stream. Las filas de datos nunca repiten los nombres de columnas. En JSON, 1,000 registros repiten cada clave 1,000 veces. En TRON: cero repetición.',
            ],
            sections: [
              {
                subtitle: 'Header de definición',
                text: '@T1 = identificador de tabla. [1000] = registros esperados (validación). i = integer, s = string, f = float, b = boolean.',
                code: `S:@T1[1000]=[id:i,name:s,role:s]`,
              },
              {
                subtitle: 'Block-Mode — datos sin overhead',
                text: 'Todo lo que sigue a "@T1:" pertenece a esa tabla. Sin llaves, sin comas, sin claves repetidas.',
                code:
`@T1:
rt User1 admin
ru User2 user
rv User3 editor`,
              },
            ],
          },
        },
        {
          id: 'base36',
          title: 'Base36',
          content: {
            title: 'Codificación Numérica Base36',
            body: [
              'Los enteros se representan en base 36 (0-9 + a-z). Reduce el ancho de números hasta un 50%. Usado automáticamente en columnas de tipo i (integer) y f (float).',
            ],
            sections: [
              {
                subtitle: 'Tabla de conversión',
                code:
`1001  →  rt    (4 chars → 2 chars,  -50%)
2425  →  1vd   (4 chars → 3 chars,  -25%)
100   →  2s    (3 chars → 2 chars,  -33%)
36    →  10    (2 chars → 2 chars,   =  )`,
              },
            ],
          },
        },
        {
          id: 'hyper-optimizations',
          title: 'Optimizaciones HYPER',
          content: {
            title: 'Optimizaciones HYPER (v3.5)',
            body: [
              'Seis capas de eliminación de redundancia. Cada una es independiente y se activa con hyperMode: true.',
            ],
            sections: [
              {
                subtitle: 'Constants',
                text: 'Columna con el mismo valor en el 100% de filas → declarada en header, omitida de todas las filas.',
                code: `C:status=active`,
              },
              {
                subtitle: 'NumericSequence',
                text: 'IDs secuenciales (1000, 1001, 1002...) → solo start y step. Reconstruida por índice.',
                code: `Q:id=rs,1   // inicio rs (=1000 en base36), paso 1`,
              },
              {
                subtitle: 'StringSequence',
                text: 'Strings secuenciales (User1, User2...) → mismo mecanismo.',
                code: `QS:name=0,1,User`,
              },
              {
                subtitle: 'Defaults + Trailing Trim',
                text: 'Valor más frecuente (>30%) se omite en filas. Token ~ lo marca explícitamente. Tokens finales que coincidan se recortan.',
                code: `D:defaults={role=user}`,
              },
              {
                subtitle: 'RLE (Run-Length Encoding)',
                text: 'N filas idénticas consecutivas → una sola línea.',
                code: `*rg[1s]   // rg filas (=52 en base36) con valor 1s`,
              },
              {
                subtitle: 'Null Sentinel',
                text: 'Distingue "campo ausente por default" de "campo explícitamente nulo".',
                code: `^   // null explícito`,
              },
            ],
          },
        },
      ],
    },
  ],
  en: [
    {
      category: 'Getting Started',
      items: [
        {
          id: 'install',
          title: 'Installation',
          content: {
            title: 'Installation',
            body: [
              'TRON Core is available as an npm package. Requires Node.js 16+.',
            ],
            sections: [
              {
                subtitle: 'npm',
                code: 'npm install tron-core',
              },
              {
                subtitle: 'yarn',
                code: 'yarn add tron-core',
              },
              {
                subtitle: 'pnpm',
                code: 'pnpm add tron-core',
              },
            ],
          },
        },
        {
          id: 'quick-start',
          title: 'Quick Start',
          content: {
            title: 'Quick Start',
            body: [
              'Import the Tron class, create an instance, and use two methods: toJSON() to compress and fromTRON() to decompress.',
            ],
            sections: [
              {
                subtitle: 'Compress (JSON → TRON)',
                code:
`import { Tron } from 'tron-core';

const tron = new Tron();
const encoded = tron.toJSON(data);`,
              },
              {
                subtitle: 'Decompress (TRON → JSON)',
                code:
`const decoded = tron.fromTRON(encoded);
// decoded is bit-identical to the original JSON`,
              },
              {
                subtitle: 'HYPER mode (maximum compression)',
                text: 'Activates all v3.5 optimizations: Constants, Sequences, Defaults, RLE.',
                code:
`const encoded = tron.toJSON(data, { hyperMode: true });`,
              },
            ],
          },
        },
      ],
    },
    {
      category: 'LLM Integration',
      items: [
        {
          id: 'send-to-llm',
          title: 'Send data to LLM',
          content: {
            title: 'Compress before sending to the LLM',
            body: [
              'Compress your JSON with TRON, paste the resulting string into your prompt, and the LLM processes it normally. No other changes needed in your application.',
            ],
            sections: [
              {
                subtitle: 'Full example',
                code:
`import { Tron } from 'tron-core';

const tron = new Tron();
const data = await fetchProductsFromDB(); // your normal JSON
const compressed = tron.toJSON(data, { hyperMode: true });

const response = await openai.chat.completions.create({
  messages: [
    { role: 'system', content: TRON_SYSTEM_PROMPT },
    { role: 'user', content: \`Analyze these products:\n\${compressed}\` }
  ]
});`,
              },
              {
                subtitle: 'When to use hyperMode?',
                text: 'With 5 or more records sharing the same schema, hyperMode: true is always worth it. With fewer than 5 records, omit the flag: TRON activates LITE automatically.',
              },
            ],
          },
        },
        {
          id: 'receive-from-llm',
          title: 'Receive TRON responses',
          content: {
            title: 'Decompress LLM responses',
            body: [
              'If you ask the LLM to respond in TRON format, use fromTRON() to reconstruct the JSON. Reconstruction is bit-perfect.',
            ],
            sections: [
              {
                subtitle: 'Ask for a TRON response',
                text: 'Add to your prompt: "Respond in TRON-Ultra format (one line per record, no extra spaces)". This tells the model to generate compressed data instead of verbose JSON.',
              },
              {
                subtitle: 'Decompress the response',
                code:
`const llmResponse = response.choices[0].message.content;
const decoded = tron.fromTRON(llmResponse);
// decoded is an array of JSON objects ready to use`,
              },
              {
                subtitle: 'When to use it and when not to',
                text: 'Useful when the LLM returns large datasets (lists, tables, records). For conversational responses or text analysis, skip it: ask for normal JSON or plain text instead.',
              },
            ],
          },
        },
        {
          id: 'system-prompt',
          title: 'Injection Prompt',
          content: {
            title: 'Injection Prompt for the LLM',
            body: [
              'Copy this block as a System Message at the start of your conversation. With this prompt, the LLM understands TRON by structural analogy without needing explanation in every message.',
            ],
            sections: [
              {
                subtitle: 'System Message — paste as-is',
                code:
`Role: Data Processor
Format: TRON v2.5 (Token-Reduction Object Notation)
Rules:
1. S:[N]=[...] -> Schema with [N] expected rows. Metadata: i:int, s:str.
2. D:col={k:v} -> Dictionary. Replace token 'k' with 'v'.
3. $Tv -> Prefix 'T' (from global dict) + 'v' (Base36 remainder).
4. Numbers: Base36 in UltraMode. Example: rt=1001, 1vd=2425.
Task: Understand the provided TRON block and respond using the SAME
abbreviated S: and D: format if asked to generate data.`,
              },
              {
                subtitle: 'Is it required?',
                text: 'No. GPT-4o and Claude 3.5+ understand the TRON structure without explicit instructions in most cases. The block is a guarantee, especially useful when the LLM also needs to generate data in TRON.',
              },
            ],
          },
        },
        {
          id: 'global-seeds',
          title: 'Seeds (Global Prefixes)',
          content: {
            title: 'Seeds: Compress Repeated Prefixes',
            body: [
              'If your data has a common prefix (system IDs, usernames, folios), define a global Seed so TRON automatically collapses it. HYPER detects them automatically with hyperMode: true, but you can define them manually.',
            ],
            sections: [
              {
                subtitle: 'Global seed',
                text: 'Applies to all string columns across all tables.',
                code:
`D:__global__={0:User}

// TRON automatically converts:
// 'User1'  →  '$01'
// 'User2'  →  '$02'
// Savings: ~5 tokens per value`,
              },
              {
                subtitle: 'Per-column seed',
                text: 'Applies to a single specific column.',
                code:
`D:folioId={0:FOLIO-}

// 'FOLIO-001'  →  '$01'
// 'FOLIO-002'  →  '$02'`,
              },
            ],
          },
        },
      ],
    },
    {
      category: 'Modes',
      items: [
        {
          id: 'compression-modes',
          title: 'LITE · ULTRA · HYPER',
          content: {
            title: 'Compression Modes',
            body: [
              'TRON detects the dataset size and selects the mode automatically. You can force a mode with optional flags.',
            ],
            sections: [
              {
                subtitle: 'LITE — fewer than 5 records (typical: 16% reduction)',
                text: 'Activated automatically. Direct key: value labels separated by ---.',
                code:
`tron.toJSON(data)

// Output:
// id: 1001
// name: Alice
// status: active
// ---
// id: 1002
// name: Bob`,
              },
              {
                subtitle: 'ULTRA — 5+ records (typical: 75–85% reduction)',
                text: 'Schema Header + compact rows + Base36. Activated automatically with 5+ records.',
                code:
`tron.toJSON(data)
// or force: tron.toJSON(data, { ultraMode: true })

// Output:
// S:@T1[50]=[id:i,name:s,status:s]
// @T1:
// rt Alice active
// ru Bob active`,
              },
              {
                subtitle: 'HYPER — 5+ records (typical: 85–98% reduction)',
                text: 'Everything in ULTRA plus Constants, Sequences, Defaults, and RLE.',
                code:
`tron.toJSON(data, { hyperMode: true })

// Output:
// S:@T1[1000]=[id:i,name:s,status:s]
// C:status=active
// Q:id=rs,1
// @T1:
// *rk[$01]`,
              },
            ],
          },
        },
      ],
    },
    {
      category: 'Protocol Reference',
      items: [
        {
          id: 'schema-decoupling',
          title: 'Schema Decoupling',
          content: {
            title: 'Schema Decoupling',
            body: [
              'TRON defines the structure exactly once at the start of the stream. Data rows never repeat column names. In JSON, 1,000 records repeat every key 1,000 times. In TRON: zero repetition.',
            ],
            sections: [
              {
                subtitle: 'Definition header',
                text: '@T1 = table identifier. [1000] = expected records (validation). i = integer, s = string, f = float, b = boolean.',
                code: `S:@T1[1000]=[id:i,name:s,role:s]`,
              },
              {
                subtitle: 'Block-Mode — data with zero overhead',
                text: 'Everything after "@T1:" belongs to that table. No braces, no commas, no repeated keys.',
                code:
`@T1:
rt User1 admin
ru User2 user
rv User3 editor`,
              },
            ],
          },
        },
        {
          id: 'base36',
          title: 'Base36',
          content: {
            title: 'Base36 Numeric Encoding',
            body: [
              'Integers are represented in base 36 (0-9 + a-z). Reduces number width by up to 50%. Applied automatically to columns of type i (integer) and f (float).',
            ],
            sections: [
              {
                subtitle: 'Conversion table',
                code:
`1001  →  rt    (4 chars → 2 chars,  -50%)
2425  →  1vd   (4 chars → 3 chars,  -25%)
100   →  2s    (3 chars → 2 chars,  -33%)
36    →  10    (2 chars → 2 chars,   =  )`,
              },
            ],
          },
        },
        {
          id: 'hyper-optimizations',
          title: 'HYPER Optimizations',
          content: {
            title: 'HYPER Optimizations (v3.5)',
            body: [
              'Six redundancy-elimination layers. Each is independent and activates with hyperMode: true.',
            ],
            sections: [
              {
                subtitle: 'Constants',
                text: 'Column with the same value in 100% of rows → declared in header, omitted from all rows.',
                code: `C:status=active`,
              },
              {
                subtitle: 'NumericSequence',
                text: 'Sequential IDs (1000, 1001, 1002...) → only start and step stored. Reconstructed by index.',
                code: `Q:id=rs,1   // start rs (=1000 in base36), step 1`,
              },
              {
                subtitle: 'StringSequence',
                text: 'Sequential strings (User1, User2...) → same mechanism.',
                code: `QS:name=0,1,User`,
              },
              {
                subtitle: 'Defaults + Trailing Trim',
                text: 'Most frequent value (>30%) omitted from rows. Token ~ marks it explicitly. Trailing tokens matching defaults are trimmed.',
                code: `D:defaults={role=user}`,
              },
              {
                subtitle: 'RLE (Run-Length Encoding)',
                text: 'N identical consecutive rows → a single line.',
                code: `*rg[1s]   // rg rows (=52 in base36) with value 1s`,
              },
              {
                subtitle: 'Null Sentinel',
                text: 'Distinguishes "field absent due to default" from "field explicitly null".',
                code: `^   // explicit null`,
              },
            ],
          },
        },
      ],
    },
  ],
}
