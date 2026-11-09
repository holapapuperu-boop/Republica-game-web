/**
 * REPÚBLICA — Utilidades de fecha del juego
 *
 * Funciones puras para operar con FechaJuego.
 * Puras = no tienen efectos secundarios; dado el mismo input, siempre
 * devuelven el mismo output. Fáciles de probar con Vitest.
 */

import type { FechaJuego, Mes } from '../../types/gameTypes';

/** Avanza una fecha exactamente un mes. Diciembre → Enero del año siguiente. */
export function avanzarUnMes(fecha: FechaJuego): FechaJuego {
  if (fecha.mes === 12) {
    return { anio: fecha.anio + 1, mes: 1 };
  }
  return { anio: fecha.anio, mes: (fecha.mes + 1) as Mes };
}

/** Compara dos fechas: -1 si a < b, 0 si iguales, 1 si a > b */
export function compararFechas(a: FechaJuego, b: FechaJuego): -1 | 0 | 1 {
  if (a.anio !== b.anio) return a.anio < b.anio ? -1 : 1;
  if (a.mes !== b.mes) return a.mes < b.mes ? -1 : 1;
  return 0;
}

/** Devuelve true si las dos fechas son exactamente iguales */
export function fechasIguales(a: FechaJuego, b: FechaJuego): boolean {
  return a.anio === b.anio && a.mes === b.mes;
}

const NOMBRES_MESES: Record<Mes, string> = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo',
  4: 'Abril', 5: 'Mayo', 6: 'Junio',
  7: 'Julio', 8: 'Agosto', 9: 'Septiembre',
  10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre',
};

/** Formatea la fecha para mostrar en la interfaz: "Enero 2024" */
export function formatearFecha(fecha: FechaJuego): string {
  return `${NOMBRES_MESES[fecha.mes]} ${fecha.anio}`;
}

/** Calcula cuántos meses han transcurrido entre dos fechas (inicio → fin) */
export function mesesEntre(inicio: FechaJuego, fin: FechaJuego): number {
  return (fin.anio - inicio.anio) * 12 + (fin.mes - inicio.mes);
}
