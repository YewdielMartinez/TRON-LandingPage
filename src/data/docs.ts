export const DOCS_DATA = {
  es: [
    {
      category: 'Conceptos',
      items: [
        {
          id: 'what-is-loon',
          title: '¿Qué es LOON?',
          content: {
            title: '¿Qué es LOON?',
            body: [
              'LOON (LLM-Optimized Object Notation) es un formato de serialización pensado para gastar la menor cantidad de tokens posible al enviar datos estructurados a un modelo de lenguaje (LLM), sin perder información.',
              'Es a la vez un protocolo (las reglas del formato) y una librería (loon-core, un paquete npm que lo implementa). Tomas tu JSON, lo codificas a LOON, lo metes en el prompt; el modelo lo lee, y si hace falta, lo vuelves a JSON con un solo método.',
            ],
            sections: [
              { subtitle: 'En una frase', text: 'Declara la estructura una sola vez y transmite solo los valores: el resultado pesa mucho menos en tokens pero sigue siendo texto que el modelo puede leer y razonar.' },
              { subtitle: 'Qué NO es', text: 'No es compresión binaria tipo gzip (eso el LLM no lo entiende): LOON sigue siendo texto legible. Tampoco es un servicio ni una base de datos: es una librería que corre donde tú la instales.' },
              { subtitle: '¿Dónde corre?', text: 'En el navegador, en edge functions y en Node. No necesita servidor ni estado externo. El playground de este sitio, por ejemplo, codifica 100% en tu navegador.' },
              { subtitle: 'Sin pérdida (salvo que tú decidas)', text: 'fromLOON(toLOON(x)) devuelve exactamente x. La única transformación con pérdida es NORM (z-score para floats), y solo si la activas explícitamente.' },
            ],
          },
        },
        {
          id: 'why-loon',
          title: '¿Por qué existe?',
          content: {
            title: '¿Por qué existe LOON?',
            body: [
              'Cada llamada a un LLM se cobra por token, y la ventana de contexto es finita. Los formatos como JSON se diseñaron para humanos y máquinas, no para densidad de tokens: una tabla JSON de 50 filas y 8 columnas gasta 2000+ tokens, de los cuales 50–70% son nombres de claves repetidos, comillas, llaves y espacios.',
              'En 1000 registros, la clave "name" se escribe 1000 veces. Eso es estructura, no dato — y la estás pagando en cada llamada.',
            ],
            sections: [
              { subtitle: 'El problema en concreto', text: 'JSON repite cada nombre de campo en cada fila. Multiplica por 10–20 campos típicos y la mayor parte del payload es ruido estructural que el modelo además tiene que leer.' },
              { subtitle: 'Por qué importa tanto (costo cuadrático)', text: 'La atención del transformer escala O(n²) con el número de tokens. Reducir los tokens a la mitad no baja el costo a la mitad: lo baja a la cuarta parte. Una reducción de 4× en tokens ≈ 16× menos cómputo de atención. Comprimir tokens tiene beneficio superlineal.' },
              { subtitle: 'La idea de LOON', text: 'Quitar la redundancia en la capa de transporte: esquema una vez, valores densos, y patrones (constantes, secuencias, repeticiones) reemplazados por descripciones cortas. El modelo recibe los mismos datos en una fracción de los tokens.' },
            ],
          },
        },
        {
          id: 'how-loon',
          title: '¿Cómo funciona?',
          content: {
            title: '¿Cómo funciona? (ejemplo)',
            body: [
              'La idea central es schema-first: en vez de repetir las claves en cada objeto, LOON las declara una vez en un encabezado y luego cada fila son solo valores. Mira el mismo dato en JSON y en LOON (modo full):',
            ],
            sections: [
              { subtitle: 'Antes — JSON', code: `[
  { "id": 1001, "name": "Alice", "role": "admin",  "active": true },
  { "id": 1002, "name": "Bob",   "role": "user",   "active": true },
  { "id": 1003, "name": "Cara",  "role": "user",   "active": false }
]` },
              { subtitle: 'Después — LOON (modo full)', code: `S:@T1[3]=[id:i,name:s,role:s,active:b]
D:role=admin,user
@T1:
rt,Alice,0,1
ru,Bob,1,1
rv,Cara,1,0` },
              { subtitle: 'Qué pasó, línea por línea', text: 'S:@T1[3]=[...] declara el esquema: tabla T1, 3 filas, columnas con tipo (i=int, s=string, b=bool). D:role=... es un diccionario: "admin"=0, "user"=1. @T1: marca el inicio de los datos. Cada fila es solo valores separados por coma: el id va en Base36 (rt=1001), role es el índice del diccionario, active es 1/0. Las claves nunca se repiten.' },
              { subtitle: 'Y de vuelta', text: 'fromLOON() lee el esquema, expande Base36 y diccionarios, y reconstruye el JSON original idéntico. El modo llm hace lo mismo pero en decimal y sin diccionarios, para que un modelo lo entienda sin instrucciones.' },
              { subtitle: 'El motor en 3 pasos', text: 'Codificar = aplanar (objetos anidados → claves con punto) → elegir modo según la forma → analizar columnas y emitir encabezados + filas. Si algo falla con una forma rara, cae automáticamente a compat (JSON válido). Decodificar es el espejo exacto.' },
            ],
          },
        },
        {
          id: 'when-loon',
          title: '¿Cuándo usar qué?',
          content: {
            title: '¿Cuándo usar cada modo?',
            body: ['LOON elige el modo solo si no indicas ninguno. Pero conviene saber cuál pedir según quién va a leer la salida.'],
            sections: [
              { subtitle: 'Guía rápida', code: `Lo lee un parser / API, máxima compresión   → full  (+ getSpec())
Lo lee un LLM (incl. modelos chicos/locales) → llm   (legible, sin spec)
Pocos registros (<5) o forma irregular        → compact (auto)
Forma rara que rompe el encoder                → compat (fallback auto)` },
              { subtitle: 'Cuándo LOON brilla', text: 'Mayor ahorro con datos repetitivos y tabulares: respuestas de APIs con esquema fijo, logs, inventarios, telemetría, listas de registros. Cuantas más filas comparten esquema, mayor la reducción.' },
              { subtitle: 'Cuándo importa menos', text: 'Para un solo objeto, texto libre o esquemas muy variables, el ahorro es menor — pero compact sigue siendo más corto que JSON en la mayoría de los casos. Para análisis conversacional puro, quizá no necesites LOON.' },
            ],
          },
        },
      ],
    },
    {
      category: 'Cheatsheet',
      items: [
        {
          id: 'cheatsheet',
          title: 'JSON → LOON al vistazo',
          content: {
            title: 'Cheatsheet de sintaxis',
            body: [
              'Mapeos rápidos de JSON a LOON. Los ejemplos usan el modo llm (legible) para tablas y compact para registros sueltos; donde cambia, se anota la variante full. Para reglas normativas completas, ver Referencia del Protocolo.',
            ],
            sections: [
              { subtitle: 'Objeto (1 registro)', code: `JSON
{ "id": 1, "name": "Ada" }

LOON (compact)
id: 1
name: Ada` },
              { subtitle: 'Array de objetos (tabular)', text: 'La forma estrella de LOON: el esquema una vez, luego solo valores.', code: `JSON
[ { "id":1,"name":"Alice","role":"admin" },
  { "id":2,"name":"Bob","role":"user" } ]

LOON (llm)
@[2]{id,name,role}
1,Alice,admin
2,Bob,user

LOON (full) — añade Base36, DC:, diccionarios:
S:@T1[2]=[id:i,name:s,role:s]
...` },
              { subtitle: 'Objeto anidado → dot-notation', code: `JSON
{ "user": { "id": 1, "name": "Ada" } }

LOON
@[1]{user.id,user.name}
1,Ada` },
              { subtitle: 'Array de primitivos (tipo a)', text: 'Dentro de una celda van delimitados por tubería |. En compact se usa el sufijo [N].', code: `JSON
{ "tags": ["foo","bar","baz"] }

LOON (llm)            LOON (compact)
@[1]{tags:a}          tags[3]: foo,bar,baz
foo|bar|baz` },
              { subtitle: 'Array vacío', code: `JSON                 LOON
{ "items": [] }      items: []   (token []  en celda)` },
              { subtitle: 'Null y booleanos', code: `JSON                 LOON (llm)    LOON (full)
null            →    ^             ^
true / false    →    true / false  1 / 0` },
              { subtitle: 'Strings ambiguos y con delimitadores', text: 'Los números/booleanos como texto se mantienen string por el tipo de columna (s); no necesitan comillas. La coma dentro de un string se escapa con \\\\,.', code: `JSON                    LOON
{ "version": "123" } →  version: 123        (columna tipo s)
{ "note": "a, b" }   →  note: a\\, b         (coma escapada)` },
            ],
          },
        },
        {
          id: 'symbols',
          title: 'Símbolos & delimitadores',
          content: {
            title: 'Símbolos, delimitadores y tipos',
            body: ['Referencia compacta de los tokens y convenciones del bloque de datos.'],
            sections: [
              { subtitle: 'Tokens de celda', code: `^      null
~      usar el default de la columna
+      la clave estaba ausente en esa fila
!xyz   string literal crudo (ignora diccionario)
*N[…]  RLE: repetir la fila N veces (N en Base36)
.      fila con todos los valores por defecto` },
              { subtitle: 'Delimitadores', code: `,   separa valores de fila   (F:csv)
|   separa elementos de un array primitivo
;   separa objetos en un array de objetos (AS:)
\\  escape:  \\,  \\|  \\\\  \\n  \\r  \\t` },
              { subtitle: 'Tipos de columna', code: `i int   f float   b bool   s string   a array` },
              { subtitle: 'Números: full vs llm', text: 'full escribe enteros en Base36 (rt = 1001) salvo columnas en DC:. llm usa decimal plano siempre, por legibilidad.' },
            ],
          },
        },
      ],
    },
    {
      category: 'Guías',
      items: [
        {
          id: 'format-overview',
          title: 'Visión del formato',
          content: {
            title: 'Visión del formato',
            body: [
              'LOON modela los datos como JSON (primitivos, objetos, arrays) pero es array-first: la entrada se trata como una lista de registros. Un objeto suelto = 1 registro. El esquema se declara una vez y cada fila son solo valores.',
            ],
            sections: [
              { subtitle: 'Objetos y anidamiento', text: 'Las claves anidadas se aplanan a dot-notation; en la salida legible aparecen como columnas user.id, user.name.', code: `{ "user": { "id": 1, "name": "Ada" } }
→  @[1]{user.id,user.name}
   1,Ada` },
              { subtitle: 'Array de primitivos', text: 'Tipo a: elementos separados por tubería dentro de la celda.', code: `{ "tags": ["foo","bar"] }
→  @[1]{tags:a}
   foo|bar` },
              { subtitle: 'Array de objetos uniformes (AS:)', text: 'Las claves se declaran una vez en AS:. En la celda, los campos van con | y los objetos con ;.', code: `items: [ {sku:"A1",qty:2}, {sku:"B2",qty:1} ]
→  AS:items=sku,qty
   ...,A1|2;B2|1` },
              { subtitle: 'Arrays de arrays / no-uniformes', text: 'Los arrays anidados se serializan como elementos escapados. Los datos no-uniformes (filas con claves distintas) caen a compat (JSON-hybrid), que marca claves ausentes sin inventar nulls.' },
              { subtitle: 'Vacíos', code: `{ "items": [] }   →  items: []` },
              { subtitle: 'Comillas, escapes y tipos', text: 'A diferencia de TOON, LOON no usa comillas: el tipo de columna (i/f/b/s/a) desambigua, así que "123" como string se escribe 123 sin comillas. Se escapan los delimitadores: \\, dentro de fila, \\| dentro de array, y \\\\ \\n \\r \\t. null = ^.' },
            ],
          },
        },
        {
          id: 'llm-prompting',
          title: 'Prompting con LLMs',
          content: {
            title: 'Usar LOON con LLMs',
            body: ['LOON sirve para pasar datos estructurados a un LLM gastando menos tokens. Dos caminos: enviarle datos (input) o pedirle que genere LOON (output).'],
            sections: [
              { subtitle: 'Enviar datos (muestra, no describas)', text: 'Envuelve el LOON en un bloque de código. Con modo full, incluye getSpec() como system message; con modo llm no hace falta spec (es auto-evidente).', code: `Datos en formato LOON:
@[3]{id,name,role}
1,Alice,admin
2,Bob,user
3,Cara,user

Tarea: resume los roles.` },
              { subtitle: 'Pedir que genere LOON', text: 'Muestra el encabezado esperado (@[N]{...}) y pide que rellene filas, ajustando [N] al número de filas. Para modelos chicos usa modo llm (decimal, sin Base36).' },
              { subtitle: 'Validar la salida del modelo', text: 'Decodifica y valida contra el esquema; si falla, repairHint() da una pista mínima para reintentar.', code: `const { ok, errors } = loon.validateDecode(encoded, rows);
if (!ok) retry(loon.repairHint(encoded, errors));` },
              { subtitle: 'Sesiones y streaming', text: 'Multi-turno: LoonSession envía spec+esquema una vez (prefijo cacheable) y luego solo filas. Datasets grandes: chunk({ maxTokens }) o encodeStream() / fromLOONStream().' },
              { subtitle: 'Tips', text: 'Muestra ejemplos chicos (2–5 filas), no párrafos. Para razonamiento puro: full + getSpec(); para modelos chicos/locales: llm. Valida siempre antes de confiar en la salida.' },
            ],
          },
        },
      ],
    },
    {
      category: 'Empezar',
      items: [
        {
          id: 'install',
          title: 'Instalación',
          content: {
            title: 'Instalación',
            body: ['LOON Core se distribuye como paquete npm. Requiere Node.js 16+. Funciona en navegador, edge y Node.'],
            sections: [
              { subtitle: 'npm', code: 'npm install loon-core' },
              { subtitle: 'yarn', code: 'yarn add loon-core' },
              { subtitle: 'pnpm', code: 'pnpm add loon-core' },
            ],
          },
        },
        {
          id: 'quick-start',
          title: 'Inicio Rápido',
          content: {
            title: 'Inicio Rápido',
            body: ['Importa el singleton loon (o la clase Loon) y usa dos métodos: toLOON() para codificar y fromLOON() para reconstruir el JSON original.'],
            sections: [
              {
                subtitle: 'Codificar (JSON → LOON)',
                code:
`import { loon } from 'loon-core';

const encoded = loon.toLOON(data);
// modo auto-seleccionado según la forma del dataset`,
              },
              {
                subtitle: 'Decodificar (LOON → JSON)',
                code:
`const decoded = loon.fromLOON(encoded);
// round-trip: idéntico al JSON original`,
              },
              {
                subtitle: 'Forzar un modo',
                text: 'Tres modos públicos: full (máxima compresión), llm (legible) y compact (datos chicos). compat es el fallback universal.',
                code: `const encoded = loon.toLOON(data, { mode: 'full' });`,
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
            body: ['Codifica tu JSON con LOON, pega el string en el prompt y el LLM lo procesa. Para el modo full, acompaña con getSpec() (mini-spec de decode); el modo llm es auto-evidente y no necesita spec.'],
            sections: [
              {
                subtitle: 'Ejemplo completo (modo full + spec)',
                code:
`import { loon, getSpec } from 'loon-core';

const data = await fetchProductsFromDB();
const compressed = loon.toLOON(data, { mode: 'full' });
const spec = getSpec(compressed); // ~200-600 tokens

await openai.chat.completions.create({
  messages: [
    { role: 'system', content: spec.text },
    { role: 'user', content: \`Analiza estos productos:\\n\${compressed}\` }
  ]
});`,
              },
              {
                subtitle: 'full vs llm',
                text: 'full = máxima reducción (~78% vs JSON), requiere la spec. llm = decimal plano, legible y auto-evidente (~44%), ideal para modelos chicos/locales sin spec.',
              },
            ],
          },
        },
        {
          id: 'sessions',
          title: 'Sesiones multi-turno',
          content: {
            title: 'LoonSession — schema una vez, filas después',
            body: ['En conversaciones multi-turno, la spec + headers de esquema se envían una sola vez (prefijo cacheable). Los turnos siguientes envían solo las filas; el LLM las decodifica con el esquema ya en contexto.'],
            sections: [
              {
                subtitle: 'Uso',
                code:
`import { LoonSession } from 'loon-core';

const s = new LoonSession();
s.init(primerLote, { mode: 'full' });
// system prompt (cachéalo): s.primer  (getSpec() + esquema)
// mensaje 1: s.dataBlock
for (const lote of lotesSiguientes) {
  send(s.encodeRows(lote).dataBlock); // solo filas
}`,
              },
            ],
          },
        },
        {
          id: 'roundtrip-validate',
          title: 'Validar y reparar',
          content: {
            title: 'Verificar la decodificación del LLM',
            body: ['Si pides al LLM que responda en LOON, valida su salida contra el esquema. repairHint() genera una pista mínima (~50-150 tokens) con solo las filas erróneas para un reintento.'],
            sections: [
              {
                subtitle: 'validateDecode + repairHint',
                code:
`const { ok, errors } = loon.validateDecode(encoded, rows);
if (!ok) {
  const hint = loon.repairHint(encoded, errors);
  // reenvía 'hint' al LLM para corregir
}`,
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
          title: 'full · llm · compact',
          content: {
            title: 'Modos de Codificación',
            body: ['Si omites el modo, LOON lo elige según la forma del dataset (full o compact). llm es opt-in para consumo por LLM. compat es el fallback automático ante errores.'],
            sections: [
              {
                subtitle: 'full — máxima compresión (~78% vs JSON)',
                text: 'Schema + Base36 + diccionarios + secuencias + RLE + anchor. La salida más pequeña; pensada para APIs/servicios y para LLMs junto con getSpec().',
                code:
`loon.toLOON(data, { mode: 'full' });
// S:@T1[6]=[id:i,name:s,role:s,active:b]
// C:active=... · D:role=... · @T1: · filas Base36`,
              },
              {
                subtitle: 'llm — legible (~44% vs JSON)',
                text: 'Decimal plano, sin Base36/RLE/diccionarios. Auto-evidente para cualquier modelo (nube o local) sin spec. Absorbe el antiguo modo "local".',
                code:
`loon.toLOON(data, { mode: 'llm' });
// @T1[6]{id,name,role,active}
// 1001,Alice,admin,true`,
              },
              {
                subtitle: 'compact — datos chicos / no-uniformes',
                text: 'Para <5 registros o esquemas irregulares. Elige internamente la forma más chica: micro (#cols) para tablas uniformes, o key: value --- para registros sueltos.',
                code:
`loon.toLOON(few, { mode: 'compact' });
// #id,name
// 1,Alice`,
              },
              {
                subtitle: 'compat — fallback universal',
                text: 'JSON-hybrid {S,T,R}: JSON válido que cualquier modelo parsea. Se usa automáticamente si el modo elegido falla al codificar una forma rara.',
                code: `loon.toLOON(data, { mode: 'compat' });`,
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
            body: ['LOON declara la estructura una sola vez. Las filas nunca repiten los nombres de columna. En JSON, 1000 registros repiten cada clave 1000 veces; en LOON: cero repetición.'],
            sections: [
              {
                subtitle: 'Header (modo full)',
                text: '@T1 = id de tabla. [N] = registros esperados (validación). i=int, s=string, f=float, b=bool, a=array.',
                code: `S:@T1[1000]=[id:i,name:s,role:s]`,
              },
              {
                subtitle: 'Header (modo llm, legible)',
                text: 'Sin tipos: el modelo los infiere de la forma de la celda.',
                code:
`@T1[1000]{id,name,role}
1001,Alice,admin`,
              },
            ],
          },
        },
        {
          id: 'base36',
          title: 'Base36',
          content: {
            title: 'Codificación Numérica Base36',
            body: ['En modo full, los enteros se escriben en base 36 (0-9 + a-z), reduciendo su ancho hasta ~50%. El modo llm usa decimal plano para legibilidad.'],
            sections: [
              { subtitle: 'Tabla de conversión', code:
`1001  →  rt    (-50%)
2425  →  1vd   (-25%)
100   →  2s    (-33%)` },
            ],
          },
        },
        {
          id: 'optimizations',
          title: 'Optimizaciones (modo full)',
          content: {
            title: 'Optimizaciones del modo full',
            body: ['Capas independientes de eliminación de redundancia detectadas automáticamente por el analizador de columnas.'],
            sections: [
              { subtitle: 'Constants', text: 'Columna con valor único en todas las filas → al header, omitida de las filas.', code: `C:status=active` },
              { subtitle: 'Sequences', text: 'Progresiones aritméticas (enteras, float o string).', code: `Q:id=rs,1   QF:t=0,0.5   QS:sku=1,1,SKU-` },
              { subtitle: 'Fixed-Point', text: 'Floats con decimales fijos → entero × 10^d → Base36.', code: `FP:2=price,cost` },
              { subtitle: 'Dictionaries', text: 'Valores repetidos → índice posicional Base36.', code: `D:role=admin,user,editor` },
              { subtitle: 'Array-Schema', text: 'Arrays de objetos uniformes: las claves se declaran una vez.', code: `AS:items=sku,name,qty` },
              { subtitle: 'Defaults + RLE', text: 'Valor frecuente omitido (token ~). Filas repetidas → *N[...].', code: `D:defaults=role=user   *rg[...]` },
            ],
          },
        },
      ],
    },
    {
      category: 'Arquitectura',
      items: [
        {
          id: 'src-map',
          title: 'Estructura de src/',
          content: {
            title: 'Cómo está organizado loon-core',
            body: ['El núcleo es modular y stateless. La clase Loon (src/index.ts) orquesta encoder, decoder, codecs y el registro de esquema. Cada pieza tiene una sola responsabilidad, lo que facilita extenderlo o portarlo.'],
            sections: [
              { subtitle: 'encoder/', text: 'LoonEncoder delega en AdaptiveEncoder (adaptive/: analyzer → header → rows) para full/llm, y en compact / micro / json-hybrid para datos chicos, no-uniformes o el fallback.' },
              { subtitle: 'decoder/', text: 'LoonDecoder auto-detecta el formato y enruta a AdaptiveDecoder (adaptive/: header-parser, row-reconstructor, state) o a compact / micro / json-hybrid.' },
              { subtitle: 'compression/', text: 'adaptive.ts = AdaptiveEngine (compress/decompress, arrays, diccionarios, Base36). mode-selector.ts = selectMode() con señales por columna (constantes, secuencias, fixed-point, repetición, cardinalidad, sufijos).' },
              { subtitle: 'state/', text: 'StateManager guarda el LoonContext por esquema (columnas, tipos, diccionarios, defaults, secuencias) compartido entre encode y decode.' },
              { subtitle: 'codecs/ · utils/', text: 'codecs: CSV (RFC 4180), XML (fast-xml-parser), YAML, Tree (árbol ↔ adyacencia). utils: flatten/unflatten, validate, get-spec, count-tokens, auto-type, token-picker.' },
            ],
          },
        },
        {
          id: 'pipeline',
          title: 'Pipeline encode/decode',
          content: {
            title: 'Flujo interno',
            body: ['Encode y decode son simétricos. El round-trip es la invariante central: fromLOON(toLOON(x)) debe ser igual a x.'],
            sections: [
              { subtitle: 'Encode', code: `flatten → selectMode → encode
analyzeColumns → buildHeaders → compressRows
(try/catch → fallback compat si algo falla)` },
              { subtitle: 'Decode', code: `auto-detect ( { · # · S: · @{} · else )
parseHeader → reconstructAdaptiveRow → unflatten` },
            ],
          },
        },
      ],
    },
    {
      category: 'API & Formatos',
      items: [
        {
          id: 'full-api',
          title: 'API completa',
          content: {
            title: 'Métodos públicos de Loon',
            body: ['Todo accesible desde el singleton loon o una instancia new Loon().'],
            sections: [
              { subtitle: 'Núcleo', code: `toLOON(data, opts?)  ·  fromLOON(str)
encode / decode (alias)  ·  reset()` },
              { subtitle: 'Conversión de formatos', code: `fromCSV / toCSV   ·  fromXML / toXML
fromYAML / toYAML  ·  fromTree / toTree` },
              { subtitle: 'Streaming / chunking', text: 'Para datasets grandes: divide en chunks que caben en un presupuesto de tokens, o procesa como stream (la primera porción lleva el esquema; las siguientes solo filas).', code: `chunk(data, { maxTokens })
encodeStream(source)  ·  fromLOONStream(source)` },
              { subtitle: 'Calidad y sesiones', code: `validateDecode(str, rows)  ·  repairHint(str, errors)
getSpec(str)  ·  LoonSession  ·  splitLoon(str)` },
            ],
          },
        },
        {
          id: 'headers-ref',
          title: 'Referencia de headers',
          content: {
            title: 'Todos los headers del protocolo',
            body: ['El decoder los reconoce por prefijo. Se activan solo cuando la optimización aplica, así que un payload simple lleva pocos.'],
            sections: [
              { subtitle: 'Esquema', code: `S:@T1[N]=[col:type]   (full, con tipos i/f/b/s/a)
@T1[N]{col,col}        (llm, sin tipos)` },
              { subtitle: 'Por columna', code: `A: alias    DC: decimal    C: constante
Q: / QF: / QS: secuencias
FP: fixed-point   X: sufijo
D: dict   D:defaults=   AS: array-de-objetos` },
              { subtitle: 'Avanzado / verificación', code: `DL: delta   NM: / LY: norm (lossy)
EX:row0 ejemplo   CK: checksum   END:@T1 sentinel` },
              { subtitle: 'Tokens especiales (en celdas)', code: `~ usar default   ^ null   + clave ausente
!raw literal   *N[...] RLE   . fila all-defaults` },
            ],
          },
        },
      ],
    },
    {
      category: 'Codecs',
      items: [
        {
          id: 'codecs-overview',
          title: 'CSV · XML · YAML',
          content: {
            title: 'Codecs de formato',
            body: ['LOON funciona como hub de intercambio tabular: convierte desde/hacia formatos estándar reutilizando el mismo motor. Los arrays se serializan como tokens delimitados por tubería (v1|v2|v3) dentro de la celda, escapando | y \\\\ para un parseo inequívoco.'],
            sections: [
              { subtitle: 'CSV (RFC 4180)', text: 'Parseo conforme a RFC 4180 con inferencia de tipos.', code: `const loonStr = loon.fromCSV(csv);
const csv = loon.toCSV(loonStr);` },
              { subtitle: 'XML (fast-xml-parser)', text: 'Anidamiento (→ dot-notation) y atributos. rowTag opcional para el elemento de fila.', code: `loon.fromXML(xml, { rowTag: 'item' });
loon.toXML(loonStr, 'data', 'item');` },
              { subtitle: 'YAML', text: 'Block scalars y secuencias.', code: `loon.fromYAML(yaml);
loon.toYAML(loonStr);` },
            ],
          },
        },
        {
          id: 'tree-codec',
          title: 'Tree Codec',
          content: {
            title: 'Tree Codec — jerarquías a lista de adyacencias',
            body: [
              'Las estructuras jerárquicas (árboles DOM, JSON profundamente anidado) se aplanan a filas de lista de adyacencias al codificar. Cada nodo recibe un id entero (secuencia auto-generada) y un id de padre (_pid).',
              'El analizador detecta la secuencia de ids y la reemplaza con un header Q:, eliminando esa columna de las filas. Los _pid suelen ser de baja cardinalidad → comprimen con D:. Un header TREE: se antepone para que toTree() reconstruya la forma original sin argumentos extra.',
            ],
            sections: [
              { subtitle: 'Codificar / reconstruir', code: `const encoded = loon.fromTree(domRoot, { mode: 'full' });
const tree = loon.toTree(encoded); // round-trip exacto` },
              { subtitle: 'Opciones', text: 'childKey (auto-detectado: children/nodes/items…), maxDepth, idCol (_id), pidCol (_pid).' },
              { subtitle: 'Cuándo conviene', text: 'Gana cuando muchos subárboles comparten esquema (DOM, categorías). Para un objeto de configuración único y disperso, LOON cae a una jerarquía indentada (flat=1) que tokeniza más barato que la lista de adyacencias dispersa.' },
            ],
          },
        },
      ],
    },
    {
      category: 'Open Source',
      items: [
        {
          id: 'license',
          title: 'Licencia & Filosofía',
          content: {
            title: 'LOON es open source (MIT)',
            body: [
              'loon-core se publica bajo licencia MIT: puedes usarlo, modificarlo, integrarlo en productos comerciales o académicos y redistribuirlo, conservando el aviso de copyright.',
              'Al ser un protocolo abierto, sin estado de servidor y sin dependencias pesadas, cualquiera puede implementar un encoder/decoder compatible en otro lenguaje a partir de la referencia de headers.',
            ],
            sections: [
              { subtitle: '¿Qué puedes construir?', text: 'Adaptadores en otros lenguajes (Python, Go, Rust), middleware de API que comprima respuestas antes del LLM, plugins para SDKs de modelos, o nuevos modos/optimizaciones sobre el motor adaptativo.' },
              { subtitle: 'Sin lock-in', text: 'La salida es texto plano y el round-trip es exacto: si dejas de usar LOON, fromLOON() te devuelve tu JSON intacto. No hay formato propietario que te ate.' },
            ],
          },
        },
        {
          id: 'contributing',
          title: 'Contribuir',
          content: {
            title: 'Cómo contribuir',
            body: ['El código vive en el repositorio (LOON/). Dependencias de runtime mínimas: fast-xml-parser y yaml (y gpt-tokenizer solo para benchmarks).'],
            sections: [
              { subtitle: 'Build', code: `npm install
npm run build   # tsup → dist (CJS + ESM + .d.ts)` },
              { subtitle: 'Regla de oro: simetría', text: 'Si tocas un header o token en encoder/, refleja el parseo en decoder/. Mantén la invariante de round-trip (codificar → decodificar → idéntico al original).' },
              { subtitle: 'Benchmarks antes del PR', text: 'comprehension-benchmark/ mide reducción de tokens, fidelidad round-trip y accuracy en LLM. Córrelos para no regresar métricas.' },
            ],
          },
        },
      ],
    },
    {
      category: 'Especificación',
      items: [
        {
          id: 'spec',
          title: 'Especificación',
          content: {
            title: 'Especificación de LOON',
            body: [
              'La especificación es la referencia normativa para implementar encoders, decoders y validadores de LOON. No la necesitas para usar LOON — es para implementadores y contribuidores.',
              'Se mantiene como un único archivo Markdown, fácil de editar: vive en Tron/public/loon-spec.md y la landing lo sirve en /loon-spec.md.',
            ],
            sections: [
              { subtitle: 'Descargar', text: 'Usa el botón "Descargar spec" en la página de inicio, o abre directamente la ruta:', code: `/loon-spec.md` },
              { subtitle: 'Recorrido por el documento', code: `1.  Modelo de datos        7.  Escapes
2.  Modos                  8.  Round-trip y fallback
3.  Estructura del doc      9.  Codecs (CSV/XML/YAML/Tree)
4.  Headers (normativo)    10. Checklist de conformidad
5.  Tokens y delimitadores 11. Versionado
6.  Tipos y Base36         12. Licencia (MIT)` },
              { subtitle: 'Versión actual', text: 'v1.0 (Working Draft, estable para implementar). El esquema declara [N] y opcionalmente CK:/END: para detectar truncamiento.' },
              { subtitle: 'Cómo cambiarla', text: 'Edita Tron/public/loon-spec.md y vuelve a desplegar. Versionado semántico: mayor = cambios incompatibles del formato; menor = aclaraciones o adiciones compatibles.' },
            ],
          },
        },
      ],
    },
  ],
  en: [
    {
      category: 'Concepts',
      items: [
        {
          id: 'what-is-loon',
          title: 'What is LOON?',
          content: {
            title: 'What is LOON?',
            body: [
              'LOON (LLM-Optimized Object Notation) is a serialization format built to spend as few tokens as possible when sending structured data to a language model (LLM), without losing information.',
              'It is both a protocol (the format rules) and a library (loon-core, an npm package that implements it). You take your JSON, encode it to LOON, drop it in the prompt; the model reads it, and if needed you turn it back to JSON with a single method.',
            ],
            sections: [
              { subtitle: 'In one sentence', text: 'Declare the structure once and transmit only the values: the result is far smaller in tokens but still text the model can read and reason over.' },
              { subtitle: 'What it is NOT', text: 'Not binary compression like gzip (the LLM cannot read that): LOON stays human-readable text. Not a service or a database either: it is a library that runs wherever you install it.' },
              { subtitle: 'Where does it run?', text: 'In the browser, in edge functions, and in Node. No server, no external state. The playground on this site, for instance, encodes 100% in your browser.' },
              { subtitle: 'Lossless (unless you opt out)', text: 'fromLOON(toLOON(x)) returns exactly x. The only lossy transform is NORM (z-score for floats), and only if you turn it on explicitly.' },
            ],
          },
        },
        {
          id: 'why-loon',
          title: 'Why does it exist?',
          content: {
            title: 'Why does LOON exist?',
            body: [
              'Every LLM call is billed per token, and the context window is finite. Formats like JSON were designed for humans and machines, not token density: a 50-row, 8-column JSON table burns 2000+ tokens, of which 50–70% are repeated key names, quotes, braces and whitespace.',
              'In 1000 records, the key "name" is written 1000 times. That is structure, not data — and you pay for it on every call.',
            ],
            sections: [
              { subtitle: 'The concrete problem', text: 'JSON repeats every field name in every row. Multiply by 10–20 typical fields and most of the payload is structural noise the model also has to read.' },
              { subtitle: 'Why it matters so much (quadratic cost)', text: 'Transformer attention scales O(n²) with token count. Halving tokens does not halve cost — it quarters it. A 4× token reduction ≈ 16× less attention compute. Compressing tokens has superlinear payoff.' },
              { subtitle: 'The LOON idea', text: 'Remove redundancy at the transport layer: schema once, dense values, and patterns (constants, sequences, repetitions) replaced by short descriptions. The model gets the same data in a fraction of the tokens.' },
            ],
          },
        },
        {
          id: 'how-loon',
          title: 'How does it work?',
          content: {
            title: 'How does it work? (example)',
            body: [
              'The core idea is schema-first: instead of repeating keys in every object, LOON declares them once in a header and then each row is just values. Here is the same data in JSON and in LOON (full mode):',
            ],
            sections: [
              { subtitle: 'Before — JSON', code: `[
  { "id": 1001, "name": "Alice", "role": "admin",  "active": true },
  { "id": 1002, "name": "Bob",   "role": "user",   "active": true },
  { "id": 1003, "name": "Cara",  "role": "user",   "active": false }
]` },
              { subtitle: 'After — LOON (full mode)', code: `S:@T1[3]=[id:i,name:s,role:s,active:b]
D:role=admin,user
@T1:
rt,Alice,0,1
ru,Bob,1,1
rv,Cara,1,0` },
              { subtitle: 'What happened, line by line', text: 'S:@T1[3]=[...] declares the schema: table T1, 3 rows, typed columns (i=int, s=string, b=bool). D:role=... is a dictionary: "admin"=0, "user"=1. @T1: marks the start of data. Each row is just comma-separated values: id in Base36 (rt=1001), role is the dictionary index, active is 1/0. Keys are never repeated.' },
              { subtitle: 'And back', text: 'fromLOON() reads the schema, expands Base36 and dictionaries, and rebuilds the identical original JSON. The llm mode does the same but in plain decimal and without dictionaries, so a model understands it with no instructions.' },
              { subtitle: 'The engine in 3 steps', text: 'Encode = flatten (nested objects → dotted keys) → pick a mode from the shape → analyze columns and emit headers + rows. If anything fails on an odd shape, it falls back to compat (valid JSON). Decode is the exact mirror.' },
            ],
          },
        },
        {
          id: 'when-loon',
          title: 'When to use what?',
          content: {
            title: 'When to use each mode?',
            body: ['LOON picks the mode only if you do not specify one. Still, it helps to know which to ask for based on who reads the output.'],
            sections: [
              { subtitle: 'Quick guide', code: `Read by a parser / API, max compression   → full  (+ getSpec())
Read by an LLM (incl. small/local models)  → llm   (readable, no spec)
Few records (<5) or irregular shape          → compact (auto)
Odd shape that breaks the encoder            → compat (auto fallback)` },
              { subtitle: 'When LOON shines', text: 'Biggest savings on repetitive, tabular data: fixed-schema API responses, logs, inventories, telemetry, lists of records. The more rows share a schema, the larger the reduction.' },
              { subtitle: 'When it matters less', text: 'For a single object, free text, or highly variable schemas, savings are smaller — but compact is still shorter than JSON in most cases. For pure conversational analysis, you may not need LOON.' },
            ],
          },
        },
      ],
    },
    {
      category: 'Cheatsheet',
      items: [
        {
          id: 'cheatsheet',
          title: 'JSON → LOON at a glance',
          content: {
            title: 'Syntax cheatsheet',
            body: [
              'Quick JSON-to-LOON mappings. Examples use llm mode (readable) for tables and compact for single records; where it differs, the full variant is noted. For rigorous rules, see Protocol Reference.',
            ],
            sections: [
              { subtitle: 'Object (1 record)', code: `JSON
{ "id": 1, "name": "Ada" }

LOON (compact)
id: 1
name: Ada` },
              { subtitle: 'Array of objects (tabular)', text: "LOON's signature shape: schema once, then values only.", code: `JSON
[ { "id":1,"name":"Alice","role":"admin" },
  { "id":2,"name":"Bob","role":"user" } ]

LOON (llm)
@[2]{id,name,role}
1,Alice,admin
2,Bob,user

LOON (full) — adds Base36, DC:, dictionaries:
S:@T1[2]=[id:i,name:s,role:s]
...` },
              { subtitle: 'Nested object → dot-notation', code: `JSON
{ "user": { "id": 1, "name": "Ada" } }

LOON
@[1]{user.id,user.name}
1,Ada` },
              { subtitle: 'Primitive array (type a)', text: 'Inside a cell, elements are pipe-delimited |. compact uses the [N] suffix.', code: `JSON
{ "tags": ["foo","bar","baz"] }

LOON (llm)            LOON (compact)
@[1]{tags:a}          tags[3]: foo,bar,baz
foo|bar|baz` },
              { subtitle: 'Empty array', code: `JSON                 LOON
{ "items": [] }      items: []   (token []  in cell)` },
              { subtitle: 'Null and booleans', code: `JSON                 LOON (llm)    LOON (full)
null            →    ^             ^
true / false    →    true / false  1 / 0` },
              { subtitle: 'Ambiguous strings & delimiters', text: 'Numbers/booleans as text stay string via the column type (s); no quoting needed. A comma inside a string is escaped with \\\\,.', code: `JSON                    LOON
{ "version": "123" } →  version: 123        (column type s)
{ "note": "a, b" }   →  note: a\\, b         (escaped comma)` },
            ],
          },
        },
        {
          id: 'symbols',
          title: 'Symbols & delimiters',
          content: {
            title: 'Symbols, delimiters and types',
            body: ['Compact reference of the data-block tokens and conventions.'],
            sections: [
              { subtitle: 'Cell tokens', code: `^      null
~      use the column default
+      the key was absent in that row
!xyz   raw literal string (ignores dictionary)
*N[…]  RLE: repeat the row N times (N in Base36)
.      all-defaults row` },
              { subtitle: 'Delimiters', code: `,   separates row values        (F:csv)
|   separates primitive-array elements
;   separates objects in an object-array (AS:)
\\  escape:  \\,  \\|  \\\\  \\n  \\r  \\t` },
              { subtitle: 'Column types', code: `i int   f float   b bool   s string   a array` },
              { subtitle: 'Numbers: full vs llm', text: 'full writes integers in Base36 (rt = 1001) except DC: columns. llm always uses plain decimal for readability.' },
            ],
          },
        },
      ],
    },
    {
      category: 'Guides',
      items: [
        {
          id: 'format-overview',
          title: 'Format overview',
          content: {
            title: 'Format overview',
            body: [
              'LOON models data like JSON (primitives, objects, arrays) but is array-first: input is treated as a list of records. A lone object = 1 record. The schema is declared once and each row is just values.',
            ],
            sections: [
              { subtitle: 'Objects and nesting', text: 'Nested keys flatten to dot-notation; in readable output they appear as columns user.id, user.name.', code: `{ "user": { "id": 1, "name": "Ada" } }
→  @[1]{user.id,user.name}
   1,Ada` },
              { subtitle: 'Primitive array', text: 'Type a: elements are pipe-delimited inside the cell.', code: `{ "tags": ["foo","bar"] }
→  @[1]{tags:a}
   foo|bar` },
              { subtitle: 'Array of uniform objects (AS:)', text: 'Keys are declared once in AS:. Inside the cell, fields use | and objects use ;.', code: `items: [ {sku:"A1",qty:2}, {sku:"B2",qty:1} ]
→  AS:items=sku,qty
   ...,A1|2;B2|1` },
              { subtitle: 'Arrays of arrays / non-uniform', text: 'Nested arrays serialize as escaped elements. Non-uniform data (rows with different keys) falls back to compat (JSON-hybrid), which marks absent keys without inventing nulls.' },
              { subtitle: 'Empty', code: `{ "items": [] }   →  items: []` },
              { subtitle: 'Quoting, escapes and types', text: 'Unlike TOON, LOON needs no quotes: the column type (i/f/b/s/a) disambiguates, so "123" as a string is written 123 without quotes. Delimiters are escaped: \\, inside a row, \\| inside an array, and \\\\ \\n \\r \\t. null = ^.' },
            ],
          },
        },
        {
          id: 'llm-prompting',
          title: 'Prompting with LLMs',
          content: {
            title: 'Using LOON with LLMs',
            body: ['LOON is for passing structured data to an LLM at a lower token cost. Two paths: sending it data (input) or asking it to generate LOON (output).'],
            sections: [
              { subtitle: 'Send data (show, do not describe)', text: 'Wrap the LOON in a code block. With full mode, include getSpec() as a system message; with llm mode no spec is needed (it is self-evident).', code: `Data is in LOON format:
@[3]{id,name,role}
1,Alice,admin
2,Bob,user
3,Cara,user

Task: summarize the roles.` },
              { subtitle: 'Ask it to generate LOON', text: 'Show the expected header (@[N]{...}) and ask it to fill rows, adjusting [N] to the row count. For small models use llm mode (decimal, no Base36).' },
              { subtitle: "Validate the model's output", text: 'Decode and validate against the schema; if it fails, repairHint() gives a minimal retry hint.', code: `const { ok, errors } = loon.validateDecode(encoded, rows);
if (!ok) retry(loon.repairHint(encoded, errors));` },
              { subtitle: 'Sessions and streaming', text: 'Multi-turn: LoonSession sends spec+schema once (cacheable prefix) then rows only. Large datasets: chunk({ maxTokens }) or encodeStream() / fromLOONStream().' },
              { subtitle: 'Tips', text: 'Show small examples (2–5 rows), not paragraphs. For pure reasoning: full + getSpec(); for small/local models: llm. Always validate before trusting the output.' },
            ],
          },
        },
      ],
    },
    {
      category: 'Getting Started',
      items: [
        {
          id: 'install',
          title: 'Installation',
          content: {
            title: 'Installation',
            body: ['LOON Core ships as an npm package. Requires Node.js 16+. Works in browser, edge and Node.'],
            sections: [
              { subtitle: 'npm', code: 'npm install loon-core' },
              { subtitle: 'yarn', code: 'yarn add loon-core' },
              { subtitle: 'pnpm', code: 'pnpm add loon-core' },
            ],
          },
        },
        {
          id: 'quick-start',
          title: 'Quick Start',
          content: {
            title: 'Quick Start',
            body: ['Import the loon singleton (or the Loon class) and use two methods: toLOON() to encode and fromLOON() to rebuild the original JSON.'],
            sections: [
              {
                subtitle: 'Encode (JSON → LOON)',
                code:
`import { loon } from 'loon-core';

const encoded = loon.toLOON(data);
// mode auto-selected from the dataset shape`,
              },
              {
                subtitle: 'Decode (LOON → JSON)',
                code:
`const decoded = loon.fromLOON(encoded);
// round-trip: identical to the original JSON`,
              },
              {
                subtitle: 'Force a mode',
                text: 'Three public modes: full (max compression), llm (readable) and compact (small data). compat is the universal fallback.',
                code: `const encoded = loon.toLOON(data, { mode: 'full' });`,
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
            body: ['Encode your JSON with LOON, paste the string in the prompt and the LLM processes it. For full mode, include getSpec() (a tiny decode spec); the llm mode is self-evident and needs no spec.'],
            sections: [
              {
                subtitle: 'Full example (full mode + spec)',
                code:
`import { loon, getSpec } from 'loon-core';

const data = await fetchProductsFromDB();
const compressed = loon.toLOON(data, { mode: 'full' });
const spec = getSpec(compressed); // ~200-600 tokens

await openai.chat.completions.create({
  messages: [
    { role: 'system', content: spec.text },
    { role: 'user', content: \`Analyze these products:\\n\${compressed}\` }
  ]
});`,
              },
              {
                subtitle: 'full vs llm',
                text: 'full = max reduction (~78% vs JSON), needs the spec. llm = plain decimal, readable and self-evident (~44%), ideal for small/local models without a spec.',
              },
            ],
          },
        },
        {
          id: 'sessions',
          title: 'Multi-turn sessions',
          content: {
            title: 'LoonSession — schema once, rows after',
            body: ['In multi-turn conversations, the spec + schema headers are sent once (cacheable prefix). Later turns send only the rows; the LLM decodes them using the schema already in context.'],
            sections: [
              {
                subtitle: 'Usage',
                code:
`import { LoonSession } from 'loon-core';

const s = new LoonSession();
s.init(firstBatch, { mode: 'full' });
// system prompt (cache it): s.primer  (getSpec() + schema)
// message 1: s.dataBlock
for (const batch of nextBatches) {
  send(s.encodeRows(batch).dataBlock); // rows only
}`,
              },
            ],
          },
        },
        {
          id: 'roundtrip-validate',
          title: 'Validate and repair',
          content: {
            title: "Verify the LLM's decoding",
            body: ['If you ask the LLM to answer in LOON, validate its output against the schema. repairHint() builds a minimal hint (~50-150 tokens) with only the failing rows for a retry.'],
            sections: [
              {
                subtitle: 'validateDecode + repairHint',
                code:
`const { ok, errors } = loon.validateDecode(encoded, rows);
if (!ok) {
  const hint = loon.repairHint(encoded, errors);
  // resend 'hint' to the LLM to fix
}`,
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
          title: 'full · llm · compact',
          content: {
            title: 'Encoding Modes',
            body: ['If you omit the mode, LOON picks one from the dataset shape (full or compact). llm is opt-in for LLM consumption. compat is the automatic on-error fallback.'],
            sections: [
              {
                subtitle: 'full — max compression (~78% vs JSON)',
                text: 'Schema + Base36 + dictionaries + sequences + RLE + anchor. Smallest output; for APIs/services and for LLMs together with getSpec().',
                code:
`loon.toLOON(data, { mode: 'full' });
// S:@T1[6]=[id:i,name:s,role:s,active:b]
// C:active=... · D:role=... · @T1: · Base36 rows`,
              },
              {
                subtitle: 'llm — readable (~44% vs JSON)',
                text: 'Plain decimal, no Base36/RLE/dictionaries. Self-evident for any model (cloud or local) without a spec. Absorbs the old "local" mode.',
                code:
`loon.toLOON(data, { mode: 'llm' });
// @T1[6]{id,name,role,active}
// 1001,Alice,admin,true`,
              },
              {
                subtitle: 'compact — small / non-uniform data',
                text: 'For <5 records or irregular schemas. Internally picks the smallest form: micro (#cols) for uniform tables, or key: value --- for loose records.',
                code:
`loon.toLOON(few, { mode: 'compact' });
// #id,name
// 1,Alice`,
              },
              {
                subtitle: 'compat — universal fallback',
                text: 'JSON-hybrid {S,T,R}: valid JSON any model parses. Used automatically if the chosen mode fails to encode an odd shape.',
                code: `loon.toLOON(data, { mode: 'compat' });`,
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
            body: ['LOON declares the structure exactly once. Rows never repeat column names. In JSON, 1000 records repeat every key 1000 times; in LOON: zero repetition.'],
            sections: [
              {
                subtitle: 'Header (full mode)',
                text: '@T1 = table id. [N] = expected records (validation). i=int, s=string, f=float, b=bool, a=array.',
                code: `S:@T1[1000]=[id:i,name:s,role:s]`,
              },
              {
                subtitle: 'Header (llm mode, readable)',
                text: 'No types: the model infers them from the cell shape.',
                code:
`@T1[1000]{id,name,role}
1001,Alice,admin`,
              },
            ],
          },
        },
        {
          id: 'base36',
          title: 'Base36',
          content: {
            title: 'Base36 Numeric Encoding',
            body: ['In full mode, integers are written in base 36 (0-9 + a-z), cutting their width by up to ~50%. The llm mode uses plain decimal for readability.'],
            sections: [
              { subtitle: 'Conversion table', code:
`1001  →  rt    (-50%)
2425  →  1vd   (-25%)
100   →  2s    (-33%)` },
            ],
          },
        },
        {
          id: 'optimizations',
          title: 'Optimizations (full mode)',
          content: {
            title: 'full mode optimizations',
            body: ['Independent redundancy-elimination layers detected automatically by the column analyzer.'],
            sections: [
              { subtitle: 'Constants', text: 'Column with a single value across all rows → moved to header, omitted from rows.', code: `C:status=active` },
              { subtitle: 'Sequences', text: 'Arithmetic progressions (integer, float or string).', code: `Q:id=rs,1   QF:t=0,0.5   QS:sku=1,1,SKU-` },
              { subtitle: 'Fixed-Point', text: 'Floats with fixed decimals → integer × 10^d → Base36.', code: `FP:2=price,cost` },
              { subtitle: 'Dictionaries', text: 'Repeated values → positional Base36 index.', code: `D:role=admin,user,editor` },
              { subtitle: 'Array-Schema', text: 'Uniform object arrays: keys declared once.', code: `AS:items=sku,name,qty` },
              { subtitle: 'Defaults + RLE', text: 'Frequent value omitted (token ~). Repeated rows → *N[...].', code: `D:defaults=role=user   *rg[...]` },
            ],
          },
        },
      ],
    },
    {
      category: 'Architecture',
      items: [
        {
          id: 'src-map',
          title: 'src/ layout',
          content: {
            title: 'How loon-core is organized',
            body: ['The core is modular and stateless. The Loon class (src/index.ts) orchestrates encoder, decoder, codecs and the schema registry. Each piece has a single responsibility, which makes it easy to extend or port.'],
            sections: [
              { subtitle: 'encoder/', text: 'LoonEncoder delegates to AdaptiveEncoder (adaptive/: analyzer → header → rows) for full/llm, and to compact / micro / json-hybrid for small, non-uniform data or the fallback.' },
              { subtitle: 'decoder/', text: 'LoonDecoder auto-detects the format and routes to AdaptiveDecoder (adaptive/: header-parser, row-reconstructor, state) or to compact / micro / json-hybrid.' },
              { subtitle: 'compression/', text: 'adaptive.ts = AdaptiveEngine (compress/decompress, arrays, dictionaries, Base36). mode-selector.ts = selectMode() with per-column signals (constants, sequences, fixed-point, repetition, cardinality, suffixes).' },
              { subtitle: 'state/', text: 'StateManager holds the per-schema LoonContext (columns, types, dictionaries, defaults, sequences) shared between encode and decode.' },
              { subtitle: 'codecs/ · utils/', text: 'codecs: CSV (RFC 4180), XML (fast-xml-parser), YAML, Tree (tree ↔ adjacency). utils: flatten/unflatten, validate, get-spec, count-tokens, auto-type, token-picker.' },
            ],
          },
        },
        {
          id: 'pipeline',
          title: 'encode/decode pipeline',
          content: {
            title: 'Internal flow',
            body: ['Encode and decode are symmetric. The round-trip is the central invariant: fromLOON(toLOON(x)) must equal x.'],
            sections: [
              { subtitle: 'Encode', code: `flatten → selectMode → encode
analyzeColumns → buildHeaders → compressRows
(try/catch → compat fallback if anything fails)` },
              { subtitle: 'Decode', code: `auto-detect ( { · # · S: · @{} · else )
parseHeader → reconstructAdaptiveRow → unflatten` },
            ],
          },
        },
      ],
    },
    {
      category: 'API & Formats',
      items: [
        {
          id: 'full-api',
          title: 'Full API',
          content: {
            title: 'Loon public methods',
            body: ['All available from the loon singleton or a new Loon() instance.'],
            sections: [
              { subtitle: 'Core', code: `toLOON(data, opts?)  ·  fromLOON(str)
encode / decode (aliases)  ·  reset()` },
              { subtitle: 'Format conversion', code: `fromCSV / toCSV   ·  fromXML / toXML
fromYAML / toYAML  ·  fromTree / toTree` },
              { subtitle: 'Streaming / chunking', text: 'For large datasets: split into chunks that fit a token budget, or process as a stream (the first chunk carries the schema; later ones carry rows only).', code: `chunk(data, { maxTokens })
encodeStream(source)  ·  fromLOONStream(source)` },
              { subtitle: 'Quality and sessions', code: `validateDecode(str, rows)  ·  repairHint(str, errors)
getSpec(str)  ·  LoonSession  ·  splitLoon(str)` },
            ],
          },
        },
        {
          id: 'headers-ref',
          title: 'Headers reference',
          content: {
            title: 'All protocol headers',
            body: ['The decoder recognizes them by prefix. They appear only when the optimization applies, so a simple payload carries few.'],
            sections: [
              { subtitle: 'Schema', code: `S:@T1[N]=[col:type]   (full, with types i/f/b/s/a)
@T1[N]{col,col}        (llm, no types)` },
              { subtitle: 'Per column', code: `A: alias    DC: decimal    C: constant
Q: / QF: / QS: sequences
FP: fixed-point   X: suffix
D: dict   D:defaults=   AS: object-array` },
              { subtitle: 'Advanced / verification', code: `DL: delta   NM: / LY: norm (lossy)
EX:row0 example   CK: checksum   END:@T1 sentinel` },
              { subtitle: 'Special tokens (in cells)', code: `~ use default   ^ null   + key absent
!raw literal   *N[...] RLE   . all-defaults row` },
            ],
          },
        },
      ],
    },
    {
      category: 'Codecs',
      items: [
        {
          id: 'codecs-overview',
          title: 'CSV · XML · YAML',
          content: {
            title: 'Format codecs',
            body: ['LOON acts as a tabular interchange hub: it converts to/from standard formats reusing the same engine. Arrays serialize as pipe-delimited tokens (v1|v2|v3) inside the cell, escaping | and \\\\ for unambiguous parsing.'],
            sections: [
              { subtitle: 'CSV (RFC 4180)', text: 'RFC 4180-compliant parsing with type inference.', code: `const loonStr = loon.fromCSV(csv);
const csv = loon.toCSV(loonStr);` },
              { subtitle: 'XML (fast-xml-parser)', text: 'Nesting (→ dot-notation) and attributes. Optional rowTag for the row element.', code: `loon.fromXML(xml, { rowTag: 'item' });
loon.toXML(loonStr, 'data', 'item');` },
              { subtitle: 'YAML', text: 'Block scalars and sequences.', code: `loon.fromYAML(yaml);
loon.toYAML(loonStr);` },
            ],
          },
        },
        {
          id: 'tree-codec',
          title: 'Tree Codec',
          content: {
            title: 'Tree Codec — hierarchies to adjacency list',
            body: [
              'Hierarchical structures (DOM trees, deeply nested JSON) are flattened to adjacency-list rows on encode. Each node gets an integer id (auto-generated sequence) and a parent id (_pid).',
              'The analyzer detects the id sequence and replaces it with a Q: header, dropping that column from rows. _pid is usually low-cardinality → compresses under D:. A TREE: header is prepended so toTree() rebuilds the original shape with no extra arguments.',
            ],
            sections: [
              { subtitle: 'Encode / rebuild', code: `const encoded = loon.fromTree(domRoot, { mode: 'full' });
const tree = loon.toTree(encoded); // exact round-trip` },
              { subtitle: 'Options', text: 'childKey (auto-detected: children/nodes/items…), maxDepth, idCol (_id), pidCol (_pid).' },
              { subtitle: 'When it pays off', text: 'Wins when many subtrees share a schema (DOM, categories). For a single sparse config object, LOON falls back to an indented hierarchy (flat=1) that tokenizes cheaper than a sparse adjacency list.' },
            ],
          },
        },
      ],
    },
    {
      category: 'Open Source',
      items: [
        {
          id: 'license',
          title: 'License & Philosophy',
          content: {
            title: 'LOON is open source (MIT)',
            body: [
              'loon-core ships under the MIT license: you can use, modify, integrate it into commercial or academic products, and redistribute it, keeping the copyright notice.',
              'As an open protocol with no server state and no heavy dependencies, anyone can implement a compatible encoder/decoder in another language from the headers reference.',
            ],
            sections: [
              { subtitle: 'What can you build?', text: 'Adapters in other languages (Python, Go, Rust), API middleware that compresses responses before the LLM, plugins for model SDKs, or new modes/optimizations on top of the adaptive engine.' },
              { subtitle: 'No lock-in', text: 'Output is plain text and the round-trip is exact: if you stop using LOON, fromLOON() returns your JSON intact. No proprietary format ties you in.' },
            ],
          },
        },
        {
          id: 'contributing',
          title: 'Contributing',
          content: {
            title: 'How to contribute',
            body: ['The code lives in the repository (LOON/). Minimal runtime deps: fast-xml-parser and yaml (and gpt-tokenizer for benchmarks only).'],
            sections: [
              { subtitle: 'Build', code: `npm install
npm run build   # tsup → dist (CJS + ESM + .d.ts)` },
              { subtitle: 'Golden rule: symmetry', text: 'If you touch a header or token in encoder/, mirror the parsing in decoder/. Keep the round-trip invariant (encode → decode → identical to the original).' },
              { subtitle: 'Benchmarks before a PR', text: 'comprehension-benchmark/ measures token reduction, round-trip fidelity and LLM accuracy. Run them so you do not regress metrics.' },
            ],
          },
        },
      ],
    },
    {
      category: 'Specification',
      items: [
        {
          id: 'spec',
          title: 'Specification',
          content: {
            title: 'LOON Specification',
            body: [
              'The specification is the normative reference for implementing LOON encoders, decoders and validators. You do not need it to use LOON — it is for implementers and contributors.',
              'It is kept as a single, easy-to-edit Markdown file: it lives at Tron/public/loon-spec.md and the landing serves it at /loon-spec.md.',
            ],
            sections: [
              { subtitle: 'Download', text: 'Use the "Download spec" button on the home page, or open the path directly:', code: `/loon-spec.md` },
              { subtitle: 'Document tour', code: `1.  Data model            7.  Escapes
2.  Modes                 8.  Round-trip & fallback
3.  Document structure     9.  Codecs (CSV/XML/YAML/Tree)
4.  Headers (normative)   10. Conformance checklist
5.  Tokens & delimiters   11. Versioning
6.  Types & Base36        12. License (MIT)` },
              { subtitle: 'Current version', text: 'v1.0 (Working Draft, stable for implementation). The schema declares [N] and optionally CK:/END: to detect truncation.' },
              { subtitle: 'How to change it', text: 'Edit Tron/public/loon-spec.md and redeploy. Semantic versioning: major = incompatible format changes; minor = clarifications or backward-compatible additions.' },
            ],
          },
        },
      ],
    },
  ],
}
