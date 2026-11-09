/**
 * REPÚBLICA — Motor de Ideología
 *
 * Funciones puras para calcular etiquetas ideológicas a partir de los dos
 * ejes (económico y social). Sin dependencias de React ni del DOM.
 */

import type { EjeEconomico, EjeSocial, Ideologia } from '../../types/gameTypes';

// ---------------------------------------------------------------------------
// MATRIZ DE ETIQUETAS (ejeEconomico × ejeSocial)
// ---------------------------------------------------------------------------
// Inspirada en la matriz del cuadrante político (Political Compass).
// Cada celda tiene la etiqueta más descriptiva para ese cruce.

const MATRIZ_ETIQUETAS: Record<EjeEconomico, Record<EjeSocial, string>> = {
  estatismo: {
    ultraconservador: 'Nacionalismo autoritario',
    conservador:      'Socialismo conservador',
    centrista:        'Socialismo de Estado',
    progresista:      'Socialismo progresista',
    ultraprogresista: 'Marxismo libertario',
  },
  socialdemocrata: {
    ultraconservador: 'Democracia cristiana autoritaria',
    conservador:      'Democracia cristiana',
    centrista:        'Socialdemocracia',
    progresista:      'Socialdemocracia progresista',
    ultraprogresista: 'Izquierda progresista',
  },
  centroeconomico: {
    ultraconservador: 'Nacionalismo conservador',
    conservador:      'Centro-derecha',
    centrista:        'Centro',
    progresista:      'Centro-izquierda',
    ultraprogresista: 'Progresismo',
  },
  liberal: {
    ultraconservador: 'Conservadurismo liberal',
    conservador:      'Liberalismo conservador',
    centrista:        'Liberalismo',
    progresista:      'Liberalismo progresista',
    ultraprogresista: 'Liberalismo social',
  },
  ultraliberal: {
    ultraconservador: 'Libertarismo conservador',
    conservador:      'Ultraliberalismo conservador',
    centrista:        'Ultraliberalismo',
    progresista:      'Anarcocapitalismo progresista',
    ultraprogresista: 'Tecno-anarquismo',
  },
};

/**
 * Genera una instancia de Ideologia a partir de los dos ejes.
 */
export function construirIdeologia(
  ejeEconomico: EjeEconomico,
  ejeSocial: EjeSocial,
): Ideologia {
  const etiqueta = MATRIZ_ETIQUETAS[ejeEconomico][ejeSocial];
  return { ejeEconomico, ejeSocial, etiqueta };
}

// ---------------------------------------------------------------------------
// METADATOS PARA LA UI (etiquetas en español para los selectores)
// ---------------------------------------------------------------------------

export const OPCIONES_EJE_ECONOMICO: { valor: EjeEconomico; etiqueta: string; descripcion: string }[] = [
  { valor: 'estatismo',      etiqueta: 'Estatismo',       descripcion: 'El Estado controla los sectores estratégicos de la economía.' },
  { valor: 'socialdemocrata',etiqueta: 'Socialdemocracia', descripcion: 'Economía mixta con fuerte Estado de bienestar.' },
  { valor: 'centroeconomico',etiqueta: 'Centro',           descripcion: 'Pragmatismo económico sin posición ideológica fija.' },
  { valor: 'liberal',        etiqueta: 'Liberal',          descripcion: 'Mercado libre con regulaciones moderadas.' },
  { valor: 'ultraliberal',   etiqueta: 'Ultraliberal',     descripcion: 'Mínima intervención estatal; mercado como eje central.' },
];

export const OPCIONES_EJE_SOCIAL: { valor: EjeSocial; etiqueta: string; descripcion: string }[] = [
  { valor: 'ultraconservador', etiqueta: 'Ultraconservador', descripcion: 'Valores tradicionales estrictos; orden social sobre libertades individuales.' },
  { valor: 'conservador',      etiqueta: 'Conservador',      descripcion: 'Preservar las instituciones y valores establecidos.' },
  { valor: 'centrista',        etiqueta: 'Centrista',         descripcion: 'Equilibrio entre tradición y cambio gradual.' },
  { valor: 'progresista',      etiqueta: 'Progresista',       descripcion: 'Reformas sociales y ampliación de derechos civiles.' },
  { valor: 'ultraprogresista', etiqueta: 'Ultraprogresista',  descripcion: 'Transformación radical de las estructuras sociales.' },
];
