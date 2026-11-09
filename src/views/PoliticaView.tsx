/**
 * REPÚBLICA — Vista: Política
 * Muestra los atributos del partido, ideología, acciones disponibles
 * y el resumen de los partidos rivales.
 */

import React, { useState } from 'react';
import { useGameStore, seleccionarPartidoJugador } from '../store/gameStore';
import type { EstadoPartida, Partido } from '../types/gameTypes';
import { generarId } from '../utils/id';

// Definición de acciones básicas disponibles en Fase 1-2
interface AccionPolitica {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  costoPuntos: number;
  costoFondos: number;
  requiereAfiliados: number;
  efecto: (partido: Partido) => Partial<Partido>;
  textoEvento: string;
}

const ACCIONES_BASICAS: AccionPolitica[] = [
  {
    id: 'reclutar_afiliados',
    nombre: 'Reclutar Afiliados',
    descripcion: 'Campaña de captación de militantes. Incrementa la base del partido.',
    categoria: 'Organización',
    costoPuntos: 1,
    costoFondos: 2_000,
    requiereAfiliados: 0,
    efecto: (p) => ({
      afiliados: p.afiliados + Math.floor(5 + p.organizacion * 0.3),
      organizacion: Math.min(100, p.organizacion + 0.5),
    }),
    textoEvento: 'Se reclutaron nuevos afiliados al partido.',
  },
  {
    id: 'acto_partidario',
    nombre: 'Acto Partidario',
    descripcion: 'Organiza un evento público. Aumenta la popularidad y visibilidad.',
    categoria: 'Campaña',
    costoPuntos: 1,
    costoFondos: 5_000,
    requiereAfiliados: 10,
    efecto: (p) => ({
      popularidad: Math.min(100, p.popularidad + 2 + p.comunicacion * 0.05),
      credibilidad: Math.min(100, p.credibilidad + 0.5),
      accionesEjecutadas: p.accionesEjecutadas + 1,
    }),
    textoEvento: 'El partido realizó un acto público con asistencia ciudadana.',
  },
  {
    id: 'recaudacion_fondos',
    nombre: 'Campaña de Recaudación',
    descripcion: 'Reúne donantes y simpatizantes para obtener financiamiento.',
    categoria: 'Financiamiento',
    costoPuntos: 1,
    costoFondos: 1_000,
    requiereAfiliados: 5,
    efecto: (p) => ({
      fondos: p.fondos + 10_000 + p.credibilidad * 100,
      accionesEjecutadas: p.accionesEjecutadas + 1,
    }),
    textoEvento: 'La campaña de recaudación generó nuevos fondos para el partido.',
  },
  {
    id: 'capacitar_militantes',
    nombre: 'Capacitar Militantes',
    descripcion: 'Talleres de formación política. Mejora la organización interna.',
    categoria: 'Organización',
    costoPuntos: 1,
    costoFondos: 3_000,
    requiereAfiliados: 15,
    efecto: (p) => ({
      organizacion: Math.min(100, p.organizacion + 3),
      credibilidad: Math.min(100, p.credibilidad + 1),
      accionesEjecutadas: p.accionesEjecutadas + 1,
    }),
    textoEvento: 'Se realizaron capacitaciones internas fortaleciendo la militancia.',
  },
  {
    id: 'entrevista_medios',
    nombre: 'Entrevista en Medios',
    descripcion: 'Presencia en televisión o radio. Aumenta reconocimiento público.',
    categoria: 'Comunicación',
    costoPuntos: 1,
    costoFondos: 1_500,
    requiereAfiliados: 0,
    efecto: (p) => ({
      popularidad: Math.min(100, p.popularidad + 1.5),
      comunicacion: Math.min(100, p.comunicacion + 1),
      accionesEjecutadas: p.accionesEjecutadas + 1,
    }),
    textoEvento: 'El partido apareció en medios de comunicación nacionales.',
  },
  {
    id: 'publicidad_digital',
    nombre: 'Publicidad Digital',
    descripcion: 'Campaña en redes sociales. Bajo costo, amplio alcance.',
    categoria: 'Comunicación',
    costoPuntos: 1,
    costoFondos: 800,
    requiereAfiliados: 0,
    efecto: (p) => ({
      popularidad: Math.min(100, p.popularidad + 1),
      comunicacion: Math.min(100, p.comunicacion + 0.5),
      accionesEjecutadas: p.accionesEjecutadas + 1,
    }),
    textoEvento: 'El partido lanzó una campaña digital con alta difusión.',
  },
];

export const PoliticaView: React.FC = () => {
  const partida = useGameStore((s) => s.partida);
  const partido = useGameStore(seleccionarPartidoJugador);
  const cargarPartidaEnStore = useGameStore((s) => s.cargarPartidaEnStore);
  const [mensajeAccion, setMensajeAccion] = useState<string | null>(null);
  const [tabActual, setTabActual] = useState<'acciones' | 'rivals'>('acciones');

  if (!partida || !partido) return null;

  const pA = partida.recursos.puntosDeAccion;

  const rivales = partida.partidos.filter((p) => !p.esJugador);

  function ejecutarAccion(accion: AccionPolitica) {
    if (!partida || !partido) return;
    if (pA < accion.costoPuntos) {
      setMensajeAccion('⚠ No tienes suficientes Puntos de Acción este turno.');
      return;
    }
    if (partido.fondos < accion.costoFondos) {
      setMensajeAccion(`⚠ Fondos insuficientes. Necesitas $${accion.costoFondos.toLocaleString('es-SV')}.`);
      return;
    }
    if (partido.afiliados < accion.requiereAfiliados) {
      setMensajeAccion(`⚠ Necesitas al menos ${accion.requiereAfiliados} afiliados.`);
      return;
    }

    // Aplicar efectos al partido
    const efectos = accion.efecto(partido);
    const partidoActualizado: Partido = {
      ...partido,
      ...efectos,
      fondos: (efectos.fondos !== undefined ? efectos.fondos : partido.fondos) - accion.costoFondos,
      accionesEjecutadas: (efectos.accionesEjecutadas ?? partido.accionesEjecutadas),
    };

    const nuevoEstado: EstadoPartida = {
      ...partida,
      partidos: partida.partidos.map((p) =>
        p.id === partido.id ? partidoActualizado : p
      ),
      recursos: {
        ...partida.recursos,
        puntosDeAccion: partida.recursos.puntosDeAccion - accion.costoPuntos,
      },
      eventos: [
        ...partida.eventos,
        {
          id: generarId('evt'),
          fecha: partida.fechaActual,
          titulo: accion.nombre,
          descripcion: accion.textoEvento,
          categoria: 'accion_jugador',
          esFicticio: true,
        },
      ],
    };

    cargarPartidaEnStore(nuevoEstado);
    setMensajeAccion(`✓ "${accion.nombre}" ejecutada correctamente.`);
    setTimeout(() => setMensajeAccion(null), 3000);
  }

  return (
    <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto animate-fade-in">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary font-semibold text-sm">Política</h1>
          <p className="text-text-muted text-xs">
            Gestiona tu partido · PA disponibles: {pA}/{partida.recursos.puntosDeAccionMaximos}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-700 p-0.5 rounded">
          <TabBtn activo={tabActual === 'acciones'} onClick={() => setTabActual('acciones')}>
            Acciones
          </TabBtn>
          <TabBtn activo={tabActual === 'rivals'} onClick={() => setTabActual('rivals')}>
            Rivales ({rivales.length})
          </TabBtn>
        </div>
      </div>

      {/* Alerta de acción */}
      {mensajeAccion && (
        <div className={`text-xs px-3 py-2 rounded border ${
          mensajeAccion.startsWith('✓')
            ? 'bg-success/10 border-success/40 text-success'
            : 'bg-danger/10 border-danger/40 text-danger'
        }`}>
          {mensajeAccion}
        </div>
      )}

      {/* TAB: ACCIONES */}
      {tabActual === 'acciones' && (
        <>
          {/* Tarjetas de acciones */}
          <div className="grid grid-cols-2 gap-3">
            {ACCIONES_BASICAS.map((accion) => {
              const sinPA = pA < accion.costoPuntos;
              const sinFondos = partido.fondos < accion.costoFondos;
              const sinAfiliados = partido.afiliados < accion.requiereAfiliados;
              const bloqueada = sinPA || sinFondos || sinAfiliados;

              return (
                <div
                  key={accion.id}
                  className={`
                    bg-surface-700 border border-surface-500 rounded p-3
                    flex flex-col gap-2
                    ${!bloqueada ? 'hover:border-accent/60 transition-colors' : 'opacity-60'}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xxs text-text-muted uppercase tracking-widest">
                        {accion.categoria}
                      </span>
                      <h3 className="text-text-primary text-xs font-semibold mt-0.5">
                        {accion.nombre}
                      </h3>
                    </div>
                    <span className="text-xxs bg-warning/20 text-warning px-1.5 py-0.5 rounded shrink-0">
                      {accion.costoPuntos} PA
                    </span>
                  </div>

                  <p className="text-text-muted text-xxs">{accion.descripcion}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-surface-500">
                    <div className="flex gap-2 text-xxs text-text-muted">
                      <span className={sinFondos ? 'text-danger' : ''}>
                        💵 ${accion.costoFondos.toLocaleString('es-SV')}
                      </span>
                      {accion.requiereAfiliados > 0 && (
                        <span className={sinAfiliados ? 'text-danger' : ''}>
                          👥 {accion.requiereAfiliados}+
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => ejecutarAccion(accion)}
                      disabled={bloqueada}
                      className="
                        px-2.5 py-1 text-xxs rounded
                        bg-accent hover:bg-accent-hover text-white font-medium
                        disabled:opacity-40 disabled:cursor-not-allowed
                        transition-colors duration-150
                      "
                    >
                      Ejecutar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Perfil del Partido */}
          <div className="bg-surface-700 border border-surface-500 rounded p-3">
            <h2 className="text-text-secondary text-xxs uppercase tracking-widest mb-3">
              Perfil del Partido
            </h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <InfoItem etiqueta="Nombre" valor={partido.nombre} />
              <InfoItem etiqueta="Siglas" valor={partido.siglas} />
              <InfoItem etiqueta="Lema" valor={`"${partido.lema}"`} />
              <InfoItem etiqueta="Posición económica" valor={capitalizar(partido.ideologia.ejeEconomico)} />
              <InfoItem etiqueta="Posición social" valor={capitalizar(partido.ideologia.ejeSocial)} />
              <InfoItem etiqueta="Etiqueta ideológica" valor={partido.ideologia.etiqueta} />
            </div>
          </div>
        </>
      )}

      {/* TAB: RIVALES */}
      {tabActual === 'rivals' && (
        <div className="space-y-3">
          {rivales.length === 0 ? (
            <p className="text-text-muted text-xs">No hay partidos rivales en esta partida.</p>
          ) : (
            rivales.map((rival) => (
              <TarjetaRival key={rival.id} partido={rival} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Subcomponentes
// ---------------------------------------------------------------------------

function TabBtn({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 text-xxs rounded font-medium transition-colors
        ${activo
          ? 'bg-accent text-white'
          : 'text-text-muted hover:text-text-secondary'}
      `}
    >
      {children}
    </button>
  );
}

function TarjetaRival({ partido }: { partido: Partido }) {
  return (
    <div
      className="bg-surface-700 border border-surface-500 rounded p-3"
      style={{ borderLeftColor: partido.colorPrincipal, borderLeftWidth: '3px' }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-bold text-sm" style={{ color: partido.colorPrincipal }}>
            {partido.siglas}
          </p>
          <p className="text-text-secondary text-xs">{partido.nombre}</p>
          <p className="text-text-muted text-xxs italic">"{partido.lema}"</p>
        </div>
        <span className="text-xxs px-1.5 py-0.5 rounded bg-surface-600 text-text-secondary">
          {partido.ideologia.etiqueta}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
        <BarraMini etiqueta="Popularidad" valor={partido.popularidad} color={partido.colorPrincipal} />
        <BarraMini etiqueta="Organización" valor={partido.organizacion} color="#22c55e" />
        <BarraMini etiqueta="Credibilidad" valor={partido.credibilidad} color="#f59e0b" />
        <BarraMini etiqueta="Comunicación" valor={partido.comunicacion} color="#8b5cf6" />
      </div>

      <div className="flex gap-4 mt-2 pt-2 border-t border-surface-500">
        <span className="text-xxs text-text-muted">
          💵 <span className="text-text-secondary">${partido.fondos.toLocaleString('es-SV')}</span>
        </span>
        <span className="text-xxs text-text-muted">
          👥 <span className="text-text-secondary">{partido.afiliados.toLocaleString('es-SV')} afiliados</span>
        </span>
        <span className="text-xxs text-text-muted">
          ⚡ <span className="text-text-secondary">{partido.accionesEjecutadas} acciones</span>
        </span>
      </div>
    </div>
  );
}

function BarraMini({ etiqueta, valor, color }: { etiqueta: string; valor: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-0.5">
        <span className="text-text-muted text-xxs">{etiqueta}</span>
        <span className="text-text-muted text-xxs font-mono">{valor.toFixed(0)}</span>
      </div>
      <div className="h-1 bg-surface-500 rounded">
        <div
          className="h-1 rounded"
          style={{ width: `${Math.min(valor, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function InfoItem({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <span className="text-text-muted text-xxs block">{etiqueta}</span>
      <span className="text-text-primary text-xs">{valor}</span>
    </div>
  );
}

function capitalizar(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}
