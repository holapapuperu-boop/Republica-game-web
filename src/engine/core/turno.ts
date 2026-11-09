/**
 * REPÚBLICA — Motor de Turnos (Turn Engine)
 *
 * Módulo central del bucle de simulación. No importa React ni accede
 * al DOM; es TypeScript puro para que las pruebas sean simples y confiables.
 *
 * Responsabilidad: recibir el estado actual de la partida y devolver
 * el nuevo estado tras procesar un mes de juego, junto con los eventos
 * generados durante ese turno.
 */

import type {
  EstadoPartida,
  EventoJuego,
  ResultadoTurno,
} from '../../types/gameTypes';
import { avanzarUnMes } from './fecha';
import { generarId } from '../../utils/id';
import { turnoRival } from './rivales';

// ---------------------------------------------------------------------------
// CONSTANTES DE BALANCE
// ---------------------------------------------------------------------------

/** Puntos de Acción que el jugador recibe al iniciar un nuevo turno */
const PA_POR_TURNO = 3;

/**
 * Variación mensual de popularidad base (antes de acciones del jugador).
 * Un partido sin actividad pierde muy lentamente credibilidad.
 */
const DECAIMIENTO_POPULARIDAD_BASE = 0.3;

// ---------------------------------------------------------------------------
// FUNCIÓN PRINCIPAL: procesarTurno
// ---------------------------------------------------------------------------

/**
 * Procesa el avance de un turno (un mes) completo.
 *
 * Pasos:
 * 1. Avanza la fecha un mes.
 * 2. Incrementa el contador de turnos.
 * 3. Restaura los Puntos de Acción del jugador.
 * 4. Aplica decaimiento natural de atributos de partidos inactivos.
 * 5. Genera los eventos del turno.
 * 6. Registra el resumen en el historial de eventos.
 *
 * @param estado - Estado actual de la partida (no se muta; se devuelve uno nuevo).
 * @returns ResultadoTurno con el estado actualizado y los eventos generados.
 */
export function procesarTurno(estado: EstadoPartida): ResultadoTurno {
  const nuevaFecha = avanzarUnMes(estado.fechaActual);
  const nuevoTurno = estado.turnoActual + 1;

  // 1. Actualizar partidos:
  //    - Al jugador: solo incrementar turnosDesdeFundacion (sus acciones las ejecuta él)
  //    - A los rivales: aplicar lógica de IA + decaimiento natural si no actúan
  const partidosActualizados = estado.partidos.map((partido) => {
    if (partido.esJugador) {
      return {
        ...partido,
        turnosDesdeFundacion: partido.turnosDesdeFundacion + 1,
      };
    }
    // Rival: ejecutar su acción mensual automática
    const rivalActualizado = turnoRival(partido);
    // Decaimiento de popularidad base si no creció
    const nuevaPopularidad = Math.max(
      0,
      rivalActualizado.popularidad - DECAIMIENTO_POPULARIDAD_BASE
    );
    return {
      ...rivalActualizado,
      popularidad: parseFloat(nuevaPopularidad.toFixed(2)),
      turnosDesdeFundacion: rivalActualizado.turnosDesdeFundacion + 1,
    };
  });

  // 2. Restaurar Puntos de Acción al inicio de cada turno
  const recursosActualizados = {
    ...estado.recursos,
    puntosDeAccion: PA_POR_TURNO,
  };

  // 3. Generar eventos del turno
  const eventosNuevos: EventoJuego[] = [];

  const eventoAvanceTurno: EventoJuego = {
    id: generarId('evt'),
    fecha: nuevaFecha,
    titulo: 'Inicio de nuevo período',
    descripcion: `Comienza ${_formatearFecha(nuevaFecha)}. El partido cuenta con ${PA_POR_TURNO} puntos de acción disponibles.`,
    categoria: 'sistema',
    esFicticio: true,
  };
  eventosNuevos.push(eventoAvanceTurno);

  // 4. Construir el nuevo estado (sin mutar el original)
  const nuevoEstado: EstadoPartida = {
    ...estado,
    fechaActual: nuevaFecha,
    turnoActual: nuevoTurno,
    partidos: partidosActualizados,
    recursos: recursosActualizados,
    eventos: [...estado.eventos, ...eventosNuevos],
    fechaUltimoGuardado: new Date().toISOString(),
  };

  return {
    nuevoEstado,
    eventosGenerados: eventosNuevos,
    mensajeResumen: `Turno ${nuevoTurno} — ${_formatearFecha(nuevaFecha)}`,
  };
}

// ---------------------------------------------------------------------------
// Helpers internos (privados al módulo)
// ---------------------------------------------------------------------------

const MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function _formatearFecha(fecha: { anio: number; mes: number }): string {
  return `${MESES[fecha.mes]} ${fecha.anio}`;
}
