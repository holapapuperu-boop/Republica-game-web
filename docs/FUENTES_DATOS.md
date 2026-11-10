# Fuentes de datos

## Escenario político 2024 — El Salvador

**Cobertura:** configuración inicial de partidos del escenario de 2024.

- **Tribunal Supremo Electoral (TSE), resultados legislativos 2024.** Nuevas Ideas obtuvo 54 de 60 diputaciones; PCN 2; ARENA 2; PDC 1; VAMOS 1. Consultado el 9 de noviembre de 2026: <https://tse.gob.sv/publico/prensa/359>.
- **Uso en el juego:** esta distribución fija la jerarquía cualitativa inicial: Nuevas Ideas comienza como fuerza dominante en popularidad e influencia nacional.
- **Parámetros de simulación:** popularidad, influencia, organización, credibilidad, comunicación, fondos y afiliados en `src/engine/core/rivales.ts` son valores de balance para la simulación, no encuestas, padrones ni estados financieros reales. Deben sustituirse por series documentadas si se implementa un modo histórico con métricas cuantitativas exactas.
- **Catálogo del escenario:** NI, ARENA, FMLN, GANA, PCN, PDC, VAMOS y Nuestro Tiempo. La presencia en el catálogo no equivale a representación legislativa en 2024.
