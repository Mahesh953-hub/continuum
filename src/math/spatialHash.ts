/**
 * High-Performance Spatial Hash for O(1) Neighbor and Proximity Queries
 */

import { ParticleInternal } from '../types';

export class SpatialHash {
  private cellSize: number;
  private grid: Map<string, number[]>;

  constructor(cellSize: number = 60) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  public setCellSize(size: number) {
    this.cellSize = Math.max(10, size);
  }

  public clear() {
    this.grid.clear();
  }

  private getKey(cx: number, cy: number): string {
    return `${cx},${cy}`;
  }

  public insert(particleId: number, x: number, y: number) {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const key = this.getKey(cx, cy);

    let list = this.grid.get(key);
    if (!list) {
      list = [];
      this.grid.set(key, list);
    }
    list.push(particleId);
  }

  public queryRadius(
    x: number,
    y: number,
    radius: number,
    particles: ParticleInternal[]
  ): ParticleInternal[] {
    const rSq = radius * radius;
    const minCx = Math.floor((x - radius) / this.cellSize);
    const maxCx = Math.floor((x + radius) / this.cellSize);
    const minCy = Math.floor((y - radius) / this.cellSize);
    const maxCy = Math.floor((y + radius) / this.cellSize);

    const result: ParticleInternal[] = [];

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        const list = this.grid.get(this.getKey(cx, cy));
        if (list) {
          for (let i = 0; i < list.length; i++) {
            const id = list[i];
            const p = particles[id];
            if (p) {
              const dx = p.x - x;
              const dy = p.y - y;
              if (dx * dx + dy * dy <= rSq) {
                result.push(p);
              }
            }
          }
        }
      }
    }

    return result;
  }
}
