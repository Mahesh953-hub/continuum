/**
 * Continuum Primary Controls
 * Section 2.2: Exactly four persistent primary controls (Hand, Pencil, Random, Canon)
 * Independent operation: Hand mode does NOT deactivate Canon.
 * Includes Infinity Density Slider (10k to 100M genuine particles) and Theme Toggle.
 */

import React from 'react';
import {
  Hand,
  Pencil,
  Shuffle,
  Crosshair,
  Sun,
  Moon,
  RotateCcw,
  Orbit,
  MoveHorizontal,
  MoveVertical,
  ZoomIn,
  Infinity,
  FlaskConical,
  X,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useUniverseStore } from '../../state/useUniverseStore';

function formatNumberHuman(val: number): string {
  if (val >= 1000000) {
    const m = val / 1000000;
    return Number.isInteger(m) ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (val >= 1000) {
    const k = val / 1000;
    return Number.isInteger(k) ? `${k}K` : `${k.toFixed(0)}K`;
  }
  return val.toLocaleString();
}

export const PrimaryControls: React.FC = () => {
  const {
    handMode,
    toggleHandMode,
    pencilOpen,
    togglePencil,
    canonMode,
    toggleCanonMode,
    randomActive,
    toggleRandomMode,
    infinityMode,
    toggleInfinityMode,
    setInfinityMode,
    infinitySliderOpen,
    setInfinitySliderOpen,
    infiniteTargetCount,
    setInfiniteTargetCount,
    setLabModalOpen,
    theme,
    setTheme,
    fps,
    activeParticlesCount,
    dimensionConfig,
    appearance,
    camera,
    updateCamera,
    resetCamera,
  } = useUniverseStore();

  const isDark = theme === 'dark';

  const INFINITY_PRESETS = [
    { label: '10K', count: 10000 },
    { label: '50K', count: 50000 },
    { label: '250K', count: 250000 },
    { label: '1M', count: 1000000 },
    { label: '10M', count: 10000000 },
    { label: '50M', count: 50000000 },
    { label: '100M', count: 100000000 },
  ];

  return (
    <>
      <header
        className="fixed top-4 right-4 z-40 flex items-center gap-2 pointer-events-auto select-none"
        aria-label="Universe Primary Controls"
      >
        {/* HUD Telemetry Badge (Compact, Technical) */}
        <div
          className={`hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-mono-math transition-colors ${
            isDark
              ? 'bg-[#0d1017]/85 border-white/10 text-[#94a3b8]'
              : 'bg-white/90 border-slate-200/90 text-slate-600 shadow-sm'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className={isDark ? 'text-white/90' : 'text-slate-900 font-semibold'}>{fps}</span> fps
          </span>
          <span className={isDark ? 'text-white/20' : 'text-slate-300'}>|</span>
          <span className="flex items-center gap-1">
            <span className={isDark ? 'text-white/90 font-medium' : 'text-slate-900 font-medium'}>
              {activeParticlesCount.toLocaleString()}
            </span>
            <span>particles ·</span>
            <span className={infinityMode ? 'text-cyan-400 font-semibold' : ''}>
              {appearance.particleSize.toFixed(2)}px
            </span>
            {infinityMode && (
              <span className="text-cyan-400 font-bold ml-0.5">∞</span>
            )}
          </span>
          <span className={isDark ? 'text-white/20' : 'text-slate-300'}>|</span>
          <span className="text-blue-400 font-medium">{dimensionConfig.currentDimension}D</span>
        </div>

        {/* Infinity Mode Toggle & Slider Trigger Button */}
        <div className="relative">
          <button
            id="infinity-mode-toggle"
            type="button"
            onClick={() => {
              if (!infinityMode) {
                toggleInfinityMode();
              } else {
                setInfinitySliderOpen(!infinitySliderOpen);
              }
            }}
            title={
              infinityMode
                ? `Infinity Mode: ACTIVE (${formatNumberHuman(infiniteTargetCount)} particles). Click to adjust density slider (10k to 100M).`
                : 'Infinity Mode: OFF. Click to open particle density slider (10,000 to 100,000,000 particles).'
            }
            aria-label="Infinity Mode and Density Slider"
            aria-pressed={infinityMode}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border backdrop-blur-md shadow-lg active:scale-95 ${
              infinityMode
                ? 'bg-cyan-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.7)] border-cyan-300 ring-2 ring-cyan-400/40'
                : isDark
                ? 'bg-[#0d1017]/85 text-[#94a3b8] hover:text-white hover:bg-white/10 border-white/10'
                : 'bg-white/90 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 border-slate-200 shadow-sm'
            }`}
          >
            <Infinity className="w-4 h-4" />
            {infinityMode && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
            )}
          </button>
        </div>

        {/* Tweak / Particle Lab Suite Button */}
        <button
          id="tweak-lab-button"
          type="button"
          onClick={() => setLabModalOpen(true)}
          title="Tweak / Particle Lab: Create custom blank objects and experiment with electrons, protons, and quantum species"
          aria-label="Open Particle Lab & Tweak Suite"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border backdrop-blur-md shadow-lg active:scale-95 ${
            isDark
              ? 'bg-[#0d1017]/85 hover:bg-white/10 text-[#94a3b8] hover:text-emerald-400 border-white/10'
              : 'bg-white/90 hover:bg-slate-100 text-slate-600 hover:text-emerald-600 border-slate-200 shadow-sm'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Theme Toggle Button (Fully Functional Light & Dark Mode) */}
        <button
          id="theme-toggle-button"
          type="button"
          onClick={() => {
            const nextTheme = theme === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
          }}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle system theme"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border backdrop-blur-md shadow-lg active:scale-95 ${
            isDark
              ? 'bg-[#0d1017]/85 hover:bg-white/10 text-amber-300 hover:text-amber-200 border-white/12 shadow-[0_0_12px_rgba(251,191,36,0.15)]'
              : 'bg-white/95 hover:bg-slate-100 text-slate-800 hover:text-indigo-600 border-slate-300 shadow-md ring-1 ring-slate-200'
          }`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-700 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* Primary 4 Controls Container */}
        <div
          className={`flex items-center p-1 rounded-full backdrop-blur-md border shadow-2xl gap-1 ${
            isDark
              ? 'bg-[#0d1017]/85 border-white/12'
              : 'bg-white/90 border-slate-200 shadow-lg'
          }`}
        >
          {/* 1. HAND CONTROL */}
          <button
            id="primary-control-hand"
            type="button"
            onClick={toggleHandMode}
            title={
              handMode
                ? 'Hand Mode: ACTIVE (Pan/Zoom camera enabled)'
                : 'Hand Mode: OFF (Click to navigate space and inspect dimensions)'
            }
            aria-label="Hand Navigation Mode"
            aria-pressed={handMode}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
              handMode
                ? 'bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.6)] border border-blue-400/50 ring-2 ring-blue-500/30'
                : isDark
                ? 'text-[#94a3b8] hover:text-white hover:bg-white/8'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Hand className="w-4 h-4" />
            {handMode && (
              <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-white animate-ping" />
            )}
          </button>

          {/* 2. PENCIL CONTROL */}
          <button
            id="primary-control-pencil"
            type="button"
            onClick={togglePencil}
            title="Pencil: Open Universe Configuration (Presets, Galaxy, Shapes, Math, Healing, Appearance)"
            aria-label="Pencil Configuration Menu"
            aria-pressed={pencilOpen}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
              pencilOpen
                ? 'bg-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.6)] border border-violet-400/50'
                : isDark
                ? 'text-[#94a3b8] hover:text-white hover:bg-white/8'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* 3. RANDOM CONTROL (Toggleable state) */}
          <button
            id="primary-control-random"
            type="button"
            onClick={toggleRandomMode}
            title={
              randomActive
                ? 'Random: ACTIVE (Click to toggle off)'
                : 'Random: Click to activate coherent procedural universe'
            }
            aria-label="Randomize Universe"
            aria-pressed={randomActive}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
              randomActive
                ? 'bg-emerald-600 text-white shadow-[0_0_16px_rgba(16,185,129,0.6)] border border-emerald-400/50 ring-2 ring-emerald-500/30'
                : isDark
                ? 'text-[#94a3b8] hover:text-white hover:bg-white/8'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            {randomActive && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* 4. CANON CONTROL */}
          <button
            id="primary-control-canon"
            type="button"
            onClick={toggleCanonMode}
            title={
              canonMode
                ? 'Canon: ACTIVE (Aim & fire impulse projectiles)'
                : 'Canon: Activate impulse targeting cannon'
            }
            aria-label="Canon Mode"
            aria-pressed={canonMode}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
              canonMode
                ? 'bg-amber-600 text-white shadow-[0_0_16px_rgba(217,119,6,0.6)] border border-amber-400/50 ring-2 ring-amber-500/30'
                : isDark
                ? 'text-[#94a3b8] hover:text-white hover:bg-white/8'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            {canonMode && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* INFINITY DENSITY SLIDER POPOVER (10k to 100M Genuine Particle Continuum) */}
      {infinitySliderOpen && (
        <aside
          id="infinity-density-slider-hud"
          aria-label="Infinity Density Particle Slider"
          className={`fixed top-18 right-4 sm:right-28 z-40 w-80 sm:w-96 p-4 rounded-2xl backdrop-blur-2xl border shadow-2xl select-none animate-in fade-in slide-in-from-top-2 duration-200 ${
            isDark
              ? 'bg-[#0d1017]/95 border-cyan-500/30 text-white shadow-[0_16px_50px_rgba(0,0,0,0.7)]'
              : 'bg-white/95 border-cyan-500/40 text-slate-900 shadow-[0_16px_50px_rgba(6,182,212,0.15)]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Infinity className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold tracking-wide flex items-center gap-1.5">
                  <span>Infinity Field Density</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 font-mono">
                    10K - 100M
                  </span>
                </h2>
                <p className="text-[10px] text-cyan-400/80 font-mono-math">
                  Genuine mathematical particle continuum
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInfinitySliderOpen(false)}
              title="Close Infinity Density Slider"
              aria-label="Close slider"
              className={`p-1 rounded-full transition-colors ${
                isDark ? 'text-white/50 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Metrics Highlight */}
          <div
            className={`p-3 rounded-xl mb-3 border flex items-center justify-between ${
              isDark
                ? 'bg-cyan-950/30 border-cyan-500/20'
                : 'bg-cyan-50/80 border-cyan-200'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 block">
                Particle Total
              </span>
              <span className="text-lg font-bold font-mono-math text-cyan-400">
                {infiniteTargetCount.toLocaleString()}
              </span>
              <span className="text-xs font-mono-math ml-1 opacity-70">
                ({formatNumberHuman(infiniteTargetCount)})
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 block">
                Dynamic Diameter
              </span>
              <span className="text-sm font-bold font-mono-math text-emerald-400">
                {appearance.particleSize.toFixed(2)}px
              </span>
            </div>
          </div>

          {/* Logarithmic Particle Continuum Slider (10,000 to 100,000,000) */}
          <div className="mb-3">
            <div className="flex justify-between items-center text-[11px] font-mono-math mb-1.5">
              <span className="opacity-70 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-cyan-400" />
                <span>Density Continuum</span>
              </span>
              <span className="text-cyan-400 font-bold">
                {formatNumberHuman(infiniteTargetCount)}
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={8}
              step={0.02}
              value={Math.log10(infiniteTargetCount)}
              onChange={(e) => {
                const logVal = parseFloat(e.target.value);
                const count = Math.round(Math.pow(10, logVal));
                setInfiniteTargetCount(count);
                if (!infinityMode) {
                  setInfinityMode(true);
                }
              }}
              className="w-full accent-cyan-400 bg-white/10 dark:bg-white/15 h-2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono-math opacity-50 mt-1">
              <span>10K (Min)</span>
              <span>100K</span>
              <span>1M</span>
              <span>10M</span>
              <span>100M (Max)</span>
            </div>
          </div>

          {/* Preset Buttons for Quick Jumps */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 block">
              Quick Cosmic Presets
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
              {INFINITY_PRESETS.map((preset) => {
                const isSelected =
                  Math.abs(infiniteTargetCount - preset.count) / preset.count < 0.15;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setInfiniteTargetCount(preset.count);
                      if (!infinityMode) setInfinityMode(true);
                    }}
                    className={`py-1 px-1.5 rounded text-[10px] font-mono-math font-semibold transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 ring-1 ring-cyan-300'
                        : isDark
                        ? 'bg-white/8 hover:bg-white/15 text-white/80'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Master Infinity Mode Toggle footer */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] opacity-70 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Forced Boundless Cosmos</span>
            </span>
            <button
              type="button"
              onClick={toggleInfinityMode}
              className={`px-3 py-1 rounded-full text-xs font-mono-math font-bold transition-all ${
                infinityMode
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/40'
                  : isDark
                  ? 'bg-white/10 text-white/50 hover:bg-white/20'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {infinityMode ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>
        </aside>
      )}

      {/* HAND MODE EXTENDED HUD CONTROLS */}
      {handMode && (
        <aside
          id="hand-mode-camera-hud"
          aria-label="Hand Navigation HUD"
          className={`fixed top-18 right-4 z-35 w-72 sm:w-80 p-3.5 rounded-2xl backdrop-blur-xl border shadow-[0_12px_40px_rgba(0,0,0,0.6)] select-none animate-in fade-in slide-in-from-top-2 duration-200 ${
            isDark
              ? 'bg-[#0d1017]/92 border-blue-500/30 text-white'
              : 'bg-white/95 border-blue-400/40 text-slate-900 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
              <Hand className="w-3.5 h-3.5" />
              <span>Camera & Particle Inspection</span>
            </div>
            <button
              type="button"
              onClick={resetCamera}
              title="Reset camera pan and zoom"
              className="flex items-center gap-1 text-[10px] font-mono-math px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* 1. Horizontal Camera Pan Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="opacity-70 flex items-center gap-1">
                  <MoveHorizontal className="w-3 h-3 text-blue-400" />
                  <span>Pan X</span>
                </span>
                <span className="font-mono-math text-[11px] opacity-50">{Math.round(camera.x)}px</span>
              </div>
              <input
                type="range"
                min={-1500}
                max={1500}
                value={camera.x}
                onChange={(e) => updateCamera({ x: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 2. Vertical Camera Pan Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="opacity-70 flex items-center gap-1">
                  <MoveVertical className="w-3 h-3 text-blue-400" />
                  <span>Pan Y</span>
                </span>
                <span className="font-mono-math text-[11px] opacity-50">{Math.round(camera.y)}px</span>
              </div>
              <input
                type="range"
                min={-1500}
                max={1500}
                value={camera.y}
                onChange={(e) => updateCamera({ y: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 3. Object Scale / Zoom Magnification */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="opacity-70 flex items-center gap-1">
                  <ZoomIn className="w-3 h-3 text-amber-400" />
                  <span>Object Scale</span>
                </span>
                <span className="font-mono-math text-[11px] opacity-50">{(camera.objectScale || 1.4).toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={5.0}
                step={0.05}
                value={camera.objectScale || 1.4}
                onChange={(e) => updateCamera({ objectScale: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 4. Autonomous 3D Spin Control */}
            <div className="pt-1 border-t border-white/10 flex items-center justify-between">
              <span className="opacity-70 flex items-center gap-1">
                <Orbit className="w-3 h-3 text-violet-400" />
                <span>Autonomous 3D Spin</span>
              </span>
              <button
                type="button"
                onClick={() => updateCamera({ autoSpin: !camera.autoSpin })}
                className={`px-2 py-0.5 rounded text-[11px] font-mono-math transition-colors ${
                  camera.autoSpin
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'bg-white/10 text-white/50 hover:bg-white/20'
                }`}
              >
                {camera.autoSpin ? 'ACTIVE' : 'PAUSED'}
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};
