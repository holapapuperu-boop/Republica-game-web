/**
 * REPÚBLICA — App principal
 * Enruta entre el menú principal y el juego activo.
 */

import React, { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { MainMenu } from './views/MainMenu';
import { TopBar } from './components/layout/TopBar';
import { SideNav } from './components/layout/SideNav';
import { SituacionView } from './views/SituacionView';
import { PoliticaView } from './views/PoliticaView';
import { SistemaView } from './views/SistemaView';
import { MapaView } from './views/MapaView';
import type { VistaActiva } from './types/uiTypes';

export default function App() {
  const partida = useGameStore((s) => s.partida);
  const guardarManual = useGameStore((s) => s.guardarManual);
  const error = useGameStore((s) => s.error);
  const limpiarError = useGameStore((s) => s.limpiarError);
  const [vista, setVista] = useState<VistaActiva>('situacion');

  // Sin partida activa → mostrar menú principal
  if (!partida) {
    return <MainMenu />;
  }

  return (
    <div className="h-screen flex flex-col bg-surface-900 text-text-primary overflow-hidden">
      {/* Barra superior */}
      <TopBar onGuardar={guardarManual} />

      {/* Error global */}
      {error && (
        <div className="bg-danger/10 border-b border-danger/30 px-4 py-2 flex justify-between items-center">
          <span className="text-danger text-xs">{error}</span>
          <button
            onClick={limpiarError}
            className="text-danger/60 hover:text-danger text-xs ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Cuerpo principal */}
      <div className="flex flex-1 overflow-hidden">
        <SideNav vistaActual={vista} onCambiarVista={setVista} />

        {/* Área de contenido */}
        <main className="flex-1 overflow-hidden bg-surface-900">
          {vista === 'situacion' && <SituacionView />}
          {vista === 'politica' && <PoliticaView />}
          {vista === 'territorio' && <MapaView />}
          {vista === 'sistema' && <SistemaView />}
          {/* Resto de vistas se implementarán en fases siguientes */}
          {!['situacion', 'politica', 'territorio', 'sistema'].includes(vista) && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-text-muted text-sm">
                  Esta sección se implementará en una fase próxima.
                </p>
                <button
                  onClick={() => setVista('situacion')}
                  className="mt-3 text-accent text-xs hover:underline"
                >
                  Volver a Situación
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
