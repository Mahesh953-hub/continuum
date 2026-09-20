/**
 * Standard Model Fundamental Particles & Subatomic Species
 * Complete physics definitions for electrons, protons, neutrons, quarks, bosons, and leptons.
 */

import { ParticleSpecies } from '../../types';

export interface ParticleSpeciesMetadata {
  id: ParticleSpecies;
  name: string;
  symbol: string;
  category: 'lepton' | 'baryon' | 'quark' | 'gauge-boson' | 'scalar-boson';
  massMev: number;
  charge: number;
  spin: string;
  authenticColor: string; // Genuine real-world physics chromatic identity
  description: string;
}

export const FUNDAMENTAL_PARTICLES: ParticleSpeciesMetadata[] = [
  {
    id: 'electron',
    name: 'Electron',
    symbol: 'e⁻',
    category: 'lepton',
    massMev: 0.511,
    charge: -1,
    spin: '1/2',
    authenticColor: '#38bdf8', // Luminous Cyan
    description: 'Fundamental negative charge carrier, governs chemical bonding and electromagnetism.',
  },
  {
    id: 'proton',
    name: 'Proton',
    symbol: 'p⁺',
    category: 'baryon',
    massMev: 938.27,
    charge: +1,
    spin: '1/2',
    authenticColor: '#ef4444', // Ruby Red
    description: 'Composite baryon (uud) forming the massive positively charged atomic nucleus.',
  },
  {
    id: 'neutron',
    name: 'Neutron',
    symbol: 'n⁰',
    category: 'baryon',
    massMev: 939.57,
    charge: 0,
    spin: '1/2',
    authenticColor: '#10b981', // Neutral Emerald / Slate
    description: 'Neutral baryon (udd) providing nuclear binding force against Coulomb repulsion.',
  },
  {
    id: 'photon',
    name: 'Photon',
    symbol: 'γ',
    category: 'gauge-boson',
    massMev: 0,
    charge: 0,
    spin: '1',
    authenticColor: '#fbbf24', // Solar Gold
    description: 'Massless quantum of light and electromagnetic force gauge mediator.',
  },
  {
    id: 'up-quark',
    name: 'Up Quark',
    symbol: 'u',
    category: 'quark',
    massMev: 2.16,
    charge: +2 / 3,
    spin: '1/2',
    authenticColor: '#f97316', // Vibrant Orange
    description: 'Lightest quark, fundamental constituent of nucleons carrying +2/3 fractional charge.',
  },
  {
    id: 'down-quark',
    name: 'Down Quark',
    symbol: 'd',
    category: 'quark',
    massMev: 4.67,
    charge: -1 / 3,
    spin: '1/2',
    authenticColor: '#ec4899', // Magenta
    description: 'Second lightest quark, carrying -1/3 charge, essential for atomic stability.',
  },
  {
    id: 'gluon',
    name: 'Gluon',
    symbol: 'g',
    category: 'gauge-boson',
    massMev: 0,
    charge: 0,
    spin: '1',
    authenticColor: '#84cc16', // Lime Yellow-Green
    description: 'Gauge boson mediating the strong color interaction binding quarks inside hadrons.',
  },
  {
    id: 'muon',
    name: 'Muon',
    symbol: 'μ⁻',
    category: 'lepton',
    massMev: 105.66,
    charge: -1,
    spin: '1/2',
    authenticColor: '#818cf8', // Indigo
    description: 'Second generation charged lepton, 207 times more massive than the electron.',
  },
  {
    id: 'tau',
    name: 'Tau Lepton',
    symbol: 'τ⁻',
    category: 'lepton',
    massMev: 1776.86,
    charge: -1,
    spin: '1/2',
    authenticColor: '#c084fc', // Bright Purple
    description: 'Heaviest known lepton, massive enough to decay into hadrons.',
  },
  {
    id: 'neutrino',
    name: 'Neutrino',
    symbol: 'ν_e',
    category: 'lepton',
    massMev: 0.000001,
    charge: 0,
    spin: '1/2',
    authenticColor: '#a78bfa', // Ghostly Lavender
    description: 'Nearly massless, electrically neutral lepton interacting exclusively via weak gravity.',
  },
  {
    id: 'boson',
    name: 'W/Z Weak Boson',
    symbol: 'W/Z',
    category: 'gauge-boson',
    massMev: 80379,
    charge: +1,
    spin: '1',
    authenticColor: '#f43f5e', // Rose
    description: 'Massive vector bosons mediating weak nuclear interactions and radioactive decay.',
  },
  {
    id: 'higgs',
    name: 'Higgs Boson',
    symbol: 'H⁰',
    category: 'scalar-boson',
    massMev: 125100,
    charge: 0,
    spin: '0',
    authenticColor: '#fb7185', // Coral Crimson
    description: 'Excitation of the Higgs scalar field generating mass for fundamental fermions.',
  },
];

export function getParticleMetadata(id: ParticleSpecies): ParticleSpeciesMetadata {
  return FUNDAMENTAL_PARTICLES.find((p) => p.id === id) || FUNDAMENTAL_PARTICLES[0];
}
