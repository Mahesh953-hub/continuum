/**
 * Higher-Dimensional Projection Engine: 1D to 11D Projections
 */

export interface ProjectionMatrixOptions {
  dimension: number;
  time: number;
  angleXW?: number;
  angleYW?: number;
  angleZW?: number;
  focalLength?: number;
  type?: 'orthographic' | 'perspective' | 'stereographic' | 'calabi-yau' | 'clifford-torus' | 'hopf';
}

/**
 * Projects a point in N dimensions (up to 11D) into 2D plane coordinates (x, y).
 */
export function projectNDto2D(
  coords: number[],
  options: ProjectionMatrixOptions
): { x: number; y: number; scale: number; depth: number } {
  const { dimension, time, type = 'perspective' } = options;
  const focal = options.focalLength ?? 2.8;

  // 1D: Line along X
  if (dimension <= 1) {
    return { x: coords[0] || 0, y: 0, scale: 1, depth: 0 };
  }

  // 2D: Direct planar mapping
  if (dimension === 2) {
    return { x: coords[0] || 0, y: coords[1] || 0, scale: 1, depth: 0 };
  }

  // 3D: Rotated 3D to 2D
  if (dimension === 3) {
    const x = coords[0] || 0;
    const y = coords[1] || 0;
    const z = coords[2] || 0;

    // Gentle 3D rotation
    const rotY = time * 0.25;
    const rotX = time * 0.15;
    
    const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
    const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);

    const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
    const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

    const scale = focal / (focal + z2 * 0.003 + 2.0);
    return { x: x1 * scale, y: y2 * scale, scale, depth: z2 };
  }

  // 4D Projections (Tesseract, Clifford Torus, Hopf)
  if (dimension === 4) {
    const x = coords[0] || 0;
    const y = coords[1] || 0;
    const z = coords[2] || 0;
    const w = coords[3] || 0;

    const angleXW = options.angleXW ?? time * 0.4;
    const angleZW = options.angleZW ?? time * 0.3;

    // 4D plane rotations: X-W plane
    const cosXW = Math.cos(angleXW);
    const sinXW = Math.sin(angleXW);
    const x1 = x * cosXW - w * sinXW;
    const w1 = x * sinXW + w * cosXW;

    // Z-W plane rotation
    const cosZW = Math.cos(angleZW);
    const sinZW = Math.sin(angleZW);
    const z1 = z * cosZW - w1 * sinZW;
    const w2 = z * sinZW + w1 * cosZW;

    if (type === 'stereographic') {
      // 4D -> 3D stereographic from north pole (w = R)
      const R = 350;
      const denom = Math.max(1, R - w2);
      const px = (x1 * R) / denom;
      const py = (y * R) / denom;
      return { x: px, y: py, scale: R / denom, depth: w2 };
    }

    // 4D Perspective projection
    const distance4D = 400;
    const factor4D = distance4D / (distance4D + w2);
    const projX = x1 * factor4D;
    const projY = y * factor4D;
    const projZ = z1 * factor4D;

    // Then 3D to 2D
    const rot = time * 0.2;
    const rx = projX * Math.cos(rot) + projZ * Math.sin(rot);
    const rz = -projX * Math.sin(rot) + projZ * Math.cos(rot);
    const scale = focal / (focal + rz * 0.002 + 1.8);

    return { x: rx * scale, y: projY * scale, scale, depth: w2 };
  }

  // Higher Dimensions (5D to 11D - M-Theory compactifications and Calabi-Yau)
  // We project iteratively from D -> D-1 down to 2D with rotating hyper-angles
  let currentVec = [...coords];
  // Ensure array has at least dimension elements
  while (currentVec.length < dimension) {
    currentVec.push(0);
  }

  // Rotate adjacent hyperplanes with irrational angular frequency ratios
  const goldenFrequencies = [
    0.31, 0.47, 0.61, 0.79, 0.97, 1.13, 1.37, 1.61, 1.89, 2.11
  ];

  for (let d = dimension - 1; d >= 3; d--) {
    const angle = time * (goldenFrequencies[d % goldenFrequencies.length] || 0.5);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    
    // Rotate hyperplane (d, d-1)
    const vd = currentVec[d];
    const vPrev = currentVec[d - 1];
    currentVec[d - 1] = vPrev * cosA - vd * sinA;
    currentVec[d] = vPrev * sinA + vd * cosA;

    // Apply hyper-perspective collapse
    const hyperDist = 320 + d * 50;
    const factor = hyperDist / Math.max(50, hyperDist + currentVec[d]);
    for (let j = 0; j < d; j++) {
      currentVec[j] *= factor;
    }
  }

  // Project remaining 3D coordinates (currentVec[0], [1], [2]) to 2D
  const x = currentVec[0];
  const y = currentVec[1];
  const z = currentVec[2];
  const rot = time * 0.25;
  const rx = x * Math.cos(rot) + z * Math.sin(rot);
  const rz = -x * Math.sin(rot) + z * Math.cos(rot);
  const scale = focal / (focal + rz * 0.002 + 1.8);

  return { x: rx * scale, y: y * scale, scale, depth: z };
}
