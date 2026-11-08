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
