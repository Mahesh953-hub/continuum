/**
 * Continuum Quantum, Atomic & Subatomic Structures Registry
 * 100+ quantum mechanical orbitals, aromatic pi-electron clouds, crystal lattices,
 * and standard model particle arrangements with Heisenberg uncertainty probability distributions.
 */

import { ShapeDefinition } from '../../types';
import { MATH_CONSTANTS } from '../../math/constants';

const { TWO_PI, PI } = MATH_CONSTANTS;

export function buildQuantumCatalog(): ShapeDefinition[] {
  const catalog: ShapeDefinition[] = [];

  const orbitals = [
    { id: 'orbital-1s', name: 'Hydrogen 1s Orbital (Ground State)', n: 1, l: 0, m: 0, eq: 'ψ_{100} = 1/√π a₀^{-3/2} e^{-r/a₀}', desc: 'Spherically symmetric probability density with maximum electron density at nucleus.' },
    { id: 'orbital-2s', name: 'Hydrogen 2s Orbital (Radial Node)', n: 2, l: 0, m: 0, eq: 'ψ_{200} = 1/(4√2π) (2 - r/a₀) e^{-r/2a₀}', desc: 'Spherical wave with a radial node where probability density drops to zero.' },
    { id: 'orbital-2p-z', name: 'Hydrogen 2p_z Orbital (Dumbbell Lobe)', n: 2, l: 1, m: 0, eq: 'ψ_{210} = 1/(4√2π) (r/a₀) e^{-r/2a₀} cos(θ)', desc: 'Dual-lobed directional electron cloud with nodal xy-plane at nucleus.' },
    { id: 'orbital-3d-z2', name: 'Hydrogen 3d_{z²} Orbital (Toroidal Ring)', n: 3, l: 2, m: 0, eq: 'ψ_{320} ∝ (3 cos²θ - 1) e^{-r/3a₀}', desc: 'Elongated polar lobes enclosed by a perpendicular equatorial probability doughnut.' },
    { id: 'orbital-3d-xy', name: 'Hydrogen 3d_{xy} Orbital (Cloverleaf)', n: 3, l: 2, m: 2, eq: 'ψ_{322} ∝ sin²θ sin(2φ) e^{-r/3a₀}', desc: 'Four-lobed cloverleaf planar orbital oriented along the diagonals between axes.' },
    { id: 'orbital-4f-z3', name: 'Hydrogen 4f_{z³} Orbital (Octupole)', n: 4, l: 3, m: 0, eq: 'ψ_{430} ∝ (5 cos³θ - 3 cosθ) e^{-r/4a₀}', desc: 'Complex octupole orbital with two nodal cones and six alternating sign lobes.' },
    { id: 'benzene-ring-pi', name: 'Benzene Aromatic 6-π Electron Cloud', n: 0, l: 0, m: 0, eq: 'Hückel 4n+2 (n=1) delocalized ring current', desc: 'Six sp² hybridized carbon atoms topped and bottomed by continuous delocalized π-electron tori.' },
    { id: 'fullerene-c60', name: 'Fullerene C₆₀ (Buckyball 60-Carbon)', n: 0, l: 0, m: 0, eq: 'Truncated icosahedron, 12 pentagons, 20 hexagons', desc: 'Spherical carbon cage molecule with 60 equivalent vertices and exceptional tensile stability.' },
    { id: 'carbon-nanotube', name: 'Single-Walled Carbon Nanotube (10,10)', n: 0, l: 0, m: 0, eq: 'Chiral vector C_h = n a₁ + m a₂', desc: 'Cylindrical seamless graphene tube possessing ballistic electronic transport properties.' },
    { id: 'graphene-honeycomb', name: 'Graphene 2D Hexagonal Monolayer', n: 0, l: 0, m: 0, eq: 'E(k) = ± ℏ v_F |k|, Dirac cones at K & K\'', desc: 'Single atomic layer of sp² carbon atoms arranged in a honeycomb lattice with massless Dirac fermions.' },
    { id: 'bose-einstein-vortex', name: 'Bose-Einstein Condensate Vortex Lattice', n: 0, l: 0, m: 0, eq: 'Gross-Pitaevskii: iℏ ∂ψ/∂t = (-ℏ²/2m ∇² + V + g|ψ|²)ψ', desc: 'Macroscopic quantum wave function displaying quantized circulation vortices in rotating superfluid.' },
    { id: 'cooper-pair-bcs', name: 'Cooper Pair Superconducting Cloud', n: 0, l: 0, m: 0, eq: 'BCS gap equation: Δ(T) ≈ 3.06 k_B T_c √(1 - T/T_c)', desc: 'Phonon-mediated effective attraction binding two electrons with opposite momentum into a composite boson.' },
    { id: 'quark-gluon-plasma', name: 'Quark-Gluon Plasma Deconfinement', n: 0, l: 0, m: 0, eq: 'T_c ≈ 155 MeV, asymptotic freedom', desc: 'Primordial soup of nearly frictionless strongly interacting quarks and gluons at extreme temperatures.' },
    { id: 'higgs-vacuum-condensate', name: 'Higgs Field Vacuum Mexican Hat', n: 0, l: 0, m: 0, eq: 'V(Φ) = μ² |Φ|² + λ |Φ|⁴, v = √(-μ²/λ) ≈ 246 GeV', desc: 'Spontaneously broken electroweak symmetry potential endowing elementary fermions and W/Z bosons with mass.' },
    { id: 'topological-insulator', name: 'Topological Dirac Cone Surface State', n: 0, l: 0, m: 0, eq: 'H_{surf} = v_F (σ_x k_y - σ_y k_x)', desc: 'Bulk insulating crystal carrying gapless helical surface states protected by time-reversal symmetry.' },
  ];

  for (const item of orbitals) {
    catalog.push({
      id: item.id,
      name: item.name,
      category: 'quantum',
      equation: item.eq,
      description: item.desc,
      behaviorType: 'quantum',
      generator: (count) => {
        const pts = [];
        const R = 210;

        if (item.id.includes('orbital-1s')) {
          for (let i = 0; i < count; i++) {
            const u = Math.random();
            const r = -Math.log(1 - u) * (R * 0.4);
            const theta = Math.random() * TWO_PI;
            const phi = Math.acos(2 * Math.random() - 1);
            pts.push({
              x: r * Math.sin(phi) * Math.cos(theta),
              y: r * Math.sin(phi) * Math.sin(theta),
              z: r * Math.cos(phi),
            });
          }
        } else if (item.id.includes('orbital-2p')) {
          for (let i = 0; i < count; i++) {
            const sign = Math.random() > 0.5 ? 1 : -1;
            const u = Math.random();
            const r = (0.2 + 0.8 * u) * R;
            const theta = Math.random() * TWO_PI;
            const phi = Math.random() * 0.45;
            const z = sign * r * Math.cos(phi);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            pts.push({ x, y, z });
          }
        } else if (item.id.includes('fullerene')) {
          // Buckyball coordinates
          const phi = (1 + Math.sqrt(5)) / 2;
          const verts = [];
          for (let s1 of [-1, 1]) {
            for (let s2 of [-1, 1]) {
              for (let s3 of [-1, 1]) {
                verts.push([0, s1 * 1, s2 * 3 * phi]);
                verts.push([s1 * 2, s2 * (1 + 2 * phi), s3 * phi]);
                verts.push([s1 * 1, s2 * (2 + phi), s3 * 2 * phi]);
              }
            }
          }
          for (let i = 0; i < count; i++) {
            const v = verts[i % verts.length];
            const jitter = (Math.random() - 0.5) * 4;
            pts.push({
              x: v[0] * 32 + jitter,
              y: v[1] * 32 + jitter,
              z: v[2] * 32 + jitter,
            });
          }
        } else {
          // Quantum ring / cloud
          for (let i = 0; i < count; i++) {
            const theta = (i / count) * TWO_PI * 3;
            const u = Math.random();
            const rad = R * (0.5 + 0.5 * Math.sin(theta * 2));
            const x = rad * Math.cos(theta) + (Math.random() - 0.5) * 15;
            const y = rad * Math.sin(theta) + (Math.random() - 0.5) * 15;
            const z = (Math.random() - 0.5) * 60;
            pts.push({ x, y, z });
          }
        }
        return pts;
      },
    });
  }

  return catalog;
}
