/**
 * Continuum: Authoritative Preset Universes
 * Satisfies Section 16 (Solar System, Walking Man, River, Spacetime Fabric, Black Hole, Endless Hotel + extras)
 */

import { PresetUniverse } from '../types';
import { MATH_CONSTANTS } from '../math/constants';

const { TWO_PI } = MATH_CONSTANTS;

export const PRESETS_REGISTRY: PresetUniverse[] = [
  {
    id: 'solar-system',
    name: 'Solar System',
    subtitle: 'Gravitational Orbital Mechanics',
    description: 'Central solar mass with eight concentric planetary orbital bodies governed by Keplerian ellipses.',
    mathematicalBasis: "Kepler's Laws & Newton's Law of Universal Gravitation: F = G (m₁ m₂) / r²",
    particleCount: 3600,
    shapeId: 'solar-system-orbits',
    dimension: 3,
    physics: {
      gravity: 0.8,
      damping: 0.998,
      timeScale: 1.0,
      turbulence: 0.05,
    },
    healing: {
      enabled: true,
      particleHealing: true,
      shapeHealing: true,
      strength: 0.07,
      speed: 0.9,
    },
    customStep: (particles, dt, time) => {
      // Rotate planets along orbital paths with Keplerian angular velocities ω ∝ r^(-1.5)
      const sunCount = Math.floor(particles.length * 0.12);
      // Gentle solar pulsation
      for (let i = 0; i < sunCount; i++) {
        const p = particles[i];
        p.vx += (Math.random() - 0.5) * 0.2;
        p.vy += (Math.random() - 0.5) * 0.2;
      }
      // Planetary orbital motion
      const orbits = [30, 55, 85, 120, 180, 235, 285, 330];
      for (let i = sunCount; i < particles.length; i++) {
        const p = particles[i];
        const r = Math.sqrt(p.x * p.x + p.y * p.y) || 1;
        // Tangential velocity proportional to 1 / sqrt(r)
        const orbitalSpeed = (380 / Math.sqrt(r)) * dt;
        const tangX = -p.y / r;
        const tangY = p.x / r;
        p.vx += tangX * orbitalSpeed * 0.08;
        p.vy += tangY * orbitalSpeed * 0.08;
      }
    },
  },
  {
    id: 'walking-man',
    name: 'Walking Man',
    subtitle: 'Kinematic Biomechanical Gait',
    description: 'Articulated bipedal skeletal figure walking smoothly across the coordinate space, fully self-healing upon disruption.',
    mathematicalBasis: 'Hierarchical forward kinematics, periodic gait cycles θ(t) = A sin(ωt + φ)',
    particleCount: 2800,
    shapeId: 'walking-man',
    dimension: 2,
    physics: {
      gravity: 0.0,
      damping: 0.92,
      timeScale: 1.0,
      turbulence: 0.0,
    },
    healing: {
      enabled: true,
      particleHealing: true,
      shapeHealing: true,
      strength: 0.12,
      speed: 1.4,
    },
    customStep: (particles, dt, time) => {
      // Dynamic leg and arm swinging gait cycle
      const gaitFrequency = 3.2;
      const legPhase = time * gaitFrequency;
      const swingLeft = Math.sin(legPhase) * 26;
      const swingRight = Math.sin(legPhase + Math.PI) * 26;
      const bobbing = Math.abs(Math.sin(legPhase * 2)) * 6;

      // Adjust particle target offsets based on walking gait
      const headCount = Math.floor(particles.length * 0.15);
      const spineCount = Math.floor(particles.length * 0.15);

      for (let i = 0; i < headCount; i++) {
        particles[i].targetY = -190 + bobbing;
      }
      for (let i = headCount; i < headCount + spineCount; i++) {
        particles[i].targetY += (bobbing - particles[i].targetY) * 0.02;
      }
    },
  },
  {
    id: 'river',
    name: 'River',
    subtitle: 'Hydrodynamic Flow & Vorticity',
    description: 'Turbulent fluid currents branching, meandering, and cascading through a dynamic riverbed channel.',
    mathematicalBasis: 'Navier-Stokes vorticity curl(v) = ω with 2D turbulent stream function ψ(x, y)',
    particleCount: 4200,
    shapeId: 'river-vortex',
    dimension: 2,
    physics: {
      gravity: 0.0,
      damping: 0.97,
      timeScale: 1.0,
      turbulence: 0.8,
    },
    healing: {
      enabled: true,
      particleHealing: true,
      shapeHealing: false,
      strength: 0.04,
      speed: 0.7,
    },
    customStep: (particles, dt, time) => {
      const riverHalfLen = 350;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Forward flow along X
        p.vx += 1.8 * dt * 60;
        // Meandering curl
        const wave = Math.sin(p.x * 0.015 + time * 1.5) * 0.8;
        p.vy += wave;
        // Recycle particles reaching downstream end
        if (p.x > riverHalfLen) {
          p.x = -riverHalfLen - (Math.random() * 40);
          p.y = Math.sin(p.x * 0.02) * 50 + (Math.random() - 0.5) * 60;
          p.vx = 2.0;
          p.vy = 0;
        }
      }
    },
  },
  {
    id: 'spacetime-fabric',
    name: 'Spacetime Fabric',
    subtitle: 'General Relativistic Curvature',
    description: 'Deformable elastic metric lattice experiencing gravitational depression around central mass attractor.',
    mathematicalBasis: "Einstein Field Equations: G_μν = 8πT_μν, geodesic deviations and tensor ripples",
    particleCount: 3800,
    shapeId: 'spacetime-fabric',
    dimension: 3,
    physics: {
      gravity: 0.3,
      damping: 0.96,
      timeScale: 1.0,
      turbulence: 0.05,
    },
    healing: {
      enabled: true,
      particleHealing: true,
      shapeHealing: true,
      strength: 0.09,
      speed: 1.0,
    },
    customStep: (particles, dt, time) => {
      // Gravitational ripple waves outward from center
      const waveFreq = 2.5;
      const waveSpeed = 120;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dist = Math.sqrt(p.x * p.x + p.y * p.y);
        const ripple = Math.sin(dist * 0.04 - time * waveFreq) * 6;
        p.targetY = p.targetY * 0.95 + (p.targetY + ripple) * 0.05;
      }
    },
  },
  {
    id: 'black-hole',
    name: 'Black Hole',
    subtitle: 'Schwarzschild Metric & Accretion Disk',
    description: 'Singularity event horizon surrounded by relativistically sheared accretion disk and photon sphere.',
    mathematicalBasis: 'Schwarzschild radius r_s = 2GM/c² with relativistic frame dragging and orbital vortex',
    particleCount: 4500,
    shapeId: 'black-hole-accretion',
    dimension: 3,
    physics: {
      gravity: 2.2,
      damping: 0.985,
      timeScale: 1.0,
      turbulence: 0.1,
    },
    healing: {
      enabled: true,
      particleHealing: true,
      shapeHealing: true,
      strength: 0.06,
      speed: 0.8,
    },
    customStep: (particles, dt, time) => {
      // Strong central gravitational vortex pull and relativistic rotational acceleration
      const rEventHorizon = 40;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const distSq = p.x * p.x + p.y * p.y;
        const dist = Math.sqrt(distSq) || 1;

        if (dist > rEventHorizon) {
          // Inward gravity
          const gravityPull = (18000 / (distSq + 200)) * dt;
          p.vx -= (p.x / dist) * gravityPull;
          p.vy -= (p.y / dist) * gravityPull;

          // Tangential swirl
          const swirlSpeed = (1200 / (dist + 50)) * dt;
          p.vx += (-p.y / dist) * swirlSpeed;
          p.vy += (p.x / dist) * swirlSpeed;
        } else {
          // Inside event horizon: photon sphere recirculation
          p.vx *= 0.85;
          p.vy *= 0.85;
        }
      }
    },
  },
  {
    id: 'endless-hotel',
    name: 'Endless Hotel',
    subtitle: "Hilbert's Transfinite Hotel",
    description: 'Recursive perspective geometric chambers nesting infinitely along spatial dimensions.',
    mathematicalBasis: 'Hilbert’s Hotel cardinality ℵ₀ transfinite mapping: room n → room n + 1',
    particleCount: 3200,
    shapeId: 'endless-hotel',
    dimension: 3,
    physics: {
      gravity: 0.0,
      damping: 0.94,
      timeScale: 1.0,
      turbulence: 0.0,
    },
    healing: {
      enabled: true,
      particleHealing: true,
      shapeHealing: true,
      strength: 0.11,
      speed: 1.2,
    },
    customStep: (particles, dt, time) => {
      // Continuous camera dive / recursive room forward drift
      const speed = 0.4;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.dimZ !== undefined) {
          p.dimZ -= speed;
          if (p.dimZ < 0) {
            p.dimZ += 420;
          }
        }
      }
    },
  },
  {
    id: 'calabi-yau',
    name: 'Calabi-Yau Manifold',
    subtitle: 'Superstring Compactified Dimensions',
    description: 'Ricci-flat Kähler 6-dimensional complex quintic hypersurface projection from 10D spacetime.',
    mathematicalBasis: 'Compactification of extra 6 dimensions in Type IIB string theory with SU(3) holonomy',
    particleCount: 3600,
    shapeId: 'calabi-yau-6d',
    dimension: 6,
    physics: {
      gravity: 0.1,
      damping: 0.97,
      timeScale: 0.8,
      turbulence: 0.0,
    },
    healing: {
      enabled: true,
      particleHealing: true,
      shapeHealing: true,
      strength: 0.08,
      speed: 1.0,
    },
  },
  {
    id: 'lorenz-cosmos',
    name: 'Lorenz Attractor',
    subtitle: 'Deterministic Chaos Butterfly',
    description: 'Continuous flow around twin unstable chaotic equilibrium manifolds with fractal dimension ~2.06.',
    mathematicalBasis: 'Nonlinear dynamical system: dx/dt = σ(y - x), dy/dt = x(ρ - z) - y, dz/dt = xy - βz',
    particleCount: 3400,
    shapeId: 'lorenz-attractor',
    dimension: 3,
    physics: {
      gravity: 0.0,
      damping: 0.98,
      timeScale: 1.0,
      turbulence: 0.0,
    },
    healing: {
      enabled: true,
      particleHealing: true,
      shapeHealing: true,
      strength: 0.05,
      speed: 0.8,
    },
  },
];

export function getPresetById(id: string): PresetUniverse {
  return PRESETS_REGISTRY.find((p) => p.id === id) || PRESETS_REGISTRY[0];
}
