/**
 * Continuum Custom Color Palettes: 8 Authentic Scientific & Cosmic Color Sets
 */

import { CustomColorPalette } from '../../types';

export const CUSTOM_PALETTES: CustomColorPalette[] = [
  {
    id: 'deep-field',
    name: 'Cosmic Deep Field',
    description: 'Nebular ultraviolet, luminous cyan, and starlight white inspired by deep space astrophysics.',
    colors: ['#a855f7', '#06b6d4', '#f8fafc', '#3b82f6', '#ec4899'],
  },
  {
    id: 'standard-model',
    name: 'Standard Model Particle Spectrum',
    description: 'Authentic quantum chromodynamic colors: Quark ruby, Lepton cyan, Boson gold, Neutrino violet.',
    colors: ['#ef4444', '#06b6d4', '#10b981', '#fbbf24', '#8b5cf6', '#f43f5e'],
  },
  {
    id: 'plasma-thermal',
    name: 'Solar Plasma & Blackbody',
    description: 'Blackbody radiation curve: 6000K white-hot core through incandescent amber to coronal crimson.',
    colors: ['#ffffff', '#fef08a', '#f59e0b', '#ea580c', '#991b1b'],
  },
  {
    id: 'quantum-chromodynamics',
    name: 'Quantum Chromodynamics (QCD)',
    description: 'Color-charge fundamental triad: Red, Green, and Blue SU(3) gauge symmetry with anti-color conjugates.',
    colors: ['#ef4444', '#22c55e', '#3b82f6', '#f97316', '#a855f7'],
  },
  {
    id: 'bioluminescent',
    name: 'Bioluminescent Abyssal',
    description: 'Phosphorescent luciferin glow: deep ocean turquoise, electric emerald, and abyss violet.',
    colors: ['#00f5d4', '#00bbf9', '#7b2cbf', '#05f140', '#ffffff'],
  },
  {
    id: 'cybernetic',
    name: 'Cybernetic Phosphor Matrix',
    description: 'Terminal phosphor emerald and cold monochrome zinc for high-precision analytical telemetry.',
    colors: ['#10b981', '#34d399', '#064e3b', '#6ee7b7', '#f8fafc'],
  },
  {
    id: 'gravitational-lensing',
    name: 'Gravitational Lensing & Horizon',
    description: 'Spacetime curvature gradient: warped indigo, event horizon amber, and relativistic blue-shift.',
    colors: ['#312e81', '#6366f1', '#fb923c', '#fef08a', '#ffffff'],
  },
  {
    id: 'starlight-silver',
    name: 'Pure Starlight Silver',
    description: 'Subtle high-contrast multi-luminance silver, titanium, and platinum starlight.',
    colors: ['#ffffff', '#e2e8f0', '#94a3b8', '#64748b', '#cbd5e1'],
  },
];

export function getPaletteById(id: string): CustomColorPalette {
  return CUSTOM_PALETTES.find((p) => p.id === id) || CUSTOM_PALETTES[0];
}
