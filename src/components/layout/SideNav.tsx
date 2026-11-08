/**
 * REPÚBLICA — Barra de navegación lateral (SideNav)
 *
 * Permite cambiar entre las vistas principales del juego.
 * Las vistas bloqueadas (aún no implementadas) se muestran deshabilitadas
 * en lugar de no aparecer, para que el jugador sepa que existen.
 */

import React from 'react';
import clsx from 'clsx';
import type { VistaActiva } from '../../types/uiTypes';

interface NavItem {
  id: VistaActiva;
  etiqueta: string;
  icono: string;          // Emoji o carácter Unicode como icono temporal
  disponible: boolean;    // false = bloqueado en esta fase
}

const ITEMS_NAV: NavItem[] = [
  { id: 'situacion',    etiqueta: 'Situación',    icono: '◉', disponible: true },
  { id: 'politica',     etiqueta: 'Política',     icono: '⚑', disponible: true },
  { id: 'asamblea',     etiqueta: 'Asamblea',     icono: '⚖', disponible: false },
  { id: 'territorio',   etiqueta: 'Territorio',   icono: '◫', disponible: false },
  { id: 'gobierno',     etiqueta: 'Gobierno',     icono: '★', disponible: false },
  { id: 'economia',     etiqueta: 'Economía',     icono: '◈', disponible: false },
  { id: 'sociedad',     etiqueta: 'Sociedad',     icono: '◎', disponible: false },
  { id: 'inteligencia', etiqueta: 'Inteligencia', icono: '◆', disponible: false },
  { id: 'geopolitica',  etiqueta: 'Geopolítica',  icono: '◉', disponible: false },
  { id: 'sistema',      etiqueta: 'Sistema',      icono: '⚙', disponible: true },
];

interface SideNavProps {
  vistaActual: VistaActiva;
  onCambiarVista: (vista: VistaActiva) => void;
}

export const SideNav: React.FC<SideNavProps> = ({ vistaActual, onCambiarVista }) => {
  return (
    <nav className="
      w-36 bg-surface-800 border-r border-surface-500
      flex flex-col py-2 gap-0.5 shrink-0 overflow-y-auto
    ">
      {ITEMS_NAV.map((item) => (
        <button
          key={item.id}
          onClick={() => item.disponible && onCambiarVista(item.id)}
          disabled={!item.disponible}
          className={clsx(
            'flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium',
            'transition-colors duration-100 rounded-none',
            item.id === vistaActual && item.disponible
              ? 'bg-surface-600 text-text-primary border-l-2 border-accent'
              : item.disponible
              ? 'text-text-secondary hover:bg-surface-700 hover:text-text-primary border-l-2 border-transparent'
              : 'text-text-muted cursor-not-allowed border-l-2 border-transparent opacity-40'
          )}
          title={!item.disponible ? 'Disponible en una fase posterior' : undefined}
        >
          <span className="w-4 text-center text-sm">{item.icono}</span>
          <span>{item.etiqueta}</span>
          {!item.disponible && (
            <span className="ml-auto text-xxs text-text-muted">🔒</span>
          )}
        </button>
      ))}
    </nav>
  );
};
