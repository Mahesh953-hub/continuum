/**
 * Canon Mini-Menu & Targeting Configuration
 * Satisfies Section 12 (Firing methods, power, range, Hand mode status)
 */

import React from 'react';
import { Crosshair, Zap, Waves, Sparkles, CircleDot, Orbit, ShieldAlert, X } from 'lucide-react';
import { useUniverseStore } from '../../state/useUniverseStore';
import { CanonFiringMethod } from '../../types';

export const CanonMiniMenu: React.FC = () => {
  const { canon, updateCanonSettings, canonMode, setCanonMode, handMode } = useUniverseStore();

  if (!canonMode) return null;

  const methods: { id: CanonFiringMethod; name: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'single', name: 'Single Impulse', icon: <CircleDot className="w-3.5 h-3.5" />, desc: 'Focused singular vector pulse' },
    { id: 'burst', name: 'Tri-Burst', icon: <Zap className="w-3.5 h-3.5" />, desc: 'Rapid 3-projectile spread' },
    { id: 'rapid', name: 'Rapid Stream', icon: <Sparkles className="w-3.5 h-3.5" />, desc: 'High-frequency particle barrage' },
    { id: 'beam', name: 'Continuous Laser', icon: <Zap className="w-3.5 h-3.5" />, desc: 'Instantaneous directed laser line' },
    { id: 'wave', name: 'Wave Pulse', icon: <Waves className="w-3.5 h-3.5" />, desc: 'Propagating concentric shockwave' },
    { id: 'radial', name: 'Radial Blast', icon: <CircleDot className="w-3.5 h-3.5" />, desc: 'Omnidirectional kinetic dispersion' },
    { id: 'orbital', name: 'Orbital Slingshot', icon: <Orbit className="w-3.5 h-3.5" />, desc: 'Tangential rotational impulse' },
  ];

  return (
    <div
      id="canon-mini-menu"
      className="fixed top-20 right-4 z-30 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#0d1017]/90 backdrop-blur-xl border border-white/12 shadow-2xl p-4 text-white font-sans animate-in fade-in slide-in-from-top-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Crosshair className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide">Canon Targeting</h3>
            <p className="text-[10px] text-white/50 font-mono-math">Tap anywhere to launch impulse</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCanonMode(false)}
          className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close Canon menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Hand Mode Status Warning (Section 12.5) */}
      {handMode && (
        <div className="mb-3.5 p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 text-xs flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-blue-300">Hand Mode Active:</span> Firing is enabled, but particle disturbance is suppressed. Visual tracer will deploy cleanly.
          </div>
        </div>
      )}

      {/* Firing Methods Selector */}
      <div className="space-y-1.5 mb-4">
        <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider font-mono-math">
          Firing Mechanism
        </label>
        <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
          {methods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => updateCanonSettings({ firingMethod: m.id })}
              className={`p-2 rounded-xl text-left transition-all text-xs flex flex-col gap-0.5 ${
                canon.firingMethod === m.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5 font-medium">
                {m.icon}
                <span>{m.name}</span>
              </div>
              <span className="text-[9px] text-white/40 leading-tight">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Power & Range Sliders */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div>
          <div className="flex justify-between text-xs mb-1 font-mono-math">
            <span className="text-white/70">Impulse Power</span>
            <span className="text-amber-400 font-medium">{canon.power.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.5"
            step="0.1"
            value={canon.power}
            onChange={(e) => updateCanonSettings({ power: parseFloat(e.target.value) })}
            className="w-full accent-amber-500 h-1.5 bg-white/15 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1 font-mono-math">
            <span className="text-white/70">Impact Radius</span>
            <span className="text-amber-400 font-medium">{Math.round(canon.range)} px</span>
          </div>
          <input
            type="range"
            min="60"
            max="300"
            step="10"
            value={canon.range}
            onChange={(e) => updateCanonSettings({ range: parseFloat(e.target.value) })}
            className="w-full accent-amber-500 h-1.5 bg-white/15 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
