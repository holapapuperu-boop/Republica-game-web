/**
 * REPÚBLICA — Vista: Situación Nacional
 */

import React from 'react';
import { useGameStore, seleccionarPartidoJugador, type GameStore } from '../store/gameStore';
import { formatearFecha } from '../engine/core/fecha';
import type { Partido } from '../types/gameTypes';

export const SituacionView: React.FC = () => {
  const partida = useGameStore((s: GameStore) => s.partida);
  const partido = useGameStore(seleccionarPartidoJugador);
  const procesando = useGameStore((s: GameStore) => s.procesandoTurno);
  const avanzarTurno = useGameStore((s: GameStore) => s.avanzarTurno);

  if (!partida || !partido) return null;

  const eventosRecientes = [...partida.eventos].reverse().slice(0, 6);

  // Ordenar partidos por popularidad descendente para el ranking
  const partidosOrdenados = [...partida.partidos].sort(
    (a, b) => b.popularidad - a.popularidad
  );

  return (
    <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto animate-fade-in">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary font-semibold text-sm">
            Situación Nacional
          </h1>
          <p className="text-text-muted text-xs">
            {formatearFecha(partida.fechaActual)} · Turno {partida.turnoActual}
            {' · '}{partida.partidos.length} partidos activos
          </p>
        </div>

        <button
          onClick={() => { void avanzarTurno(); }}
          disabled={procesando}
          className="
            px-5 py-2 bg-accent hover:bg-accent-hover text-white
            text-xs font-semibold rounded
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-150
          "
        >
          {procesando ? 'Procesando…' : '▶ Siguiente Turno'}
        </button>
      </div>

      {/* Fila superior: Mi Partido + Recursos + Estado Político */}
      <div className="grid grid-cols-3 gap-3">
        {/* Tarjeta: Mi Partido */}
        <div
          className="bg-surface-700 border border-surface-500 rounded p-3 col-span-1"
          style={{ borderLeftColor: partido.colorPrincipal, borderLeftWidth: '3px' }}
        >
          <h2 className="text-text-secondary text-xxs uppercase tracking-widest mb-2">
            Mi Partido
          </h2>
          <p className="font-bold text-sm mb-0.5" style={{ color: partido.colorPrincipal }}>
            {partido.siglas}
          </p>
          <p className="text-text-muted text-xxs mb-0.5">{partido.nombre}</p>
          <p className="text-text-muted text-xxs italic mb-1">"{partido.lema}"</p>
          <span className="text-xxs px-1.5 py-0.5 rounded bg-surface-600 text-text-secondary">
            {partido.ideologia.etiqueta}
          </span>

          <div className="space-y-1.5 mt-3">
            <BarraAtributo etiqueta="Popularidad" valor={partido.popularidad} color="#3b82f6" />
            <BarraAtributo etiqueta="Organización" valor={partido.organizacion} color="#22c55e" />
            <BarraAtributo etiqueta="Credibilidad" valor={partido.credibilidad} color="#f59e0b" />
            <BarraAtributo etiqueta="Comunicación" valor={partido.comunicacion} color="#8b5cf6" />
          </div>
        </div>

        {/* Tarjeta: Recursos */}
        <div className="bg-surface-700 border border-surface-500 rounded p-3">
          <h2 className="text-text-secondary text-xxs uppercase tracking-widest mb-3">
            Recursos Disponibles
          </h2>
          <div className="space-y-3">
            <RecursoFila icono="💵" etiqueta="Fondos" valor={`$${partido.fondos.toLocaleString('es-SV')}`} colorValor="text-success" />
            <RecursoFila icono="👥" etiqueta="Afiliados" valor={partido.afiliados.toLocaleString('es-SV')} colorValor="text-info" />
            <RecursoFila icono="⚡" etiqueta="Puntos de Acción" valor={`${partida.recursos.puntosDeAccion} / ${partida.recursos.puntosDeAccionMaximos}`} colorValor="text-warning" />
          </div>
        </div>

        {/* Tarjeta: Estado Político */}
        <div className="bg-surface-700 border border-surface-500 rounded p-3">
          <h2 className="text-text-secondary text-xxs uppercase tracking-widest mb-3">
            Estado Político
          </h2>
          <div className="space-y-2">
            <InfoFila etiqueta="Régimen" valor={capitalizar(partida.regimen)} />
            <InfoFila etiqueta="Etapa" valor={capitalizar(partida.etapa)} />
            <InfoFila etiqueta="Partidos activos" valor={String(partida.partidos.length)} />
            <InfoFila etiqueta="Acciones ejecutadas" valor={String(partido.accionesEjecutadas)} />
            <InfoFila etiqueta="Meses en actividad" valor={String(partido.turnosDesdeFundacion)} />
          </div>
        </div>
      </div>

      {/* Escena política: ranking de popularidad */}
      <div className="bg-surface-700 border border-surface-500 rounded p-3">
        <h2 className="text-text-secondary text-xxs uppercase tracking-widest mb-3">
          Escena Política — Popularidad comparada
        </h2>
        <div className="space-y-2">
          {partidosOrdenados.map((p, idx) => (
            <FilaRanking
              key={p.id}
              partido={p}
              posicion={idx + 1}
              esJugador={p.id === partida.partidoJugadorId}
            />
          ))}
        </div>
      </div>

      {/* Panel: Historial de eventos recientes */}
      <div className="bg-surface-700 border border-surface-500 rounded p-3">
        <h2 className="text-text-secondary text-xxs uppercase tracking-widest mb-3">
          Últimos Eventos
        </h2>
        {eventosRecientes.length === 0 ? (
          <p className="text-text-muted text-xs">Sin eventos registrados.</p>
        ) : (
          <div className="space-y-2">
            {eventosRecientes.map((evt) => (
              <div key={evt.id} className="flex gap-3 items-start border-b border-surface-500 pb-2 last:border-0">
                <span className="text-text-muted text-xxs font-mono whitespace-nowrap pt-0.5">
                  {formatearFecha(evt.fecha)}
                </span>
                <div>
                  <p className="text-text-primary text-xs font-medium">{evt.titulo}</p>
                  <p className="text-text-muted text-xxs">{evt.descripcion}</p>
                </div>
                <span className={`ml-auto text-xxs px-1.5 py-0.5 rounded whitespace-nowrap ${categoriaBadge(evt.categoria)}`}>
                  {evt.categoria}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Subcomponentes
// ---------------------------------------------------------------------------

function FilaRanking({ partido, posicion, esJugador }: { partido: Partido; posicion: number; esJugador: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${esJugador ? 'opacity-100' : 'opacity-80'}`}>
      {/* Posición */}
      <span className="text-text-muted text-xxs font-mono w-4 text-right shrink-0">
        {posicion}.
      </span>

      {/* Indicador de color del partido */}
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: partido.colorPrincipal }}
      />

      {/* Nombre */}
      <div className="flex-1 min-w-0">
        <span
          className={`text-xs font-medium truncate block ${esJugador ? 'text-text-primary' : 'text-text-secondary'}`}
          style={esJugador ? { color: partido.colorPrincipal } : undefined}
        >
          {partido.siglas}
          {esJugador && <span className="text-xxs text-text-muted ml-1 font-normal">(tú)</span>}
        </span>
        <span className="text-xxs text-text-muted truncate block">{partido.ideologia.etiqueta}</span>
      </div>

      {/* Barra de popularidad */}
      <div className="flex-1 max-w-24">
        <div className="h-1.5 bg-surface-500 rounded">
          <div
            className="h-1.5 rounded transition-all duration-500"
            style={{
              width: `${Math.min(partido.popularidad, 100)}%`,
              backgroundColor: partido.colorPrincipal,
            }}
          />
        </div>
      </div>

      {/* Valor */}
      <span className="text-xs font-mono text-text-secondary w-8 text-right shrink-0">
        {partido.popularidad.toFixed(0)}
      </span>
    </div>
  );
}

function BarraAtributo({ etiqueta, valor, color }: { etiqueta: string; valor: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-0.5">
        <span className="text-text-muted text-xxs">{etiqueta}</span>
        <span className="text-text-secondary text-xxs font-mono">{valor.toFixed(0)}</span>
      </div>
      <div className="h-1 bg-surface-500 rounded">
        <div className="h-1 rounded transition-all duration-500" style={{ width: `${Math.min(valor, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function RecursoFila({ icono, etiqueta, valor, colorValor }: { icono: string; etiqueta: string; valor: string; colorValor: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>{icono}</span>
        <span className="text-text-secondary text-xs">{etiqueta}</span>
      </div>
      <span className={`text-xs font-semibold font-mono ${colorValor}`}>{valor}</span>
    </div>
  );
}

function InfoFila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-muted text-xxs">{etiqueta}</span>
      <span className="text-text-secondary text-xxs font-medium">{valor}</span>
    </div>
  );
}

function capitalizar(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

function categoriaBadge(cat: string): string {
  const mapa: Record<string, string> = {
    politico: 'bg-info/20 text-info',
    economico: 'bg-success/20 text-success',
    social: 'bg-warning/20 text-warning',
    internacional: 'bg-accent/20 text-accent',
    accion_jugador: 'bg-purple-500/20 text-purple-400',
    sistema: 'bg-surface-500 text-text-muted',
  };
  return mapa[cat] ?? 'bg-surface-500 text-text-muted';
}
