/**
 * REPÚBLICA — Sistema Electoral
 *
 * Gestiona el calendario electoral de El Salvador:
 * - Elecciones presidenciales cada 5 años (Feb del año electoral)
 * - Detecta si el turno actual coincide con una fecha electoral
 * - Calcula resultados basados en popularidad, organización y credibilidad
 * - Determina ganador y actualiza la etapa de la partida
 *
 * TypeScript puro — sin React, sin DB.
 */

import type {
  EstadoPartida,
  Eleccion,
  ResultadoElectoral,
  FechaJuego,
  EventoJuego,
  EtapaPartida,
} from '../../types/gameTypes';
import { generarId } from '../../utils/id';

// ---------------------------------------------------------------------------
// CONSTANTES
// ---------------------------------------------------------------------------

/** Mes de las elecciones presidenciales en El Salvador (febrero) */
const MES_ELECCION_PRESIDENCIAL = 2;

/** Ciclo presidencial en años */
const CICLO_PRESIDENCIAL = 5;

// ---------------------------------------------------------------------------
// FUNCIONES EXPORTADAS
// ---------------------------------------------------------------------------

/**
 * Calcula la fecha de la próxima elección presidencial a partir de una fecha base.
 */
export function calcularProximaEleccion(fechaBase: FechaJuego): FechaJuego {
  // Siguiente año electoral (múltiplo de 5 desde 2024: 2029, 2034...)
  const anioBase = 2024;
  let anioEleccion = anioBase;
  while (anioEleccion <= fechaBase.anio) {
    anioEleccion += CICLO_PRESIDENCIAL;
  }
  return { anio: anioEleccion, mes: MES_ELECCION_PRESIDENCIAL as FechaJuego['mes'] };
}

/**
 * Verifica si el turno actual cae en una fecha electoral y, de ser así,
 * celebra las elecciones y devuelve el estado actualizado con resultados.
 */
export function procesarElecciones(estado: EstadoPartida): {
  nuevoEstado: EstadoPartida;
  eleccionCelebrada: Eleccion | null;
  eventosElectorales: EventoJuego[];
} {
  const { fechaActual, proximaEleccionPresidencial } = estado;

  // ¿Es el mes y año electoral?
  const esEleccion =
    fechaActual.anio === proximaEleccionPresidencial.anio &&
    fechaActual.mes === proximaEleccionPresidencial.mes;

  if (!esEleccion) {
    return { nuevoEstado: estado, eleccionCelebrada: null, eventosElectorales: [] };
  }

  // Celebrar elecciones
  const resultados = calcularResultados(estado);
  const ganador = resultados.find((r) => r.gano);

  const eleccion: Eleccion = {
    id: generarId('elec'),
    tipo: 'presidencial',
    fecha: fechaActual,
    resultados,
    ganadorId: ganador?.partidoId ?? null,
    celebrada: true,
  };

  // Determinar nueva etapa
  const jugador = estado.partidos.find((p) => p.esJugador);
  const jugadorGano = ganador?.partidoId === jugador?.id;
  const nuevaEtapa: EtapaPartida = jugadorGano ? 'gobierno' : 'oposición';

  // Próxima elección presidencial (en 5 años)
  const siguienteEleccion: FechaJuego = {
    anio: fechaActual.anio + CICLO_PRESIDENCIAL,
    mes: MES_ELECCION_PRESIDENCIAL as FechaJuego['mes'],
  };

  // Eventos electorales
  const eventosElectorales: EventoJuego[] = [];

  const eventoResultado: EventoJuego = {
    id: generarId('evt'),
    fecha: fechaActual,
    titulo: 'Resultados electorales',
    descripcion: ganador
      ? `${_nombrePartido(estado, ganador.partidoId)} gana la presidencia con ${ganador.porcentaje.toFixed(1)}% de los votos.`
      : 'Las elecciones terminaron sin un ganador claro. Se convoca segunda vuelta.',
    categoria: 'politico',
    esFicticio: true,
  };
  eventosElectorales.push(eventoResultado);

  if (jugadorGano) {
    eventosElectorales.push({
      id: generarId('evt'),
      fecha: fechaActual,
      titulo: '¡Victoria presidencial!',
      descripcion: 'Tu partido ha ganado la presidencia de El Salvador. ¡Comienza la gestión de gobierno!',
      categoria: 'politico',
      esFicticio: true,
    });
  } else if (jugador) {
    const posicion = resultados.findIndex((r) => r.partidoId === jugador.id) + 1;
    eventosElectorales.push({
      id: generarId('evt'),
      fecha: fechaActual,
      titulo: `Derrota electoral — ${posicion}° lugar`,
      descripcion: `Tu partido obtuvo el ${posicion}° lugar con ${resultados.find((r) => r.partidoId === jugador.id)?.porcentaje.toFixed(1) ?? 0}%. Continúa desde la oposición.`,
      categoria: 'politico',
      esFicticio: true,
    });
  }

  const nuevoEstado: EstadoPartida = {
    ...estado,
    etapa: nuevaEtapa,
    elecciones: [...estado.elecciones, eleccion],
    proximaEleccionPresidencial: siguienteEleccion,
    eventos: [...estado.eventos, ...eventosElectorales],
  };

  return { nuevoEstado, eleccionCelebrada: eleccion, eventosElectorales };
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

/**
 * Calcula los resultados electorales basados en atributos de cada partido.
 * Fórmula: score = popularidad*0.5 + credibilidad*0.3 + organizacion*0.2 + ruido
 */
function calcularResultados(estado: EstadoPartida): ResultadoElectoral[] {
  const scores = estado.partidos.map((p) => {
    const base = p.popularidad * 0.5 + p.credibilidad * 0.3 + p.organizacion * 0.2;
    const ruido = (Math.random() - 0.5) * 8; // ±4 puntos de incertidumbre
    return { partido: p, score: Math.max(0.1, base + ruido) };
  });

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

  const resultados: ResultadoElectoral[] = scores
    .map(({ partido, score }) => ({
      partidoId: partido.id,
      votos: Math.round((score / totalScore) * 5_000_000), // 5M votos simulados
      porcentaje: parseFloat(((score / totalScore) * 100).toFixed(2)),
      gano: false,
    }))
    .sort((a, b) => b.porcentaje - a.porcentaje);

  // Marcar ganador (mayoría simple — se puede ampliar a segunda vuelta)
  if (resultados.length > 0) {
    resultados[0].gano = true;
  }

  return resultados;
}

function _nombrePartido(estado: EstadoPartida, id: string): string {
  return estado.partidos.find((p) => p.id === id)?.siglas ?? id;
}
