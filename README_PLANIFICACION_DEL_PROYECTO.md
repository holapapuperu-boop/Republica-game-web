# REPÚBLICA — Planificación y Arquitectura Técnica del Proyecto

**Documento:** Planificación y Hoja de Ruta de Desarrollo  
**Fecha de creación:** Noviembre 2026  
**Estado:** Propuesta formal aprobada para inicio de Fase 0  
**Referencia Principal:** [README_REPUBLICA (1).md](./README_REPUBLICA%20(1).md)

---

## 1. Diagnóstico del Entorno y Estado Inicial

* **Ubicación del proyecto:** `Republica game web`
* **Herramientas del sistema verificadas:**
  * **Node.js:** `v26.13.0`
  * **npm:** `11.20.0`
  * **Git:** `2.56.0`
* **Archivos existentes al inicio:**
  * `README_REPUBLICA (1).md`: Especificación funcional y de diseño maestra consolidada (versión 1.3, 1.330 líneas).
* **Condición de partida:** No existe código previo ni librerías instaladas. Se parte desde cimientos limpios, garantizando una base moderna, estricta y modular.

---

## 2. Visión y Alcance del Simulador

**REPÚBLICA** es un simulador político, institucional y geopolítico profundo centrado inicialmente en **El Salvador**, diseñado como aplicación web para ejecutarse de forma privada y local en PC.

### Principios Fundamentales del Diseño:
1. **Separación Estricta:**
   * **Interfaz (UI):** Presenta datos e interactúa con el usuario mediante un diseño oscuro, profesional y sobrio.
   * **Motor de Simulación (Engine):** Código TypeScript puro con fórmulas matemáticas deterministas y reproducibles.
   * **Estado de Juego (Store):** Almacén central de variables de la partida.
   * **Persistencia:** Almacenamiento local mediante base de datos del navegador (IndexedDB).
2. **Cero "Efecto Maqueta":** Ningún botón, tarjeta de acción o indicador existirá de forma cosmética; cada elemento visual debe conectarse a mecánicas que alteren variables reales del juego.
3. **Reproducibilidad y Neutralidad:** Los cálculos electorales, legislativos y económicos no dependen de IA generativa; se calculan mediante algoritmos auditables y con pruebas automatizadas.
4. **Fidelidad al Marco Institucional Salvadoreño:**
   * Asamblea Legislativa unicameral (60 diputados para el período actual, comisiones, dictámenes, votaciones con mayorías calificadas y simples, quórum).
   * Organización territorial actualizada a 2024: 14 departamentos y 44 municipios (con distritos).
   * Distinción real entre **influencia partidaria**, **apoyo/intención de voto** y **control institucional de alcaldías**.

---

## 3. Pila Tecnológica Seleccionada y Justificación

| Tecnología | Rol en el Proyecto | Justificación Técnica (Explicación para Aprendizaje) |
| :--- | :--- | :--- |
| **Vite** | Entorno de desarrollo y empaquetador | Inicia el servidor local en milisegundos y refleja cambios en pantalla casi al instante (*Hot Module Replacement*), agilizando el flujo de trabajo. |
| **React** | Biblioteca de interfaz de usuario | Permite modularizar la interfaz en componentes reutilizables (tarjetas de acción, fichas de diputados, indicadores de recursos). |
| **TypeScript (Modo Estricto)** | Lenguaje de programación | Añade tipado estático obligatorio sobre JavaScript. Detecta incoherencias y errores en tiempo de escritura antes de ejecutar el código, indispensable para un simulador con cientos de variables numéricas e institucionales. |
| **Tailwind CSS** | Motor de estilos y diseño | Facilita construir una estética oscura, elegante y minimalista tipo juego de gran estrategia profesional (`#0a0e14`, bordes finos, acentos de color institucional) sin generar desorden en hojas de estilo externas. |
| **Zustand** | Gestión del estado global | Gestiona la "memoria viva" del juego (recursos, fecha, relaciones, partidos). Es mucho más ligero, transparente y fácil de aprender que Redux, permitiendo desacoplar la lógica del motor de los componentes de React. |
| **IndexedDB (con Dexie.js)** | Base de datos local en el navegador | A diferencia de `localStorage` (limitado a 5MB y síncrono), IndexedDB permite almacenar múltiples partidas complejas, historiales por turno y árboles de eventos de forma asíncrona y exportable a archivos `.json`. |
| **SVG Interactivo** | Motor del mapa nacional | Permite renderizar los 14 departamentos y 44 municipios salvadoreños de forma vectorial, nítida, personalizable por colores partidarios y **100% funcional sin conexión a internet**. |
| **Vitest** | Pruebas unitarias automatizadas | Permite escribir tests que verifiquen que las fórmulas electorales, mayorías legislativas y balances económicos arrojen siempre el resultado correcto antes de conectarlos a la pantalla. |

---

## 4. Arquitectura Modular y Estructura de Carpetas

Siguiendo la sección 26 del documento maestro, el proyecto se organizará en una arquitectura limpia y desacoplada:

```text
republica-game-web/
├── docs/                      # Documentación viva, manuales y registro de datos
│   ├── README_REPUBLICA.md    # Especificación funcional maestra
│   ├── README_PLANIFICACION_DEL_PROYECTO.md # Este documento de planificación
│   ├── ARQUITECTURA.md        # Decisiones de diseño de software y diagramas
│   └── FUENTES_DATOS.md       # Registro formal de fuentes (TSE, BCR, etc.)
├── public/
│   ├── data/                  # GeoJSON / SVG del mapa salvadoreño
│   └── assets/                # Iconos, escudos, emblemas de partidos
├── src/
│   ├── engine/                # MOTOR DEL JUEGO (Lógica pura TypeScript, sin React)
│   │   ├── core/              # Avance de turnos mensuales, calendario, reloj
│   │   ├── formulas/          # Matemáticas electorales (D'Hondt, cocientes) y económicas
│   │   └── rules/             # Reglas constitucionales, quórum, mayorías de la Asamblea
│   ├── systems/               # MÓDULOS DE JUEGO (Sistemas independientes y extensibles)
│   │   ├── parties/           # Partidos políticos, dirigentes, afiliados, ideología
│   │   ├── actions/           # Catálogo y resolución de tarjetas de acción
│   │   ├── territorial/       # 14 departamentos, 44 municipios, influencia vs. apoyo
│   │   ├── elections/         # Elecciones presidenciales, legislativas y municipales
│   │   ├── legislature/       # Asamblea Legislativa, 60 diputados, comisiones, leyes
│   │   ├── government/        # Presidencia, gabinete de ministros, decretos
│   │   ├── economy/           # Presupuesto nacional, impuestos, deuda
│   │   └── events/            # Generación de noticias, crisis y acontecimientos
│   ├── store/                 # ALMACÉN DE ESTADO (Zustand)
│   │   ├── gameStore.ts       # Estado global y acciones principales
│   │   └── selectors.ts       # Consultas optimizadas para la interfaz
│   ├── persistence/           # GUARDADO Y CARGA (IndexedDB y exportación/importación)
│   ├── components/            # COMPONENTES VISUALES
│   │   ├── layout/            # Barra superior (recursos, fecha), menú lateral
│   │   ├── cards/             # Tarjetas interactivas de acciones
│   │   ├── map/               # Componente del mapa interactivo SVG
│   │   └── ui/                # Botones, modales, barras, insignias
│   ├── views/                 # PANTALLAS PRINCIPALES DEL JUEGO
│   │   ├── OverviewView.tsx   # Situación general y mapa
│   │   ├── PoliticsView.tsx   # Partidos, acciones y militancia
│   │   ├── AssemblyView.tsx   # Asamblea Legislativa y proyectos de ley
│   │   ├── TerritorialView.tsx# Vista detallada de territorios
│   │   └── SystemView.tsx     # Guardar, cargar, configuración y sandbox
│   └── tests/                 # PRUEBAS AUTOMATIZADAS (Vitest)
│       ├── engine.test.ts
│       ├── elections.test.ts
│       └── legislature.test.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 5. Hoja de Ruta de Desarrollo en Fases

### Fase 0 — Cimientos Técnicos y Configuración (Incremento Inmediato)
* Inicialización de la aplicación con Vite + React + TypeScript en modo estricto.
* Configuración de Tailwind CSS con paleta temática oscura (`dark theme` sobrio).
* Estructuración de directorios y configuración de Vitest para pruebas automáticas.
* Creación de la primera prueba automatizada base para validar el entorno.

### Fase 1 — Base Funcional (Core Loop y Persistencia)
* Definición de tipos de datos fundamentales (`GameState`, `Turn`, `Party`, `Resource`).
* Motor de turnos mensual (`advanceTurn`): procesa el paso del tiempo y genera registro de eventos.
* Sistema de persistencia con IndexedDB: nueva partida, guardar partida, cargar partida, exportar e importar en archivo `.json`.
* Marco de navegación principal: barra superior con fecha, recursos y estado nacional; menú lateral para cambiar de vista.

### Fase 2 — Sistema Político y Tarjetas de Acción
* Creación y personalización de partidos (nombre, sigla, logo, colores, ideología).
* Atributos de partido: popularidad, organización, recursos económicos, afiliados.
* Mecánica de **Tarjetas de Acción**: catálogo de acciones (campaña, organización, recaudación) con costos, requisitos y efectos reales en el estado.

### Fase 3 — Territorio Salvadoreño
* Integración del mapa vectorial interactivo de El Salvador (14 departamentos y 44 municipios).
* Fichas territoriales con población, electores, nivel de influencia y partido gobernante local.
* Competencia territorial entre facciones y despliegue de sedes/acciones locales.

### Fase 4 — Elecciones y Asamblea Legislativa (Pilar Central)
* Calendario electoral y cálculo matemático verificable de resultados.
* Simulación de la Asamblea Legislativa unicameral (60 diputados con disciplina partidaria y posicionamiento).
* Proceso legislativo completo: presentación de proyectos, comisiones, votación en el pleno, quórum, mayorías diferenciadas, sanción o veto presidencial.

### Fase 5 — Gobierno y Administración del Estado
* Módulo de presidencia, ministerios y gabinete.
* Controles y pesos institucionales entre el Ejecutivo y el Legislativo.
* Presupuesto nacional con balance contable real (ingresos, gastos, deuda).

### Fase 6 a 10 — Economía Profunda, Geopolítica, Rutas Alternativas y Pulido
* Indicadores macroeconómicos (PIB, inflación, recaudación).
* Rutas no democráticas, crisis institucionales y estados de excepción narrativos.
* Proyección a mapa geopolítico internacional, diplomacia y conflictos estratégicos por turnos.
* Balance final, optimización y compatibilidad de partidas guardadas.

---

## 6. Riesgos Técnicos Identificados y Medidas Preventivas

1. **Riesgo de "Efecto Maqueta":**
   * *Mitigación:* Cada acción o botón en pantalla debe pasar obligatoriamente por una función pura del motor (`engine/`) que verifique requisitos, descuente costos y actualice el estado. Si no hay recursos suficientes, la acción no se ejecuta.
2. **Complejidad del Marco Territorial 2024:**
   * *Mitigación:* Estructurar los datos geográficos en un formato jerárquico claro (`Departamento -> Municipio (44) -> Distritos`) respaldado por datos oficiales y fuentes verificables.
3. **Pérdida de Compatibilidad en Partidas Guardadas:**
   * *Mitigación:* Cada guardado llevará un número de versión de esquema (`saveVersion: 1.0.0`) y un sistema de migraciones que actualice partidas antiguas sin corromper los datos.
4. **Acoplamiento de Código:**
   * *Mitigación:* Mantener el motor (`src/engine/`) completamente aislado de React y HTML, permitiendo probar toda la lógica del juego de forma independiente mediante tests de Vitest.

---

## 7. Criterios de Aceptación para el Inicio del Proyecto

* El proyecto debe compilar sin advertencias en modo estricto de TypeScript.
* Todas las pruebas automatizadas deben ejecutarse y aprobarse exitosamente.
* La interfaz debe responder de forma fluida y mantener la coherencia visual oscura establecida.
* Toda nueva funcionalidad debe quedar documentada en este archivo o en la documentación técnica complementaria.
