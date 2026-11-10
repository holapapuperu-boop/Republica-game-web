import { describe, expect, it } from 'vitest';
import { crearNuevaPartida } from '../../engine/core/nuevaPartida';
import { generarPartidosRivales } from '../../engine/core/rivales';
import { calcularInfluenciasIniciales } from '../../components/mapa/MapaSVG';

describe('escenario político 2024', () => {
  it('incorpora el espectro partidario solicitado por defecto', () => {
    const siglas = generarPartidosRivales().map((partido) => partido.siglas);
    expect(siglas).toEqual(['NI', 'ARENA', 'FMLN', 'GANA', 'PCN', 'PDC', 'VAMOS', 'NT']);
  });

  it('define a Nuevas Ideas como fuerza inicial principal', () => {
    const partidos = generarPartidosRivales();
    const lider = [...partidos].sort((a, b) => b.popularidad - a.popularidad)[0];
    const liderTerritorial = [...partidos].sort((a, b) => (b.influenciaNacional ?? 0) - (a.influenciaNacional ?? 0))[0];
    expect(lider.siglas).toBe('NI');
    expect(liderTerritorial.siglas).toBe('NI');
  });

  it('asigna más departamentos iniciales a NI que a cualquier rival', () => {
    const estado = crearNuevaPartida({
      nombrePartida: 'Prueba 2024', nombrePartido: 'Partido de Prueba', siglasPartido: 'PP',
      colorPrincipal: '#000000', colorSecundario: '#FFFFFF', lema: 'Prueba',
    });
    const ni = estado.partidos.find((partido) => partido.siglas === 'NI');
    expect(ni).toBeDefined();

    const conteos = calcularInfluenciasIniciales(estado.partidos).reduce<Record<string, number>>((acumulado, influencia) => {
      if (influencia.partidoId) acumulado[influencia.partidoId] = (acumulado[influencia.partidoId] ?? 0) + 1;
      return acumulado;
    }, {});
    const mayorRival = Math.max(...estado.partidos.filter((partido) => partido.id !== ni?.id).map((partido) => conteos[partido.id] ?? 0));
    expect(conteos[ni!.id]).toBeGreaterThan(mayorRival);
  });
});
