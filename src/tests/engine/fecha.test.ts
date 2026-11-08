/**
 * REPÚBLICA — Pruebas: Motor de Fecha
 *
 * Verifica que las funciones de fecha sean correctas y deterministas.
 * Estas pruebas documentan las reglas del calendario y protegen contra
 * regresiones (que un cambio en el código rompa algo que antes funcionaba).
 */

import { describe, it, expect } from 'vitest';
import {
  avanzarUnMes,
  compararFechas,
  fechasIguales,
  formatearFecha,
  mesesEntre,
} from '../../engine/core/fecha';
import type { FechaJuego } from '../../types/gameTypes';

describe('avanzarUnMes', () => {
  it('avanza del mes 1 al 2 en el mismo año', () => {
    const resultado = avanzarUnMes({ anio: 2024, mes: 1 });
    expect(resultado).toEqual({ anio: 2024, mes: 2 });
  });

  it('avanza de noviembre a diciembre en el mismo año', () => {
    const resultado = avanzarUnMes({ anio: 2024, mes: 11 });
    expect(resultado).toEqual({ anio: 2024, mes: 12 });
  });

  it('avanza de diciembre a enero del año siguiente (año nuevo)', () => {
    const resultado = avanzarUnMes({ anio: 2024, mes: 12 });
    expect(resultado).toEqual({ anio: 2025, mes: 1 });
  });

  it('avanza correctamente desde el año 2023 diciembre', () => {
    const resultado = avanzarUnMes({ anio: 2023, mes: 12 });
    expect(resultado).toEqual({ anio: 2024, mes: 1 });
  });

  it('no muta el objeto original', () => {
    const original: FechaJuego = { anio: 2024, mes: 6 };
    avanzarUnMes(original);
    expect(original).toEqual({ anio: 2024, mes: 6 });
  });
});

describe('compararFechas', () => {
  it('devuelve -1 si a es anterior a b (mismo año, mes menor)', () => {
    expect(compararFechas({ anio: 2024, mes: 3 }, { anio: 2024, mes: 7 })).toBe(-1);
  });

  it('devuelve 1 si a es posterior a b (año mayor)', () => {
    expect(compararFechas({ anio: 2025, mes: 1 }, { anio: 2024, mes: 12 })).toBe(1);
  });

  it('devuelve 0 si las fechas son iguales', () => {
    expect(compararFechas({ anio: 2024, mes: 6 }, { anio: 2024, mes: 6 })).toBe(0);
  });
});

describe('fechasIguales', () => {
  it('devuelve true para fechas idénticas', () => {
    expect(fechasIguales({ anio: 2024, mes: 3 }, { anio: 2024, mes: 3 })).toBe(true);
  });

  it('devuelve false si difiere el mes', () => {
    expect(fechasIguales({ anio: 2024, mes: 3 }, { anio: 2024, mes: 4 })).toBe(false);
  });

  it('devuelve false si difiere el año', () => {
    expect(fechasIguales({ anio: 2024, mes: 3 }, { anio: 2025, mes: 3 })).toBe(false);
  });
});

describe('formatearFecha', () => {
  it('formatea enero 2024 correctamente', () => {
    expect(formatearFecha({ anio: 2024, mes: 1 })).toBe('Enero 2024');
  });

  it('formatea diciembre 2023 correctamente', () => {
    expect(formatearFecha({ anio: 2023, mes: 12 })).toBe('Diciembre 2023');
  });

  it('formatea septiembre correctamente (mes de 9 letras)', () => {
    expect(formatearFecha({ anio: 2024, mes: 9 })).toBe('Septiembre 2024');
  });
});

describe('mesesEntre', () => {
  it('calcula 0 meses entre la misma fecha', () => {
    expect(mesesEntre({ anio: 2024, mes: 1 }, { anio: 2024, mes: 1 })).toBe(0);
  });

  it('calcula 1 mes entre enero y febrero del mismo año', () => {
    expect(mesesEntre({ anio: 2024, mes: 1 }, { anio: 2024, mes: 2 })).toBe(1);
  });

  it('calcula 12 meses entre enero 2024 y enero 2025', () => {
    expect(mesesEntre({ anio: 2024, mes: 1 }, { anio: 2025, mes: 1 })).toBe(12);
  });

  it('calcula 24 meses entre enero 2024 y enero 2026', () => {
    expect(mesesEntre({ anio: 2024, mes: 1 }, { anio: 2026, mes: 1 })).toBe(24);
  });

  it('calcula meses parciales correctamente: marzo 2024 a julio 2024 = 4', () => {
    expect(mesesEntre({ anio: 2024, mes: 3 }, { anio: 2024, mes: 7 })).toBe(4);
  });
});
