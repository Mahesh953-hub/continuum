/**
 * Continuum Primary Controls
 * Section 2.2: Exactly four persistent primary controls (Hand, Pencil, Random, Canon)
 * Independent operation: Hand mode does NOT deactivate Canon.
 */

import React from 'react';
import { Hand, Pencil, Shuffle, Crosshair, Sun, Moon, RotateCcw, Orbit, MoveHorizontal, MoveVertical, ZoomIn } from 'lucide-react';
import { useUniverseStore } from '../../state/useUniverseStore';

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
    theme,
    setTheme,
    fps,
    activeParticlesCount,
    dimensionConfig,
    camera,
    updateCamera,
    resetCamera,
  } = useUniverseStore();

  return (
    <>
      <header className="fixed top-4 right-4 z-40 flex items-center gap-2 pointer-events-auto select-none" aria-label="Universe Primary Controls">
        {/* HUD Telemetry Badge (Compact, Technical) */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0d1017]/80 dark:bg-[#0d1017]/80 backdrop-blur-md border border-white/10 text-xs font-mono-math text-[#94a3b8]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/90">{fps}</span> fps
          </span>
          <span className="text-white/20">|</span>
          <span>{activeParticlesCount.toLocaleString()} particles</span>
          <span className="text-white/20">|</span>
          <span className="text-blue-400 font-medium">{dimensionConfig.currentDimension}D</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          id="theme-toggle-button"
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle system theme"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0d1017]/85 dark:bg-[#0d1017]/85 hover:bg-white/10 text-[#94a3b8] hover:text-white transition-all duration-200 border border-white/10 backdrop-blur-md shadow-lg active:scale-95"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Primary 4 Controls Container */}
        <div className="flex items-center p-1 rounded-full bg-[#0d1017]/85 dark:bg-[#0d1017]/85 backdrop-blur-md border border-white/12 shadow-2xl gap-1">
          {/* 1. HAND CONTROL */}
          <button
            id="primary-control-hand"
            type="button"
            onClick={toggleHandMode}
            title={
              handMode
                ? 'Hand Mode: ACTIVE (Pan/Zoom camera enabled, direct particle blasts suppressed)'
                : 'Hand Mode: OFF (Click to navigate space and inspect dimensions)'
            }
            aria-label="Hand Navigation Mode"
            aria-pressed={handMode}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
              handMode
                ? 'bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.6)] border border-blue-400/50 ring-2 ring-blue-500/30'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/8'
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
            title="Pencil: Open Universe Configuration (Presets, Shapes, Math, Healing, Appearance)"
            aria-label="Pencil Configuration Menu"
            aria-pressed={pencilOpen}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
              pencilOpen
                ? 'bg-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.6)] border border-violet-400/50'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/8'
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
                : 'text-[#94a3b8] hover:text-white hover:bg-white/8'
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
                ? 'Canon: ACTIVE (Aim & fire impulse projectiles; tap target to launch)'
                : 'Canon: Activate impulse targeting cannon'
            }
            aria-label="Canon Mode"
            aria-pressed={canonMode}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
              canonMode
                ? 'bg-amber-600 text-white shadow-[0_0_16px_rgba(217,119,6,0.6)] border border-amber-400/50 ring-2 ring-amber-500/30'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/8'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            {canonMode && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* HAND MODE EXTENDED HUD CONTROLS */}
      {handMode && (
        <aside
          id="hand-mode-camera-hud"
          aria-label="Hand Navigation HUD"
          className="fixed top-18 right-4 z-35 w-72 sm:w-80 p-3.5 rounded-2xl bg-[#0d1017]/92 dark:bg-[#0d1017]/92 backdrop-blur-xl border border-blue-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] text-white select-none animate-in fade-in slide-in-from-top-2 duration-200"
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
                <span className="text-white/70 flex items-center gap-1">
                  <MoveHorizontal className="w-3 h-3 text-blue-400" />
                  <span>Pan X</span>
                </span>
                <span className="font-mono-math text-[11px] text-white/50">{Math.round(camera.x)}px</span>
              </div>
              <input
                type="range"
                min={-1400}
                max={1400}
                step={5}
                value={camera.x}
                onChange={(e) => updateCamera({ x: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 2. Vertical Camera Pan Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-white/70 flex items-center gap-1">
                  <MoveVertical className="w-3 h-3 text-blue-400" />
                  <span>Pan Y</span>
                </span>
                <span className="font-mono-math text-[11px] text-white/50">{Math.round(camera.y)}px</span>
              </div>
              <input
                type="range"
                min={-1400}
                max={1400}
                step={5}
                value={camera.y}
                onChange={(e) => updateCamera({ y: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 3. Object Scale / Invisible Particle Zoom Slider */}
            <div className="pt-1 border-t border-white/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white/80 font-medium flex items-center gap-1">
                  <ZoomIn className="w-3 h-3 text-amber-400" />
                  <span>Object Particle Scale</span>
                </span>
                <span className="font-mono-math text-[11px] text-amber-400 font-bold">
                  {(camera.objectScale || 1.4).toFixed(2)}x
                </span>
              </div>
              <p className="text-[10px] text-white/40 mb-1.5">
                Inspect particles closely without altering physics behavior or camera translation.
              </p>
              <input
                type="range"
                min={0.4}
                max={4.0}
                step={0.05}
                value={camera.objectScale || 1.4}
                onChange={(e) => updateCamera({ objectScale: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 4. Autonomous 3D Spin Control */}
            <div className="pt-1 border-t border-white/10 flex items-center justify-between">
              <span className="text-white/70 flex items-center gap-1">
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

