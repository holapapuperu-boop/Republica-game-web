/**
 * REPÚBLICA — Fábrica de estado inicial de partida
 *
 * Crea el estado de inicio de una nueva partida a partir de los parámetros
 * que el jugador configura en el menú (nombre del partido, escenario, etc.).
 * Este módulo pertenece al motor: no importa React ni accede a la DB.
 */

import type { EstadoPartida, Partido, FechaJuego } from '../../types/gameTypes';
import { generarId } from '../../utils/id';

export interface OpcionesNuevaPartida {
  nombrePartida: string;
  nombrePartido: string;
  siglasPartido: string;
  colorPrincipal: string;
  colorSecundario: string;
  lema: string;
  /** Fecha de inicio del escenario */
  fechaInicio?: FechaJuego;
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

  const partidoJugador: Partido = {
    id: partidoId,
    nombre: opciones.nombrePartido,
    siglas: opciones.siglasPartido.toUpperCase(),
    colorPrincipal: opciones.colorPrincipal,
    colorSecundario: opciones.colorSecundario,
    lema: opciones.lema,
    ideologia: {
      ejeEconomico: 'centroeconomico',
      ejeSocial: 'centrista',
      etiqueta: 'Centro',
    },
    esJugador: true,

    // Atributos iniciales bajos: hay que construir el partido
    popularidad: 10,
    organizacion: 5,
    credibilidad: 15,
    comunicacion: 5,
    experienciaElectoral: 0,

    fondos: 50_000,       // 50,000 USD al inicio
    afiliados: 25,        // Núcleo fundador pequeño

    accionesEjecutadas: 0,
    turnosDesdeFundacion: 0,
  };

  const estadoInicial: EstadoPartida = {
    saveVersion: '1.0.0',
    partidaId,
    nombrePartida: opciones.nombrePartida,

    fechaActual: fechaInicio,
    turnoActual: 1,

    regimen: 'democracia',
    etapa: 'organización',

    partidos: [partidoJugador],
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
    ],

    fechaCreacion: ahora,
    fechaUltimoGuardado: ahora,
  };

  return estadoInicial;
}
