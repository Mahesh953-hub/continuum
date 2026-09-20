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
  ParticleInternal,
  PhysicsConfig,
  SelfHealingConfig,
} from '../../types';
import { getShapeById } from '../shapes/shapeRegistry';
import { getPresetById } from '../../presets/presetRegistry';
import { projectNDto2D } from '../../math/projections';
import { SpatialHash } from '../../math/spatialHash';

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
   * Initializes or re-allocates particle entities with coordinated appearance
   */
  public initParticles(targetCount: number) {
    const count = Math.max(200, Math.min(12000, targetCount));
    this.particles = new Array(count);

    const shape = getShapeById(this.activeShapeId);
    const targetPoints = shape.generator(count);

    // 15% of particles allocated to boundless cosmic horizon background to guarantee infinite feel
    const ambientCount = Math.floor(count * 0.15);
    const structuralCount = count - ambientCount;

    for (let i = 0; i < count; i++) {
      let pt: { x: number; y: number; z?: number; w?: number };

      if (i < structuralCount) {
        pt = targetPoints[i % targetPoints.length] || { x: 0, y: 0 };
      } else {
        // Expansive cosmic ambient particles radiating outward
        const angle = (i * 2.39996) % (Math.PI * 2);
        const rad = 350 + (i % 200) * 8 + Math.random() * 80;
        pt = {
          x: Math.cos(angle) * rad,
          y: Math.sin(angle) * rad,
          z: (Math.random() - 0.5) * 300,
          w: (Math.random() - 0.5) * 200,
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
        size: 1.1 + Math.random() * 0.8,
        age: 0,
        alive: true,
        shapeIndex: i,
        lastDisplacedTime: 0,
        alpha: 0.85,
      };
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
    const originX = this.camera.x;
    const originY = this.camera.y;
    const dx = targetUniverseX - originX;
    const dy = targetUniverseY - originY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const dirX = dx / dist;
    const dirY = dy / dist;

    const method = this.canon.firingMethod;
    const power = this.canon.power;
    const range = this.canon.range;
    const suppressParticles = this.handMode; // LOCKED RULE: Suppress particle effects in Hand mode

    // Spawn visual projectile fx
    const count = method === 'burst' ? 5 : method === 'spread' ? 7 : method === 'rapid' ? 3 : 1;
    const baseAngle = Math.atan2(dirY, dirX);

    for (let i = 0; i < count; i++) {
      let angle = baseAngle;
      if (count > 1) {
        const spread = this.canon.spread;
        angle += (i / (count - 1) - 0.5) * spread;
      }

      const pVx = Math.cos(angle) * 16;
      const pVy = Math.sin(angle) * 16;

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
        maxAge: method === 'beam' ? 14 : 45,
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

    // Run preset-specific custom step if present
    if (preset.customStep) {
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

      // Self-Healing attraction toward dynamically spinning target rest shape
      if (healingEnabled && p.alive) {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > this.healing.threshold) {
          // Smooth non-linear spring attractor
          const pull = Math.min(dist * healStrength, 14.0) * healSpeed;
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;
        }
      }

      // Object-specific gravity rule
      if (gravity !== 0 && !isHigherDim) {
        p.vy += gravity * 0.05 * timeScale;
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
      const bound = 3500;
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
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    
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

  private renderProjectiles(ctx: CanvasRenderingContext2D, isDark: boolean) {
    for (let i = 0; i < this.projectiles.length; i++) {
      const p = this.projectiles[i];
      const progress = p.age / p.maxAge;

      if (p.type === 'beam') {
        // Continuous directed laser beam
        ctx.strokeStyle = p.suppressParticleEffect
          ? 'rgba(147, 197, 253, 0.7)' // soft cyan when Hand mode suppresses blast
          : 'rgba(239, 68, 68, 0.85)'; // hot red/orange beam
        ctx.lineWidth = 3;
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

    // Fast path: if monochrome (default), batch single path for performance
    if (!colored) {
      const fill = isDark ? '#f8fafc' : '#0f172a';
      ctx.fillStyle = fill;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const p = this.particles[i];
        const rad = Math.max(0.7, p.size * baseSize * 0.7);
        ctx.moveTo(p.x + rad, p.y);
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      }
      ctx.fill();
      return;
    }

    // Chromatic path when colored particles enabled via Pencil
    for (let i = 0; i < count; i++) {
      const p = this.particles[i];
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
          this.onMetricsUpdate(this.fpsCounter, this.particles.length);
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
