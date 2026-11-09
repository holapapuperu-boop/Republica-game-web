/**
 * REPÚBLICA — Partidos Rivales (partidos reales de El Salvador)
 *
 * Modela los principales partidos políticos históricos y actuales
 * de El Salvador como rivales controlados por la IA.
 *
 * IMPORTANTE: Este módulo es TypeScript puro, sin React ni acceso a DB.
 * Los stats iniciales son aproximaciones para equilibrio de juego,
 * no reflejan posiciones políticas oficiales de dichos partidos.
 */

import type { Partido } from '../../types/gameTypes';
import type { EjeEconomico, EjeSocial } from '../../types/gameTypes';
import { construirIdeologia } from './ideologia';
import { generarId } from '../../utils/id';

// ---------------------------------------------------------------------------
// PLANTILLAS DE PARTIDOS REALES SALVADOREÑOS
// ---------------------------------------------------------------------------

interface PlantillaPartido {
  nombre: string;
  siglas: string;
  colorPrincipal: string;
  colorSecundario: string;
  lema: string;
  ejeEconomico: EjeEconomico;
  ejeSocial: EjeSocial;
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
    // Alianza Republicana Nacionalista — partido de derecha histórico,
    // fundado 1981, gobierno 1989–2009.
    nombre: 'Alianza Republicana Nacionalista',
    siglas: 'ARENA',
    colorPrincipal: '#0038a8',   // Azul ARENA
    colorSecundario: '#cc0000',  // Rojo ARENA
    lema: 'Patria, libertad, democracia',
    ejeEconomico: 'ultraliberal',
    ejeSocial: 'conservador',
    popularidadBase: 32,
    organizacionBase: 50,
    credibilidadBase: 38,
    comunicacionBase: 40,
    experienciaBase: 60,
    fondosBase: 350_000,
    afiliadosBase: 3_500,
  },
  {
    // Frente Farabundo Martí para la Liberación Nacional — izquierda,
    // surgido de los Acuerdos de Paz 1992, gobierno 2009–2019.
    nombre: 'Frente Farabundo Martí para la Liberación Nacional',
    siglas: 'FMLN',
    colorPrincipal: '#cc0000',   // Rojo FMLN
    colorSecundario: '#1a1a1a',  // Negro
    lema: 'El pueblo unido jamás será vencido',
    ejeEconomico: 'socialdemocrata',
    ejeSocial: 'progresista',
    popularidadBase: 22,
    organizacionBase: 42,
    credibilidadBase: 28,
    comunicacionBase: 32,
    experienciaBase: 45,
    fondosBase: 200_000,
    afiliadosBase: 2_800,
  },
  {
    // Gran Alianza por la Unidad Nacional — centro-derecha,
    // surgido de escisiones de ARENA, apoyó a Bukele en 2019.
    nombre: 'Gran Alianza por la Unidad Nacional',
    siglas: 'GANA',
    colorPrincipal: '#f97316',   // Naranja
    colorSecundario: '#431407',
    lema: 'Unidad para el progreso',
    ejeEconomico: 'liberal',
    ejeSocial: 'conservador',
    popularidadBase: 18,
    organizacionBase: 30,
    credibilidadBase: 22,
    comunicacionBase: 25,
    experienciaBase: 25,
    fondosBase: 150_000,
    afiliadosBase: 1_200,
  },
  {
    // Partido de Concertación Nacional — histórico partido de derecha,
    // fundado 1961 (antes PCN), aliado tradicional en coaliciones.
    nombre: 'Partido de Concertación Nacional',
    siglas: 'PCN',
    colorPrincipal: '#16a34a',   // Verde
    colorSecundario: '#14532d',
    lema: 'Orden y progreso nacional',
    ejeEconomico: 'centroeconomico',
    ejeSocial: 'ultraconservador',
    popularidadBase: 10,
    organizacionBase: 35,
    credibilidadBase: 20,
    comunicacionBase: 18,
    experienciaBase: 55,
    fondosBase: 110_000,
    afiliadosBase: 900,
  },
  {
    // Nuevas Ideas — partido fundado por Nayib Bukele, ganó presidencia 2019,
    // supermayoría legislativa 2021.
    nombre: 'Nuevas Ideas',
    siglas: 'NI',
    colorPrincipal: '#7c3aed',   // Morado/violeta
    colorSecundario: '#3b0764',
    lema: 'El Salvador primero',
    ejeEconomico: 'centroeconomico',
    ejeSocial: 'conservador',
    popularidadBase: 42,
    organizacionBase: 45,
    credibilidadBase: 40,
    comunicacionBase: 55,
    experienciaBase: 10,
    fondosBase: 280_000,
    afiliadosBase: 4_000,
  },
  {
    // Nuestro Tiempo — partido progresista moderno, fundado 2018,
    // candidatos jóvenes y agenda de transparencia.
    nombre: 'Nuestro Tiempo',
    siglas: 'NT',
    colorPrincipal: '#0ea5e9',   // Azul cielo
    colorSecundario: '#0c4a6e',
    lema: 'Transparencia y futuro',
    ejeEconomico: 'centroeconomico',
    ejeSocial: 'progresista',
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
// FUNCIÓN PRINCIPAL
// ---------------------------------------------------------------------------

/**
 * Genera un array de partidos rivales (IA) para la partida.
 * @param cantidad Cuántos rivales generar (1–6; default 4).
 */
export function generarPartidosRivales(cantidad: number = 4): Partido[] {
  const n = Math.max(1, Math.min(cantidad, PLANTILLAS_RIVALES.length));
  // Siempre incluir ARENA, FMLN y NI (los más relevantes); el resto aleatorio
  const fijos = PLANTILLAS_RIVALES.slice(0, 3);
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

    popularidad: Math.max(1, tpl.popularidadBase + _variacion(4)),
    organizacion: Math.max(1, tpl.organizacionBase + _variacion(5)),
    credibilidad: Math.max(1, tpl.credibilidadBase + _variacion(4)),
    comunicacion: Math.max(1, tpl.comunicacionBase + _variacion(5)),
    experienciaElectoral: Math.max(0, tpl.experienciaBase + _variacion(8)),

    fondos: tpl.fondosBase + _variacion(25_000),
    afiliados: tpl.afiliadosBase + _variacion(150),

    accionesEjecutadas: 0,
    turnosDesdeFundacion: 0,
  }));
}

// ---------------------------------------------------------------------------
// IA: acción automática por turno
// ---------------------------------------------------------------------------

/**
 * Simula el comportamiento mensual de cada partido rival.
 */
export function turnoRival(partido: Partido): Partido {
  if (partido.esJugador) return partido;

  const puedeActuar = partido.fondos >= 5_000;

  if (!puedeActuar) {
    return {
      ...partido,
      popularidad: Math.max(0, partido.popularidad - 0.5),
      fondos: partido.fondos + 3_000,
    };
  }

  const acciones = [
    _accionCampana,
    _accionOrganizacion,
    _accionComunicacion,
    _accionRecaudacion,
  ];
  const accion = acciones[Math.floor(Math.random() * acciones.length)];
  return accion(partido);
}

// ---------------------------------------------------------------------------
// Acciones internas de la IA
// ---------------------------------------------------------------------------

function _accionCampana(p: Partido): Partido {
  return {
    ...p,
    popularidad: Math.min(100, p.popularidad + 1 + p.comunicacion * 0.03),
    fondos: p.fondos - 5_000,
    accionesEjecutadas: p.accionesEjecutadas + 1,
  };
}

function _accionOrganizacion(p: Partido): Partido {
  return {
    ...p,
    organizacion: Math.min(100, p.organizacion + 1.5),
    afiliados: p.afiliados + Math.floor(5 + p.organizacion * 0.1),
    fondos: p.fondos - 3_000,
    accionesEjecutadas: p.accionesEjecutadas + 1,
  };
}

function _accionComunicacion(p: Partido): Partido {
  return {
    ...p,
    comunicacion: Math.min(100, p.comunicacion + 1),
    credibilidad: Math.min(100, p.credibilidad + 0.5),
    fondos: p.fondos - 4_000,
    accionesEjecutadas: p.accionesEjecutadas + 1,
  };
}

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
