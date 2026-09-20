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
  DimensionConfig,
  HintItem,
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

  // Active pencil section
  activePencilSection: 
    | 'presets'
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

  // Canon state
  canon: CanonSettings;

  // Camera viewport
  camera: CameraState;

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
  randomizeUniverse: (scope?: 'everything' | 'shape' | 'physics' | 'dimension' | 'motion') => void;
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

  activeHints: [],
  fps: 60,
  activeParticlesCount: 3800,

  // Action implementations
  toggleHandMode: () => set((state) => ({ handMode: !state.handMode })),
  setHandMode: (active) => set({ handMode: active }),

  togglePencil: () => set((state) => ({ pencilOpen: !state.pencilOpen })),
  setPencilOpen: (open) => set({ pencilOpen: open }),
  setActivePencilSection: (section) => set({ activePencilSection: section }),

  toggleCanonMode: () => set((state) => ({ canonMode: !state.canonMode })),
  setCanonMode: (active) => set({ canonMode: active }),
  toggleCanonMenu: () => set((state) => ({ canonMenuOpen: !state.canonMenuOpen })),
  setCanonMenuOpen: (open) => set({ canonMenuOpen: open }),

  toggleRandomMode: () => {
    const next = !get().randomActive;
    set({ randomActive: next });
    if (next) {
      get().randomizeUniverse('everything');
    }
  },

  setHintsEnabled: (enabled) => set({ hintsEnabled: enabled, activeHints: enabled ? get().activeHints : [] }),

  updateCanonSettings: (settings) =>
    set((state) => ({ canon: { ...state.canon, ...settings } })),

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  selectPreset: (presetId) => {
    const preset = PRESETS_REGISTRY.find((p) => p.id === presetId);
    if (!preset) return;
    set((state) => ({
      activePresetId: preset.id,
      activeShapeId: preset.shapeId,
      particleCount: preset.particleCount,
      dimensionConfig: {
        ...state.dimensionConfig,
        currentDimension: preset.dimension,
      },
      physics: {
        ...state.physics,
        ...preset.physics,
      },
      healing: {
        ...state.healing,
        ...preset.healing,
      },
      appearance: {
        ...state.appearance,
        ...preset.appearance,
      },
    }));
  },

  selectShape: (shapeId) => {
    const shape = SHAPES_REGISTRY.find((s) => s.id === shapeId);
    if (!shape) return;
    
    // Auto-detect dimension if it's a dimensional shape
    let detectedDim = get().dimensionConfig.currentDimension;
    if (shape.id === '1d-line') detectedDim = 1;
    else if (shape.id === '2d-plane') detectedDim = 2;
    else if (shape.id === '3d-hypersphere-shell') detectedDim = 3;
    else if (shape.id.includes('4d') || shape.id === 'clifford-torus') detectedDim = 4;
    else if (shape.id.includes('5d')) detectedDim = 5;
    else if (shape.id.includes('6d') || shape.id === 'calabi-yau-6d') detectedDim = 6;
    else if (shape.id.includes('11d')) detectedDim = 11;
    else if (shape.category === 'dimensions') {
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

  randomizeUniverse: (scope = 'everything') => {
    const shapes = SHAPES_REGISTRY;
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomDim = Math.floor(Math.random() * 11) + 1;

    set((state) => {
      const newShapeId = scope === 'everything' || scope === 'shape' ? randomShape.id : state.activeShapeId;
      const newDim = scope === 'everything' || scope === 'dimension' ? randomDim : state.dimensionConfig.currentDimension;

      let newPhysics = { ...state.physics };
      if (scope === 'everything' || scope === 'physics' || scope === 'motion') {
        newPhysics = {
          ...newPhysics,
          gravity: Number((Math.random() * 1.5).toFixed(2)),
          damping: Number((0.92 + Math.random() * 0.075).toFixed(3)),
          timeScale: Number((0.6 + Math.random() * 0.8).toFixed(2)),
          turbulence: Number((Math.random() * 0.4).toFixed(2)),
        };
      }

      return {
        activePresetId: 'procedural',
        activeShapeId: newShapeId,
        dimensionConfig: {
          ...state.dimensionConfig,
          currentDimension: newDim,
        },
        physics: newPhysics,
      };
    });
  },

  addHint: (hint) =>
    set((state) => {
      // Avoid excessive duplicates
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
