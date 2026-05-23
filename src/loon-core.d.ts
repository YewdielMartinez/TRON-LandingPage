// Declaración mínima del subset de loon-core usado por la landing.
// La implementación real se resuelve por alias de Vite a ../LOON/dist/index.mjs.
declare module 'loon-core' {
  export type LoonMode = 'full' | 'llm' | 'compact' | 'compat'
  export interface LoonOptions {
    mode?: LoonMode
    tableId?: string
    fields?: string[]
    maxDecimals?: number
    [key: string]: unknown
  }
  export class Loon {
    toLOON(json: unknown[], options?: LoonOptions): string
    fromLOON(loon: string): unknown[]
    reset(): void
  }
  export const loon: Loon
  export interface LoonSpecResult { text: string; sections: string[]; estimatedTokens: number }
  export function getSpec(encoded: string): LoonSpecResult
}
