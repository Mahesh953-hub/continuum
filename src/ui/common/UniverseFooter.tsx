/**
 * Continuum Universe Technical Identity & Explainable Manifold Footer
 * Section 1.3: "A universe that calculates itself."
 * Includes reactive selection status and an explainable block describing current geometry.
 */

import React, { useState } from 'react';
import { useUniverseStore } from '../../state/useUniverseStore';
import { getShapeById } from '../../engine/shapes/shapeRegistry';
import { getPresetById } from '../../presets/presetRegistry';
import { Info, ChevronUp, ChevronDown, Layers, Sparkles } from 'lucide-react';

export const UniverseFooter: React.FC = () => {
  const {
    activeShapeId,
    activePresetId,
    dimensionConfig,
    handMode,
    canonMode,
    randomActive,
    togglePencil,
    theme,
  } = useUniverseStore();

  const [expanded, setExpanded] = useState(false);
  const isDark = theme === 'dark';

  const shape = getShapeById(activeShapeId);
  const preset = getPresetById(activePresetId);

  return (
    <footer
      id="universe-status-footer"
      className="fixed bottom-4 left-4 z-25 pointer-events-auto select-none flex flex-col gap-1.5 max-w-[320px] sm:max-w-md animate-in fade-in duration-200"
      aria-label="Universe Selection and Structure Details"
    >
      {/* Main Status Capsule */}
      <div
        className={`p-3 rounded-2xl backdrop-blur-xl border transition-colors ${
          isDark
            ? 'bg-[#0c0f17]/90 border-white/10 text-white shadow-[0_12px_36px_rgba(0,0,0,0.6)]'
            : 'bg-white/90 border-slate-200 text-slate-900 shadow-[0_12px_36px_rgba(0,0,0,0.08)]'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold tracking-widest uppercase font-mono-math ${
                isDark ? 'text-white/90' : 'text-slate-900'
              }`}
            >
              Continuum
            </span>
            <span className={isDark ? 'text-white/20 text-[10px]' : 'text-slate-300 text-[10px]'}>·</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-math bg-blue-500/20 text-blue-500 dark:text-blue-300 border border-blue-400/30">
              {dimensionConfig.currentDimension}D
            </span>
            {randomActive && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-math bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-400/30 animate-pulse">
                AUTONOMOUS
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-1 text-[11px] font-mono-math transition-colors px-1.5 py-0.5 rounded-lg ${
              isDark
                ? 'text-white/50 hover:text-white hover:bg-white/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Toggle structure explanation"
            aria-expanded={expanded}
          >
            <Info className="w-3 h-3 text-blue-400" />
            <span>{expanded ? 'Hide' : 'Explain'}</span>
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>

        {/* Selected Shape Title & Category */}
        <div className="flex items-baseline justify-between gap-2">
          <h2
            className={`text-sm font-semibold tracking-wide truncate ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {shape ? shape.name : 'Autonomous Manifold'}
          </h2>
          {shape?.category && (
            <span
              className={`text-[10px] uppercase font-mono-math tracking-wider shrink-0 ${
                isDark ? 'text-white/40' : 'text-slate-400'
              }`}
            >
              {shape.category}
            </span>
          )}
        </div>

        {/* Mathematical Equation */}
        {shape?.equation && (
          <div
            className={`text-[10px] font-mono-math px-2 py-0.5 rounded-md mt-1 truncate border ${
              isDark
                ? 'text-emerald-400/90 bg-black/40 border-emerald-500/20'
                : 'text-emerald-700 bg-emerald-50 border-emerald-300/60'
            }`}
          >
            {shape.equation}
          </div>
        )}

        {/* Explainable Block (Toggled or Concise Preview) */}
        {expanded ? (
          <div
            className={`mt-2.5 pt-2.5 border-t space-y-2 text-xs leading-relaxed animate-in fade-in duration-200 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            <div className={isDark ? 'text-white/80 font-sans' : 'text-slate-700 font-sans'}>
              {shape?.description ||
                'A dynamic system of persistent particles equilibrating along continuous mathematical manifolds.'}
            </div>

            <div
              className={`text-[11px] font-mono-math space-y-1 p-2 rounded-xl border ${
                isDark
                  ? 'text-white/50 bg-white/[0.03] border-white/6'
                  : 'text-slate-600 bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between">
                <span>Projection:</span>
                <span className={isDark ? 'text-white/70' : 'text-slate-800'}>
                  {dimensionConfig.projectionType}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cosmology Preset:</span>
                <span className={isDark ? 'text-white/70' : 'text-slate-800'}>
                  {preset?.name || 'Default'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Equilibrium Law:</span>
                <span className={isDark ? 'text-white/70' : 'text-slate-800'}>
                  Spring Attractor O(1)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={togglePencil}
              className="w-full py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-700 dark:text-violet-200 text-center text-xs font-medium border border-violet-500/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              <span>Configure in Universe Architect</span>
            </button>
          </div>
        ) : (
          <p
            className={`text-[11px] mt-1 line-clamp-1 ${
              isDark ? 'text-white/50' : 'text-slate-500'
            }`}
          >
            {shape?.description || 'Equilibrating mathematical manifold with persistent particle dynamics.'}
          </p>
        )}

        {/* Mode Indicators */}
        <div
          className={`flex items-center gap-1.5 pt-2 mt-1 border-t ${
            isDark ? 'border-white/8' : 'border-slate-100'
          }`}
        >
          {preset && (
            <span
              className={`text-[10px] font-mono-math truncate ${
                isDark ? 'text-white/40' : 'text-slate-400'
              }`}
            >
              Preset: {preset.name}
            </span>
          )}
          {handMode && (
            <span className="px-1.5 py-0.2 text-[9px] font-mono-math bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded border border-blue-400/30">
              HAND
            </span>
          )}
          {canonMode && (
            <span className="px-1.5 py-0.2 text-[9px] font-mono-math bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded border border-amber-400/30">
              CANON
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};

