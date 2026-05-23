# Especificación LOON

**LOON — LLM-Optimized Object Notation**
Versión: **v1.0** · Estado: Working Draft (estable para implementar) · 2026

> Este documento es la referencia para implementar encoders, decoders y validadores de LOON.
> No necesitas leerlo para *usar* LOON — para eso ve la documentación. Es para implementadores y contribuidores.
>
> Para editarlo: este archivo vive en `Tron/public/loon-spec.md`. Cámbialo y vuelve a desplegar; la landing lo sirve en `/loon-spec.md`.

---

## 1. Modelo de datos

LOON modela exactamente el modelo de datos de JSON:

- **Primitivos**: string, number, boolean, `null`.
- **Objetos**: mapeos de clave (string) a valor. El orden de claves se preserva.
- **Arrays**: secuencias ordenadas de valores.

LOON es **array-first**: la entrada se trata como una lista de registros (`any[]`). Un objeto suelto equivale a un registro. Los objetos anidados se aplanan a claves con punto (`user.id`) antes de codificar; el decoder los reconstruye.

El round-trip es **sin pérdida** (`fromLOON(toLOON(x)) === x`) salvo `NORM` (normalización z-score), que es opt-in y aproximada.

---

## 2. Modos de codificación

Tres modos públicos + un fallback:

| Modo | Uso | Características |
|------|-----|----------------|
| `full` | Máxima compresión (APIs, o LLM + `getSpec()`) | Schema con tipos, Base36, diccionarios, secuencias, RLE, anchor. |
| `llm` | Legible para cualquier modelo (nube o local) | Schema sin tipos, decimal plano, sin Base36/RLE/dict. Auto-evidente. |
| `compact` | Datos chicos (<5) o no-uniformes | `#cols` (micro) para tablas uniformes; `key: value ---` para registros sueltos. |
| `compat` | Fallback universal | JSON-hybrid `{S,T,R}`. Se usa automáticamente si el modo elegido lanza error. |

Si no se especifica modo, el selector elige `full` o `compact` según la forma del dataset. Aliases aceptados (deprecados): `adaptive→full`, `local→llm`, `micro→compact`, `json→compat`.

---

## 3. Estructura del documento

Codificación orientada a líneas. El bloque de datos es delimitado por comas (`F:csv`). Orden general de un payload `full`:

```
S:@T1[N]=[col:type,...]      ← esquema (obligatorio en full)
A:full1,full2,...            ← alias (si se abrevian columnas)
DC:col1,col2                 ← columnas enteras en decimal
C:col=val                    ← constantes
Q:/QF:/QS:                   ← secuencias
FP:d=col1,col2               ← fixed-point
X:col=suffix                 ← sufijos
D:col=v0,v1,...              ← diccionarios
D:defaults=col=val,...       ← defaults
AS:col=k1,k2,...             ← sub-esquema de array de objetos
DL:col=first   NM:/LY:       ← delta / normalización (lossy)
@T1:                         ← marcador de inicio de datos
F:csv                        ← filas delimitadas por coma
<filas de datos>
EX:row0=[...]   CK:r,c[,sum] ← ejemplo / checksum (opcional)
END:@T1                      ← sentinel de fin (detecta truncamiento)
```

En modo `llm` el esquema es una sola línea sin tipos: `@T1[N]{col,col,...}` (o `@[N]{...}` omitiendo el id por defecto), seguido directo de filas decimales.

---

## 4. Headers (normativo)

| Header | Forma | Significado |
|--------|-------|-------------|
| Esquema (full) | `S:@{id}[{N}]=[col:type,...]` | Tabla, N filas esperadas, columnas tipadas. |
| Esquema (llm) | `@{id}[{N}]{col,col,...}` | Sin tipos; el decoder infiere por celda. `:a` marca columnas array. |
| Alias | `A:full1,full2,...` | Nombres reales cuando el esquema usa abreviaciones. |
| Decimal | `DC:col1,col2` | Estas columnas enteras van en decimal, no Base36. |
| Constante | `C:col=val` | Mismo valor en todas las filas; columna omitida de las filas. |
| Secuencia entera | `Q:col=start,step` | `row[n] = start + step·n` (Base36). |
| Secuencia float | `QF:col=start,step` | Decimal. |
| Secuencia string | `QS:col=start,step,prefix` | `prefix + (start + step·n)`. |
| Fixed-point | `FP:d=col1,col2` | token entero ÷ 10^d. |
| Sufijo | `X:col=suffix` | Se reañade a cada valor decodificado. |
| Diccionario | `D:col=v0,v1,...` | Token = índice posicional Base36. |
| Defaults | `D:defaults=col=val,...` | `~` o tokens finales ausentes usan el default. |
| Array de objetos | `AS:col=k1,k2,k3` | Celda: campos con `|`, objetos con `;`. |
| Delta | `DL:col=firstValue` | Acumular deltas decimales por fila. |
| Norm (lossy) | `NM:col=mean,std,sigmaT,mT` + `LY:NM` | z-score; valores aproximados. |
| Bloque | `@{id}:` | Inicio de datos. |
| CSV | `F:csv` | Filas delimitadas por coma. |
| Ejemplo | `EX:row0=[col:val,...]` | Fila 0 en claro (verificación). |
| Checksum | `CK:rows,cols[,intSum]` | Verificación de conteo. |
| Sentinel | `END:@{id}` | Fin del bloque; ausencia ⇒ posible truncamiento. |

---

## 5. Tokens de celda y delimitadores

Tokens especiales (cuando una celda completa los iguala):

- `^` → `null`
- `~` → usar el default de la columna (o null si no hay)
- `+` → la clave estaba ausente en esa fila (omitir del objeto)
- `!valor` → string literal crudo (ignora diccionario)
- `*N[t1 t2 …]` → RLE: repetir la fila N veces (N en Base36); `*N[]` = filas all-defaults
- `.` → una fila con todos los valores por defecto
- `[]` → array vacío

Delimitadores:

- `,` separa valores de fila (modo CSV).
- `|` separa elementos de un array primitivo (tipo `a`).
- `;` separa objetos dentro de un array de objetos (`AS:`).

---

## 6. Tipos y codificación numérica

Tipos de columna: `i` int, `f` float, `b` bool, `s` string, `a` array.

- **Base36** (solo `full`): los enteros se escriben en base 36 (`0-9a-z`), salvo columnas listadas en `DC:`. El modo `llm` usa decimal plano siempre.
- **Selección consciente del tokenizador**: Base36 se aplica por columna solo cuando reduce el conteo real de tokens (medido con un tokenizador BPE); si no, decimal.
- **Booleanos**: `1`/`0` en `full`; `true`/`false` en `llm`.
- **Arrays** (tipo `a`): elementos delimitados por `|`; objetos anidados se serializan como JSON escapado.

---

## 7. Escapes

Dentro de valores se escapan con barra invertida:

```
\,   coma literal (dentro de fila CSV)
\|   tubería literal (dentro de array)
\;   punto y coma literal (dentro de AS:)
\\   barra invertida literal
\n \r \t   salto de línea, retorno, tabulación
```

El unescape es de una sola pasada. `encodeHdrVal`/`decodeHdrVal` escapan además comas, llaves y `^` en valores de encabezado.

---

## 8. Round-trip y fallback

La codificación corre en `try/catch`: si el modo elegido lanza error con una forma rara, LOON cae automáticamente a `compat` (JSON-hybrid `{S,T,R}`), que es JSON válido y reconstruye cualquier forma. En `compat`, una clave ausente se marca con un sentinela y se omite al decodificar (no se inventa `null`).

La decodificación auto-detecta el formato por el inicio del payload:

- `{` → JSON-hybrid (compat)
- `#` → micro
- `S:` / `SCHEMA:` / `@…{…}` → adaptativo (full/llm)
- otro → compact

---

## 9. Codecs de formato

LOON actúa como hub tabular bidireccional:

| Codec | Métodos | Notas |
|-------|---------|-------|
| CSV | `fromCSV` / `toCSV` | RFC 4180, inferencia de tipos. |
| XML | `fromXML` / `toXML` | fast-xml-parser; anidamiento → dot-notation; `rowTag` opcional. |
| YAML | `fromYAML` / `toYAML` | Block scalars, secuencias. |
| Tree | `fromTree` / `toTree` | Árbol → lista de adyacencias (`_id` secuencia → `Q:`, `_pid` → `D:`); header `TREE:`. |

---

## 10. Checklist de conformidad

**Encoder** debe:

- Producir UTF-8 con saltos de línea LF.
- Declarar el esquema una vez; nunca repetir nombres de clave en las filas.
- Emitir `[N]` = número real de filas.
- Preservar el orden de claves del objeto.
- Escapar `\, \| \; \\ \n \r \t` en valores.
- `^` para null; `~`/trailing-trim para defaults.
- En `full`: Base36 para enteros salvo `DC:`; en `llm`: decimal plano, sin Base36/RLE/dict.
- Caer a `compat` si una forma no es representable.

**Decoder** debe:

- Auto-detectar el formato por el prefijo.
- Parsear headers por prefijo y registrar el contexto de esquema.
- Reconstruir filas: expandir Base36, diccionarios, secuencias, fixed-point, arrays (`|`/`;`), defaults (`~`), null (`^`), RLE (`*N`).
- Des-aplanar dot-notation a objetos anidados.
- Garantizar el round-trip exacto (salvo NORM).

**Validador** (`validateDecode`) verifica conteo de filas, columnas y tipos contra el esquema; `repairHint` genera una pista mínima de reintento.

---

## 11. Versionado

Versionado semántico (mayor.menor):

- **Mayor** (v1 → v2): cambios incompatibles en el formato de transmisión.
- **Menor** (v1.0 → v1.1): aclaraciones, headers adicionales o cambios compatibles hacia atrás.

El esquema declara `[N]` y opcionalmente `CK:`/`END:` para que un consumidor detecte truncamiento o drift.

---

## 12. Licencia

`loon-core` se publica bajo licencia **MIT**. Puedes implementar encoders/decoders compatibles en cualquier lenguaje a partir de esta especificación. La salida es texto plano y el round-trip es exacto: no hay lock-in.
