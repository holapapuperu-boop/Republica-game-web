/**
 * REPÚBLICA — Tipos de datos centrales del juego
 *
 * Este archivo define las estructuras de datos principales que el motor,
 * el estado (store) y la interfaz comparten. NUNCA duplicar estas definiciones
 * en otros archivos; importarlas siempre desde aquí.
 */

// ---------------------------------------------------------------------------
// FECHA Y TIEMPO
// ---------------------------------------------------------------------------

/** Mes del año (1 = enero, 12 = diciembre) */
export type Mes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Fecha del juego expresada como año y mes (sin horas ni minutos) */
export interface FechaJuego {
  anio: number;
  mes: Mes;
}

// ---------------------------------------------------------------------------
// REGIMEN Y ETAPA POLITICA
// ---------------------------------------------------------------------------

export type RegimeniPolítico =
  | 'democracia'
  | 'autoritarismo'
  | 'dictadura'
  | 'gobierno_transitorio'
  | 'crisis_institucional';

export type EtapaPartida =
  | 'organización'   // El jugador construye su partido, sin ser gobierno
  | 'campaña'        // Período de campaña electoral activo
  | 'elecciones'     // Proceso electoral en curso
  | 'oposición'      // El partido perdió; existe fuera del gobierno
  | 'gobierno';      // El partido ganó la presidencia

// ---------------------------------------------------------------------------
// IDEOLOGIA
// ---------------------------------------------------------------------------

export type EjeEconomico =
  | 'estatismo'
  | 'socialdemocrata'
  | 'centroeconomico'
  | 'liberal'
  | 'ultraliberal';

export type EjeSocial =
  | 'ultraconservador'
  | 'conservador'
  | 'centrista'
  | 'progresista'
  | 'ultraprogresista';

export interface Ideologia {
  ejeEconomico: EjeEconomico;
  ejeSocial: EjeSocial;
  /** Descripción breve: "Centro-izquierda", "Nacionalista conservador", etc. */
  etiqueta: string;
}

// ---------------------------------------------------------------------------
// PARTIDO POLITICO
// ---------------------------------------------------------------------------

export interface Partido {
  id: string;
  nombre: string;
  siglas: string;
  colorPrincipal: string;    // Hex: '#e63946'
  colorSecundario: string;   // Hex: '#1d3557'
  lema: string;
  ideologia: Ideologia;
  esJugador: boolean;        // true = partido controlado por el jugador

  // ---- Atributos (todos 0–100 salvo recursos) ----
  popularidad: number;       // Reconocimiento público general
  /** Capacidad de control territorial a escala nacional (0–100). */
  influenciaNacional?: number;
  organizacion: number;      // Capacidad organizativa y estructura interna
  credibilidad: number;      // Confianza ciudadana
  comunicacion: number;      // Capacidad mediática y de campaña
  experienciaElectoral: number;

  // ---- Recursos ----
  fondos: number;            // Dólares (USD) disponibles
  afiliados: number;         // Número de militantes activos

  // ---- Estadísticas acumuladas ----
  accionesEjecutadas: number;
  turnosDesdeFundacion: number;

  // ---- IA (solo rivales) ----
  personalidad?: PersonalidadPartido;
}

// ---------------------------------------------------------------------------
// RECURSOS DEL JUGADOR
// ---------------------------------------------------------------------------

/** Puntos de Acción disponibles en el turno actual */
export interface RecursosJugador {
  puntosDeAccion: number;    // PA disponibles en este turno (ej.: 3 por mes)
  puntosDeAccionMaximos: number;
}

// ---------------------------------------------------------------------------
// EVENTO DE JUEGO
// ---------------------------------------------------------------------------

export type CategoriaEvento =
  | 'politico'
  | 'economico'
  | 'social'
  | 'internacional'
  | 'accion_jugador'
  | 'sistema';

export interface EventoJuego {
  id: string;
  fecha: FechaJuego;
  titulo: string;
  descripcion: string;
  categoria: CategoriaEvento;
  /** true = inventado por el motor de simulación; false = histórico/dato real */
  esFicticio: boolean;
}

// ---------------------------------------------------------------------------
// ESTADO GLOBAL DE LA PARTIDA
// ---------------------------------------------------------------------------

export interface EstadoPartida {
  /** Versión del esquema de guardado — para migraciones futuras */
  saveVersion: string;
  /** ID único de esta partida */
  partidaId: string;
  /** Nombre que el jugador asigna a su partida */
  nombrePartida: string;

  // ---- Tiempo ----
  fechaActual: FechaJuego;
  turnoActual: number;       // Número del turno (empieza en 1)

  // ---- Estado político nacional ----
  regimen: RegimeniPolítico;
  etapa: EtapaPartida;

  // ---- Partidos ----
  partidos: Partido[];
  /** ID del partido controlado por el jugador */
  partidoJugadorId: string | null;

  // ---- Recursos del turno ----
  recursos: RecursosJugador;

  // ---- Historial de eventos ----
  eventos: EventoJuego[];

  // ---- Elecciones ----
  elecciones: Eleccion[];
  /** Fecha de la próxima elección presidencial */
  proximaEleccionPresidencial: FechaJuego;

  // ---- Metadatos ----
  fechaCreacion: string;     // ISO 8601
  fechaUltimoGuardado: string;
}

// ---------------------------------------------------------------------------
// RESULTADO DEL AVANCE DE TURNO
// ---------------------------------------------------------------------------

/** El motor devuelve este objeto al procesar un turno */
export interface ResultadoTurno {
  nuevoEstado: EstadoPartida;
  eventosGenerados: EventoJuego[];
  mensajeResumen: string;
}

// ---------------------------------------------------------------------------
// ELECCIONES
// ---------------------------------------------------------------------------

export type TipoEleccion =
  | 'presidencial'       // Cada 5 años
  | 'legislativa'        // Cada 3 años (Asamblea)
  | 'municipal';         // Alcaldías

export interface ResultadoElectoral {
  partidoId: string;
  votos: number;        // Votos absolutos simulados
  porcentaje: number;   // 0–100
  escanos?: number;     // Para legislativas
  gano: boolean;
}

export interface Eleccion {
  id: string;
  tipo: TipoEleccion;
  fecha: FechaJuego;
  resultados: ResultadoElectoral[];
  /** Partido ganador (null si aún no se celebró) */
  ganadorId: string | null;
  celebrada: boolean;
}

// ---------------------------------------------------------------------------
// EVENTOS ALEATORIOS (plantillas del catálogo)
// ---------------------------------------------------------------------------

export type ImpactoAtributo =
  | 'popularidad'
  | 'organizacion'
  | 'credibilidad'
  | 'comunicacion'
  | 'fondos'
  | 'afiliados';

export type ObjetivoEvento =
  | 'jugador'       // Solo afecta al jugador
  | 'lider'         // Afecta al partido más popular
  | 'todos'         // Afecta a todos los partidos
  | 'rivales';      // Solo afecta a los rivales

export interface EfectoEvento {
  atributo: ImpactoAtributo;
  delta: number;           // Puede ser negativo
  objetivo: ObjetivoEvento;
}

export interface PlantillaEvento {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: CategoriaEvento;
  probabilidad: number;    // 0–1 por turno
  efectos: EfectoEvento[];
  /** Condición para que el evento pueda dispararse (opcional) */
  condicion?: (estado: EstadoPartida) => boolean;
}

// ---------------------------------------------------------------------------
// PERSONALIDAD DE PARTIDO RIVAL (IA)
// ---------------------------------------------------------------------------

export type PersonalidadPartido =
  | 'agresivo'       // Ataca al líder, invierte en campaña masiva
  | 'defensivo'      // Prioriza organización y fondos, evita riesgos
  | 'oportunista'    // Actúa según el contexto, cambia estrategia
  | 'populista';     // Maximiza popularidad a toda costa, ignora fondos
