/**
 * Continuum Particle Physics Lab: Interactive Real-World Experiments
 * Implements High-Energy Collider, Double-Slit Quantum Interference, Quantum Tunneling,
 * Continuous Elastic Topological Rope, Venturi Tunnel Flow, and Gravitational Pole Collapse.
 */

import { ParticleInternal } from '../../types';
import { getParticleMetadata } from './particleSpecies';
import { ParticleSpecies, ParticleColorMode } from '../../types';

export interface LabExperimentDefinition {
  id: string;
  name: string;
  category: string;
  equation: string;
  description: string;
  setup: (particles: ParticleInternal[], species: ParticleSpecies, colorMode: ParticleColorMode) => void;
  step?: (particles: ParticleInternal[], dt: number, time: number) => void;
}

export const LAB_EXPERIMENTS: LabExperimentDefinition[] = [
  {
    id: 'collider',
    name: 'Relativistic Particle Collider (LHC)',
    category: 'High-Energy Particle Physics',
    equation: 's = (p₁ + p₂)² = 4 E_{beam}², E_k → Hadrons',
    description: 'Two opposing particle beams accelerated to relativistic velocity collide at center, shattering into quark-gluon hadron fragments.',
    setup: (particles, species, colorMode) => {
      const meta = getParticleMetadata(species);
      const count = particles.length;
      const half = Math.floor(count / 2);

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const isLeft = i < half;
        const beamX = isLeft ? -700 - Math.random() * 400 : 700 + Math.random() * 400;
        const beamY = (Math.random() - 0.5) * 12;

        p.x = beamX;
        p.y = beamY;
        p.vx = isLeft ? 18 + Math.random() * 6 : -(18 + Math.random() * 6);
        p.vy = (Math.random() - 0.5) * 1.5;
        p.baseTargetX = 0;
        p.baseTargetY = 0;
        p.targetX = 0;
        p.targetY = 0;
        p.species = species;
        p.mass = meta.massMev > 0 ? meta.massMev / 1000 : 0.5;
        p.charge = meta.charge;

        if (colorMode === 'genuine') {
          p.colorOverride = isLeft ? meta.authenticColor : '#f43f5e';
        } else if (colorMode === 'white') {
          p.colorOverride = '#ffffff';
        } else {
          p.colorOverride = undefined;
        }
      }
    },
    step: (particles, dt, time) => {
      // Accelerate beams inward; upon approaching center (|x| < 35), explode into collision showers
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (Math.abs(p.x) < 30 && Math.abs(p.y) < 30) {
          // Fragmentation burst
          const ang = Math.random() * Math.PI * 2;
          const speed = 6 + Math.random() * 18;
          p.vx = Math.cos(ang) * speed;
          p.vy = Math.sin(ang) * speed;
          p.energy = 5.0;
        }
        // Respawn if escaped far
        if (Math.abs(p.x) > 1200 || Math.abs(p.y) > 900) {
          const isLeft = i % 2 === 0;
          p.x = isLeft ? -900 : 900;
          p.y = (Math.random() - 0.5) * 10;
          p.vx = isLeft ? 22 : -22;
          p.vy = 0;
        }
      }
    },
  },
  {
    id: 'double-slit',
    name: 'Double-Slit Quantum Interference',
    category: 'Quantum Optics',
    equation: 'I(θ) = I₀ cos²(π d sinθ / λ) · [sinc(π a sinθ / λ)]²',
    description: 'A stream of coherent wave-like quantum particles fired towards a double-slit barrier, generating fringe interference peaks.',
    setup: (particles, species, colorMode) => {
      const meta = getParticleMetadata(species);
      const count = particles.length;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x = -600 + (Math.random() - 0.5) * 150;
        p.y = (Math.random() - 0.5) * 350;
        p.vx = 7 + Math.random() * 2;
        p.vy = (Math.random() - 0.5) * 0.5;
        p.species = species;
        p.colorOverride = colorMode === 'genuine' ? meta.authenticColor : colorMode === 'white' ? '#ffffff' : undefined;
      }
    },
    step: (particles) => {
      const barrierX = -100;
      const slitDist = 70;
      const slitWidth = 24;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // If passing through barrier
        if (p.x >= barrierX - 5 && p.x <= barrierX + 5) {
          const nearTopSlit = Math.abs(p.y - slitDist) < slitWidth;
          const nearBottomSlit = Math.abs(p.y + slitDist) < slitWidth;

          if (!nearTopSlit && !nearBottomSlit) {
            // Blocked by barrier: reflect or absorb
            p.vx = -Math.abs(p.vx) * 0.4;
          } else {
            // Diffraction spread through slit
            const diffractionAngle = (Math.random() - 0.5) * 0.95;
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            p.vx = Math.cos(diffractionAngle) * speed;
            p.vy = Math.sin(diffractionAngle) * speed;
          }
        }

        // Screen collision detector at x = 500
        if (p.x > 550) {
          // Recycle back to emitter
          p.x = -650 - Math.random() * 80;
          p.y = (Math.random() - 0.5) * 350;
          p.vx = 7 + Math.random() * 2;
          p.vy = 0;
        }
      }
    },
  },
  {
    id: 'tunneling',
    name: 'Quantum Tunneling through Potential Barrier',
    category: 'Quantum Mechanics',
    equation: 'T ≈ 16 (E/V₀) (1 - E/V₀) e^{-2 w √(2m(V₀ - E)) / ℏ}',
    description: 'Wave packet striking a high potential barrier; majority reflects, but finite probability density tunnels straight through.',
    setup: (particles, species, colorMode) => {
      const meta = getParticleMetadata(species);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x = -500 + Math.random() * 250;
        p.y = (Math.random() - 0.5) * 160;
        p.vx = 8 + Math.random() * 2;
        p.vy = (Math.random() - 0.5) * 0.8;
        p.species = species;
        p.colorOverride = colorMode === 'genuine' ? meta.authenticColor : colorMode === 'white' ? '#ffffff' : undefined;
      }
    },
    step: (particles) => {
      const barrierStart = 0;
      const barrierEnd = 60;
      const transmissionProbability = 0.12; // 12% quantum tunneling rate

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.x >= barrierStart && p.x < barrierEnd && p.vx > 0) {
          if (Math.random() < transmissionProbability) {
            // Tunnel through! Instant transmission to other side
            p.x = barrierEnd + 10;
            p.vx *= 0.85; // slight energy loss
          } else {
            // Classical reflection
            p.vx = -Math.abs(p.vx);
          }
        }
        if (p.x < -600 || p.x > 600) {
          p.x = -550;
          p.y = (Math.random() - 0.5) * 160;
          p.vx = 8 + Math.random() * 2;
        }
      }
    },
  },
  {
    id: 'rope',
    name: 'Continuous Elastic Topological Rope',
    category: 'Continuum Mechanics',
    equation: '∂²u/∂t² = v² ∂²u/∂x² - γ ∂u/∂t + F_{tension}',
    description: 'Infinite continuous flexible rope of bonded particles demonstrating transverse wave propagation, tension, and wave reflection.',
    setup: (particles, species, colorMode) => {
      const meta = getParticleMetadata(species);
      const count = particles.length;
      const width = 800;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const t = (i / count);
        p.x = -width / 2 + t * width;
        p.y = Math.sin(t * Math.PI * 4) * 45;
        p.vx = 0;
        p.vy = 0;
        p.baseTargetX = p.x;
        p.baseTargetY = p.y;
        p.species = species;
        p.colorOverride = colorMode === 'genuine' ? meta.authenticColor : colorMode === 'white' ? '#ffffff' : undefined;
      }
    },
    step: (particles, dt, time) => {
      // Elastic spring coupling between adjacent particles
      const k = 0.18;
      const count = particles.length;
      for (let i = 1; i < count - 1; i++) {
        const p = particles[i];
        const prev = particles[i - 1];
        const next = particles[i + 1];

        // Wave restoring force
        const dy = (prev.y + next.y) * 0.5 - p.y;
        p.vy += dy * k;
        p.vy *= 0.98; // damping
      }
      // Drive the left end periodically to create continuous traveling waves
      if (particles[0]) {
        particles[0].y = Math.sin(time * 6) * 75;
      }
    },
  },
  {
    id: 'tunnel-flow',
    name: 'Venturi Constriction Tunnel Flow',
    category: 'Hydrodynamics & Aerodynamics',
    equation: 'p₁ + 1/2 ρ v₁² = p₂ + 1/2 ρ v₂² (Bernoulli & Continuity)',
    description: 'High-speed particle stream entering a narrow constriction, exhibiting rapid acceleration and pressure drop.',
    setup: (particles, species, colorMode) => {
      const meta = getParticleMetadata(species);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x = -600 + Math.random() * 1200;
        p.y = (Math.random() - 0.5) * 300;
        p.vx = 5;
        p.vy = 0;
        p.species = species;
        p.colorOverride = colorMode === 'genuine' ? meta.authenticColor : colorMode === 'white' ? '#ffffff' : undefined;
      }
    },
    step: (particles) => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Tunnel boundary constriction: narrowest at x = 0 (height ±35), wide at ends (height ±220)
        const neck = 35 + Math.pow(p.x / 400, 2) * 180;
        if (Math.abs(p.y) > neck) {
          p.y = Math.sign(p.y) * neck;
          p.vy = -p.vy * 0.5;
        }

        // Venturi acceleration: velocity increases inversely with conduit width
        const speedMultiplier = 35 / Math.min(neck, 220);
        p.vx = 5 * (1 + speedMultiplier * 2.8);

        if (p.x > 650) {
          p.x = -650;
          p.y = (Math.random() - 0.5) * 200;
        }
      }
    },
  },
  {
    id: 'blackhole-collapse',
    name: 'Pole Collapse into Gravitational Singularity',
    category: 'General Relativity',
    equation: 'T_{μν} → Singular Pole, g_{00} → 0, Event Horizon Formed',
    description: 'A linear stream of traveling particles encounters a massive pole at origin, which suddenly undergoes gravitational collapse into an event horizon.',
    setup: (particles, species, colorMode) => {
      const meta = getParticleMetadata(species);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x = -600 + (i / particles.length) * 1200;
        p.y = -100 + (Math.random() - 0.5) * 30; // road stream
        p.vx = 14;
        p.vy = 0;
        p.species = species;
        p.colorOverride = colorMode === 'genuine' ? meta.authenticColor : colorMode === 'white' ? '#ffffff' : undefined;
      }
    },
    step: (particles, dt, time) => {
      // Pole at (0, 0) starts forming black hole after 2 seconds
      const singularityActive = time > 1.8;
      const horizonRadius = 45;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (singularityActive) {
          const dx = 0 - p.x;
          const dy = 0 - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > horizonRadius) {
            // Gravitational suction + tangential frame-dragging spin
            const pull = Math.min(450 / (dist + 5), 18);
            p.vx += (dx / dist) * pull;
            p.vy += (dy / dist) * pull;

            // Frame dragging swirl
            p.vx += (-dy / dist) * 4.5;
            p.vy += (dx / dist) * 4.5;
          } else {
            // Captured inside event horizon: spiral into singularity
            p.vx *= 0.6;
            p.vy *= 0.6;
            p.x += (Math.random() - 0.5) * 5;
            p.y += (Math.random() - 0.5) * 5;
          }
        }
      }
    },
  },
];
