/**
 * REPÚBLICA — Vista: Sistema
 * Gestión de partidas: guardar, cargar, exportar, importar y nueva partida.
 */

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import {
  listarPartidas,
  cargarPartida,
  eliminarPartida,
  exportarPartida,
  importarPartida,
  type RegistroPartida,
} from '../../persistence/db';

export const SistemaView: React.FC = () => {
  const partida = useGameStore((s) => s.partida);
  const guardando = useGameStore((s) => s.guardando);
  const guardarManual = useGameStore((s) => s.guardarManual);
  const cargarPartidaEnStore = useGameStore((s) => s.cargarPartidaEnStore);
  const cerrarPartida = useGameStore((s) => s.cerrarPartida);

  const [partidas, setPartidas] = useState<Omit<RegistroPartida, 'estadoJson'>[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  const refrescarLista = async () => {
    const lista = await listarPartidas();
    setPartidas(lista);
  };

  useEffect(() => {
    void refrescarLista();
  }, [partida]);

  const mostrarMensaje = (tipo: 'ok' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 4000);
  };

  const handleGuardar = async () => {
    await guardarManual();
    await refrescarLista();
    mostrarMensaje('ok', 'Partida guardada correctamente.');
  };

  const handleCargar = async (id: string) => {
    setCargando(true);
    try {
      const estado = await cargarPartida(id);
      if (estado) {
        cargarPartidaEnStore(estado);
        mostrarMensaje('ok', `Partida "${estado.nombrePartida}" cargada.`);
      }
    } catch {
      mostrarMensaje('error', 'Error al cargar la partida.');
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar la partida "${nombre}"? Esta acción no se puede deshacer.`)) return;
    await eliminarPartida(id);
    await refrescarLista();
    mostrarMensaje('ok', `Partida "${nombre}" eliminada.`);
  };

  const handleExportar = () => {
    if (!partida) return;
    exportarPartida(partida);
    mostrarMensaje('ok', 'Partida exportada como archivo .json.');
  };

  const handleImportar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    try {
      const estado = await importarPartida(archivo);
      cargarPartidaEnStore(estado);
      await refrescarLista();
      mostrarMensaje('ok', `Partida "${estado.nombrePartida}" importada y cargada.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al importar.';
      mostrarMensaje('error', msg);
    }
    e.target.value = '';
  };

  return (
    <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto animate-fade-in">
      <div>
        <h1 className="text-text-primary font-semibold text-sm">Sistema</h1>
        <p className="text-text-muted text-xs">Gestión de partidas guardadas</p>
      </div>

      {mensaje && (
        <div className={`text-xs px-3 py-2 rounded border ${
          mensaje.tipo === 'ok'
            ? 'bg-success/10 border-success/40 text-success'
            : 'bg-danger/10 border-danger/40 text-danger'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {/* Acciones de la partida activa */}
      {partida && (
        <div className="bg-surface-700 border border-surface-500 rounded p-3">
          <h2 className="text-text-secondary text-xxs uppercase tracking-widest mb-3">
            Partida Activa: {partida.nombrePartida}
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="btn-primary text-xs"
            >
              {guardando ? 'Guardando…' : '💾 Guardar Ahora'}
            </button>
            <button
              onClick={handleExportar}
              className="btn-secondary text-xs"
            >
              📤 Exportar .json
            </button>
            <button
              onClick={cerrarPartida}
              className="btn-danger text-xs"
            >
              ✕ Cerrar Partida
            </button>
          </div>
        </div>
      )}

      {/* Lista de partidas guardadas */}
      <div className="bg-surface-700 border border-surface-500 rounded p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-text-secondary text-xxs uppercase tracking-widest">
            Partidas Guardadas
          </h2>
          <label className="btn-secondary text-xs cursor-pointer">
            📥 Importar .json
            <input
              type="file"
              accept=".json"
              onChange={handleImportar}
              className="hidden"
            />
          </label>
        </div>

        {partidas.length === 0 ? (
          <p className="text-text-muted text-xs">No hay partidas guardadas.</p>
        ) : (
          <div className="space-y-2">
            {partidas.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 border border-surface-500 rounded p-2.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-xs font-medium truncate">
                    {p.nombrePartida}
                  </p>
                  <p className="text-text-muted text-xxs">
                    Turno {p.turnoActual} · {p.fechaJuego} · Guardado{' '}
                    {new Date(p.fechaUltimoGuardado).toLocaleString('es-SV')}
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCargar(p.id)}
                    disabled={cargando}
                    className="btn-primary text-xxs px-2 py-1"
                  >
                    Cargar
                  </button>
                  <button
                    onClick={() => handleEliminar(p.id, p.nombrePartida)}
                    className="btn-danger text-xxs px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info técnica */}
      <div className="bg-surface-700 border border-surface-500 rounded p-3">
        <h2 className="text-text-secondary text-xxs uppercase tracking-widest mb-2">
          Información Técnica
        </h2>
        <div className="space-y-1 text-xxs text-text-muted font-mono">
          <p>REPÚBLICA v0.1.0 · Fase 0-1</p>
          <p>Motor de simulación: activo</p>
          <p>Almacenamiento: IndexedDB (local)</p>
          {partida && <p>Schema: {partida.saveVersion}</p>}
        </div>
      </div>
    </div>
  );
};
