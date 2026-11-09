/**
 * REPÚBLICA — Partidos Rivales con IA Estratégica
 *
 * Partidos reales de El Salvador con personalidades distintas que
 * determinan su comportamiento en cada turno:
 *
 *  agresivo   → ataca al líder cuando va atrás, campaña masiva
 *  defensivo  → prioriza organización y fondos, evita riesgos
 *  oportunista → reacciona al contexto, cambia estrategia según posición
 *  populista  → maximiza popularidad a toda costa, ignora fondos
 *
 * TypeScript puro — sin React, sin DB.
 */

import type {
  Partido,
  EjeEconomico,
  EjeSocial,
  PersonalidadPartido,
  EstadoPartida,
} from '../../types/gameTypes';
import { construirIdeologia } from './ideologia';
import { generarId } from '../../utils/id';

// ---------------------------------------------------------------------------
// PLANTILLAS
// ---------------------------------------------------------------------------

interface PlantillaPartido {
  nombre: string;
  siglas: string;
  colorPrincipal: string;
  colorSecundario: string;
  lema: string;
  ejeEconomico: EjeEconomico;
  ejeSocial: EjeSocial;
  personalidad: PersonalidadPartido;
  popularidadBase: number;
  organizacionBase: number;
  credibilidadBase: number;
  comunicacionBase: number;
  experienciaBase: number;
  fondosBase: number;
  afiliadosBase: number;
}

const PLANTILLAS_RIVALES: PlantillaPartido[] = [
  {
    nombre: 'Alianza Republicana Nacionalista',
    siglas: 'ARENA',
    colorPrincipal: '#0038a8',
    colorSecundario: '#cc0000',
    lema: 'Patria, libertad, democracia',
    ejeEconomico: 'ultraliberal',
    ejeSocial: 'conservador',
    personalidad: 'agresivo',      // Histórico partido de poder — ataca al lider
    popularidadBase: 32,
    organizacionBase: 50,
    credibilidadBase: 38,
    comunicacionBase: 40,
    experienciaBase: 60,
    fondosBase: 350_000,
    afiliadosBase: 3_500,
  },
  {
    nombre: 'Frente Farabundo Martí para la Liberación Nacional',
    siglas: 'FMLN',
    colorPrincipal: '#cc0000',
    colorSecundario: '#1a1a1a',
    lema: 'El pueblo unido jamás será vencido',
    ejeEconomico: 'socialdemocrata',
    ejeSocial: 'progresista',
    personalidad: 'defensivo',     // Reconstruye desde la base tras 2019
    popularidadBase: 22,
    organizacionBase: 42,
    credibilidadBase: 28,
    comunicacionBase: 32,
    experienciaBase: 45,
    fondosBase: 200_000,
    afiliadosBase: 2_800,
  },
  {
    nombre: 'Gran Alianza por la Unidad Nacional',
    siglas: 'GANA',
    colorPrincipal: '#f97316',
    colorSecundario: '#431407',
    lema: 'Unidad para el progreso',
    ejeEconomico: 'liberal',
    ejeSocial: 'conservador',
    personalidad: 'oportunista',   // Busca alianzas y ventanas de oportunidad
    popularidadBase: 18,
    organizacionBase: 30,
    credibilidadBase: 22,
    comunicacionBase: 25,
    experienciaBase: 25,
    fondosBase: 150_000,
    afiliadosBase: 1_200,
  },
  {
    nombre: 'Partido de Concertación Nacional',
    siglas: 'PCN',
    colorPrincipal: '#16a34a',
    colorSecundario: '#14532d',
    lema: 'Orden y progreso nacional',
    ejeEconomico: 'centroeconomico',
    ejeSocial: 'ultraconservador',
    personalidad: 'defensivo',     // Partido histórico — sobrevive consolidando
    popularidadBase: 10,
    organizacionBase: 35,
    credibilidadBase: 20,
    comunicacionBase: 18,
    experienciaBase: 55,
    fondosBase: 110_000,
    afiliadosBase: 900,
  },
  {
    nombre: 'Nuevas Ideas',
    siglas: 'NI',
    colorPrincipal: '#7c3aed',
    colorSecundario: '#3b0764',
    lema: 'El Salvador primero',
    ejeEconomico: 'centroeconomico',
    ejeSocial: 'conservador',
    personalidad: 'populista',     // Domina las redes, maximiza popularidad
    popularidadBase: 42,
    organizacionBase: 45,
    credibilidadBase: 40,
    comunicacionBase: 55,
    experienciaBase: 10,
    fondosBase: 280_000,
    afiliadosBase: 4_000,
  },
  {
    nombre: 'Nuestro Tiempo',
    siglas: 'NT',
    colorPrincipal: '#0ea5e9',
    colorSecundario: '#0c4a6e',
    lema: 'Transparencia y futuro',
    ejeEconomico: 'centroeconomico',
    ejeSocial: 'progresista',
    personalidad: 'oportunista',   // Partido joven — crece atacando escándalos
    popularidadBase: 8,
    organizacionBase: 15,
    credibilidadBase: 18,
    comunicacionBase: 22,
    experienciaBase: 5,
    fondosBase: 60_000,
    afiliadosBase: 350,
  },
];

// ---------------------------------------------------------------------------
// GENERACIÓN
// ---------------------------------------------------------------------------

export function generarPartidosRivales(cantidad: number = 4): Partido[] {
  const n = Math.max(1, Math.min(cantidad, PLANTILLAS_RIVALES.length));
  const fijos = PLANTILLAS_RIVALES.slice(0, 3);                          // ARENA, FMLN, NI siempre
  const opcionales = [...PLANTILLAS_RIVALES.slice(3)].sort(() => Math.random() - 0.5);
  const seleccionados = [...fijos, ...opcionales].slice(0, n);

  return seleccionados.map((tpl) => ({
    id: generarId('partido'),
    nombre: tpl.nombre,
    siglas: tpl.siglas,
    colorPrincipal: tpl.colorPrincipal,
    colorSecundario: tpl.colorSecundario,
    lema: tpl.lema,
    ideologia: construirIdeologia(tpl.ejeEconomico, tpl.ejeSocial),
    esJugador: false,
    personalidad: tpl.personalidad,

    popularidad:         Math.max(1, tpl.popularidadBase + _variacion(4)),
    organizacion:        Math.max(1, tpl.organizacionBase + _variacion(5)),
    credibilidad:        Math.max(1, tpl.credibilidadBase + _variacion(4)),
    comunicacion:        Math.max(1, tpl.comunicacionBase + _variacion(5)),
    experienciaElectoral: Math.max(0, tpl.experienciaBase + _variacion(8)),

    fondos:   tpl.fondosBase + _variacion(25_000),
    afiliados: tpl.afiliadosBase + _variacion(150),

    accionesEjecutadas:   0,
    turnosDesdeFundacion: 0,
  }));
}

// ---------------------------------------------------------------------------
// IA ESTRATÉGICA POR TURNO
// ---------------------------------------------------------------------------

/**
 * Ejecuta el turno de un partido rival según su personalidad y contexto.
 * @param partido  El partido rival a procesar
 * @param estado   Estado actual para contexto (posición relativa, etc.)
 */
export function turnoRival(partido: Partido, estado?: EstadoPartida): Partido {
  if (partido.esJugador) return partido;

  // Sin fondos — recaudación de emergencia
  if (partido.fondos < 5_000) {
    return {
      ...partido,
      popularidad: Math.max(0, partido.popularidad - 0.5),
      fondos: partido.fondos + 3_000,
    };
  }

  const personalidad = partido.personalidad ?? 'oportunista';
  const jugador = estado?.partidos.find((p) => p.esJugador);
  const posicionRival = estado
    ? [...estado.partidos].sort((a, b) => b.popularidad - a.popularidad)
        .findIndex((p) => p.id === partido.id)
    : 2;
  const estaDetras = jugador ? partido.popularidad < jugador.popularidad : true;
  const jugadorEsLider = jugador
    ? [...(estado?.partidos ?? [])].sort((a, b) => b.popularidad - a.popularidad)[0]?.id === jugador.id
    : false;

  switch (personalidad) {
    case 'agresivo':
      return _iaAgresivo(partido, estaDetras, jugadorEsLider);

    case 'defensivo':
      return _iaDefensivo(partido);

    case 'oportunista':
      return _iaOportunista(partido, posicionRival, estaDetras);

    case 'populista':
      return _iaPopulista(partido);

    default:
      return _accionRecaudacion(partido);
  }
}

// ---------------------------------------------------------------------------
// Comportamientos por personalidad
// ---------------------------------------------------------------------------

/** AGRESIVO: si va atrás, campaña masiva; si lidera, consolida organización */
function _iaAgresivo(partido: Partido, estaDetras: boolean, jugadorEsLider: boolean): Partido {
  if (estaDetras && jugadorEsLider) {
    // Ataque: campaña negativa simulada → sube su popularidad más de lo normal
    return {
      ...partido,
      popularidad: Math.min(100, partido.popularidad + 2.5 + partido.comunicacion * 0.04),
      credibilidad: Math.max(0, partido.credibilidad - 1), // coste reputacional del ataque
      fondos: partido.fondos - 8_000,
      accionesEjecutadas: partido.accionesEjecutadas + 1,
    };
  }
  // Lidera — consolida
  return {
    ...partido,
    organizacion: Math.min(100, partido.organizacion + 2),
    fondos: partido.fondos - 4_000,
    accionesEjecutadas: partido.accionesEjecutadas + 1,
  };
}

/** DEFENSIVO: alterna entre organización interna y recaudación de fondos */
function _iaDefensivo(partido: Partido): Partido {
  const fondosBajos = partido.fondos < 80_000;
  if (fondosBajos) {
    return _accionRecaudacion(partido);
  }
  return {
    ...partido,
    organizacion:  Math.min(100, partido.organizacion + 2),
    credibilidad:  Math.min(100, partido.credibilidad + 1),
    afiliados:     partido.afiliados + Math.floor(5 + partido.organizacion * 0.08),
    fondos:        partido.fondos - 3_000,
    accionesEjecutadas: partido.accionesEjecutadas + 1,
  };
}

/** OPORTUNISTA: si va 1°–2° consolida; si va 3°+ ataca; si fondos bajos recauda */
function _iaOportunista(partido: Partido, posicion: number, estaDetras: boolean): Partido {
  if (partido.fondos < 40_000) return _accionRecaudacion(partido);

  if (posicion <= 1) {
    // Líder o segundo — mantener posición con comunicación
    return {
      ...partido,
      comunicacion: Math.min(100, partido.comunicacion + 1.5),
      popularidad:  Math.min(100, partido.popularidad + 1),
      fondos:       partido.fondos - 5_000,
      accionesEjecutadas: partido.accionesEjecutadas + 1,
    };
  }

  if (estaDetras) {
    // Va atrás — push de popularidad apostando todo
    return {
      ...partido,
      popularidad:  Math.min(100, partido.popularidad + 2 + partido.comunicacion * 0.03),
      fondos:       partido.fondos - 7_000,
      accionesEjecutadas: partido.accionesEjecutadas + 1,
    };
  }

  return _accionRecaudacion(partido);
}

/** POPULISTA: siempre maximiza popularidad; ignora organización */
function _iaPopulista(partido: Partido): Partido {
  if (partido.fondos < 20_000) return _accionRecaudacion(partido);

  return {
    ...partido,
    popularidad:  Math.min(100, partido.popularidad + 3 + partido.comunicacion * 0.05),
    comunicacion: Math.min(100, partido.comunicacion + 1),
    fondos:       partido.fondos - 10_000, // gasta más que el resto
    accionesEjecutadas: partido.accionesEjecutadas + 1,
  };
}

// ---------------------------------------------------------------------------
// Acciones atómicas reutilizables
// ---------------------------------------------------------------------------

function _accionRecaudacion(p: Partido): Partido {
  return {
    ...p,
    fondos: p.fondos + 15_000 + p.credibilidad * 50,
    accionesEjecutadas: p.accionesEjecutadas + 1,
  };
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function _variacion(max: number): number {
  return Math.floor((Math.random() * 2 - 1) * max);
}
