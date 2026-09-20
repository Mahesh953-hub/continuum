/**
 * Continuum: Authoritative TypeScript Types and Contracts
 */

export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export type ThemeMode = 'system' | 'dark' | 'light';

export type CanonFiringMethod = 
  | 'single'
  | 'rapid'
  | 'burst'
  | 'beam'
  | 'wave'
  | 'spread'
  | 'radial'
  | 'orbital'
  | 'gravity'
  | 'chain';

export interface CanonSettings {
  active: boolean;
  firingMethod: CanonFiringMethod;
  power: number; // 0.1 to 5.0
  range: number; // radius or length in universe coords
  spread: number; // radians
  cooldown: number; // ms
  aimAngle: number; // radians
  lastFiredTime: number;
  beamDuration: number;
}

export interface SelfHealingConfig {
  enabled: boolean;
  particleHealing: boolean;
  shapeHealing: boolean;
  strength: number; // 0.01 to 0.2
  speed: number;    // 0.1 to 2.0
  threshold: number;// distance threshold to trigger healing
  recoveryDelay: number; // ms
}

export interface DimensionConfig {
  currentDimension: number; // 1 to 11
  projectionType: 'orthographic' | 'perspective' | 'stereographic' | 'calabi-yau' | 'clifford-torus' | 'hopf';
  rotationSpeed4D: number;
  rotationSpeed5D: number;
  phase: number;
}

export interface AppearanceConfig {
  coloredParticles: boolean; // LOCKED DEFAULT: false
  colorSource: 'monochrome' | 'velocity' | 'energy' | 'shape' | 'dimension' | 'spectrum' | 'thermal';
  monochromeLuminance: number;
  trailLength: number; // 0 to 1
  particleSize: number;
  glowIntensity: number;
}

export interface PhysicsConfig {
  gravity: number;
  damping: number; // air resistance
  timeScale: number;
  collisionSoftness: number;
  turbulence: number;
}

export type ShapeCategory = 
  | 'geometry'
  | 'parametric'
  | 'surfaces'
  | 'fractals'
  | 'dimensions'
  | 'biological'
  | 'cosmic'
  | 'diagrams';

export interface ShapeDefinition {
  id: string;
  name: string;
  category: ShapeCategory;
  equation?: string;
  description: string;
  generator: (count: number, params?: Record<string, number>) => { x: number; y: number; z?: number; w?: number }[];
  defaultParams?: Record<string, number>;
}

export interface PresetUniverse {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  mathematicalBasis: string;
  particleCount: number;
  shapeId: string;
  dimension: number;
  physics: Partial<PhysicsConfig>;
  healing: Partial<SelfHealingConfig>;
  appearance?: Partial<AppearanceConfig>;
  customInit?: (particles: ParticleInternal[], universeWidth: number, universeHeight: number) => void;
  customStep?: (particles: ParticleInternal[], dt: number, time: number) => void;
}

export interface ParticleInternal {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  // Target rest coordinates for structural healing
  targetX: number;
  targetY: number;
  targetZ?: number;
  baseTargetX: number;
  baseTargetY: number;
  baseTargetZ?: number;
  // Higher dimensional coordinates
  dimZ: number;
  dimW: number;
  dim5?: number;
  // Physical / mathematical attributes
  mass: number;
  energy: number;
  charge: number;
  size: number;
  age: number;
  alive: boolean;
  shapeIndex: number;
  // Interaction & visual state
  lastDisplacedTime: number;
  colorH?: number;
  colorS?: number;
  colorL?: number;
  alpha: number;
}

export interface HintItem {
  id: string;
  title: string;
  formula?: string;
  body: string;
  category: 'math' | 'control' | 'dimension' | 'physics' | 'canon';
  xPercent: number; // 5 to 80
  yPercent: number; // 10 to 80
  durationMs: number;
}

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  objectScale: number; // Scale applied directly to particle coordinates (invisible zooming)
  autoSpin: boolean;   // Autonomous slow rotation around mathematical axis
  spinSpeed: number;   // Rotation velocity multiplier
}

