/**
 * REPÚBLICA — Generador de Partidos Rivales
 *
 * Crea los partidos rivales (controlados por la IA) al inicio de una nueva
 * partida. Los partidos son ficticios pero con nombres, siglas e ideologías
 * plausibles para el contexto salvadoreño.
 *
 * IMPORTANTE: Este módulo es TypeScript puro, sin React ni acceso a DB.
 * Los nombres, colores e ideologías son completamente ficticios y no
 * representan ni atribuyen posiciones a partidos reales de El Salvador.
 */

import type { Partido } from '../../types/gameTypes';
import type { EjeEconomico, EjeSocial } from '../../types/gameTypes';
import { construirIdeologia } from './ideologia';
import { generarId } from '../../utils/id';

// ---------------------------------------------------------------------------
// PLANTILLAS DE PARTIDOS FICTICIOS
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
  fondosBase: number;
  afiliadosBase: number;
}

const PLANTILLAS_RIVALES: PlantillaPartido[] = [
  {
    nombre: 'Partido Acción Nacional',
    siglas: 'PAN',
    colorPrincipal: '#dc2626',
    colorSecundario: '#7f1d1d',
    lema: 'Orden y prosperidad para El Salvador',
    ejeEconomico: 'liberal',
    ejeSocial: 'conservador',
    popularidadBase: 35,
    organizacionBase: 40,
    credibilidadBase: 30,
    fondosBase: 180_000,
    afiliadosBase: 850,
  },
  {
    nombre: 'Movimiento Pueblo Unido',
    siglas: 'MPU',
    colorPrincipal: '#16a34a',
    colorSecundario: '#14532d',
    lema: 'La fuerza está en el pueblo',
    ejeEconomico: 'socialdemocrata',
    ejeSocial: 'progresista',
    popularidadBase: 28,
    organizacionBase: 32,
    credibilidadBase: 25,
    fondosBase: 120_000,
    afiliadosBase: 1_200,
  },
  {
    nombre: 'Alianza Democrática Cristiana',
    siglas: 'ADC',
    colorPrincipal: '#d97706',
    colorSecundario: '#78350f',
    lema: 'Fe, familia y nación',
    ejeEconomico: 'centroeconomico',
    ejeSocial: 'conservador',
    popularidadBase: 22,
    organizacionBase: 28,
    credibilidadBase: 35,
    fondosBase: 95_000,
    afiliadosBase: 600,
  },
  {
    nombre: 'Frente de Renovación Ciudadana',
    siglas: 'FRC',
    colorPrincipal: '#7c3aed',
    colorSecundario: '#3b0764',
    lema: 'Un nuevo contrato con el ciudadano',
    ejeEconomico: 'centroeconomico',
    ejeSocial: 'progresista',
    popularidadBase: 18,
    organizacionBase: 20,
    credibilidadBase: 20,
    fondosBase: 75_000,
    afiliadosBase: 400,
  },
];

// ---------------------------------------------------------------------------
// FUNCIÓN PRINCIPAL
// ---------------------------------------------------------------------------

/**
 * Genera un array de partidos rivales (IA) para la partida.
 * @param cantidad Cuántos rivales generar (1–4; default 3).
 */
export function generarPartidosRivales(cantidad: number = 3): Partido[] {
  const n = Math.max(1, Math.min(cantidad, PLANTILLAS_RIVALES.length));
  // Barajar las plantillas para que no siempre sean los mismos
  const barajadas = [...PLANTILLAS_RIVALES].sort(() => Math.random() - 0.5);

  return barajadas.slice(0, n).map((tpl) => ({
    id: generarId('partido'),
    nombre: tpl.nombre,
    siglas: tpl.siglas,
    colorPrincipal: tpl.colorPrincipal,
    colorSecundario: tpl.colorSecundario,
    lema: tpl.lema,
    ideologia: construirIdeologia(tpl.ejeEconomico, tpl.ejeSocial),
    esJugador: false,

    popularidad: tpl.popularidadBase + _variacion(5),
    organizacion: tpl.organizacionBase + _variacion(5),
    credibilidad: tpl.credibilidadBase + _variacion(5),
    comunicacion: 10 + _variacion(8),
    experienciaElectoral: 15 + _variacion(10),

    fondos: tpl.fondosBase + _variacion(20_000),
    afiliados: tpl.afiliadosBase + _variacion(100),

    accionesEjecutadas: 0,
    turnosDesdeFundacion: 0,
  }));
}

// ---------------------------------------------------------------------------
// IA: acción automática por turno
// ---------------------------------------------------------------------------

/**
 * Simula el comportamiento mensual de cada partido rival.
 * Aplica cambios modestos a sus atributos para darle vida al sistema político.
 *
 * @param partido - Partido rival (esJugador === false).
 * @returns Partido con atributos actualizados tras un mes de actividad.
 */
export function turnoRival(partido: Partido): Partido {
  if (partido.esJugador) return partido; // Nunca tocar el partido del jugador

  // Decisión de acción: el rival actúa si tiene fondos suficientes
  const puedeActuar = partido.fondos >= 5_000;

  if (!puedeActuar) {
    // Sin fondos: decaen muy levemente
    return {
      ...partido,
      popularidad: Math.max(0, partido.popularidad - 0.5),
      fondos: partido.fondos + 3_000, // Recaudación mínima pasiva
    };
  }

  // Elegir acción aleatoria de un conjunto predefinido
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

/** Variación aleatoria simétrica: ±max */
function _variacion(max: number): number {
  return Math.floor((Math.random() * 2 - 1) * max);
}
