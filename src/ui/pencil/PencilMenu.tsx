/**
 * Continuum Pencil Menu: Authoritative Configuration Panel
 * Satisfies Section 14 (Presets, 200+ Shapes, Math & Dimensions 1D-11D, Physics,
 * Self-Healing, Appearance with Colored Particles toggle, Density & Scale)
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Shapes,
  Atom,
  HeartPulse,
  Palette,
  SlidersHorizontal,
  Layers,
  Search,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { useUniverseStore } from '../../state/useUniverseStore';
import { PRESETS_REGISTRY } from '../../presets/presetRegistry';
import { SHAPES_REGISTRY } from '../../engine/shapes/shapeRegistry';
import { ShapeCategory } from '../../types';

export const PencilMenu: React.FC = () => {
  const {
    pencilOpen,
    setPencilOpen,
    activePencilSection,
    setActivePencilSection,
    activePresetId,
    selectPreset,
    activeShapeId,
    selectShape,
    particleCount,
    setParticleCount,
    physics,
    updatePhysics,
    healing,
    updateHealing,
    dimensionConfig,
    updateDimensionConfig,
    appearance,
    updateAppearance,
    resetCamera,
    hintsEnabled,
    setHintsEnabled,
    camera,
    updateCamera,
  } = useUniverseStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShapeCategory | 'all'>('all');

  if (!pencilOpen) return null;

  const categories: { id: ShapeCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Shapes' },
    { id: 'geometry', label: 'Geometry' },
    { id: 'parametric', label: 'Parametric' },
    { id: 'fractals', label: 'Fractals' },
    { id: 'dimensions', label: '1D–11D' },
    { id: 'cosmic', label: 'Cosmic' },
    { id: 'biological', label: 'Biological' },
    { id: 'diagrams', label: 'Diagrams' },
  ];

  const filteredShapes = SHAPES_REGISTRY.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.equation && s.equation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      id="pencil-configuration-panel"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0c0f17] border border-white/12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden text-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-wide">Universe Architect & Configuration</h2>
              <p className="text-xs text-white/50 font-mono-math">Mathematical constants, physics parameters, and manifold projections</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPencilOpen(false)}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close configuration"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-white/8 bg-black/20 overflow-x-auto select-none">
          {[
            { id: 'presets', label: 'Presets', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'shapes', label: 'Shapes', icon: <Shapes className="w-3.5 h-3.5" /> },
            { id: 'dimensions', label: '1D–11D Dimensions', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'physics', label: 'Physics & Forces', icon: <Atom className="w-3.5 h-3.5" /> },
            { id: 'healing', label: 'Self-Healing', icon: <HeartPulse className="w-3.5 h-3.5" /> },
            { id: 'appearance', label: 'Appearance', icon: <Palette className="w-3.5 h-3.5" /> },
            { id: 'about', label: 'Laws & Axioms', icon: <BookOpen className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePencilSection(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activePencilSection === tab.id
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: PRESETS */}
          {activePencilSection === 'presets' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white/90">Curated Mathematical Universes</h3>
                <p className="text-xs text-white/50">Select an authoritative pre-configured cosmological or physical simulation</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESETS_REGISTRY.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset.id)}
                    className={`p-4 rounded-2xl text-left transition-all border ${
                      activePresetId === preset.id
                        ? 'bg-violet-600/15 border-violet-500/60 shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/30'
                        : 'bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-white">{preset.name}</span>
                      <span className="text-[10px] font-mono-math px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        {preset.dimension}D
                      </span>
                    </div>
                    <div className="text-xs text-violet-300/90 font-medium mb-1.5">{preset.subtitle}</div>
                    <p className="text-xs text-white/60 line-clamp-2 mb-2.5 leading-relaxed">{preset.description}</p>
                    <div className="text-[10px] text-white/40 font-mono-math truncate bg-black/30 p-1.5 rounded-lg">
                      {preset.mathematicalBasis}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: 200+ PROCEDURAL SHAPES CATALOG */}
          {activePencilSection === 'shapes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white/90">
                    Mathematical Loci & Manifolds ({filteredShapes.length} shapes)
                  </h3>
                  <p className="text-xs text-white/50">Procedural geometry, parametric curves, strange attractors, and knots</p>
                </div>
                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search formula or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/8 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-violet-600 text-white font-medium'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Shape Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {filteredShapes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectShape(s.id)}
                    className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between ${
                      activeShapeId === s.id
                        ? 'bg-violet-600/20 border-violet-500/70 shadow-sm'
                        : 'bg-white/[0.02] border-white/8 hover:bg-white/[0.05] hover:border-white/15'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-white">{s.name}</span>
                        <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono-math">
                          {s.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 line-clamp-2 mb-2 leading-relaxed">{s.description}</p>
                    </div>
                    {s.equation && (
                      <div className="text-[10px] font-mono-math text-violet-300/80 bg-black/40 px-2 py-1 rounded-md truncate">
                        {s.equation}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: HIGHER DIMENSIONS (1D to 11D) */}
          {activePencilSection === 'dimensions' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white/90">Higher-Dimensional Projections (1D–11D)</h3>
                <p className="text-xs text-white/50">
                  Observe manifolds projected from extra spatial dimensions (M-Theory 11D, Superstring 10D, Calabi-Yau 6D, Tesseract 4D)
                </p>
              </div>

              {/* Dimension Number Selector (1 to 11) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono-math">
                  <span className="text-white/70">Target Spatial Dimension</span>
                  <span className="text-violet-400 font-bold">{dimensionConfig.currentDimension}D Space</span>
                </div>
                <div className="grid grid-cols-11 gap-1.5">
                  {Array.from({ length: 11 }, (_, i) => i + 1).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => updateDimensionConfig({ currentDimension: d })}
                      className={`py-2 rounded-xl text-xs font-mono-math font-semibold transition-all ${
                        dimensionConfig.currentDimension === d
                          ? 'bg-violet-600 text-white shadow-md ring-2 ring-violet-400/50'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {d}D
                    </button>
                  ))}
                </div>
              </div>

              {/* Projection Mapping Algorithm */}
              <div className="space-y-2">
                <label className="text-xs font-mono-math text-white/70">Projection Model</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'perspective', label: 'Hyper-Perspective' },
                    { id: 'stereographic', label: 'Stereographic (S³→ℝ²)' },
                    { id: 'calabi-yau', label: 'Calabi-Yau Slicing' },
                    { id: 'clifford-torus', label: 'Clifford Flat Torus' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => updateDimensionConfig({ projectionType: p.id as any })}
                      className={`p-2.5 rounded-xl text-xs text-center transition-all ${
                        dimensionConfig.projectionType === p.id
                          ? 'bg-violet-600/30 text-violet-300 border border-violet-500/50'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: PHYSICS & FORCES */}
          {activePencilSection === 'physics' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white/90">Dynamical Systems & Force Fields</h3>
                <p className="text-xs text-white/50">Tune universal gravitational attraction, medium viscosity, and chaotic turbulence</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-math">
                    <span className="text-white/70">Gravitational Constant</span>
                    <span className="text-violet-400">{physics.gravity.toFixed(2)} G</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2.5"
                    step="0.05"
                    value={physics.gravity}
                    onChange={(e) => updatePhysics({ gravity: parseFloat(e.target.value) })}
                    className="w-full accent-violet-500 h-1.5 bg-white/15 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-math">
                    <span className="text-white/70">Velocity Damping (Viscosity)</span>
                    <span className="text-violet-400">{physics.damping.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.90"
                    max="0.999"
                    step="0.001"
                    value={physics.damping}
                    onChange={(e) => updatePhysics({ damping: parseFloat(e.target.value) })}
                    className="w-full accent-violet-500 h-1.5 bg-white/15 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-math">
                    <span className="text-white/70">Simulation Time Scale</span>
                    <span className="text-violet-400">{physics.timeScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.0"
                    step="0.1"
                    value={physics.timeScale}
                    onChange={(e) => updatePhysics({ timeScale: parseFloat(e.target.value) })}
                    className="w-full accent-violet-500 h-1.5 bg-white/15 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-math">
                    <span className="text-white/70">Chaotic Turbulence</span>
                    <span className="text-violet-400">{physics.turbulence.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.02"
                    value={physics.turbulence}
                    onChange={(e) => updatePhysics({ turbulence: parseFloat(e.target.value) })}
                    className="w-full accent-violet-500 h-1.5 bg-white/15 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: SELF-HEALING SYSTEM (Section 8) */}
          {activePencilSection === 'healing' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white/90">Autonomous Self-Healing System</h3>
                <p className="text-xs text-white/50">
                  Section 8: Particles and structures smoothly reconstruct their mathematical rest configuration following blast disruptions
                </p>
              </div>

              {/* Master Healing Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <div>
                  <div className="font-semibold text-xs text-white">Global Self-Healing Engine</div>
                  <div className="text-[11px] text-white/50">Displaced particles organically return to geometric equilibrium</div>
                </div>
                <button
                  type="button"
                  onClick={() => updateHealing({ enabled: !healing.enabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    healing.enabled ? 'bg-violet-600' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      healing.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Healing Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-math">
                    <span className="text-white/70">Restoration Strength</span>
                    <span className="text-violet-400">{healing.strength.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.25"
                    step="0.01"
                    disabled={!healing.enabled}
                    value={healing.strength}
                    onChange={(e) => updateHealing({ strength: parseFloat(e.target.value) })}
                    className="w-full accent-violet-500 h-1.5 bg-white/15 rounded-lg cursor-pointer disabled:opacity-40"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-math">
                    <span className="text-white/70">Healing Recovery Speed</span>
                    <span className="text-violet-400">{healing.speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    disabled={!healing.enabled}
                    value={healing.speed}
                    onChange={(e) => updateHealing({ speed: parseFloat(e.target.value) })}
                    className="w-full accent-violet-500 h-1.5 bg-white/15 rounded-lg cursor-pointer disabled:opacity-40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: APPEARANCE & COLORED PARTICLES TOGGLE (Section 2.4) */}
          {activePencilSection === 'appearance' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white/90">Particle Appearance & Optics</h3>
                <p className="text-xs text-white/50">
                  Section 2.4: Colored particles are disabled by default (monochrome). Enable chromatic mode here.
                </p>
              </div>

              {/* LOCKED DIRECTIVE Section 2.4: Colored Particles Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <div>
                  <div className="font-semibold text-xs text-white">Colored Particles (Chromatic Mode)</div>
                  <div className="text-[11px] text-white/50">
                    {appearance.coloredParticles
                      ? 'ON: Chromatic palette mapped to physical variables'
                      : 'OFF (Default): Pure monochrome neutral star-dust elegance'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateAppearance({ coloredParticles: !appearance.coloredParticles })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    appearance.coloredParticles ? 'bg-violet-600' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      appearance.coloredParticles ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Color Source Options when enabled */}
              {appearance.coloredParticles && (
                <div className="space-y-2">
                  <label className="text-xs font-mono-math text-white/70">Chromatic Mapping Source</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'velocity', label: 'Velocity / Doppler Shift' },
                      { id: 'energy', label: 'Energy / Harmonic Phase' },
                      { id: 'dimension', label: 'Hyper-Dimension Band' },
                      { id: 'spectrum', label: 'Full Spectrum Rainbow' },
                      { id: 'thermal', label: 'Thermal Blackbody Heat' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => updateAppearance({ colorSource: c.id as any })}
                        className={`p-2.5 rounded-xl text-xs text-left transition-all ${
                          appearance.colorSource === c.id
                            ? 'bg-violet-600/30 text-violet-300 border border-violet-500/50'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Particle Size & Persistence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-math">
                    <span className="text-white/70">Particle Size Scale</span>
                    <span className="text-violet-400">{appearance.particleSize.toFixed(1)} px</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="3.0"
                    step="0.1"
                    value={appearance.particleSize}
                    onChange={(e) => updateAppearance({ particleSize: parseFloat(e.target.value) })}
                    className="w-full accent-violet-500 h-1.5 bg-white/15 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-math">
                    <span className="text-white/70">Temporal Trail Persistence</span>
                    <span className="text-violet-400">{Math.round(appearance.trailLength * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.85"
                    step="0.05"
                    value={appearance.trailLength}
                    onChange={(e) => updateAppearance({ trailLength: parseFloat(e.target.value) })}
                    className="w-full accent-violet-500 h-1.5 bg-white/15 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Contextual Hints & Camera Options */}
              <div className="pt-3 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/8">
                  <div>
                    <div className="font-semibold text-xs text-white">Contextual Discovery Hints</div>
                    <div className="text-[11px] text-white/50">
                      {hintsEnabled
                        ? 'ON: Subtle guidance hints appear with spaced pacing'
                        : 'OFF: Hints completely muted'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHintsEnabled(!hintsEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      hintsEnabled ? 'bg-violet-600' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        hintsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono-math">
                      <span className="text-white/70">Object Scale (Invisible Zoom)</span>
                      <span className="text-violet-400">{(camera.objectScale || 1.4).toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="4.0"
                      step="0.05"
                      value={camera.objectScale || 1.4}
                      onChange={(e) => updateCamera({ objectScale: parseFloat(e.target.value) })}
                      className="w-full accent-violet-500 h-1.5 bg-white/15 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/8">
                    <div>
                      <div className="font-semibold text-xs text-white">Autonomous 3D Spin</div>
                      <div className="text-[10px] text-white/50">Rotate structures continuously to view all sides</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateCamera({ autoSpin: !camera.autoSpin })}
                      className={`px-3 py-1 rounded-lg text-xs font-mono-math transition-colors ${
                        camera.autoSpin ? 'bg-violet-600 text-white font-semibold' : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {camera.autoSpin ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: ABOUT & MATHEMATICAL LAWS */}
          {activePencilSection === 'about' && (
            <div className="space-y-4 text-xs text-white/70 leading-relaxed font-mono-math bg-white/[0.02] p-5 rounded-2xl border border-white/8">
              <div className="text-sm font-bold text-white font-sans">Continuum Engine Specification</div>
              <p>
                A universe that calculates itself. Built with strict mathematical foundations:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-white/60">
                <li>Spatial Hash O(1) partition for proximity queries and density without O(N²) bottlenecks.</li>
                <li>Fixed-timestep numerical integration preventing frame-rate physics instability.</li>
                <li>Stereographic and hyper-perspective projections for 1D through 11D manifolds.</li>
                <li>Persistent simulation entities: particles do not vanish; they morph, disperse, and self-heal.</li>
                <li>Independent controls: Hand, Pencil, Random, and Canon operate without reciprocal disabling.</li>
              </ul>
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetCamera}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Camera Viewport</span>
                </button>
                <span className="text-white/40">Status: LOCKED CONTRACT</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
