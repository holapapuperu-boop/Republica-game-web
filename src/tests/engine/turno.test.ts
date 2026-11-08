/**
 * REPÚBLICA — Pruebas: Motor de Turnos
 *
 * Verifica que procesarTurno() actualice correctamente el estado
 * de la partida. Cada prueba es independiente y determinista.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { procesarTurno } from '../../engine/core/turno';
import { crearNuevaPartida } from '../../engine/core/nuevaPartida';
import type { EstadoPartida } from '../../types/gameTypes';

let estadoBase: EstadoPartida;

beforeEach(() => {
  estadoBase = crearNuevaPartida({
    nombrePartida: 'Test',
    nombrePartido: 'Partido de Prueba',
    siglasPartido: 'PP',
    colorPrincipal: '#ff0000',
    colorSecundario: '#000000',
    lema: 'Lema de prueba',
    fechaInicio: { anio: 2024, mes: 1 },
  });
});

describe('procesarTurno — avance de fecha', () => {
  it('avanza la fecha un mes correctamente', () => {
    const resultado = procesarTurno(estadoBase);
    expect(resultado.nuevoEstado.fechaActual).toEqual({ anio: 2024, mes: 2 });
  });

  it('avanza de diciembre a enero del año siguiente', () => {
    estadoBase = { ...estadoBase, fechaActual: { anio: 2024, mes: 12 } };
    const resultado = procesarTurno(estadoBase);
    expect(resultado.nuevoEstado.fechaActual).toEqual({ anio: 2025, mes: 1 });
  });

  it('incrementa el contador de turno en 1', () => {
    const resultado = procesarTurno(estadoBase);
    expect(resultado.nuevoEstado.turnoActual).toBe(estadoBase.turnoActual + 1);
  });

  it('incrementa turnosDesdeFundacion del partido en 1', () => {
    const resultado = procesarTurno(estadoBase);
    const partido = resultado.nuevoEstado.partidos[0];
    expect(partido.turnosDesdeFundacion).toBe(1);
  });
});

describe('procesarTurno — recursos', () => {
  it('restaura los puntos de acción al máximo', () => {
    // Simula haber gastado puntos de acción
    estadoBase = {
      ...estadoBase,
      recursos: { puntosDeAccion: 0, puntosDeAccionMaximos: 3 },
    };
    const resultado = procesarTurno(estadoBase);
    expect(resultado.nuevoEstado.recursos.puntosDeAccion).toBe(3);
  });

  it('no modifica el máximo de puntos de acción', () => {
    const resultado = procesarTurno(estadoBase);
    expect(resultado.nuevoEstado.recursos.puntosDeAccionMaximos).toBe(
      estadoBase.recursos.puntosDeAccionMaximos
    );
  });
});

describe('procesarTurno — inmutabilidad', () => {
  it('no muta el estado original', () => {
    const fechaOriginal = { ...estadoBase.fechaActual };
    const turnoOriginal = estadoBase.turnoActual;
    procesarTurno(estadoBase);
    expect(estadoBase.fechaActual).toEqual(fechaOriginal);
    expect(estadoBase.turnoActual).toBe(turnoOriginal);
  });
});

describe('procesarTurno — eventos', () => {
  it('agrega al menos un evento nuevo al historial', () => {
    const eventosAntes = estadoBase.eventos.length;
    const resultado = procesarTurno(estadoBase);
    expect(resultado.nuevoEstado.eventos.length).toBeGreaterThan(eventosAntes);
  });

  it('devuelve los eventos generados en el turno', () => {
    const resultado = procesarTurno(estadoBase);
    expect(resultado.eventosGenerados.length).toBeGreaterThan(0);
  });

  it('el resumen del turno contiene el número de turno', () => {
    const resultado = procesarTurno(estadoBase);
    expect(resultado.mensajeResumen).toContain(String(estadoBase.turnoActual + 1));
  });
});

describe('procesarTurno — múltiples turnos consecutivos', () => {
  it('después de 11 turnos desde enero 2024, el mes es diciembre 2024', () => {
    let estado = estadoBase;
    for (let i = 0; i < 11; i++) {
      estado = procesarTurno(estado).nuevoEstado;
    }
    expect(estado.fechaActual).toEqual({ anio: 2024, mes: 12 });
  });

  it('después de 12 turnos desde enero 2024, la fecha es enero 2025', () => {
    let estado = estadoBase;
    for (let i = 0; i < 12; i++) {
      estado = procesarTurno(estado).nuevoEstado;
    }
    expect(estado.fechaActual).toEqual({ anio: 2025, mes: 1 });
  });

  it('el turno contador refleja la cantidad correcta de avances', () => {
    let estado = estadoBase;
    for (let i = 0; i < 6; i++) {
      estado = procesarTurno(estado).nuevoEstado;
    }
    expect(estado.turnoActual).toBe(estadoBase.turnoActual + 6);
  });
});
