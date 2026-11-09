/**
 * REPÚBLICA — Vista: Mapa Nacional
 *
 * Muestra el mapa de El Salvador con los 14 departamentos coloreados
 * según la influencia de cada partido político.
 */

import React, { useMemo } from 'react';
import { useGameStore, seleccionarPartidoJugador } from '../store/gameStore';
import { MapaSVG, calcularInfluenciasIniciales } from '../components/mapa/MapaSVG';

export const MapaView: React.FC = () => {
  const partida = useGameStore((s) => s.partida);
  const partido = useGameStore(seleccionarPartidoJugador);

  if (!partida || !partido) return null;

  // Las influencias se derivan del estado actual de los partidos.
  // Usamos useMemo para no recalcular en cada render.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const influencias = useMemo(
    () => calcularInfluenciasIniciales(partida.partidos),
    // Solo recalcular cuando cambie el turno (no en cada re-render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [partida.turnoActual]
  );

  const ordenados = [...partida.partidos].sort((a, b) => b.popularidad - a.popularidad);

  // Contar departamentos por partido
  const depsContados: Record<string, number> = {};
  influencias.forEach((inf) => {
    if (inf.partidoId) {
      depsContados[inf.partidoId] = (depsContados[inf.partidoId] ?? 0) + 1;
    }
  });

  return (
    <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto animate-fade-in">

      {/* Encabezado */}
      <div>
        <h1 className="text-text-primary font-semibold text-sm">Mapa Nacional</h1>
        <p className="text-text-muted text-xs">
          Influencia territorial por departamento · Turno {partida.turnoActual}
        </p>
      </div>

      {/* Mapa */}
      <div className="bg-surface-700 border border-surface-500 rounded p-3">
        <MapaSVG
          partidos={partida.partidos}
          influencias={influencias}
        />
      </div>

      {/* Leyenda de partidos */}
      <div className="bg-surface-700 border border-surface-500 rounded p-3">
        <h2 className="text-text-secondary text-xxs uppercase tracking-widest mb-3">
          Control territorial
        </h2>
        <div className="space-y-2">
          {ordenados.map((p) => {
            const deps = depsContados[p.id] ?? 0;
            const pct = ((deps / 14) * 100).toFixed(0);

            return (
              <div key={p.id} className="flex items-center gap-3">
                {/* Indicador color */}
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: p.colorPrincipal }}
                />
                {/* Nombre */}
                <span
                  className="text-xs font-medium w-12 shrink-0"
                  style={{ color: p.colorPrincipal }}
                >
                  {p.siglas}
                  {p.esJugador && (
                    <span className="text-xxs text-text-muted ml-1 font-normal">(tú)</span>
                  )}
                </span>
                {/* Barra */}
                <div className="flex-1 h-2 bg-surface-500 rounded">
                  <div
                    className="h-2 rounded transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: p.colorPrincipal,
                      opacity: 0.8,
                    }}
                  />
                </div>
                {/* Número de departamentos */}
                <span className="text-xxs text-text-muted font-mono w-16 text-right shrink-0">
                  {deps} dep. ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nota */}
      <p className="text-text-muted text-xxs text-center">
        La influencia territorial se recalcula cada turno según popularidad y organización de los partidos.
      </p>
    </div>
  );
};
