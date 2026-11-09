/**
 * REPÚBLICA — Mapa SVG de El Salvador
 *
 * Dibuja los 14 departamentos del país. Cada departamento se colorea
 * con el color del partido con mayor influencia en esa zona.
 *
 * Paths simplificados basados en las fronteras reales de los departamentos.
 * Viewbox: 0 0 800 500
 */

import React, { useState } from 'react';
import type { Partido } from '../../types/gameTypes';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface InfluenciaDepartamento {
  departamento: string;
  partidoId: string | null;  // null = sin control claro
  porcentaje: number;        // 0–100
}

interface Props {
  partidos: Partido[];
  influencias: InfluenciaDepartamento[];
  onDepartamentoClick?: (nombre: string) => void;
}

// ---------------------------------------------------------------------------
// Datos de departamentos
// ---------------------------------------------------------------------------

interface DatoDepartamento {
  nombre: string;
  codigo: string;
  path: string;
  labelX: number;
  labelY: number;
}

// Paths SVG aproximados de los 14 departamentos salvadoreños
// Coordenadas normalizadas en viewBox 0 0 800 500
const DEPARTAMENTOS: DatoDepartamento[] = [
  {
    nombre: 'Santa Ana',
    codigo: 'SA',
    labelX: 115,
    labelY: 130,
    path: 'M 60,80 L 185,70 L 200,100 L 195,165 L 160,185 L 100,175 L 60,155 Z',
  },
  {
    nombre: 'Ahuachapán',
    codigo: 'AH',
    labelX: 60,
    labelY: 215,
    path: 'M 20,160 L 100,175 L 95,245 L 55,260 L 20,240 Z',
  },
  {
    nombre: 'Sonsonate',
    codigo: 'SO',
    labelX: 130,
    labelY: 230,
    path: 'M 100,175 L 160,185 L 175,210 L 165,270 L 130,285 L 95,245 Z',
  },
  {
    nombre: 'La Libertad',
    codigo: 'LL',
    labelX: 220,
    labelY: 230,
    path: 'M 160,185 L 240,175 L 265,195 L 255,270 L 215,285 L 175,270 L 165,270 Z',
  },
  {
    nombre: 'Chalatenango',
    codigo: 'CH',
    labelX: 310,
    labelY: 100,
    path: 'M 185,70 L 390,55 L 400,90 L 380,140 L 290,155 L 240,145 L 200,100 Z',
  },
  {
    nombre: 'San Salvador',
    codigo: 'SS',
    labelX: 300,
    labelY: 215,
    path: 'M 240,175 L 310,165 L 335,180 L 325,250 L 285,260 L 255,255 L 255,270 L 265,195 Z',
  },
  {
    nombre: 'Cuscatlán',
    codigo: 'CU',
    labelX: 370,
    labelY: 195,
    path: 'M 310,165 L 390,155 L 400,175 L 390,220 L 350,235 L 325,220 L 335,180 Z',
  },
  {
    nombre: 'La Paz',
    codigo: 'LP',
    labelX: 310,
    labelY: 305,
    path: 'M 255,270 L 325,255 L 355,265 L 365,310 L 335,340 L 285,340 L 265,315 Z',
  },
  {
    nombre: 'Cabañas',
    codigo: 'CA',
    labelX: 445,
    labelY: 155,
    path: 'M 390,90 L 510,80 L 520,115 L 490,155 L 420,160 L 400,145 L 400,90 Z',
  },
  {
    nombre: 'San Vicente',
    codigo: 'SV',
    labelX: 420,
    labelY: 255,
    path: 'M 390,220 L 455,210 L 480,230 L 470,285 L 430,300 L 390,285 L 365,270 L 365,235 Z',
  },
  {
    nombre: 'Usulután',
    codigo: 'US',
    labelX: 490,
    labelY: 325,
    path: 'M 430,300 L 540,290 L 560,310 L 545,370 L 490,385 L 440,370 L 415,340 Z',
  },
  {
    nombre: 'San Miguel',
    codigo: 'SM',
    labelX: 600,
    labelY: 270,
    path: 'M 520,195 L 650,185 L 665,215 L 650,285 L 580,310 L 540,290 L 480,275 L 480,230 L 520,220 Z',
  },
  {
    nombre: 'Morazán',
    codigo: 'MO',
    labelX: 670,
    labelY: 185,
    path: 'M 580,100 L 710,90 L 730,130 L 700,180 L 650,185 L 610,165 L 580,140 Z',
  },
  {
    nombre: 'La Unión',
    codigo: 'LU',
    labelX: 710,
    labelY: 270,
    path: 'M 665,215 L 760,205 L 780,240 L 760,310 L 700,330 L 650,315 L 650,285 Z',
  },
];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export const MapaSVG: React.FC<Props> = ({ partidos, influencias, onDepartamentoClick }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  // Mapear partidoId → color para pintar departamentos
  const colorPorPartido: Record<string, string> = {};
  partidos.forEach((p) => {
    colorPorPartido[p.id] = p.colorPrincipal;
  });

  // Mapear departamento → influencia
  const infMap: Record<string, InfluenciaDepartamento> = {};
  influencias.forEach((inf) => { infMap[inf.departamento] = inf; });

  function colorDepartamento(nombre: string): string {
    const inf = infMap[nombre];
    if (!inf || !inf.partidoId) return '#374151'; // sin control: gris oscuro
    const color = colorPorPartido[inf.partidoId] ?? '#374151';
    return color;
  }

  function opacidadDepartamento(nombre: string): number {
    const inf = infMap[nombre];
    if (!inf || !inf.partidoId) return 0.3;
    return 0.35 + (inf.porcentaje / 100) * 0.55; // 0.35 → 0.9 según influencia
  }

  const hoveredInf = hovered ? infMap[hovered] : null;
  const hoveredPartido = hoveredInf?.partidoId
    ? partidos.find((p) => p.id === hoveredInf.partidoId)
    : null;

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 800 460"
        className="w-full h-auto"
        style={{ maxHeight: '320px' }}
      >
        {DEPARTAMENTOS.map((dep) => {
          const isHovered = hovered === dep.nombre;
          const fillColor = colorDepartamento(dep.nombre);
          const opacity = opacidadDepartamento(dep.nombre);

          return (
            <g key={dep.codigo}>
              <path
                d={dep.path}
                fill={fillColor}
                fillOpacity={isHovered ? Math.min(1, opacity + 0.25) : opacity}
                stroke="#1f2937"
                strokeWidth={isHovered ? 2 : 1}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHovered(dep.nombre)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onDepartamentoClick?.(dep.nombre)}
              />
              {/* Código del departamento */}
              <text
                x={dep.labelX}
                y={dep.labelY}
                textAnchor="middle"
                fontSize="9"
                fill={isHovered ? '#f9fafb' : '#d1d5db'}
                fontFamily="monospace"
                fontWeight={isHovered ? 'bold' : 'normal'}
                pointerEvents="none"
                className="select-none"
              >
                {dep.codigo}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip al hacer hover */}
      {hovered && (
        <div className="absolute top-2 right-2 bg-surface-800 border border-surface-500 rounded p-2 text-xs min-w-32 pointer-events-none">
          <p className="text-text-primary font-semibold">{hovered}</p>
          {hoveredPartido ? (
            <>
              <p className="text-xxs mt-0.5" style={{ color: hoveredPartido.colorPrincipal }}>
                {hoveredPartido.siglas}
              </p>
              <p className="text-text-muted text-xxs">
                {hoveredInf?.porcentaje.toFixed(0)}% influencia
              </p>
            </>
          ) : (
            <p className="text-text-muted text-xxs">Sin control definido</p>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Función auxiliar: calcular influencias iniciales
// ---------------------------------------------------------------------------

/**
 * Distribuye los 14 departamentos entre los partidos según su popularidad.
 * Partidos más fuertes reciben más departamentos y mayor porcentaje.
 */
export function calcularInfluenciasIniciales(partidos: Partido[]): InfluenciaDepartamento[] {
  const totalDeps = DEPARTAMENTOS.length; // 14

  // Ordenar partidos por popularidad descendente (incluye jugador)
  const ordenados = [...partidos].sort((a, b) => b.popularidad - a.popularidad);

  // Distribuir departamentos proporcionalmente
  const influencias: InfluenciaDepartamento[] = [];

  DEPARTAMENTOS.forEach((dep, idx) => {
    // Rotación ponderada: los primeros departamentos (índice bajo) van al partido más fuerte
    const partidoIdx = idx % Math.min(ordenados.length, 4); // máx 4 partidos dominantes
    const partido = ordenados[partidoIdx];
    const porcentaje = 30 + Math.floor(Math.random() * 40); // 30–70%

    influencias.push({
      departamento: dep.nombre,
      partidoId: partido.id,
      porcentaje,
    });
  });

  return influencias;
}

export { DEPARTAMENTOS };
