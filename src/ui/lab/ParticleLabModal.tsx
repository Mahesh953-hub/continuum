/**
 * ParticleLabModal.tsx
 * Comprehensive Particle Physics Laboratory & Object Customization Suite
 * Allows selecting all 12 fundamental particles, configuring genuine/white/default color matrices,
 * creating custom blank objects with 0 prior laws, and running authentic particle experiments.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Atom, 
  FlaskConical, 
  Zap, 
  X, 
  Sparkles, 
  Sliders, 
  Play, 
  Layers, 
  Activity,
  Maximize2
} from 'lucide-react';
import { useUniverseStore } from '../../state/useUniverseStore';
import { FUNDAMENTAL_PARTICLES } from './particleSpecies';
import { LAB_EXPERIMENTS } from './labExperiments';
import { ParticleSpecies, ParticleColorMode } from '../../types';

interface ParticleLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParticleLabModal: React.FC<ParticleLabModalProps> = ({ isOpen, onClose }) => {
  const {
    labConfig,
    setLabSpecies,
    setLabColorMode,
    setLabActiveExperiment,
    setLabCustomBlankObject,
    activeEngine,
  } = useUniverseStore();

  const [activeTab, setActiveTab] = useState<'particles' | 'blank-slate' | 'experiments'>('particles');
  const [blankDensity, setBlankDensity] = useState<number>(3000);
  const [blankGeometry, setBlankGeometry] = useState<'cloud' | 'ring' | 'sphere' | 'lattice' | 'line'>('sphere');

  if (!isOpen) return null;

  const currentSpecies = FUNDAMENTAL_PARTICLES.find((p) => p.id === labConfig.selectedSpecies) || FUNDAMENTAL_PARTICLES[0];

  const handleSelectSpecies = (speciesId: ParticleSpecies) => {
    setLabSpecies(speciesId);
    if (activeEngine) {
      activeEngine.setLabSpecies(speciesId);
    }
  };

  const handleSelectColorMode = (mode: ParticleColorMode) => {
    setLabColorMode(mode);
    if (activeEngine) {
      activeEngine.setLabColorMode(mode);
    }
  };

  const handleRunExperiment = (experimentId: string) => {
    setLabActiveExperiment(experimentId);
    const exp = LAB_EXPERIMENTS.find((e) => e.id === experimentId);
    if (exp && activeEngine) {
      activeEngine.runLabExperiment(exp, labConfig.selectedSpecies, labConfig.colorMode);
    }
  };

  const handleGenerateBlankObject = () => {
    setLabCustomBlankObject({
      name: `Custom Lab Object (${blankGeometry})`,
      particleCount: blankDensity,
      geometry: blankGeometry,
      species: labConfig.selectedSpecies,
      colorMode: labConfig.colorMode,
    });
    if (activeEngine) {
      activeEngine.createBlankObject(blankGeometry, blankDensity, labConfig.selectedSpecies, labConfig.colorMode);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        id="particle-lab-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          id="particle-lab-container"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Particle Physics Laboratory & Tweak</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Select fundamental particles, configure authentic color palettes, or run quantum collision experiments
                </p>
              </div>
            </div>

            <button
              id="close-lab-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Close Laboratory"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800 gap-2 bg-neutral-100/50 dark:bg-neutral-900/20">
            <button
              id="lab-tab-particles-btn"
              onClick={() => setActiveTab('particles')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'particles'
                  ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Atom className="w-4 h-4" />
              12 Fundamental Particles
            </button>

            <button
              id="lab-tab-blank-btn"
              onClick={() => setActiveTab('blank-slate')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'blank-slate'
                  ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Blank Object Creator
            </button>

            <button
              id="lab-tab-experiments-btn"
              onClick={() => setActiveTab('experiments')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'experiments'
                  ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              Interactive Experiments
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Color Matrix Global Setting */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Particle Color Calibration
                </div>
                <div className="text-sm text-neutral-700 dark:text-neutral-300">
                  Choose how particles express their visual identity across shapes and laboratory setups
                </div>
              </div>

              <div className="flex items-center gap-2 bg-neutral-200/60 dark:bg-neutral-800/80 p-1 rounded-xl">
                <button
                  id="color-mode-genuine-btn"
                  onClick={() => handleSelectColorMode('genuine')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    labConfig.colorMode === 'genuine'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  Genuine Particle Color
                </button>

                <button
                  id="color-mode-white-btn"
                  onClick={() => handleSelectColorMode('white')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    labConfig.colorMode === 'white'
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-neutral-300 inline-block" />
                  Custom White
                </button>

                <button
                  id="color-mode-default-btn"
                  onClick={() => handleSelectColorMode('default')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    labConfig.colorMode === 'default'
                      ? 'bg-neutral-700 text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 inline-block" />
                  Theme Adaptive
                </button>
              </div>
            </div>

            {/* Tab 1: 12 Fundamental Particles */}
            {activeTab === 'particles' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {FUNDAMENTAL_PARTICLES.map((particle) => {
                    const isSelected = labConfig.selectedSpecies === particle.id;
                    return (
                      <div
                        key={particle.id}
                        id={`particle-card-${particle.id}`}
                        onClick={() => handleSelectSpecies(particle.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/20'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3.5 h-3.5 rounded-full shadow-sm"
                              style={{ backgroundColor: particle.authenticColor }} 
                            />
                            <span className="font-semibold text-sm">{particle.name}</span>
                          </div>
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                            {particle.symbol}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-2.5">
                          {particle.description}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                          <span>Mass: {particle.massMev > 0 ? `${particle.massMev} MeV` : '0 (Massless)'}</span>
                          <span>Charge: {particle.charge > 0 ? `+${particle.charge}` : particle.charge}</span>
                          <span>Spin: {particle.spin}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Particle Detail Insight */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-violet-500" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Selected Particle Attributes
                      </span>
                    </div>
                    <span className="text-xs font-mono text-violet-600 dark:text-violet-400">
                      Standard Model Classification: {currentSpecies.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
                    {currentSpecies.description} This particle is now bound as the active laboratory test species.
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Blank Slate Object Creator */}
            {activeTab === 'blank-slate' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-300 text-xs">
                  <strong>Zero-Law Blank Object:</strong> This creates a pristine physical entity with 0 prior gravitational laws or predetermined trajectories. All particles will adopt your chosen species ({currentSpecies.name}) and custom geometry.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Base Spatial Geometry
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['sphere', 'ring', 'cloud', 'lattice', 'line'] as const).map((geom) => (
                        <button
                          key={geom}
                          onClick={() => setBlankGeometry(geom)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                            blankGeometry === geom
                              ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400'
                              : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-850'
                          }`}
                        >
                          {geom}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Particle Density: {blankDensity.toLocaleString()} particles
                    </label>
                    <input
                      type="range"
                      min={500}
                      max={8000}
                      step={250}
                      value={blankDensity}
                      onChange={(e) => setBlankDensity(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                      <span>500 (Sparse)</span>
                      <span>4,000 (Optimal)</span>
                      <span>8,000 (Dense)</span>
                    </div>
                  </div>
                </div>

                <button
                  id="generate-blank-object-btn"
                  onClick={handleGenerateBlankObject}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Instantiate Blank Object in Continuum
                </button>
              </div>
            )}

            {/* Tab 3: Interactive Experiments */}
            {activeTab === 'experiments' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {LAB_EXPERIMENTS.map((exp) => (
                    <div
                      key={exp.id}
                      id={`experiment-card-${exp.id}`}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400">
                            {exp.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{exp.name}</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                          {exp.description}
                        </p>
                        <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800/80 font-mono text-[10px] text-neutral-600 dark:text-neutral-300 mb-3">
                          {exp.equation}
                        </div>
                      </div>

                      <button
                        id={`run-exp-${exp.id}-btn`}
                        onClick={() => {
                          handleRunExperiment(exp.id);
                          onClose();
                        }}
                        className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Execute Experiment in Canvas
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-xs text-neutral-500">
            <span className="font-mono">Continuum Particle Physics Lab Engine v2.0</span>
            <button
              id="lab-footer-close-btn"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
