/**
 * REPÚBLICA — Mapa SVG interactivo de El Salvador.
 *
 * La geometría procede del archivo vectorial de los 14 departamentos
 * incorporado en src/assets/el-salvador.svg. Los IDs SV-XX del SVG se
 * vinculan explícitamente con los datos de juego para conservar la
 * interacción sin alterar el trazado geográfico original.
 */

import React, { useMemo, useState } from 'react';
import mapaElSalvador from '../../assets/el-salvador.svg?raw';
import type { Partido } from '../../types/gameTypes';

export interface InfluenciaDepartamento {
  departamento: string;
  partidoId: string | null;
  porcentaje: number;
}

interface Props {
  partidos: Partido[];
  influencias: InfluenciaDepartamento[];
  onDepartamentoClick?: (nombre: string) => void;
}

interface DatoDepartamento {
  nombre: string;
  codigo: string;
  svgId: string;
}

/** Los IDs y títulos se verifican contra el SVG de fuente. */
const DEPARTAMENTOS: DatoDepartamento[] = [
  { nombre: 'Ahuachapán', codigo: 'AH', svgId: 'SV-AH' },
  { nombre: 'Cabañas', codigo: 'CA', svgId: 'SV-CA' },
  { nombre: 'Chalatenango', codigo: 'CH', svgId: 'SV-CH' },
  { nombre: 'Cuscatlán', codigo: 'CU', svgId: 'SV-CU' },
  { nombre: 'La Libertad', codigo: 'LI', svgId: 'SV-LI' },
  { nombre: 'Morazán', codigo: 'MO', svgId: 'SV-MO' },
  { nombre: 'La Paz', codigo: 'PA', svgId: 'SV-PA' },
  { nombre: 'Santa Ana', codigo: 'SA', svgId: 'SV-SA' },
  { nombre: 'San Miguel', codigo: 'SM', svgId: 'SV-SM' },
  { nombre: 'Sonsonate', codigo: 'SO', svgId: 'SV-SO' },
  { nombre: 'San Salvador', codigo: 'SS', svgId: 'SV-SS' },
  { nombre: 'San Vicente', codigo: 'SV', svgId: 'SV-SV' },
  { nombre: 'La Unión', codigo: 'UN', svgId: 'SV-UN' },
  { nombre: 'Usulután', codigo: 'US', svgId: 'SV-US' },
];

const departamentoPorSvgId = Object.fromEntries(
  DEPARTAMENTOS.map((departamento) => [departamento.svgId, departamento.nombre]),
);

// Se elimina únicamente el contenedor exterior para insertar los paths reales
// dentro del SVG controlado por React.
const contenidoMapa = mapaElSalvador
  .replace(/<\?xml[\s\S]*?\?>/i, '')
  .replace(/^[\s\S]*?<svg\b[^>]*>/i, '')
  .replace(/<\/svg>\s*$/i, '');

export const MapaSVG: React.FC<Props> = ({ partidos, influencias, onDepartamentoClick }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const infMap = useMemo(
    () => Object.fromEntries(influencias.map((influencia) => [influencia.departamento, influencia])),
    [influencias],
  );
  const partidoPorId = useMemo(
    () => Object.fromEntries(partidos.map((partido) => [partido.id, partido])),
    [partidos],
  );

  const estilos = useMemo(() => DEPARTAMENTOS.map((departamento) => {
    const influencia = infMap[departamento.nombre];
    const partido = influencia?.partidoId ? partidoPorId[influencia.partidoId] : undefined;
    const color = partido?.colorPrincipal ?? '#374151';
    const opacidad = influencia?.partidoId
      ? 0.35 + (influencia.porcentaje / 100) * 0.55
      : 0.3;
    const estaActivo = hovered === departamento.nombre;

    return `#${departamento.svgId} { fill: ${color}; fill-opacity: ${estaActivo ? Math.min(1, opacidad + 0.2) : opacidad}; stroke: #1f2937; stroke-width: ${estaActivo ? 2 : 1}; cursor: pointer; transition: fill-opacity 150ms, stroke-width 150ms; }`;
  }).join('\n'), [hovered, infMap, partidoPorId]);

  const hoveredInf = hovered ? infMap[hovered] : undefined;
  const hoveredPartido = hoveredInf?.partidoId ? partidoPorId[hoveredInf.partidoId] : undefined;

  function departamentoDesdeEvento(target: EventTarget | null): string | null {
    if (!(target instanceof Element)) return null;
    const path = target.closest('path[id]');
    return path ? departamentoPorSvgId[path.id] ?? null : null;
  }

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 792.89117 431.65646"
        className="w-full h-auto"
        style={{ maxHeight: '360px' }}
        role="img"
        aria-label="Mapa interactivo de los departamentos de El Salvador"
        onMouseMove={(event) => {
          const departamento = departamentoDesdeEvento(event.target);
          if (departamento !== hovered) setHovered(departamento);
        }}
        onMouseLeave={() => setHovered(null)}
        onClick={(event) => {
          const departamento = departamentoDesdeEvento(event.target);
          if (departamento) onDepartamentoClick?.(departamento);
        }}
      >
        <style>{estilos}</style>
        <g dangerouslySetInnerHTML={{ __html: contenidoMapa }} />
      </svg>

      {hovered && (
        <div className="absolute top-2 right-2 bg-surface-800 border border-surface-500 rounded p-2 text-xs min-w-32 pointer-events-none">
          <p className="text-text-primary font-semibold">{hovered}</p>
          {hoveredPartido ? (
            <>
              <p className="text-xxs mt-0.5" style={{ color: hoveredPartido.colorPrincipal }}>{hoveredPartido.siglas}</p>
              <p className="text-text-muted text-xxs">{hoveredInf?.porcentaje.toFixed(0)}% influencia</p>
            </>
          ) : <p className="text-text-muted text-xxs">Sin control definido</p>}
        </div>
      )}
    </div>
  );
};

/**
 * Asigna el control inicial de forma determinista. La influencia nacional
 * separada de la popularidad evita que un orden aleatorio altere el escenario.
 */
export function calcularInfluenciasIniciales(partidos: Partido[]): InfluenciaDepartamento[] {
  const ordenados = [...partidos]
    .map((partido) => ({
      partido,
      peso: Math.max(0, (partido.influenciaNacional ?? 0) * 0.65 + partido.popularidad * 0.25 + partido.organizacion * 0.1),
    }))
    .filter(({ peso }) => peso > 0)
    .sort((a, b) => b.peso - a.peso || a.partido.siglas.localeCompare(b.partido.siglas));

  if (ordenados.length === 0) {
    return DEPARTAMENTOS.map((departamento) => ({ departamento: departamento.nombre, partidoId: null, porcentaje: 0 }));
  }

  const pesoTotal = ordenados.reduce((total, entrada) => total + entrada.peso, 0);
  const cuotas = ordenados.map((entrada) => ({ ...entrada, exacta: (entrada.peso / pesoTotal) * DEPARTAMENTOS.length }));
  const asignaciones = cuotas.map(({ exacta }) => Math.floor(exacta));
  let restantes = DEPARTAMENTOS.length - asignaciones.reduce((total, asignacion) => total + asignacion, 0);

  [...cuotas].sort((a, b) => (b.exacta % 1) - (a.exacta % 1)).forEach((cuota) => {
    if (restantes <= 0) return;
    asignaciones[cuotas.indexOf(cuota)] += 1;
    restantes -= 1;
  });

  const propietarios = cuotas.flatMap((cuota, indice) => Array.from({ length: asignaciones[indice] }, () => cuota.partido));

  return DEPARTAMENTOS.map((departamento, indice) => {
    const partido = propietarios[indice] ?? null;
    const fuerza = partido ? Math.min(90, 35 + ((partido.influenciaNacional ?? partido.popularidad) * 0.55)) : 0;
    return { departamento: departamento.nombre, partidoId: partido?.id ?? null, porcentaje: Math.round(fuerza) };
  });
}

export { DEPARTAMENTOS };
