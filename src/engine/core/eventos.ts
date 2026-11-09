/**
 * REPÚBLICA — Motor de Eventos Aleatorios
 *
 * Catálogo de eventos que pueden ocurrir durante la partida.
 * Cada turno se evalúa una muestra del catálogo; los que cumplen
 * su condición y superan su probabilidad se disparan.
 *
 * TypeScript puro — sin React, sin DB.
 */

import type {
  EstadoPartida,
  EventoJuego,
  PlantillaEvento,
  EfectoEvento,
  Partido,
} from '../../types/gameTypes';
import { generarId } from '../../utils/id';

// ---------------------------------------------------------------------------
// CATÁLOGO DE EVENTOS
// ---------------------------------------------------------------------------

const CATALOGO: PlantillaEvento[] = [
  // ── POLÍTICOS ──────────────────────────────────────────────────────────────
  {
    id: 'escandalo_corrupcion_lider',
    titulo: 'Escándalo de corrupción',
    descripcion: 'El partido líder es salpicado por acusaciones de fondos irregulares.',
    categoria: 'politico',
    probabilidad: 0.08,
    efectos: [
      { atributo: 'credibilidad', delta: -8, objetivo: 'lider' },
      { atributo: 'popularidad', delta: -5, objetivo: 'lider' },
    ],
    condicion: (e) => e.turnoActual > 3,
  },
  {
    id: 'alianza_rivales',
    titulo: 'Pacto entre partidos rivales',
    descripcion: 'Dos partidos de oposición anuncian una alianza táctica.',
    categoria: 'politico',
    probabilidad: 0.06,
    efectos: [
      { atributo: 'organizacion', delta: 5, objetivo: 'rivales' },
      { atributo: 'popularidad', delta: 3, objetivo: 'rivales' },
    ],
    condicion: (e) => e.partidos.filter((p) => !p.esJugador).length >= 2,
  },
  {
    id: 'desercion_militantes',
    titulo: 'Deserción de militantes',
    descripcion: 'Un sector interno abandona el partido por desacuerdos ideológicos.',
    categoria: 'politico',
    probabilidad: 0.07,
    efectos: [
      { atributo: 'afiliados', delta: -50, objetivo: 'jugador' },
      { atributo: 'organizacion', delta: -3, objetivo: 'jugador' },
    ],
    condicion: (e) => {
      const j = e.partidos.find((p) => p.esJugador);
      return j ? j.afiliados > 100 : false;
    },
  },
  {
    id: 'figura_publica_apoya',
    titulo: 'Figura pública respalda al partido',
    descripcion: 'Un empresario o celebridad reconocida expresa apoyo público al partido.',
    categoria: 'politico',
    probabilidad: 0.07,
    efectos: [
      { atributo: 'popularidad', delta: 4, objetivo: 'jugador' },
      { atributo: 'credibilidad', delta: 2, objetivo: 'jugador' },
    ],
  },
  {
    id: 'debate_televisado',
    titulo: 'Debate televisado',
    descripcion: 'Los principales partidos participan en un debate nacional.',
    categoria: 'politico',
    probabilidad: 0.08,
    efectos: [
      { atributo: 'comunicacion', delta: 2, objetivo: 'todos' },
      { atributo: 'popularidad', delta: 1, objetivo: 'todos' },
    ],
    condicion: (e) => e.turnoActual > 2,
  },
  {
    id: 'acusacion_rival',
    titulo: 'Ataque del rival',
    descripcion: 'El partido con más popularidad lanza una campaña negativa.',
    categoria: 'politico',
    probabilidad: 0.09,
    efectos: [
      { atributo: 'credibilidad', delta: -4, objetivo: 'jugador' },
      { atributo: 'popularidad', delta: -2, objetivo: 'jugador' },
    ],
    condicion: (e) => {
      const j = e.partidos.find((p) => p.esJugador);
      const lider = [...e.partidos].sort((a, b) => b.popularidad - a.popularidad)[0];
      return j ? lider.id !== j.id && j.popularidad > 15 : false;
    },
  },

  // ── ECONÓMICOS ─────────────────────────────────────────────────────────────
  {
    id: 'crisis_economica',
    titulo: 'Crisis económica',
    descripcion: 'Una contracción del PIB genera incertidumbre. Los fondos de todos los partidos se resienten.',
    categoria: 'economico',
    probabilidad: 0.05,
    efectos: [
      { atributo: 'fondos', delta: -20_000, objetivo: 'todos' },
      { atributo: 'credibilidad', delta: -2, objetivo: 'todos' },
    ],
  },
  {
    id: 'bonanza_remesas',
    titulo: 'Alza en remesas',
    descripcion: 'El aumento de remesas familiares reactiva la economía popular.',
    categoria: 'economico',
    probabilidad: 0.06,
    efectos: [
      { atributo: 'popularidad', delta: 2, objetivo: 'todos' },
      { atributo: 'fondos', delta: 10_000, objetivo: 'todos' },
    ],
  },
  {
    id: 'donante_empresarial',
    titulo: 'Donación empresarial',
    descripcion: 'Un sector del empresariado inyecta fondos al partido.',
    categoria: 'economico',
    probabilidad: 0.07,
    efectos: [
      { atributo: 'fondos', delta: 30_000, objetivo: 'jugador' },
    ],
    condicion: (e) => {
      const j = e.partidos.find((p) => p.esJugador);
      return j ? j.credibilidad > 20 : false;
    },
  },
  {
    id: 'investigacion_financiamiento',
    titulo: 'Investigación de financiamiento ilegal',
    descripcion: 'La fiscalía investiga el origen de fondos del partido más financiado.',
    categoria: 'economico',
    probabilidad: 0.05,
    efectos: [
      { atributo: 'credibilidad', delta: -6, objetivo: 'lider' },
      { atributo: 'fondos', delta: -25_000, objetivo: 'lider' },
    ],
    condicion: (e) => e.turnoActual > 4,
  },

  // ── SOCIALES ───────────────────────────────────────────────────────────────
  {
    id: 'protesta_ciudadana',
    titulo: 'Protesta ciudadana',
    descripcion: 'Miles marchan en San Salvador por mejoras sociales.',
    categoria: 'social',
    probabilidad: 0.07,
    efectos: [
      { atributo: 'popularidad', delta: -2, objetivo: 'lider' },
      { atributo: 'popularidad', delta: 3, objetivo: 'rivales' },
    ],
  },
  {
    id: 'ola_criminalidad',
    titulo: 'Alza en criminalidad',
    descripcion: 'Un repunte de violencia urbana domina la agenda noticiosa.',
    categoria: 'social',
    probabilidad: 0.06,
    efectos: [
      { atributo: 'popularidad', delta: -3, objetivo: 'todos' },
      { atributo: 'credibilidad', delta: -2, objetivo: 'lider' },
    ],
  },
  {
    id: 'logro_social',
    titulo: 'Logro social reconocido',
    descripcion: 'Un programa de base del partido gana cobertura mediática positiva.',
    categoria: 'social',
    probabilidad: 0.07,
    efectos: [
      { atributo: 'popularidad', delta: 4, objetivo: 'jugador' },
      { atributo: 'credibilidad', delta: 3, objetivo: 'jugador' },
    ],
    condicion: (e) => {
      const j = e.partidos.find((p) => p.esJugador);
      return j ? j.accionesEjecutadas >= 3 : false;
    },
  },

  // ── INTERNACIONALES ────────────────────────────────────────────────────────
  {
    id: 'presion_internacional',
    titulo: 'Presión internacional',
    descripcion: 'Organismos internacionales cuestionan el estado de la democracia.',
    categoria: 'internacional',
    probabilidad: 0.04,
    efectos: [
      { atributo: 'credibilidad', delta: -3, objetivo: 'lider' },
      { atributo: 'popularidad', delta: 2, objetivo: 'rivales' },
    ],
  },
  {
    id: 'cooperacion_externa',
    titulo: 'Cooperación internacional',
    descripcion: 'Fondos de cooperación extranjera benefician a partidos democráticos.',
    categoria: 'internacional',
    probabilidad: 0.05,
    efectos: [
      { atributo: 'fondos', delta: 15_000, objetivo: 'jugador' },
      { atributo: 'credibilidad', delta: 1, objetivo: 'jugador' },
    ],
  },
];

// ---------------------------------------------------------------------------
// FUNCIÓN PRINCIPAL: evaluar eventos del turno
// ---------------------------------------------------------------------------

/**
 * Evalúa el catálogo de eventos para el turno actual.
 * Devuelve los eventos disparados y el nuevo estado con sus efectos aplicados.
 */
export function evaluarEventos(estado: EstadoPartida): {
  estadoConEventos: EstadoPartida;
  eventosDisparados: EventoJuego[];
} {
  const eventosDisparados: EventoJuego[] = [];
  let nuevoEstado = { ...estado, partidos: [...estado.partidos] };

  for (const plantilla of CATALOGO) {
    // Verificar condición
    if (plantilla.condicion && !plantilla.condicion(nuevoEstado)) continue;

    // Tirar el dado de probabilidad
    if (Math.random() > plantilla.probabilidad) continue;

    // Aplicar efectos
    nuevoEstado = aplicarEfectos(nuevoEstado, plantilla.efectos);

    // Registrar el evento
    const evento: EventoJuego = {
      id: generarId('evt'),
      fecha: nuevoEstado.fechaActual,
      titulo: plantilla.titulo,
      descripcion: plantilla.descripcion,
      categoria: plantilla.categoria,
      esFicticio: true,
    };

    eventosDisparados.push(evento);
  }

  const estadoConEventos: EstadoPartida = {
    ...nuevoEstado,
    eventos: [...nuevoEstado.eventos, ...eventosDisparados],
  };

  return { estadoConEventos, eventosDisparados };
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

function aplicarEfectos(estado: EstadoPartida, efectos: EfectoEvento[]): EstadoPartida {
  let partidos = [...estado.partidos];

  for (const efecto of efectos) {
    partidos = partidos.map((p) => {
      if (!debeAplicar(p, efecto.objetivo, estado)) return p;
      return aplicarEfectoAPartido(p, efecto);
    });
  }

  return { ...estado, partidos };
}

function debeAplicar(
  partido: Partido,
  objetivo: EfectoEvento['objetivo'],
  estado: EstadoPartida,
): boolean {
  switch (objetivo) {
    case 'todos': return true;
    case 'jugador': return partido.esJugador;
    case 'rivales': return !partido.esJugador;
    case 'lider': {
      const lider = [...estado.partidos].sort((a, b) => b.popularidad - a.popularidad)[0];
      return partido.id === lider?.id;
    }
  }
}

function aplicarEfectoAPartido(partido: Partido, efecto: EfectoEvento): Partido {
  const { atributo, delta } = efecto;

  switch (atributo) {
    case 'popularidad':
      return { ...partido, popularidad: clamp(partido.popularidad + delta, 0, 100) };
    case 'organizacion':
      return { ...partido, organizacion: clamp(partido.organizacion + delta, 0, 100) };
    case 'credibilidad':
      return { ...partido, credibilidad: clamp(partido.credibilidad + delta, 0, 100) };
    case 'comunicacion':
      return { ...partido, comunicacion: clamp(partido.comunicacion + delta, 0, 100) };
    case 'fondos':
      return { ...partido, fondos: Math.max(0, partido.fondos + delta) };
    case 'afiliados':
      return { ...partido, afiliados: Math.max(0, partido.afiliados + delta) };
    default:
      return partido;
  }
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
