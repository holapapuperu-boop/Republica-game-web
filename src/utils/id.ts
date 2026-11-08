/**
 * REPÚBLICA — Generador de IDs únicos
 *
 * Función centralizada para crear identificadores.
 * Usamos crypto.randomUUID() cuando está disponible (navegador moderno);
 * si no (entorno de test Node.js sin la API), usamos un fallback.
 */

export function generarId(prefijo?: string): string {
  const uuid =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  return prefijo ? `${prefijo}-${uuid}` : uuid;
}
