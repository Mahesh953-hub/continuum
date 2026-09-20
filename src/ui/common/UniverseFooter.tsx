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
  } = useUniverseStore();

  const [expanded, setExpanded] = useState(false);

  const shape = getShapeById(activeShapeId);
  const preset = getPresetById(activePresetId);

  return (
    <footer
      id="universe-status-footer"
      className="fixed bottom-4 left-4 z-25 pointer-events-auto select-none flex flex-col gap-1.5 max-w-[320px] sm:max-w-md animate-in fade-in duration-200"
      aria-label="Universe Selection and Structure Details"
    >
      {/* Main Status Capsule */}
      <div className="p-3 rounded-2xl bg-[#0c0f17]/90 dark:bg-[#0c0f17]/90 backdrop-blur-xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.6)] text-white">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-white/90 font-mono-math">
              Continuum
            </span>
            <span className="text-white/20 text-[10px]">·</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-math bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {dimensionConfig.currentDimension}D
            </span>
            {randomActive && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-math bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 animate-pulse">
                AUTONOMOUS
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] font-mono-math text-white/50 hover:text-white transition-colors px-1.5 py-0.5 rounded-lg hover:bg-white/10"
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
          <h2 className="text-sm font-semibold text-white tracking-wide truncate">
            {shape ? shape.name : 'Autonomous Manifold'}
          </h2>
          {shape?.category && (
            <span className="text-[10px] uppercase font-mono-math text-white/40 tracking-wider shrink-0">
              {shape.category}
            </span>
          )}
        </div>

        {/* Mathematical Equation */}
        {shape?.equation && (
          <div className="text-[10px] text-emerald-400/90 font-mono-math bg-black/40 px-2 py-0.5 rounded-md mt-1 truncate border border-emerald-500/20">
            {shape.equation}
          </div>
        )}

        {/* Explainable Block (Toggled or Concise Preview) */}
        {expanded ? (
          <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-2 text-xs leading-relaxed animate-in fade-in duration-200">
            <div className="text-white/80 font-sans">
              {shape?.description ||
                'A dynamic system of persistent particles equilibrating along continuous mathematical manifolds.'}
            </div>

            <div className="text-[11px] font-mono-math text-white/50 space-y-1 bg-white/[0.03] p-2 rounded-xl border border-white/6">
              <div className="flex justify-between">
                <span>Projection:</span>
                <span className="text-white/70">{dimensionConfig.projectionType}</span>
              </div>
              <div className="flex justify-between">
                <span>Cosmology Preset:</span>
                <span className="text-white/70">{preset?.name || 'Default'}</span>
              </div>
              <div className="flex justify-between">
                <span>Equilibrium Law:</span>
                <span className="text-white/70">Spring Attractor O(1)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={togglePencil}
              className="w-full py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 text-center text-xs font-medium border border-violet-500/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              <span>Configure in Universe Architect</span>
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-white/50 mt-1 line-clamp-1">
            {shape?.description || 'Equilibrating mathematical manifold with persistent particle dynamics.'}
          </p>
        )}

        {/* Mode Indicators */}
        <div className="flex items-center gap-1.5 pt-2 mt-1 border-t border-white/8">
          {preset && (
            <span className="text-[10px] text-white/40 font-mono-math truncate">
              Preset: {preset.name}
            </span>
          )}
          {handMode && (
            <span className="px-1.5 py-0.2 text-[9px] font-mono-math bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
              HAND
            </span>
          )}
          {canonMode && (
            <span className="px-1.5 py-0.2 text-[9px] font-mono-math bg-amber-500/20 text-amber-300 rounded border border-amber-400/30">
              CANON
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};

