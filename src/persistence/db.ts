/**
 * REPÚBLICA — Base de datos local con IndexedDB (Dexie.js)
 *
 * Dexie.js es un wrapper elegante y tipado sobre IndexedDB (la base de
 * datos integrada en el navegador). Permite guardar partidas completas,
 * incluyendo su historial de eventos, sin límites de tamaño prácticos.
 *
 * Esquema versión 1: tabla 'partidas' con índices de búsqueda.
 */

import Dexie, { type Table } from 'dexie';
import type { EstadoPartida } from '../types/gameTypes';

/** Metadatos de una partida guardada (vista en la lista de partidas) */
export interface RegistroPartida {
  id: string;               // = EstadoPartida.partidaId
  nombrePartida: string;
  fechaCreacion: string;    // ISO 8601
  fechaUltimoGuardado: string;
  turnoActual: number;
  fechaJuego: string;       // "Enero 2024"
  saveVersion: string;
  /** El estado completo serializado como JSON */
  estadoJson: string;
}

class RepublicaDB extends Dexie {
  partidas!: Table<RegistroPartida>;

  constructor() {
    super('RepublicaDB');
    this.version(1).stores({
      // Índice primario: id; índices secundarios para búsqueda y orden
      partidas: 'id, nombrePartida, fechaUltimoGuardado, turnoActual',
    });
  }
}

export const db = new RepublicaDB();

// ---------------------------------------------------------------------------
// FUNCIONES DE PERSISTENCIA
// ---------------------------------------------------------------------------

/** Guarda (o sobreescribe si ya existe) una partida en IndexedDB */
export async function guardarPartida(estado: EstadoPartida): Promise<void> {
  const registro: RegistroPartida = {
    id: estado.partidaId,
    nombrePartida: estado.nombrePartida,
    fechaCreacion: estado.fechaCreacion,
    fechaUltimoGuardado: new Date().toISOString(),
    turnoActual: estado.turnoActual,
    fechaJuego: `${_mesNombre(estado.fechaActual.mes)} ${estado.fechaActual.anio}`,
    saveVersion: estado.saveVersion,
    estadoJson: JSON.stringify(estado),
  };
  await db.partidas.put(registro);
}

/** Carga una partida por ID; devuelve null si no existe */
export async function cargarPartida(
  id: string
): Promise<EstadoPartida | null> {
  const registro = await db.partidas.get(id);
  if (!registro) return null;
  return JSON.parse(registro.estadoJson) as EstadoPartida;
}

/** Lista todos los registros de partidas guardadas (sin el estadoJson completo) */
export async function listarPartidas(): Promise<Omit<RegistroPartida, 'estadoJson'>[]> {
  const todas = await db.partidas.orderBy('fechaUltimoGuardado').reverse().toArray();
  return todas.map(({ estadoJson: _, ...meta }) => meta);
}

/** Elimina una partida por ID */
export async function eliminarPartida(id: string): Promise<void> {
  await db.partidas.delete(id);
}

/** Exporta una partida como archivo .json descargable */
export function exportarPartida(estado: EstadoPartida): void {
  const json = JSON.stringify(estado, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `republica-${estado.nombrePartida.replace(/\s+/g, '_')}-turno${estado.turnoActual}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Importa una partida desde un archivo .json subido por el usuario */
export async function importarPartida(archivo: File): Promise<EstadoPartida> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const texto = e.target?.result as string;
        const estado = JSON.parse(texto) as EstadoPartida;

        // Validación mínima de estructura
        if (!estado.partidaId || !estado.saveVersion || !estado.fechaActual) {
          throw new Error('El archivo no es una partida válida de REPÚBLICA.');
        }

        await guardarPartida(estado);
        resolve(estado);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsText(archivo);
  });
}

// ---------------------------------------------------------------------------
// Helper interno
// ---------------------------------------------------------------------------

const MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function _mesNombre(mes: number): string {
  return MESES[mes] ?? '?';
}
