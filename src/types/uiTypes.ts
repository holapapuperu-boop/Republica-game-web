/**
 * Tipos de UI: Vistas disponibles en la barra de navegación lateral.
 * Separados de gameTypes.ts para mantener los tipos de UI aislados
 * de los tipos del motor de simulación.
 */

export type VistaActiva =
  | 'situacion'
  | 'politica'
  | 'asamblea'
  | 'territorio'
  | 'gobierno'
  | 'economia'
  | 'sociedad'
  | 'inteligencia'
  | 'geopolitica'
  | 'sistema';
