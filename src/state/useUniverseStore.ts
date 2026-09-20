/**
 * Continuum UI & Universe State (Zustand)
 * Maintains UI state, independent primary controls, modes, and configuration parameters.
 * High-frequency particle state is kept in engine buffers to preserve 60FPS.
 */

import { create } from 'zustand';
import {
  AppearanceConfig,
  CameraState,
  CanonSettings,
  CustomColorPalette,
  DimensionConfig,
  HintItem,
  LabConfig,
  ParticleColorMode,
  ParticleSpecies,
  PhysicsConfig,
  SelfHealingConfig,
  ThemeMode,
} from '../types';
import { PRESETS_REGISTRY } from '../presets/presetRegistry';
import { SHAPES_REGISTRY } from '../engine/shapes/shapeRegistry';

interface UniverseState {
  // Independent Primary Controls (Section 2.2)
  handMode: boolean;
  pencilOpen: boolean;
  canonMode: boolean;
  canonMenuOpen: boolean;
  infinityMode: boolean;
  infinitySliderOpen: boolean;
  infiniteTargetCount: number;
  labModalOpen: boolean;
  githubRepoUrl: string;

  // Active pencil section
  activePencilSection: 
    | 'presets'
    | 'galaxy'
    | 'shapes'
    | 'math'
    | 'physics'
    | 'dimensions'
    | 'healing'
    | 'appearance'
    | 'canon'
    | 'about';

  // Core configurations
  theme: ThemeMode;
  activePresetId: string;
  activeShapeId: string;
  particleCount: number;

  // Physics & Simulation parameters
  physics: PhysicsConfig;
  healing: SelfHealingConfig;
  dimensionConfig: DimensionConfig;
  
  // Appearance (Section 2.4: coloredParticles defaults to false!)
  appearance: AppearanceConfig;
  activePaletteId: string;

  // Canon state
  canon: CanonSettings;

  // Camera viewport
  camera: CameraState;

  // Lab & Particle Physics State
  labConfig: LabConfig;

  // Engine instance reference for high-performance direct actions
  activeEngine: any | null;

  // Random control toggle state
  randomActive: boolean;

  // Hints enabled toggle
  hintsEnabled: boolean;

  // Active hints overlay list
  activeHints: HintItem[];

  // Performance / Stats
  fps: number;
  activeParticlesCount: number;

  // Actions
  toggleHandMode: () => void;
  setHandMode: (active: boolean) => void;
  togglePencil: () => void;
  setPencilOpen: (open: boolean) => void;
  setActivePencilSection: (section: UniverseState['activePencilSection']) => void;
  toggleCanonMode: () => void;
  setCanonMode: (active: boolean) => void;
  toggleCanonMenu: () => void;
  setCanonMenuOpen: (open: boolean) => void;
  toggleInfinityMode: () => void;
  setInfinityMode: (enabled: boolean) => void;
  setInfinitySliderOpen: (open: boolean) => void;
  setInfiniteTargetCount: (count: number) => void;
  setGithubRepoUrl: (url: string) => void;
  setLabModalOpen: (open: boolean) => void;
  setLabSpecies: (species: ParticleSpecies) => void;
  setLabColorMode: (mode: ParticleColorMode) => void;
  setLabActiveExperiment: (expId: string | null) => void;
  setLabCustomBlankObject: (blank: any) => void;
  setPaletteId: (paletteId: string) => void;
  setActiveEngine: (engine: any) => void;
  updateCanonSettings: (settings: Partial<CanonSettings>) => void;
  setTheme: (theme: ThemeMode) => void;
  selectPreset: (presetId: string) => void;
  selectShape: (shapeId: string) => void;
  setParticleCount: (count: number) => void;
  updatePhysics: (physics: Partial<PhysicsConfig>) => void;
  updateHealing: (healing: Partial<SelfHealingConfig>) => void;
  updateDimensionConfig: (config: Partial<DimensionConfig>) => void;
  updateAppearance: (appearance: Partial<AppearanceConfig>) => void;
  updateCamera: (camera: Partial<CameraState>) => void;
  resetCamera: () => void;
  toggleRandomMode: () => void;
  setHintsEnabled: (enabled: boolean) => void;
  randomizeUniverse: () => void;
  addHint: (hint: HintItem) => void;
  removeHint: (id: string) => void;
  setPerformanceMetrics: (fps: number, count: number) => void;
}

export const useUniverseStore = create<UniverseState>((set, get) => ({
  // Independent primary controls
  handMode: false,
  pencilOpen: false,
  canonMode: false,
  canonMenuOpen: false,
  infinityMode: false,
  infinitySliderOpen: false,
  infiniteTargetCount: 50000,
  labModalOpen: false,
  githubRepoUrl: 'https://github.com/mahesh953-hub/continuum.git',
  randomActive: false,
  hintsEnabled: true,

  activePencilSection: 'presets',

  theme: 'dark',
  activePresetId: 'solar-system',
  activeShapeId: 'solar-system-orbits',
  particleCount: 3800,

  physics: {
    gravity: 0.5,
    damping: 0.985,
    timeScale: 1.0,
    collisionSoftness: 0.5,
    turbulence: 0.05,
  },

  healing: {
    enabled: true,
    particleHealing: true,
    shapeHealing: true,
    strength: 0.08,
    speed: 1.0,
    threshold: 4,
    recoveryDelay: 100,
  },

  dimensionConfig: {
    currentDimension: 3,
    projectionType: 'perspective',
    rotationSpeed4D: 0.35,
    rotationSpeed5D: 0.25,
    phase: 0,
  },

  // LOCKED DIRECTIVE Section 2.4: Colored particles default to OFF (monochrome)
  appearance: {
    coloredParticles: false,
    colorSource: 'monochrome',
    monochromeLuminance: 0.92,
    trailLength: 0.25,
    particleSize: 1.5,
    glowIntensity: 0.6,
  },
  activePaletteId: 'deep-field',

  canon: {
    active: false,
    firingMethod: 'burst',
    power: 1.8,
    range: 160,
    spread: Math.PI / 6,
    cooldown: 180,
    aimAngle: 0,
    lastFiredTime: 0,
    beamDuration: 160,
  },

  camera: {
    x: 0,
    y: 0,
    zoom: 1.0,
    objectScale: 1.4,
    autoSpin: true,
    spinSpeed: 1.0,
  },

  labConfig: {
    selectedSpecies: 'electron',
    colorMode: 'genuine',
    activeExperiment: 'none',
  },

  activeEngine: null,

  fps: 60,
  activeParticlesCount: 3800,
  activeHints: [],

  toggleHandMode: () => set((state) => ({ handMode: !state.handMode })),
  setHandMode: (active) => set({ handMode: active }),

  togglePencil: () => set((state) => ({ pencilOpen: !state.pencilOpen })),
  setPencilOpen: (open) => set({ pencilOpen: open }),

  setActivePencilSection: (section) => set({ activePencilSection: section }),

  toggleCanonMode: () =>
    set((state) => ({
      canonMode: !state.canonMode,
      canon: { ...state.canon, active: !state.canonMode },
    })),
  setCanonMode: (active) =>
    set((state) => ({ canonMode: active, canon: { ...state.canon, active } })),

  toggleCanonMenu: () =>
    set((state) => ({ canonMenuOpen: !state.canonMenuOpen })),
  setCanonMenuOpen: (open) => set({ canonMenuOpen: open }),

  toggleInfinityMode: () => {
    const next = !get().infinityMode;
    set({ infinityMode: next, infinitySliderOpen: next });
    const engine = get().activeEngine;
    if (engine) {
      engine.setInfinityMode(next);
      if (next) {
        engine.setInfiniteTargetCount(get().infiniteTargetCount);
      }
    }
  },
  setInfinityMode: (enabled) => {
    set({ infinityMode: enabled, infinitySliderOpen: enabled ? get().infinitySliderOpen : false });
    const engine = get().activeEngine;
    if (engine) {
      engine.setInfinityMode(enabled);
      if (enabled) {
        engine.setInfiniteTargetCount(get().infiniteTargetCount);
      }
    }
  },
  setInfinitySliderOpen: (open) => set({ infinitySliderOpen: open }),
  setInfiniteTargetCount: (count) => {
    const clamped = Math.max(10000, Math.min(100000000, count));
    set({ infiniteTargetCount: clamped, activeParticlesCount: clamped });
    const engine = get().activeEngine;
    if (engine) {
      engine.setInfiniteTargetCount(clamped);
    }
  },
  setGithubRepoUrl: (url) => set({ githubRepoUrl: url }),

  setLabModalOpen: (open) => set({ labModalOpen: open }),
  setLabSpecies: (species) =>
    set((state) => ({
      labConfig: { ...state.labConfig, selectedSpecies: species },
    })),
  setLabColorMode: (mode) =>
    set((state) => ({
      labConfig: { ...state.labConfig, colorMode: mode },
    })),
  setLabActiveExperiment: (expId) =>
    set((state) => ({
      labConfig: { ...state.labConfig, activeExperiment: expId },
    })),
  setLabCustomBlankObject: (blank) =>
    set((state) => ({
      labConfig: { ...state.labConfig, customBlankObject: blank },
    })),

  setPaletteId: (paletteId) => {
    set((state) => ({
      activePaletteId: paletteId,
      appearance: {
        ...state.appearance,
        coloredParticles: true,
        colorSource: 'palette',
      },
    }));
    const engine = get().activeEngine;
    if (engine) {
      engine.setPaletteId(paletteId);
    }
  },

  setActiveEngine: (engine) => set({ activeEngine: engine }),

  updateCanonSettings: (settings) =>
    set((state) => ({ canon: { ...state.canon, ...settings } })),

  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    const engine = get().activeEngine;
    if (engine) {
      engine.setTheme(theme);
    }
  },

  toggleRandomMode: () => set((state) => ({ randomActive: !state.randomActive })),
  setHintsEnabled: (enabled) => set({ hintsEnabled: enabled }),

  selectPreset: (presetId) => {
    const preset = PRESETS_REGISTRY.find((p) => p.id === presetId);
    if (!preset) return;

    set((state) => ({
      activePresetId: presetId,
      activeShapeId: preset.shapeId,
      physics: { ...state.physics, ...preset.physics },
      healing: { ...state.healing, ...preset.healing },
      dimensionConfig: {
        ...state.dimensionConfig,
        currentDimension: preset.dimension,
      },
      appearance: preset.appearance
        ? { ...state.appearance, ...preset.appearance }
        : state.appearance,
      particleCount: preset.particleCount,
    }));
  },

  selectShape: (shapeId) => {
    const shape = SHAPES_REGISTRY.find((s) => s.id === shapeId);
    let detectedDim = 3;
    if (shape) {
      if (shape.dimension) detectedDim = shape.dimension;
      const match = shape.id.match(/(\d+)d/);
      if (match) detectedDim = parseInt(match[1], 10);
    }

    set((state) => ({
      activeShapeId: shapeId,
      activePresetId: 'custom',
      dimensionConfig: {
        ...state.dimensionConfig,
        currentDimension: detectedDim,
      },
    }));
  },

  setParticleCount: (count) => set({ particleCount: count }),

  updatePhysics: (physics) =>
    set((state) => ({ physics: { ...state.physics, ...physics } })),

  updateHealing: (healing) =>
    set((state) => ({ healing: { ...state.healing, ...healing } })),

  updateDimensionConfig: (config) =>
    set((state) => ({ dimensionConfig: { ...state.dimensionConfig, ...config } })),

  updateAppearance: (appearance) =>
    set((state) => ({ appearance: { ...state.appearance, ...appearance } })),

  updateCamera: (camera) =>
    set((state) => ({ camera: { ...state.camera, ...camera } })),

  resetCamera: () =>
    set({
      camera: {
        x: 0,
        y: 0,
        zoom: 1.0,
        objectScale: 1.4,
        autoSpin: true,
        spinSpeed: 1.0,
      },
    }),

  /**
   * Random Mode: Purely randomizes the selection of objects from SHAPES_REGISTRY (1000+ catalog),
   * NEVER modifying, degrading, or scrambling user behavior, physics, or appearance.
   */
  randomizeUniverse: () => {
    const shapes = SHAPES_REGISTRY;
    if (!shapes || shapes.length === 0) return;
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    let detectedDim = randomShape.dimension || 3;

    set((state) => ({
      activePresetId: 'procedural',
      activeShapeId: randomShape.id,
      dimensionConfig: {
        ...state.dimensionConfig,
        currentDimension: detectedDim,
      },
    }));
  },

  addHint: (hint) =>
    set((state) => {
      if (state.activeHints.some((h) => h.id === hint.id)) return state;
      return { activeHints: [...state.activeHints.slice(-3), hint] };
    }),

  removeHint: (id) =>
    set((state) => ({
      activeHints: state.activeHints.filter((h) => h.id !== id),
    })),

  setPerformanceMetrics: (fps, count) =>
    set({ fps, activeParticlesCount: count }),
}));

