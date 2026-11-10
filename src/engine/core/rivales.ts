/**
 * Partidos del escenario El Salvador 2024.
 *
 * Las cifras de atributos son parámetros de balance, no son encuestas ni
 * registros de afiliación. La jerarquía inicial se calibra con el resultado
 * legislativo oficial de 2024: NI obtuvo 54 de los 60 escaños.
 */

import type { Partido, EjeEconomico, EjeSocial, PersonalidadPartido, EstadoPartida } from '../../types/gameTypes';
import { construirIdeologia } from './ideologia';
import { generarId } from '../../utils/id';

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
  influenciaNacionalBase: number;
  organizacionBase: number;
  credibilidadBase: number;
  comunicacionBase: number;
  experienciaBase: number;
  fondosBase: number;
  afiliadosBase: number;
}

const PLANTILLAS_RIVALES: PlantillaPartido[] = [
  {
    nombre: 'Nuevas Ideas', siglas: 'NI', colorPrincipal: '#00ABED', colorSecundario: '#003B5C',
    lema: 'El Salvador primero', ejeEconomico: 'centroeconomico', ejeSocial: 'conservador', personalidad: 'populista',
    popularidadBase: 85, influenciaNacionalBase: 88, organizacionBase: 78, credibilidadBase: 72, comunicacionBase: 88,
    experienciaBase: 48, fondosBase: 800_000, afiliadosBase: 10_000,
  },
  {
    nombre: 'Alianza Republicana Nacionalista', siglas: 'ARENA', colorPrincipal: '#08088A', colorSecundario: '#FFFFFF',
    lema: 'Patria, libertad, democracia', ejeEconomico: 'ultraliberal', ejeSocial: 'conservador', personalidad: 'agresivo',
    popularidadBase: 24, influenciaNacionalBase: 20, organizacionBase: 52, credibilidadBase: 32, comunicacionBase: 38,
    experienciaBase: 68, fondosBase: 260_000, afiliadosBase: 3_500,
  },
  {
    nombre: 'Frente Farabundo Martí para la Liberación Nacional', siglas: 'FMLN', colorPrincipal: '#CC0000', colorSecundario: '#1A1A1A',
    lema: 'El pueblo unido jamás será vencido', ejeEconomico: 'socialdemocrata', ejeSocial: 'progresista', personalidad: 'defensivo',
    popularidadBase: 21, influenciaNacionalBase: 17, organizacionBase: 44, credibilidadBase: 27, comunicacionBase: 30,
    experienciaBase: 58, fondosBase: 170_000, afiliadosBase: 2_800,
  },
  {
    nombre: 'Gran Alianza por la Unidad Nacional', siglas: 'GANA', colorPrincipal: '#F59E0B', colorSecundario: '#78350F',
    lema: 'Unidad para el progreso', ejeEconomico: 'liberal', ejeSocial: 'conservador', personalidad: 'oportunista',
    popularidadBase: 16, influenciaNacionalBase: 16, organizacionBase: 34, credibilidadBase: 24, comunicacionBase: 26,
    experienciaBase: 36, fondosBase: 140_000, afiliadosBase: 1_200,
  },
  {
    nombre: 'Partido de Concertación Nacional', siglas: 'PCN', colorPrincipal: '#448DE8', colorSecundario: '#12356B',
    lema: 'Orden y progreso nacional', ejeEconomico: 'centroeconomico', ejeSocial: 'ultraconservador', personalidad: 'defensivo',
    popularidadBase: 14, influenciaNacionalBase: 15, organizacionBase: 38, credibilidadBase: 24, comunicacionBase: 20,
    experienciaBase: 62, fondosBase: 120_000, afiliadosBase: 900,
  },
  {
    nombre: 'Partido Demócrata Cristiano', siglas: 'PDC', colorPrincipal: '#00A550', colorSecundario: '#064E2A',
    lema: 'Humanismo y justicia social', ejeEconomico: 'centroeconomico', ejeSocial: 'conservador', personalidad: 'defensivo',
    popularidadBase: 13, influenciaNacionalBase: 13, organizacionBase: 32, credibilidadBase: 23, comunicacionBase: 18,
    experienciaBase: 58, fondosBase: 100_000, afiliadosBase: 750,
  },
  {
    nombre: 'VAMOS', siglas: 'VAMOS', colorPrincipal: '#104D8F', colorSecundario: '#9CC8FF',
    lema: 'Una nueva forma de hacer política', ejeEconomico: 'centroeconomico', ejeSocial: 'progresista', personalidad: 'oportunista',
    popularidadBase: 12, influenciaNacionalBase: 11, organizacionBase: 22, credibilidadBase: 35, comunicacionBase: 30,
    experienciaBase: 16, fondosBase: 75_000, afiliadosBase: 450,
  },
  {
    nombre: 'Nuestro Tiempo', siglas: 'NT', colorPrincipal: '#7C3AED', colorSecundario: '#2E1065',
    lema: 'Transparencia y futuro', ejeEconomico: 'centroeconomico', ejeSocial: 'progresista', personalidad: 'oportunista',
    popularidadBase: 9, influenciaNacionalBase: 7, organizacionBase: 16, credibilidadBase: 24, comunicacionBase: 24,
    experienciaBase: 8, fondosBase: 55_000, afiliadosBase: 300,
  },
];

/** Devuelve el espectro completo por defecto; el orden es estable y reproducible. */
export function generarPartidosRivales(cantidad: number = PLANTILLAS_RIVALES.length): Partido[] {
  const n = Math.max(1, Math.min(cantidad, PLANTILLAS_RIVALES.length));
  return PLANTILLAS_RIVALES.slice(0, n).map((tpl) => ({
    id: generarId('partido'), nombre: tpl.nombre, siglas: tpl.siglas,
    colorPrincipal: tpl.colorPrincipal, colorSecundario: tpl.colorSecundario, lema: tpl.lema,
    ideologia: construirIdeologia(tpl.ejeEconomico, tpl.ejeSocial), esJugador: false, personalidad: tpl.personalidad,
    popularidad: tpl.popularidadBase, influenciaNacional: tpl.influenciaNacionalBase,
    organizacion: tpl.organizacionBase, credibilidad: tpl.credibilidadBase, comunicacion: tpl.comunicacionBase,
    experienciaElectoral: tpl.experienciaBase, fondos: tpl.fondosBase, afiliados: tpl.afiliadosBase,
    accionesEjecutadas: 0, turnosDesdeFundacion: 0,
  }));
}

export function turnoRival(partido: Partido, estado?: EstadoPartida): Partido {
  if (partido.esJugador) return partido;
  if (partido.fondos < 5_000) return _accionRecaudacion({ ...partido, popularidad: Math.max(0, partido.popularidad - 0.5) });

  const jugador = estado?.partidos.find((p) => p.esJugador);
  const posicion = estado ? [...estado.partidos].sort((a, b) => b.popularidad - a.popularidad).findIndex((p) => p.id === partido.id) : 2;
  const estaDetras = jugador ? partido.popularidad < jugador.popularidad : true;
  const jugadorEsLider = jugador ? [...(estado?.partidos ?? [])].sort((a, b) => b.popularidad - a.popularidad)[0]?.id === jugador.id : false;

  switch (partido.personalidad ?? 'oportunista') {
    case 'agresivo': return _iaAgresivo(partido, estaDetras, jugadorEsLider);
    case 'defensivo': return _iaDefensivo(partido);
    case 'oportunista': return _iaOportunista(partido, posicion, estaDetras);
    case 'populista': return _iaPopulista(partido);
  }
}

function _iaAgresivo(partido: Partido, estaDetras: boolean, jugadorEsLider: boolean): Partido {
  if (estaDetras && jugadorEsLider) return { ...partido, popularidad: Math.min(100, partido.popularidad + 2.5 + partido.comunicacion * 0.04), credibilidad: Math.max(0, partido.credibilidad - 1), fondos: partido.fondos - 8_000, accionesEjecutadas: partido.accionesEjecutadas + 1 };
  return { ...partido, organizacion: Math.min(100, partido.organizacion + 2), fondos: partido.fondos - 4_000, accionesEjecutadas: partido.accionesEjecutadas + 1 };
}

function _iaDefensivo(partido: Partido): Partido {
  if (partido.fondos < 80_000) return _accionRecaudacion(partido);
  return { ...partido, organizacion: Math.min(100, partido.organizacion + 2), credibilidad: Math.min(100, partido.credibilidad + 1), afiliados: partido.afiliados + Math.floor(5 + partido.organizacion * 0.08), fondos: partido.fondos - 3_000, accionesEjecutadas: partido.accionesEjecutadas + 1 };
}

function _iaOportunista(partido: Partido, posicion: number, estaDetras: boolean): Partido {
  if (partido.fondos < 40_000) return _accionRecaudacion(partido);
  if (posicion <= 1) return { ...partido, comunicacion: Math.min(100, partido.comunicacion + 1.5), popularidad: Math.min(100, partido.popularidad + 1), fondos: partido.fondos - 5_000, accionesEjecutadas: partido.accionesEjecutadas + 1 };
  if (estaDetras) return { ...partido, popularidad: Math.min(100, partido.popularidad + 2 + partido.comunicacion * 0.03), fondos: partido.fondos - 7_000, accionesEjecutadas: partido.accionesEjecutadas + 1 };
  return _accionRecaudacion(partido);
}

function _iaPopulista(partido: Partido): Partido {
  if (partido.fondos < 20_000) return _accionRecaudacion(partido);
  return { ...partido, popularidad: Math.min(100, partido.popularidad + 3 + partido.comunicacion * 0.05), comunicacion: Math.min(100, partido.comunicacion + 1), fondos: partido.fondos - 10_000, accionesEjecutadas: partido.accionesEjecutadas + 1 };
}

function _accionRecaudacion(partido: Partido): Partido {
  return { ...partido, fondos: partido.fondos + 15_000 + partido.credibilidad * 50, accionesEjecutadas: partido.accionesEjecutadas + 1 };
}
