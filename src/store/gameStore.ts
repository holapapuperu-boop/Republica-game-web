/**
 * REPÚBLICA — Store Global de la Partida (Zustand)
 *
 * Este es el "cerebro vivo" de la partida activa. Zustand mantiene el estado
 * en memoria mientras el juego está abierto; la persistencia real en disco
 * se delega a IndexedDB (src/persistence/db.ts).
 *
 * Convención: las funciones que modifican el estado comienzan con verbo
 * en español para ser coherentes con el idioma del proyecto.
 */

import { create } from 'zustand';
import type { EstadoPartida } from '../types/gameTypes';
import { procesarTurno } from '../engine/core/turno';
import { guardarPartida } from '../persistence/db';

// ---------------------------------------------------------------------------
// Definición del Store
// ---------------------------------------------------------------------------

export interface GameStore {
  /** Partida activa (null = en el menú principal, sin partida cargada) */
  partida: EstadoPartida | null;

  /** true mientras el motor está procesando un turno (bloquea el botón) */
  procesandoTurno: boolean;

  /** true mientras se guarda en IndexedDB */
  guardando: boolean;

  /** Mensaje de error visible al jugador (null = ninguno) */
  error: string | null;

  // ---- Acciones ----

  /** Carga una partida existente en el store (desde DB o nueva) */
  cargarPartidaEnStore: (estado: EstadoPartida) => void;

  /** Cierra la partida activa y vuelve al menú principal */
  cerrarPartida: () => void;

  /** Avanza un turno aplicando el motor de simulación */
  avanzarTurno: () => Promise<void>;

  /** Guarda manualmente la partida activa en IndexedDB */
  guardarManual: () => Promise<void>;

  /** Limpia el mensaje de error actual */
  limpiarError: () => void;
}

// ---------------------------------------------------------------------------
// Implementación del Store
// ---------------------------------------------------------------------------

export const useGameStore = create<GameStore>((set, get) => ({
  partida: null,
  procesandoTurno: false,
  guardando: false,
  error: null,

  cargarPartidaEnStore: (estado) => {
    set({ partida: estado, error: null });
  },

  cerrarPartida: () => {
    set({ partida: null, error: null });
  },

  avanzarTurno: async () => {
    const { partida } = get();
    if (!partida) {
      set({ error: 'No hay partida activa.' });
      return;
    }

    set({ procesandoTurno: true });

    try {
      // El motor de turnos es síncrono y puro; sin efectos secundarios
      const resultado = procesarTurno(partida);

      // Actualizar el estado en memoria
      set({ partida: resultado.nuevoEstado });

      // Guardado automático después de cada turno
      await guardarPartida(resultado.nuevoEstado);
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : 'Error desconocido al avanzar el turno.';
      set({ error: mensaje });
    } finally {
      set({ procesandoTurno: false });
    }
  },

  guardarManual: async () => {
    const { partida } = get();
    if (!partida) return;

    set({ guardando: true });
    try {
      await guardarPartida(partida);
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : 'Error al guardar la partida.';
      set({ error: mensaje });
    } finally {
      set({ guardando: false });
    }
  },

  limpiarError: () => set({ error: null }),
}));

// ---------------------------------------------------------------------------
// Selectores (funciones de acceso optimizadas)
// ---------------------------------------------------------------------------

/** Devuelve el partido controlado por el jugador (o null) */
export function seleccionarPartidoJugador(state: GameStore) {
  if (!state.partida) return null;
  const { partidos, partidoJugadorId } = state.partida;
  return partidos.find((p) => p.id === partidoJugadorId) ?? null;
}
