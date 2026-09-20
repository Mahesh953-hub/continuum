# CONTINUUM: Guide for Creating Objects, Laws & Particle Dynamics

Welcome to the **Continuum Object Engineering Guide**. This document details the mathematical standards, physical laws, cosmological surroundings, and chromatic pipelines used to design, calibrate, and simulate objects within Continuum.

---

## 1. Architectural Anatomy of an Object

Every entity in Continuum is modeled as an array of discrete, persistent mathematical point-masses calculating their own trajectories under physical laws and dynamic target equilibria.

```typescript
export interface ShapeDefinition {
  id: string;                                    // Unique identifier (e.g. 'milky-way-galaxy')
  name: string;                                  // Human-readable title
  category: ShapeCategory;                       // 'cosmic' | 'quantum' | 'geometry' | 'parametric' | 'fractals' | 'dimensions' | 'biological' | 'diagrams'
  description: string;                           // Physical or geometric description
  equation?: string;                             // LaTeX or mathematical formula (displayed in HUD)
  dimension?: number;                            // Default spatial dimension (2D, 3D, 4D... 11D)
  behaviorType?:                                 // Authentic physical dynamics rule:
    | 'standard'                                 // Self-healing spring lattice
    | 'blackhole'                                // Relativistic Kerr/Schwarzschild singularity
    | 'galaxy'                                   // Flat rotation curve with dark matter halo
    | 'quantum'                                  // Heisenberg probability wave & orbital breathing
    | 'dimension'                                // Higher-dimensional stereographic projection
    | 'attractor';                               // Continuous differential chaos integration
  generatePoints: (count: number) => {           // Deterministic locus generator
    x: number;
    y: number;
    z?: number;
    w?: number;
  }[];
}
```

---

## 2. Mathematical Coordinate Generation

### 2.1 Spherical & Radial Manifolds
Use Archimedean or Fibonacci spherical distribution to ensure uniform density without pole clustering:
```typescript
generatePoints: (count: number) => {
  const points = [];
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * i / phi;
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const scale = 220;
    points.push({
      x: Math.cos(theta) * radius * scale,
      y: y * scale,
      z: Math.sin(theta) * radius * scale,
    });
  }
  return points;
}
```

### 2.2 Spiral Density Wave (Galaxies)
Galaxies must use logarithmic spiral arms governed by:
$$r(\theta) = a \cdot e^{b \theta}$$
```typescript
generatePoints: (count: number) => {
  const points = [];
  const arms = 2; // e.g. Milky Way Perseus & Scutum-Centaurus
  const b = 0.28;  // Winding constant
  for (let i = 0; i < count; i++) {
    const armIndex = i % arms;
    const armOffset = (armIndex * 2 * Math.PI) / arms;
    const t = Math.pow(Math.random(), 0.75) * 3.8; // Dense core falloff
    const r = 24 + 68 * Math.exp(b * t);
    const theta = t + armOffset + (Math.random() - 0.5) * 0.35;
    const z = (Math.random() - 0.5) * (35 / (1 + r * 0.02)); // Thin disk
    points.push({
      x: r * Math.cos(theta),
      y: r * Math.sin(theta),
      z,
    });
  }
  return points;
}
```

### 2.3 Black Hole Accretion Disk & Event Horizon
A black hole contains three distinct geometric zones:
1. **Singularity & Event Horizon ($r < r_s$):** Pitch-black photon capture sphere with relativistic replenishment.
2. **Accretion Disk ($r_s < r < 4.5 r_s$):** Ultra-high orbital velocity swirling gas with Doppler beaming.
3. **Relativistic Polar Jets ($z \gg r$):** Narrow synchrotron outflow beams collimated along magnetic axis.

---

## 3. Physical Laws & Gravitational Behaviors

### 3.1 Standard Gravity vs. Cosmic Equilibrium
* **Standard Objects:** Follow Hooke's self-healing spring attraction $F = -k(r - r_0)$ and optional downward or planar gravity vector $g_y$.
* **Cosmic & Galaxy Objects:** Planetary downward gravity is **strictly zero** ($g = 0$). Instead, particles are governed by:
  * **Dark Matter Flat Rotation Curve:**
    $$v_c(r) = v_{\infty} \cdot \frac{r}{\sqrt{r^2 + r_c^2}}$$
    Unlike Keplerian orbital decay ($v \propto r^{-1/2}$), flat rotation curves prevent spiral galaxy arms from winding into disintegration.

### 3.2 Relativistic Black Hole Dynamics
* **Radial Singularity Pull:**
  $$F_r = \frac{G M}{r^2 + \epsilon^2}$$
* **Kerr Metric Frame-Dragging:**
  $$\vec{v}_{\text{drag}} = \frac{J}{r^{3/2}} (-\hat{y}, \hat{x})$$
* **Relativistic Jet Outflow:**
  Particles falling inside the ergosphere trigger high-velocity collimated expulsion along the $\pm \hat{z}$ polar axis.

### 3.3 Quantum Uncertainty & Orbital Mechanics
Objects marked with `behaviorType: 'quantum'` exhibit:
* **Heisenberg Stochastic Jitter:** Constant micro-impulse momentum dispersion $\Delta p \approx \frac{\hbar}{2 \Delta x}$.
* **Wavefunction Phase Breathing:** Orbital probability density cloud modulation $\psi_{nlm}(r, \theta, \phi) = R_{nl}(r) Y_l^m(\theta, \phi)$.

---

## 4. Surroundings & Cosmic Environment

Continuum provides a dual-layer cosmic background:
* **Focal Object Manifold:** Dense core particles adhering to the target locus.
* **Ambient Stellar Background:** In **Infinity Mode** ($\infty$), 22% of total particles (up to 14,000) are dynamically distributed into the outer deep-space ambient field (up to 6,000 units), establishing an infinite, boundless cosmic environment.
* **Toroidal Universe Wrap:** Any particle traversing past the cosmic horizon coordinates wraps seamlessly to the antipodal boundary:
  $$\text{if } |x| > R_{\text{bound}} \implies x \leftarrow -\operatorname{sgn}(x) R_{\text{bound}}$$

---

## 5. Particle Colors, Palettes & Species

### 5.1 Color Sources
Continuum supports 6 dynamic color calculation modes configured via the Pencil tool:
1. **Monochrome (Default High-Performance):** Solid slate `#f8fafc` (Dark Mode) or `#0f172a` (Light Mode), rendered via a single batched canvas path.
2. **Velocity:** Color shifts according to instantaneous kinetic velocity $||\vec{v}||$: cyan $\to$ electric blue $\to$ ultraviolet.
3. **Thermal:** Blackbody radiation formula: crimson $\to$ amber $\to$ incandescent white.
4. **Energy / Hamiltonian:** Hamiltonian energy state $H = T + V$.
5. **Dimension:** Multi-dimensional projection slice angle.
6. **Curated Palettes:** Laser Cyan, Electric Amber, Quantum Void, Supernova, Deep Nebula, or Emerald Matrix.

### 5.2 Fundamental Particle Species
In the **Particle Lab / Tweak Suite**, custom species can be applied:
* **Electrons ($e^-$):** Negative charge, cyan, high magnetic gyration.
* **Protons ($p^+$):** Positive charge, amber-red, massive inertial resistance.
* **Neutrons ($n^0$):** Neutral charge, neutral silver, strong nuclear binding.
* **Photons ($\gamma$):** Zero rest mass, golden yellow, speed-of-light propagation $c$.
* **Gluons ($g$):** Color charge exchange (red, green, blue).
* **Higgs Bosons ($H^0$):** High mass scalar coupling, ultraviolet luminescence.

---

## 6. How to Add a New Shape to Continuum

1. Open `src/engine/shapes/shapeRegistry.ts` (or the appropriate category sub-file).
2. Write your geometric locus generator function using parametric math:
```typescript
{
  id: 'stellar-nursery-orion',
  name: 'Orion Stellar Nursery',
  category: 'cosmic',
  behaviorType: 'galaxy',
  equation: '\\rho(r) = \\rho_0 / (1 + (r/r_c)^2)',
  description: 'A dense interstellar molecular cloud collapsing under self-gravity to form protostellar cores.',
  generatePoints: (count: number) => {
    const points = [];
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const r = Math.pow(u, 0.5) * 240;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.4;
      points.push({
        x: r * Math.cos(theta) * Math.cos(phi),
        y: r * Math.sin(theta) * Math.cos(phi),
        z: r * Math.sin(phi) * 0.6,
      });
    }
    return points;
  },
}
```
3. Add the definition to `SHAPES_REGISTRY`.
4. Compile using `compile_applet` to verify mathematical validity and performance.
