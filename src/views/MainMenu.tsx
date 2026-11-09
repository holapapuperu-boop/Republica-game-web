/**
 * REPÚBLICA — Pantalla de Inicio / Menú Principal
 *
 * Permite al jugador crear una nueva partida configurando su partido,
 * o cargar una partida existente desde IndexedDB.
 */

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { crearNuevaPartida } from '../engine/core/nuevaPartida';
import { listarPartidas, cargarPartida, type RegistroPartida } from '../persistence/db';
import { guardarPartida } from '../persistence/db';
import {
  OPCIONES_EJE_ECONOMICO,
  OPCIONES_EJE_SOCIAL,
  construirIdeologia,
} from '../engine/core/ideologia';
import type { EjeEconomico, EjeSocial } from '../types/gameTypes';

type Pantalla = 'menu' | 'nueva_partida' | 'cargar';

export const MainMenu: React.FC = () => {
  const cargarPartidaEnStore = useGameStore((s) => s.cargarPartidaEnStore);
  const [pantalla, setPantalla] = useState<Pantalla>('menu');
  const [partidas, setPartidas] = useState<Omit<RegistroPartida, 'estadoJson'>[]>([]);

  // Formulario de nueva partida
  const [form, setForm] = useState({
    nombrePartida: 'Mi Partida',
    nombrePartido: '',
    siglasPartido: '',
    colorPrincipal: '#3b82f6',
    colorSecundario: '#1e3a5f',
    lema: '',
    ejeEconomico: 'centroeconomico' as EjeEconomico,
    ejeSocial: 'centrista' as EjeSocial,
  });
  const [errorForm, setErrorForm] = useState<string | null>(null);

  useEffect(() => {
    if (pantalla === 'cargar') {
      listarPartidas().then(setPartidas).catch(console.error);
    }
  }, [pantalla]);

  const ideologiaActual = construirIdeologia(form.ejeEconomico, form.ejeSocial);

  const handleCrear = async () => {
    if (!form.nombrePartido.trim()) {
      setErrorForm('El nombre del partido es obligatorio.');
      return;
    }
    if (!form.siglasPartido.trim()) {
      setErrorForm('Las siglas del partido son obligatorias.');
      return;
    }
    if (form.siglasPartido.length > 8) {
      setErrorForm('Las siglas no deben superar 8 caracteres.');
      return;
    }
    if (!form.lema.trim()) {
      setErrorForm('El lema del partido es obligatorio.');
      return;
    }

    const nuevoEstado = crearNuevaPartida({
      nombrePartida: form.nombrePartida.trim(),
      nombrePartido: form.nombrePartido.trim(),
      siglasPartido: form.siglasPartido.trim(),
      colorPrincipal: form.colorPrincipal,
      colorSecundario: form.colorSecundario,
      lema: form.lema.trim(),
      ejeEconomico: form.ejeEconomico,
      ejeSocial: form.ejeSocial,
    });

    await guardarPartida(nuevoEstado);
    cargarPartidaEnStore(nuevoEstado);
  };

  const handleCargar = async (id: string) => {
    const estado = await cargarPartida(id);
    if (estado) cargarPartidaEnStore(estado);
  };

  if (pantalla === 'nueva_partida') {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-surface-800 border border-surface-500 rounded-lg p-6">
          <button
            onClick={() => setPantalla('menu')}
            className="text-text-muted text-xs mb-4 hover:text-text-secondary"
          >
            ← Volver
          </button>
          <h2 className="text-text-primary font-bold text-base mb-1">Nueva Partida</h2>
          <p className="text-text-muted text-xs mb-5">Crea tu partido político y comienza tu camino.</p>

          {errorForm && (
            <div className="text-xs px-3 py-2 rounded border bg-danger/10 border-danger/40 text-danger mb-4">
              {errorForm}
            </div>
          )}

          <div className="space-y-4">
            {/* ---- Datos básicos ---- */}
            <FormField
              label="Nombre de la partida"
              hint="Solo para identificar tu guardado"
            >
              <input
                className="form-input"
                value={form.nombrePartida}
                onChange={(e) => { setErrorForm(null); setForm({ ...form, nombrePartida: e.target.value }); }}
                placeholder="Mi Partida El Salvador 2024"
              />
            </FormField>

            <FormField label="Nombre del Partido" hint="El nombre completo del partido político">
              <input
                className="form-input"
                value={form.nombrePartido}
                onChange={(e) => { setErrorForm(null); setForm({ ...form, nombrePartido: e.target.value }); }}
                placeholder="Partido Acción Ciudadana"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Siglas" hint="Máx. 8 caracteres">
                <input
                  className="form-input uppercase"
                  value={form.siglasPartido}
                  maxLength={8}
                  onChange={(e) => { setErrorForm(null); setForm({ ...form, siglasPartido: e.target.value.toUpperCase() }); }}
                  placeholder="PAC"
                />
              </FormField>

              <FormField label="Lema del Partido">
                <input
                  className="form-input"
                  value={form.lema}
                  onChange={(e) => { setErrorForm(null); setForm({ ...form, lema: e.target.value }); }}
                  placeholder="Por una nueva El Salvador"
                />
              </FormField>
            </div>

            {/* ---- Colores ---- */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Color principal">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.colorPrincipal}
                    onChange={(e) => setForm({ ...form, colorPrincipal: e.target.value })}
                    className="w-10 h-8 rounded cursor-pointer border border-surface-500 bg-surface-700"
                  />
                  <span className="text-text-muted text-xs font-mono">{form.colorPrincipal}</span>
                </div>
              </FormField>
              <FormField label="Color secundario">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.colorSecundario}
                    onChange={(e) => setForm({ ...form, colorSecundario: e.target.value })}
                    className="w-10 h-8 rounded cursor-pointer border border-surface-500 bg-surface-700"
                  />
                  <span className="text-text-muted text-xs font-mono">{form.colorSecundario}</span>
                </div>
              </FormField>
            </div>

            {/* ---- Ideología ---- */}
            <div className="border border-surface-500 rounded p-3 space-y-3">
              <p className="text-text-secondary text-xs font-medium uppercase tracking-widest">
                Posición Ideológica
              </p>

              <FormField label="Eje Económico">
                <div className="grid grid-cols-5 gap-1">
                  {OPCIONES_EJE_ECONOMICO.map((op) => (
                    <button
                      key={op.valor}
                      type="button"
                      title={op.descripcion}
                      onClick={() => setForm({ ...form, ejeEconomico: op.valor })}
                      className={`
                        py-1.5 px-1 text-xxs rounded text-center transition-colors
                        ${form.ejeEconomico === op.valor
                          ? 'bg-accent text-white font-semibold'
                          : 'bg-surface-700 text-text-muted hover:bg-surface-600 hover:text-text-secondary border border-surface-500'}
                      `}
                    >
                      {op.etiqueta}
                    </button>
                  ))}
                </div>
                <p className="text-text-muted text-xxs mt-1">
                  {OPCIONES_EJE_ECONOMICO.find(o => o.valor === form.ejeEconomico)?.descripcion}
                </p>
              </FormField>

              <FormField label="Eje Social">
                <div className="grid grid-cols-5 gap-1">
                  {OPCIONES_EJE_SOCIAL.map((op) => (
                    <button
                      key={op.valor}
                      type="button"
                      title={op.descripcion}
                      onClick={() => setForm({ ...form, ejeSocial: op.valor })}
                      className={`
                        py-1.5 px-1 text-xxs rounded text-center transition-colors
                        ${form.ejeSocial === op.valor
                          ? 'bg-accent text-white font-semibold'
                          : 'bg-surface-700 text-text-muted hover:bg-surface-600 hover:text-text-secondary border border-surface-500'}
                      `}
                    >
                      {op.etiqueta}
                    </button>
                  ))}
                </div>
                <p className="text-text-muted text-xxs mt-1">
                  {OPCIONES_EJE_SOCIAL.find(o => o.valor === form.ejeSocial)?.descripcion}
                </p>
              </FormField>
            </div>

            {/* ---- Vista previa del partido ---- */}
            <div
              className="border rounded p-3 mt-2"
              style={{ borderColor: form.colorPrincipal + '80' }}
            >
              <p className="text-xxs text-text-muted mb-1">Vista previa</p>
              <p
                className="font-bold text-sm"
                style={{ color: form.colorPrincipal }}
              >
                {form.siglasPartido || 'SIGLAS'}
              </p>
              <p className="text-text-secondary text-xs">{form.nombrePartido || 'Nombre del Partido'}</p>
              <p className="text-text-muted text-xxs italic mb-1">"{form.lema || 'Lema del partido'}"</p>
              <span className="text-xxs px-1.5 py-0.5 rounded bg-surface-600 text-text-secondary">
                {ideologiaActual.etiqueta}
              </span>
            </div>

            <button
              onClick={handleCrear}
              className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded transition-colors"
            >
              ▶ Comenzar Partida
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pantalla === 'cargar') {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-surface-800 border border-surface-500 rounded-lg p-6">
          <button
            onClick={() => setPantalla('menu')}
            className="text-text-muted text-xs mb-4 hover:text-text-secondary"
          >
            ← Volver
          </button>
          <h2 className="text-text-primary font-bold text-base mb-4">Cargar Partida</h2>

          {partidas.length === 0 ? (
            <p className="text-text-muted text-sm">No hay partidas guardadas.</p>
          ) : (
            <div className="space-y-2">
              {partidas.map((p) => (
                <div
                  key={p.id}
                  className="border border-surface-500 rounded p-3 flex items-center gap-3 hover:border-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleCargar(p.id)}
                >
                  <div className="flex-1">
                    <p className="text-text-primary text-sm font-medium">{p.nombrePartida}</p>
                    <p className="text-text-muted text-xs">
                      Turno {p.turnoActual} · {p.fechaJuego}
                    </p>
                    <p className="text-text-muted text-xxs">
                      {new Date(p.fechaUltimoGuardado).toLocaleString('es-SV')}
                    </p>
                  </div>
                  <span className="text-accent text-xs">▶ Cargar</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Menú principal
  return (
    <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center gap-8 p-6">
      {/* Logo / Título */}
      <div className="text-center">
        <h1 className="text-5xl font-black tracking-widest text-text-primary uppercase">
          REPÚBLICA
        </h1>
        <p className="text-text-secondary text-sm mt-2 tracking-wide">
          Simulador político de El Salvador
        </p>
        <p className="text-text-muted text-xxs mt-1 font-mono">
          v0.2.0 · Fase 2
        </p>
      </div>

      {/* Separador decorativo */}
      <div className="w-24 h-px bg-accent/40" />

      {/* Opciones del menú */}
      <div className="flex flex-col gap-3 w-56">
        <button
          onClick={() => setPantalla('nueva_partida')}
          className="
            w-full py-3 bg-accent hover:bg-accent-hover text-white
            font-semibold text-sm rounded tracking-wide uppercase
            transition-colors duration-150
          "
        >
          Nueva Partida
        </button>
        <button
          onClick={() => setPantalla('cargar')}
          className="
            w-full py-3 border border-surface-500 hover:border-accent/60
            text-text-secondary hover:text-text-primary
            font-medium text-sm rounded tracking-wide
            transition-colors duration-150
          "
        >
          Cargar Partida
        </button>
      </div>

      <p className="text-text-muted text-xxs text-center max-w-xs">
        Proyecto privado y personal · Uso exclusivo offline
      </p>
    </div>
  );
};

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-text-secondary text-xs font-medium block mb-1">
        {label}
        {hint && <span className="text-text-muted ml-1 font-normal">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
