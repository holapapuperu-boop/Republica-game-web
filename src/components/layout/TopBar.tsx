/**
 * REPÚBLICA — Componente de barra superior (TopBar)
 *
 * Muestra: fecha actual del juego, turno, puntos de acción disponibles,
 * fondos del partido y botón de guardar.
 */

import React from 'react';
import { useGameStore, seleccionarPartidoJugador } from '../../store/gameStore';
import { formatearFecha } from '../../engine/core/fecha';
import clsx from 'clsx';

interface TopBarProps {
  onGuardar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onGuardar }) => {
  const partida = useGameStore((s) => s.partida);
  const guardando = useGameStore((s) => s.guardando);
  const procesando = useGameStore((s) => s.procesandoTurno);
  const partido = useGameStore(seleccionarPartidoJugador);

  if (!partida) return null;

  const pA = partida.recursos.puntosDeAccion;
  const pAMax = partida.recursos.puntosDeAccionMaximos;

  return (
    <header className="
      h-12 bg-surface-800 border-b border-surface-500
      flex items-center justify-between px-4 gap-4
      text-text-secondary text-sm font-medium shrink-0
    ">
      {/* Izquierda: nombre del juego */}
      <div className="flex items-center gap-3">
        <span className="text-accent font-bold tracking-widest text-xs uppercase">
          República
        </span>
        <span className="text-surface-500">|</span>
        <span className="text-text-muted text-xs">{partida.nombrePartida}</span>
      </div>

      {/* Centro: indicadores de estado */}
      <div className="flex items-center gap-6">
        {/* Fecha y turno */}
        <div className="flex flex-col items-center">
          <span className="text-text-primary text-xs font-semibold">
            {formatearFecha(partida.fechaActual)}
          </span>
          <span className="text-text-muted text-xxs">Turno {partida.turnoActual}</span>
        </div>

        {/* Puntos de Acción */}
        <div className="flex flex-col items-center">
          <div className="flex gap-1">
            {Array.from({ length: pAMax }).map((_, i) => (
              <span
                key={i}
                className={clsx(
                  'w-2.5 h-2.5 rounded-full border',
                  i < pA
                    ? 'bg-accent border-accent'
                    : 'bg-transparent border-surface-500'
                )}
              />
            ))}
          </div>
          <span className="text-text-muted text-xxs">PA disponibles</span>
        </div>

        {/* Fondos */}
        {partido && (
          <div className="flex flex-col items-center">
            <span className="text-success text-xs font-semibold font-mono">
              ${partido.fondos.toLocaleString('es-SV')}
            </span>
            <span className="text-text-muted text-xxs">Fondos</span>
          </div>
        )}

        {/* Afiliados */}
        {partido && (
          <div className="flex flex-col items-center">
            <span className="text-info text-xs font-semibold font-mono">
              {partido.afiliados.toLocaleString('es-SV')}
            </span>
            <span className="text-text-muted text-xxs">Afiliados</span>
          </div>
        )}
      </div>

      {/* Derecha: acciones de sistema */}
      <div className="flex items-center gap-2">
        <button
          onClick={onGuardar}
          disabled={guardando || procesando}
          className="
            px-3 py-1 text-xs rounded border border-surface-500
            text-text-secondary hover:text-text-primary hover:border-accent
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors duration-150
          "
        >
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </header>
  );
};
