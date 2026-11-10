/**
 * REPÚBLICA — Fábrica de estado inicial de partida
 *
 * Crea el estado de inicio de una nueva partida a partir de los parámetros
 * que el jugador configura en el menú (nombre del partido, escenario, etc.).
 * Este módulo pertenece al motor: no importa React ni accede a la DB.
 */

import type { EstadoPartida, Partido, FechaJuego } from '../../types/gameTypes';
import type { EjeEconomico, EjeSocial } from '../../types/gameTypes';
import { generarId } from '../../utils/id';
import { construirIdeologia } from './ideologia';
import { generarPartidosRivales } from './rivales';
import { calcularProximaEleccion } from './elecciones';

export interface OpcionesNuevaPartida {
  nombrePartida: string;
  nombrePartido: string;
  siglasPartido: string;
  colorPrincipal: string;
  colorSecundario: string;
  lema: string;
  /** Posición en el eje económico (default: centroeconomico) */
  ejeEconomico?: EjeEconomico;
  /** Posición en el eje social (default: centrista) */
  ejeSocial?: EjeSocial;
  /** Fecha de inicio del escenario */
  fechaInicio?: FechaJuego;
  /** Cuántos partidos rivales generar (default: 3) */
  cantidadRivales?: number;
}

/**
 * Genera el EstadoPartida inicial para una nueva partida.
 * Los valores iniciales del partido son modestos para que el juego
 * tenga desafío desde el comienzo.
 */
export function crearNuevaPartida(
  opciones: OpcionesNuevaPartida
): EstadoPartida {
  const ahora = new Date().toISOString();
  const partidaId = generarId('partida');
  const partidoId = generarId('partido');

  const fechaInicio: FechaJuego = opciones.fechaInicio ?? {
    anio: 2024,
    mes: 1,
  };

  const ejeEconomico: EjeEconomico = opciones.ejeEconomico ?? 'centroeconomico';
  const ejeSocial: EjeSocial = opciones.ejeSocial ?? 'centrista';

  const partidoJugador: Partido = {
    id: partidoId,
    nombre: opciones.nombrePartido,
    siglas: opciones.siglasPartido.toUpperCase(),
    colorPrincipal: opciones.colorPrincipal,
    colorSecundario: opciones.colorSecundario,
    lema: opciones.lema,
    ideologia: construirIdeologia(ejeEconomico, ejeSocial),
    esJugador: true,

    // Atributos iniciales bajos: hay que construir el partido
    popularidad: 10,
    influenciaNacional: 2,
    organizacion: 5,
    credibilidad: 15,
    comunicacion: 5,
    experienciaElectoral: 0,

    fondos: 50_000,       // 50,000 USD al inicio
    afiliados: 25,        // Núcleo fundador pequeño

    accionesEjecutadas: 0,
    turnosDesdeFundacion: 0,
  };

  // Generar partidos rivales controlados por la IA
  const rivales = generarPartidosRivales(opciones.cantidadRivales);

  const estadoInicial: EstadoPartida = {
    saveVersion: '1.2.0',
    partidaId,
    nombrePartida: opciones.nombrePartida,

    fechaActual: fechaInicio,
    turnoActual: 1,

    regimen: 'democracia',
    etapa: 'organización',

    partidos: [partidoJugador, ...rivales],
    partidoJugadorId: partidoId,

    recursos: {
      puntosDeAccion: 3,
      puntosDeAccionMaximos: 3,
    },

    eventos: [
      {
        id: generarId('evt'),
        fecha: fechaInicio,
        titulo: 'Fundación del partido',
        descripcion: `${opciones.nombrePartido} inicia su actividad política con un pequeño grupo fundador. El camino hacia la presidencia apenas comienza.`,
        categoria: 'politico',
        esFicticio: true,
      },
      {
        id: generarId('evt'),
        fecha: fechaInicio,
        titulo: 'Escenario político inicial',
        descripcion: `${rivales.length} partidos compiten por la influencia nacional. La contienda política acaba de comenzar.`,
        categoria: 'politico',
        esFicticio: true,
      },
    ],

    // ---- Elecciones (Fase 4) ----
    elecciones: [],
    proximaEleccionPresidencial: calcularProximaEleccion(fechaInicio),

    fechaCreacion: ahora,
    fechaUltimoGuardado: ahora,
  };

  return estadoInicial;
}
