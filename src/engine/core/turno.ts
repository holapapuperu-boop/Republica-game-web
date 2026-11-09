/**
 * REPÚBLICA — Motor de Turnos (Turn Engine)
 *
 * Módulo central del bucle de simulación. No importa React ni accede
 * al DOM; es TypeScript puro para que las pruebas sean simples y confiables.
 *
 * Fase 4: integra eventos aleatorios, IA con contexto y sistema electoral.
 */

import type {
  EstadoPartida,
  EventoJuego,
  ResultadoTurno,
} from '../../types/gameTypes';
import { avanzarUnMes } from './fecha';
import { generarId } from '../../utils/id';
import { turnoRival } from './rivales';
import { evaluarEventos } from './eventos';
import { procesarElecciones } from './elecciones';

// ---------------------------------------------------------------------------
// CONSTANTES DE BALANCE
// ---------------------------------------------------------------------------

const PA_POR_TURNO = 3;
const DECAIMIENTO_POPULARIDAD_BASE = 0.3;

// ---------------------------------------------------------------------------
// FUNCIÓN PRINCIPAL
// ---------------------------------------------------------------------------

export function procesarTurno(estado: EstadoPartida): ResultadoTurno {
  const nuevaFecha = avanzarUnMes(estado.fechaActual);
  const nuevoTurno = estado.turnoActual + 1;

  // 1. Actualizar partidos: jugador solo avanza contador; rivales ejecutan IA
  const estadoConFecha: EstadoPartida = {
    ...estado,
    fechaActual: nuevaFecha,
    turnoActual: nuevoTurno,
  };

  const partidosActualizados = estadoConFecha.partidos.map((partido) => {
    if (partido.esJugador) {
      return { ...partido, turnosDesdeFundacion: partido.turnosDesdeFundacion + 1 };
    }
    // IA con contexto: pasa el estado para decisiones estratégicas
    const rivalActualizado = turnoRival(partido, estadoConFecha);
    const nuevaPopularidad = Math.max(
      0,
      rivalActualizado.popularidad - DECAIMIENTO_POPULARIDAD_BASE,
    );
    return {
      ...rivalActualizado,
      popularidad: parseFloat(nuevaPopularidad.toFixed(2)),
      turnosDesdeFundacion: rivalActualizado.turnosDesdeFundacion + 1,
    };
  });

  // 2. Restaurar PA al jugador
  const recursosActualizados = {
    ...estado.recursos,
    puntosDeAccion: PA_POR_TURNO,
  };

  // 3. Estado intermedio con partidos y fecha actualizados
  let estadoIntermedio: EstadoPartida = {
    ...estadoConFecha,
    partidos: partidosActualizados,
    recursos: recursosActualizados,
    fechaUltimoGuardado: new Date().toISOString(),
  };

  // 4. Evaluar eventos aleatorios (Fase 4)
  const { estadoConEventos, eventosDisparados } = evaluarEventos(estadoIntermedio);
  estadoIntermedio = estadoConEventos;

  // 5. Procesar elecciones si corresponde (Fase 4)
  const { nuevoEstado: estadoTraselecciones, eventosElectorales } =
    procesarElecciones(estadoIntermedio);
  estadoIntermedio = estadoTraselecciones;

  // 6. Evento de inicio de turno
  const eventosNuevos: EventoJuego[] = [];
  eventosNuevos.push({
    id: generarId('evt'),
    fecha: nuevaFecha,
    titulo: 'Inicio de nuevo período',
    descripcion: `Comienza ${_formatearFecha(nuevaFecha)}. El partido cuenta con ${PA_POR_TURNO} puntos de acción disponibles.`,
    categoria: 'sistema',
    esFicticio: true,
  });

  // 7. Estado final
  const nuevoEstado: EstadoPartida = {
    ...estadoIntermedio,
    eventos: [...estadoIntermedio.eventos, ...eventosNuevos],
  };

  const todosEventos = [...eventosDisparados, ...eventosElectorales, ...eventosNuevos];

  return {
    nuevoEstado,
    eventosGenerados: todosEventos,
    mensajeResumen: `Turno ${nuevoTurno} — ${_formatearFecha(nuevaFecha)}`,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function _formatearFecha(fecha: { anio: number; mes: number }): string {
  return `${MESES[fecha.mes]} ${fecha.anio}`;
}
