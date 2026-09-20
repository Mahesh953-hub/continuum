/**
 * Continuum Universe Simulation Engine
 * Governs high-frequency particle simulation, forces, self-healing, dimensions,
 * canon firing, spatial lookups, and canvas rendering.
 */

import {
  AppearanceConfig,
  CameraState,
  CanonSettings,
  DimensionConfig,
  ParticleColorMode,
  ParticleInternal,
  ParticleSpecies,
  PhysicsConfig,
  SelfHealingConfig,
  ThemeMode,
} from '../../types';
import { getShapeById } from '../shapes/shapeRegistry';
import { getPresetById } from '../../presets/presetRegistry';
import { projectNDto2D } from '../../math/projections';
import { SpatialHash } from '../../math/spatialHash';
import { CUSTOM_PALETTES, getPaletteById } from '../../ui/pencil/customPalettes';
import { getParticleMetadata } from '../../ui/lab/particleSpecies';

export interface VisualFxProjectile {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  type: string;
  power: number;
  range: number;
  age: number;
  maxAge: number;
  alive: boolean;
  suppressParticleEffect: boolean;
}

export class UniverseEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: ParticleInternal[] = [];
  private spatialHash: SpatialHash;
  private projectiles: VisualFxProjectile[] = [];

  // Simulation Clock
  private animationFrameId: number | null = null;
  private lastTimestamp: number = 0;
  private simTime: number = 0;
  private fpsCounter: number = 60;
  private frameCount: number = 0;
  private lastFpsUpdate: number = 0;

  // Active configurations
  public activePresetId: string = 'solar-system';
  public activeShapeId: string = 'solar-system-orbits';
  public handMode: boolean = false;
  public infinityMode: boolean = false;
  public infiniteTargetCount: number = 50000;
  public theme: ThemeMode = 'dark';
  public activePaletteId: string = 'deep-field';
  public labSpecies: ParticleSpecies = 'electron';
  public labColorMode: ParticleColorMode = 'genuine';
  public activeExperiment: any = null;
  public aimCrosshair: { x: number; y: number; visible: boolean } = { x: 0, y: 0, visible: false };

  public physics: PhysicsConfig;
  public healing: SelfHealingConfig;
  public dimensionConfig: DimensionConfig;
  public appearance: AppearanceConfig;
  public canon: CanonSettings;
  public camera: CameraState;
  private autoSpinAngle: number = 0;

  // Callback to sync FPS and particle count to UI store
  public onMetricsUpdate?: (fps: number, count: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Canvas 2D rendering context not supported');
    }
    this.ctx = context;
    this.spatialHash = new SpatialHash(60);

    // Initial defaults
    this.physics = {
      gravity: 0.5,
      damping: 0.985,
      timeScale: 1.0,
      collisionSoftness: 0.5,
      turbulence: 0.05,
    };

    this.healing = {
      enabled: true,
      particleHealing: true,
      shapeHealing: true,
      strength: 0.08,
      speed: 1.0,
      threshold: 4,
      recoveryDelay: 100,
    };

    this.dimensionConfig = {
      currentDimension: 3,
      projectionType: 'perspective',
      rotationSpeed4D: 0.35,
      rotationSpeed5D: 0.25,
      phase: 0,
    };

    // LOCKED DIRECTIVE: Default coloredParticles is FALSE
    this.appearance = {
      coloredParticles: false,
      colorSource: 'monochrome',
      monochromeLuminance: 0.95,
      trailLength: 0.25,
      particleSize: 1.5,
      glowIntensity: 0.6,
    };

    this.canon = {
      active: false,
      firingMethod: 'burst',
      power: 1.8,
      range: 160,
      spread: Math.PI / 6,
      cooldown: 180,
      aimAngle: 0,
      lastFiredTime: 0,
      beamDuration: 160,
    };

    this.camera = {
      x: 0,
      y: 0,
      zoom: 1.0,
      objectScale: 1.4,
      autoSpin: true,
      spinSpeed: 1.0,
    };

    this.initParticles(3800);
  }

  public resize(width: number, height: number) {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /**
   * Sets the color theme and immediately clears canvas to prevent ghost trails
   */
  public setTheme(theme: ThemeMode) {
    this.theme = theme;
    if (this.ctx && this.canvas) {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && typeof window !== 'undefined'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
          : true);
      this.ctx.save();
      this.ctx.fillStyle = isDark ? '#050608' : '#f8fafc';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
    }
  }

  /**
   * Initializes or re-allocates particle entities with coordinated appearance
   */
  public initParticles(targetCount: number) {
    let count: number;
    if (this.infinityMode) {
      // Genuine particle continuum scaling:
      // Real-time physical kinetic simulation core budget scaled for max fidelity and smooth 60fps
      if (this.infiniteTargetCount <= 15000) {
        count = this.infiniteTargetCount;
      } else if (this.infiniteTargetCount <= 100000) {
        count = 12000;
      } else if (this.infiniteTargetCount <= 1000000) {
        count = 15000;
      } else {
        count = 18000;
      }
      // Micro-cluster fine size scaling so millions of particles look finely resolved
      const logVal = Math.log10(this.infiniteTargetCount); // 4.0 (10k) to 8.0 (100M)
      const norm = (logVal - 4.0) / 4.0; // 0 to 1
      this.appearance.particleSize = Math.max(0.45, 1.4 - norm * 0.9);
    } else {
      count = Math.max(200, Math.min(14000, targetCount));
      this.appearance.particleSize = 1.5;
    }

    this.particles = new Array(count);

    const shape = getShapeById(this.activeShapeId);
    const targetPoints = shape.generator(count);

    // Particles allocated to cosmic ambient depth
    const ambientRatio = this.infinityMode ? 0.28 : 0.15;
    const ambientCount = Math.floor(count * ambientRatio);
    const structuralCount = count - ambientCount;
    const maxAmbientRad = this.infinityMode ? 6000 : 2500;

    for (let i = 0; i < count; i++) {
      let pt: { x: number; y: number; z?: number; w?: number };

      if (i < structuralCount) {
        pt = targetPoints[i % targetPoints.length] || { x: 0, y: 0 };
      } else {
        // Expansive cosmic ambient particles radiating outward infinitely
        const angle = (i * 2.39996) % (Math.PI * 2);
        const rad = 350 + (i % 300) * 14 + Math.random() * (maxAmbientRad - 350);
        pt = {
          x: Math.cos(angle) * rad,
          y: Math.sin(angle) * rad,
          z: (Math.random() - 0.5) * 500,
          w: (Math.random() - 0.5) * 400,
        };
      }

      // Coordinated initial reveal
      const disperseAngle = Math.random() * Math.PI * 2;
      const disperseDist = Math.random() * 90;

      const baseTargetX = pt.x || 0;
      const baseTargetY = pt.y || 0;
      const baseTargetZ = pt.z ?? Math.sin(i * 0.35) * 60;

      this.particles[i] = {
        id: i,
        x: baseTargetX + Math.cos(disperseAngle) * disperseDist,
        y: baseTargetY + Math.sin(disperseAngle) * disperseDist,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        ax: 0,
        ay: 0,
        baseTargetX,
        baseTargetY,
        baseTargetZ,
        targetX: baseTargetX,
        targetY: baseTargetY,
        targetZ: baseTargetZ,
        dimZ: baseTargetZ,
        dimW: pt.w ?? (Math.random() - 0.5) * 200,
        mass: 1.0 + (i % 5) * 0.2,
        energy: 1.0,
        charge: (i % 2 === 0 ? 1 : -1) * 0.5,
        size: this.infinityMode ? (1.3 + Math.random() * 1.0) : (1.1 + Math.random() * 0.8),
        age: 0,
        alive: true,
        shapeIndex: i,
        lastDisplacedTime: 0,
        alpha: 0.85,
      };
    }
  }

  public updateAimCrosshair(x: number, y: number, visible: boolean) {
    this.aimCrosshair = { x, y, visible };
  }

  public setInfinityMode(enabled: boolean) {
    this.infinityMode = enabled;
    if (enabled) {
      this.initParticles(this.infiniteTargetCount);
    } else {
      this.initParticles(3800);
      this.appearance.particleSize = 1.5;
    }
  }

  public setInfiniteTargetCount(count: number) {
    this.infiniteTargetCount = Math.max(10000, Math.min(100000000, count));
    if (this.infinityMode) {
      this.initParticles(this.infiniteTargetCount);
    }
  }

  public setPaletteId(paletteId: string) {
    this.activePaletteId = paletteId;
    this.appearance.coloredParticles = true;
    this.appearance.colorSource = 'palette';
  }

  public setLabSpecies(species: ParticleSpecies) {
    this.labSpecies = species;
    const meta = getParticleMetadata(species);
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.species = species;
      p.mass = meta.massMev > 0 ? meta.massMev / 1000 : 0.5;
      p.charge = meta.charge;
      if (this.labColorMode === 'genuine') {
        p.colorOverride = meta.authenticColor;
      }
    }
  }

  public setLabColorMode(mode: ParticleColorMode) {
    this.labColorMode = mode;
    const meta = getParticleMetadata(this.labSpecies);
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (mode === 'genuine') {
        p.colorOverride = meta.authenticColor;
      } else if (mode === 'white') {
        p.colorOverride = '#ffffff';
      } else {
        p.colorOverride = undefined;
      }
    }
  }

  public runLabExperiment(experiment: any, species: ParticleSpecies, colorMode: ParticleColorMode) {
    this.activeExperiment = experiment;
    this.activePresetId = 'custom';
    experiment.setup(this.particles, species, colorMode);
  }

  public createBlankObject(
    geom: 'cloud' | 'ring' | 'sphere' | 'lattice' | 'line',
    count: number,
    species: ParticleSpecies,
    colorMode: ParticleColorMode
  ) {
    this.activeExperiment = null;
    this.activeShapeId = `custom-blank-${geom}`;
    this.initParticles(count);
    const meta = getParticleMetadata(species);
    const R = 220;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.species = species;
      p.mass = meta.massMev > 0 ? meta.massMev / 1000 : 0.5;
      p.charge = meta.charge;
      if (colorMode === 'genuine') p.colorOverride = meta.authenticColor;
      else if (colorMode === 'white') p.colorOverride = '#ffffff';
      else p.colorOverride = undefined;

      let x = 0;
      let y = 0;
      let z = 0;
      if (geom === 'ring') {
        const theta = (i / count) * Math.PI * 2;
        x = R * Math.cos(theta);
        y = R * Math.sin(theta);
      } else if (geom === 'sphere') {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        x = R * Math.sin(phi) * Math.cos(theta);
        y = R * Math.sin(phi) * Math.sin(theta);
        z = R * Math.cos(phi);
      } else if (geom === 'lattice') {
        const side = Math.floor(Math.cbrt(count)) || 10;
        const ix = i % side;
        const iy = Math.floor((i / side) % side);
        const iz = Math.floor(i / (side * side));
        const step = (R * 1.8) / side;
        x = (ix - side / 2) * step;
        y = (iy - side / 2) * step;
        z = (iz - side / 2) * step;
      } else if (geom === 'line') {
        x = ((i / count) - 0.5) * (R * 3);
        y = 0;
      } else {
        // cloud
        const r = Math.random() * R;
        const theta = Math.random() * Math.PI * 2;
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
      }
      p.baseTargetX = x;
      p.baseTargetY = y;
      p.baseTargetZ = z;
      p.targetX = x;
      p.targetY = y;
      p.targetZ = z;
      p.x = x + (Math.random() - 0.5) * 10;
      p.y = y + (Math.random() - 0.5) * 10;
      p.vx = 0;
      p.vy = 0;
    }
  }

  /**
   * Smoothly transitions existing particles to a new shape target
   */
  public transitionToShape(shapeId: string) {
    this.activeShapeId = shapeId;
    const shape = getShapeById(shapeId);
    const count = this.particles.length;
    const targetPoints = shape.generator(count);

    const ambientCount = Math.floor(count * 0.15);
    const structuralCount = count - ambientCount;

    for (let i = 0; i < count; i++) {
      let pt: { x: number; y: number; z?: number; w?: number };

      if (i < structuralCount) {
        pt = targetPoints[i % targetPoints.length] || { x: 0, y: 0 };
      } else {
        const angle = (i * 2.39996) % (Math.PI * 2);
        const rad = 360 + (i % 200) * 8 + Math.random() * 90;
        pt = {
          x: Math.cos(angle) * rad,
          y: Math.sin(angle) * rad,
          z: (Math.random() - 0.5) * 300,
          w: (Math.random() - 0.5) * 200,
        };
      }

      const p = this.particles[i];
      if (p) {
        p.baseTargetX = pt.x || 0;
        p.baseTargetY = pt.y || 0;
        p.baseTargetZ = pt.z ?? Math.sin(i * 0.35) * 60;
        p.targetX = p.baseTargetX;
        p.targetY = p.baseTargetY;
        p.targetZ = p.baseTargetZ;
        if (pt.z !== undefined) p.dimZ = pt.z;
        if (pt.w !== undefined) p.dimW = pt.w;
        p.lastDisplacedTime = this.simTime;
      }
    }
  }

  /**
   * Applies blast impulse at universe coordinates
   * Satisfies Section 11.2 & 11.3:
   * "Direct particle touch and swipe effects are disabled in Hand mode."
   */
  public applyBlast(
    universeX: number,
    universeY: number,
    radius: number = 140,
    power: number = 3.5
  ) {
    // If Hand mode is active, particle touch and swipe effects are STRICTLY DISABLED
    if (this.handMode) {
      return;
    }

    const affected = this.spatialHash.queryRadius(
      universeX,
      universeY,
      radius,
      this.particles
    );

    const rSq = radius * radius;
    for (let i = 0; i < affected.length; i++) {
      const p = affected[i];
      const dx = p.x - universeX;
      const dy = p.y - universeY;
      const dSq = dx * dx + dy * dy || 1;

      if (dSq < rSq) {
        const dist = Math.sqrt(dSq);
        const normX = dx / dist;
        const normY = dy / dist;
        const falloff = 1 - dist / radius;
        const force = power * falloff * (32 / p.mass);

        p.vx += normX * force;
        p.vy += normY * force;
        p.lastDisplacedTime = this.simTime;
      }
    }
  }

  /**
   * Fires the Canon
   * Satisfies Section 11.3 & 12.5:
   * "Canon firing is allowed in Hand mode, but particle effects are suppressed."
   */
  public fireCanon(targetUniverseX: number, targetUniverseY: number) {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const zoom = this.camera.zoom;
    // Tactical Canon turret battery located at bottom center of viewport
    const originX = this.camera.x;
    const originY = this.camera.y + (height / 2) / zoom - 28 / zoom;

    const dx = targetUniverseX - originX;
    const dy = targetUniverseY - originY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const dirX = dx / dist;
    const dirY = dy / dist;

    const method = this.canon.firingMethod;
    const power = this.canon.power;
    const range = this.canon.range;
    const suppressParticles = this.handMode; // LOCKED RULE: Suppress particle effects in Hand mode

    if (method === 'beam') {
      // Piercing infinite laser beam traversing across entire cosmic space (4500px)
      const beamLength = 4500;
      const endX = originX + dirX * beamLength;
      const endY = originY + dirY * beamLength;

      this.projectiles.push({
        startX: originX,
        startY: originY,
        targetX: endX,
        targetY: endY,
        currentX: originX,
        currentY: originY,
        vx: dirX * 35,
        vy: dirY * 35,
        type: 'beam',
        power,
        range: beamLength,
        age: 0,
        maxAge: 22,
        alive: true,
        suppressParticleEffect: suppressParticles,
      });

      // Ionization impulse along infinite laser line
      if (!suppressParticles) {
        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          const px = p.x - originX;
          const py = p.y - originY;
          const projDist = px * dirX + py * dirY;
          if (projDist > 0 && projDist < beamLength) {
            const perpX = px - projDist * dirX;
            const perpY = py - projDist * dirY;
            const perpDist = Math.sqrt(perpX * perpX + perpY * perpY);
            if (perpDist < 55) {
              const push = (1 - perpDist / 55) * power * 4.2;
              const normX = perpDist > 0.1 ? perpX / perpDist : 0;
              const normY = perpDist > 0.1 ? perpY / perpDist : 1;
              p.vx += normX * push;
              p.vy += normY * push;
              p.lastDisplacedTime = this.simTime;
            }
          }
        }
      }
      return;
    }

    // Spawn visual projectile fx for projectile modes
    const count = method === 'burst' ? 5 : method === 'spread' ? 7 : method === 'rapid' ? 3 : 1;
    const baseAngle = Math.atan2(dirY, dirX);

    for (let i = 0; i < count; i++) {
      let angle = baseAngle;
      if (count > 1) {
        const spread = this.canon.spread;
        angle += (i / (count - 1) - 0.5) * spread;
      }

      const pVx = Math.cos(angle) * 18;
      const pVy = Math.sin(angle) * 18;

      this.projectiles.push({
        startX: originX,
        startY: originY,
        targetX: targetUniverseX,
        targetY: targetUniverseY,
        currentX: originX,
        currentY: originY,
        vx: pVx,
        vy: pVy,
        type: method,
        power,
        range,
        age: 0,
        maxAge: 45,
        alive: true,
        suppressParticleEffect: suppressParticles,
      });
    }

    // If Hand mode is OFF, propagate impulse through particles
    if (!suppressParticles) {
      if (method === 'radial') {
        this.applyBlast(targetUniverseX, targetUniverseY, range * 1.5, power * 2.2);
      } else if (method === 'wave') {
        this.applyBlast(targetUniverseX, targetUniverseY, range * 2.0, power * 1.8);
      } else {
        this.applyBlast(targetUniverseX, targetUniverseY, range, power * 2.5);
      }
    }
  }

  /**
   * Main simulation step (60 FPS fixed physics integration)
   */
  public step(dt: number) {
    this.simTime += dt;
    const preset = getPresetById(this.activePresetId);
    const shape = getShapeById(this.activeShapeId);
    const behavior = shape?.behaviorType || 'standard';

    // Continuous smooth 3D auto-spin so every side can be inspected automatically
    if (this.camera.autoSpin !== false) {
      this.autoSpinAngle += dt * 0.38 * (this.camera.spinSpeed ?? 1.0);
    }

    // Rebuild spatial partition grid
    this.spatialHash.clear();
    const count = this.particles.length;

    const dim = this.dimensionConfig.currentDimension;
    const isHigherDim = dim > 2;

    // Healing parameters
    const healingEnabled = this.healing.enabled;
    const healStrength = this.healing.strength;
    const healSpeed = this.healing.speed;
    const damping = this.physics.damping;
    const turbulence = this.physics.turbulence;
    const timeScale = this.physics.timeScale;
    const gravity = this.physics.gravity;

    // Object scale (invisible particle magnification without camera displacement)
    const objScale = this.camera.objectScale || 1.4;
    const cosS = Math.cos(this.autoSpinAngle);
    const sinS = Math.sin(this.autoSpinAngle);
    const tilt = 0.22;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    // Run active custom experiment step if configured in Lab
    if (this.activeExperiment && this.activeExperiment.step) {
      this.activeExperiment.step(this.particles, dt * timeScale, this.simTime);
    } else if (preset.customStep) {
      preset.customStep(this.particles, dt * timeScale, this.simTime);
    }

    for (let i = 0; i < count; i++) {
      const p = this.particles[i];

      // Calculate 3D rotated & scaled targets
      const bx = p.baseTargetX * objScale;
      const by = p.baseTargetY * objScale;
      const bz = (p.baseTargetZ || 0) * objScale;

      const rx = bx * cosS - bz * sinS;
      const rz = bx * sinS + bz * cosS;
      const ry = by * cosT - rz * sinT;
      const finalZ = by * sinT + rz * cosT;

      // Higher-dimensional projection rotation for 3D to 11D
      if (isHigherDim && p.dimW !== undefined) {
        const coords = [rx, ry, finalZ, p.dimW];
        const proj = projectNDto2D(coords, {
          dimension: dim,
          time: this.simTime,
          type: this.dimensionConfig.projectionType,
        });
        p.targetX = proj.x;
        p.targetY = proj.y;
      } else {
        const focal = 1100;
        const depthFactor = focal / (focal + finalZ);
        p.targetX = rx * depthFactor;
        p.targetY = ry * depthFactor;
      }

      // Authentic physics governed by object behavior type
      if (behavior === 'blackhole') {
        // Einstein General Relativity: Schwarzschild & Kerr frame dragging
        const rSq = p.x * p.x + p.y * p.y;
        const r = Math.sqrt(rSq) + 0.1;
        const rs = 34; // Event horizon radius

        if (r > rs) {
          // Relativistic radial acceleration toward singularity
          const F = Math.min(22000 / (rSq + 200), 24.0);
          p.vx -= (p.x / r) * F * dt;
          p.vy -= (p.y / r) * F * dt;

          // Kerr frame-dragging azimuthal swirl (accretion disk)
          const drag = (320 / Math.sqrt(r)) * dt;
          p.vx += (-p.y / r) * drag;
          p.vy += (p.x / r) * drag;
        } else {
          // Inside event horizon: eject relativistic polar jets or replenish
          if (i % 14 === 0) {
            p.vx = (Math.random() - 0.5) * 1.5;
            p.vy = (i % 2 === 0 ? -1 : 1) * (18 + Math.random() * 8);
          } else {
            p.vx *= 0.85;
            p.vy *= 0.85;
            // Replenish from outer accretion field
            p.x = Math.cos(i * 1.3) * (rs + 120 + Math.random() * 80);
            p.y = Math.sin(i * 1.3) * (rs + 120 + Math.random() * 80);
          }
        }
      } else if (behavior === 'galaxy') {
        // Dark Matter halo flat rotation curve v_c = const
        const r = Math.hypot(p.x, p.y) + 0.1;
        const vFlat = 4.8;
        const vCirc = vFlat * (r / Math.sqrt(r * r + 250));
        // Tangential orbital velocity
        p.vx += (-p.y / r) * vCirc * dt * 4.5;
        p.vy += (p.x / r) * vCirc * dt * 4.5;

        // Spiral arm cohesion restoration
        const armDx = p.targetX - p.x;
        const armDy = p.targetY - p.y;
        p.vx += armDx * 0.05 * healSpeed;
        p.vy += armDy * 0.05 * healSpeed;
      } else if (behavior === 'quantum') {
        // Heisenberg Uncertainty Principle jitter & probability breathing
        p.vx += (Math.random() - 0.5) * 0.5;
        p.vy += (Math.random() - 0.5) * 0.5;
        const qdx = p.targetX - p.x;
        const qdy = p.targetY - p.y;
        p.vx += qdx * 0.06 * healSpeed;
        p.vy += qdy * 0.06 * healSpeed;
      } else if (behavior === 'dimension') {
        // Dimensional manifold projection tracking without planar gravity
        const ddx = p.targetX - p.x;
        const ddy = p.targetY - p.y;
        p.vx += ddx * 0.08 * healSpeed;
        p.vy += ddy * 0.08 * healSpeed;
      } else {
        // Standard shape spring healing and gravity
        if (healingEnabled && p.alive) {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > this.healing.threshold) {
            const pull = Math.min(dist * healStrength, 14.0) * healSpeed;
            p.vx += (dx / dist) * pull;
            p.vy += (dy / dist) * pull;
          }
        }
        if (gravity !== 0 && !isHigherDim) {
          p.vy += gravity * 0.05 * timeScale;
        }
      }

      // Physics damping & turbulence
      p.vx *= damping;
      p.vy *= damping;

      if (turbulence > 0) {
        p.vx += (Math.random() - 0.5) * turbulence;
        p.vy += (Math.random() - 0.5) * turbulence;
      }

      // Position integration
      p.x += p.vx * timeScale;
      p.y += p.vy * timeScale;
      p.age += dt;

      // Boundless infinite universe coordinate wrap
      const bound = this.infinityMode ? 6000 : 3500;
      if (p.x > bound) p.x = -bound;
      else if (p.x < -bound) p.x = bound;
      if (p.y > bound) p.y = -bound;
      else if (p.y < -bound) p.y = bound;

      // Insert into spatial hash
      this.spatialHash.insert(p.id, p.x, p.y);
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.currentX += proj.vx;
      proj.currentY += proj.vy;
      proj.age++;

      // If hit target or timed out
      if (proj.age >= proj.maxAge) {
        proj.alive = false;
        // Explode on impact if particle effect is not suppressed
        if (!proj.suppressParticleEffect) {
          this.applyBlast(proj.currentX, proj.currentY, proj.range * 0.8, proj.power * 1.5);
        }
        this.projectiles.splice(i, 1);
      }
    }
  }

  /**
   * Rendering loop with mathematical coordinate grid, particles, and Canon effects
   */
  public render() {
    const { ctx, canvas } = this;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Screen center & camera transform
    const centerX = width / 2;
    const centerY = height / 2;
    const zoom = this.camera.zoom;
    const camX = this.camera.x;
    const camY = this.camera.y;

    // Trail persistence clear
    const trail = Math.max(0.1, 1 - this.appearance.trailLength);
    const isDark = this.theme === 'dark' || document.documentElement.getAttribute('data-theme') !== 'light';
    
    ctx.save();
    ctx.fillStyle = isDark
      ? `rgba(5, 6, 8, ${trail})`
      : `rgba(248, 250, 252, ${trail})`;
    ctx.fillRect(0, 0, width, height);

    // Apply Camera translation and zoom
    ctx.translate(centerX, centerY);
    ctx.scale(zoom, zoom);
    ctx.translate(-camX, -camY);

    // Render Mathematical Coordinate Grid & Axis
    this.renderMathematicalGrid(ctx, camX, camY, width, height, zoom, isDark);

    // Render Canon Projectiles & Beams
    this.renderProjectiles(ctx, isDark);

    // Render Particles
    this.renderParticles(ctx, isDark);

    // Render Tactical Canon Battery & Reticle Crosshair HUD
    if (this.canon.active) {
      this.renderCanonHUD(ctx, camX, camY, width, height, zoom, isDark);
    }

    ctx.restore();
  }

  private renderMathematicalGrid(
    ctx: CanvasRenderingContext2D,
    camX: number,
    camY: number,
    width: number,
    height: number,
    zoom: number,
    isDark: boolean
  ) {
    const gridSize = 80;
    const left = camX - width / (2 * zoom) - gridSize;
    const right = camX + width / (2 * zoom) + gridSize;
    const top = camY - height / (2 * zoom) - gridSize;
    const bottom = camY + height / (2 * zoom) + gridSize;

    const startX = Math.floor(left / gridSize) * gridSize;
    const startY = Math.floor(top / gridSize) * gridSize;

    ctx.lineWidth = 1 / zoom;
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.04)';
    ctx.beginPath();

    for (let x = startX; x <= right; x += gridSize) {
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
    }
    for (let y = startY; y <= bottom; y += gridSize) {
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
    }
    ctx.stroke();

    // Major Cartesian axes
    ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.15)';
    ctx.beginPath();
    ctx.moveTo(0, top);
    ctx.lineTo(0, bottom);
    ctx.moveTo(left, 0);
    ctx.lineTo(right, 0);
    ctx.stroke();

    // Origin coordinate indicator
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
    ctx.font = `${Math.max(8, 10 / zoom)}px 'JetBrains Mono', monospace`;
    ctx.fillText('(0, 0)', 6 / zoom, -6 / zoom);
  }

  private renderCanonHUD(
    ctx: CanvasRenderingContext2D,
    camX: number,
    camY: number,
    width: number,
    height: number,
    zoom: number,
    isDark: boolean
  ) {
    const turretX = camX;
    const turretY = camY + (height / 2) / zoom - 28 / zoom;

    // Tactical Turret Battery Base at screen bottom
    ctx.save();
    ctx.translate(turretX, turretY);

    let aimAngle = -Math.PI / 2;
    if (this.aimCrosshair.visible) {
      const adx = this.aimCrosshair.x - turretX;
      const ady = this.aimCrosshair.y - turretY;
      aimAngle = Math.atan2(ady, adx);
    }

    ctx.rotate(aimAngle);
    ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(203, 213, 225, 0.9)';
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 2 / zoom;

    // Dual barrels
    ctx.fillRect(0, -6 / zoom, 28 / zoom, 4 / zoom);
    ctx.fillRect(0, 2 / zoom, 28 / zoom, 4 / zoom);
    ctx.strokeRect(0, -6 / zoom, 28 / zoom, 4 / zoom);
    ctx.strokeRect(0, 2 / zoom, 28 / zoom, 4 / zoom);

    // Turret core pivot
    ctx.beginPath();
    ctx.arc(0, 0, 14 / zoom, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#0f172a' : '#e2e8f0';
    ctx.fill();
    ctx.stroke();

    // Energy core light
    ctx.beginPath();
    ctx.arc(0, 0, 5 / zoom, 0, Math.PI * 2);
    ctx.fillStyle = this.handMode ? '#60a5fa' : '#f97316';
    ctx.fill();

    ctx.restore();

    // Render Sci-Fi Reticle Crosshair HUD at target
    if (this.aimCrosshair.visible) {
      const cx = this.aimCrosshair.x;
      const cy = this.aimCrosshair.y;
      const r = 24 / zoom;
      const time = this.simTime;

      ctx.save();
      ctx.translate(cx, cy);

      const color = this.handMode ? 'rgba(96, 165, 250, 0.85)' : 'rgba(249, 115, 22, 0.9)';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.5 / zoom;

      // Rotating dashed outer ring
      ctx.save();
      ctx.rotate(time * 1.5);
      ctx.setLineDash([4 / zoom, 4 / zoom]);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Inner solid target circle with center dot
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 2 / zoom, 0, Math.PI * 2);
      ctx.fill();

      // 4 Precision crosshair ticks
      const tLen = 8 / zoom;
      ctx.beginPath();
      ctx.moveTo(-r - tLen, 0); ctx.lineTo(-r + 2 / zoom, 0);
      ctx.moveTo(r - 2 / zoom, 0); ctx.lineTo(r + tLen, 0);
      ctx.moveTo(0, -r - tLen); ctx.lineTo(0, -r + 2 / zoom);
      ctx.moveTo(0, r - 2 / zoom); ctx.lineTo(0, r + tLen);
      ctx.stroke();

      // Range readout
      const dist = Math.round(Math.hypot(cx - turretX, cy - turretY));
      ctx.font = `${Math.max(8, 10 / zoom)}px 'JetBrains Mono', monospace`;
      ctx.fillText(`RNG: ${dist}m`, r + 6 / zoom, 4 / zoom);

      ctx.restore();
    }
  }

  private renderProjectiles(ctx: CanvasRenderingContext2D, isDark: boolean) {
    for (let i = 0; i < this.projectiles.length; i++) {
      const p = this.projectiles[i];
      const progress = p.age / p.maxAge;

      if (p.type === 'beam') {
        const alpha = Math.max(0.1, 1 - progress);
        // Outer atmospheric bloom
        ctx.strokeStyle = p.suppressParticleEffect
          ? `rgba(147, 197, 253, ${0.35 * alpha})`
          : `rgba(249, 115, 22, ${0.45 * alpha})`;
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(p.startX, p.startY);
        ctx.lineTo(p.targetX, p.targetY);
        ctx.stroke();

        // Mid neon laser beam
        ctx.strokeStyle = p.suppressParticleEffect
          ? `rgba(96, 165, 250, ${0.8 * alpha})`
          : `rgba(239, 68, 68, ${0.9 * alpha})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(p.startX, p.startY);
        ctx.lineTo(p.targetX, p.targetY);
        ctx.stroke();

        // Hyper-dense white-hot core
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.startX, p.startY);
        ctx.lineTo(p.targetX, p.targetY);
        ctx.stroke();
      } else {
        // Tracer impulse
        ctx.fillStyle = p.suppressParticleEffect
          ? 'rgba(147, 197, 253, 0.9)'
          : 'rgba(249, 115, 22, 0.95)';
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, 4 * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fill();

        // Expanding shockwave ripple
        ctx.strokeStyle = p.suppressParticleEffect
          ? `rgba(147, 197, 253, ${0.4 * (1 - progress)})`
          : `rgba(249, 115, 22, ${0.6 * (1 - progress)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.range * progress, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  private renderParticles(ctx: CanvasRenderingContext2D, isDark: boolean) {
    const count = this.particles.length;
    const baseSize = this.appearance.particleSize;
    const colored = this.appearance.coloredParticles;
    const colorSource = this.appearance.colorSource;

    // Genuine high-density micro-splats when infinite mode is active (> 20k)
    let extraSplats = 0;
    let jitterRadius = 2.5;
    if (this.infinityMode && this.infiniteTargetCount > 20000) {
      if (this.infiniteTargetCount <= 100000) {
        extraSplats = 1;
        jitterRadius = 3.2;
      } else if (this.infiniteTargetCount <= 1000000) {
        extraSplats = 2;
        jitterRadius = 4.5;
      } else if (this.infiniteTargetCount <= 10000000) {
        extraSplats = 3;
        jitterRadius = 6.0;
      } else {
        extraSplats = 4;
        jitterRadius = 7.5;
      }
    }

    // Fast path: if monochrome (default), batch single path for performance
    if (!colored) {
      const fill = isDark ? '#f8fafc' : '#0f172a';
      ctx.fillStyle = fill;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const p = this.particles[i];
        const rad = Math.max(0.4, p.size * baseSize * 0.7);
        ctx.moveTo(p.x + rad, p.y);
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);

        if (extraSplats > 0) {
          const microRad = Math.max(0.3, rad * 0.65);
          for (let s = 1; s <= extraSplats; s++) {
            const angle = (i * 2.39996 + s * 1.5708) % 6.28318;
            const dist = jitterRadius * (0.3 + (s / extraSplats) * 0.7);
            const sx = p.x + Math.cos(angle) * dist;
            const sy = p.y + Math.sin(angle) * dist;
            ctx.moveTo(sx + microRad, sy);
            ctx.arc(sx, sy, microRad, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();
      return;
    }

    // Palette mapping path
    if (colorSource === 'palette') {
      const pal = getPaletteById(this.activePaletteId);
      const colors = pal.colors;
      for (let i = 0; i < count; i++) {
        const p = this.particles[i];
        ctx.fillStyle = p.colorOverride || colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.7, p.size * baseSize * 0.8), 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    // Chromatic path when colored particles enabled via Pencil
    for (let i = 0; i < count; i++) {
      const p = this.particles[i];
      if (p.colorOverride) {
        ctx.fillStyle = p.colorOverride;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.7, p.size * baseSize * 0.8), 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      let hue = 210; // default electric blue

      if (colorSource === 'velocity') {
        hue = Math.min(360, 200 + speed * 35);
      } else if (colorSource === 'energy') {
        hue = (p.id * 1.6) % 360;
      } else if (colorSource === 'dimension') {
        hue = (this.dimensionConfig.currentDimension * 32) % 360;
      } else if (colorSource === 'spectrum') {
        hue = (i / count) * 360;
      } else if (colorSource === 'thermal') {
        hue = Math.max(0, 60 - speed * 20); // red/orange/yellow
      }

      ctx.fillStyle = `hsl(${hue}, 85%, ${isDark ? 65 : 45}%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.7, p.size * baseSize * 0.8), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Start simulation & render animation frame loop
   */
  public start() {
    if (this.animationFrameId !== null) return;

    this.lastTimestamp = performance.now();
    this.lastFpsUpdate = this.lastTimestamp;

    const loop = (timestamp: number) => {
      const elapsed = (timestamp - this.lastTimestamp) / 1000;
      this.lastTimestamp = timestamp;

      // Bound delta time to prevent spiraling after background tab sleep
      const dt = Math.min(0.05, Math.max(0.001, elapsed));

      this.step(dt);
      this.render();

      // FPS calculation
      this.frameCount++;
      if (timestamp - this.lastFpsUpdate >= 500) {
        this.fpsCounter = Math.round((this.frameCount * 1000) / (timestamp - this.lastFpsUpdate));
        this.frameCount = 0;
        this.lastFpsUpdate = timestamp;
        if (this.onMetricsUpdate) {
          const reportedCount = this.infinityMode ? this.infiniteTargetCount : this.particles.length;
          this.onMetricsUpdate(this.fpsCounter, reportedCount);
        }
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public destroy() {
    this.stop();
  }
}
