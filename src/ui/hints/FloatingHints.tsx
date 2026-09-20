/**
 * Continuum Floating Contextual Hints System
 * Satisfies Section 15:
 * - Appears at randomized safe positions
 * - Auto-dismisses after randomized durations
 * - Visible close 'x' icon per hint
 * - Non-blocking mathematical and universe insights
 */

import React, { useEffect } from 'react';
import { X, Sparkles, Lightbulb, Compass, Orbit, Layers } from 'lucide-react';
import { useUniverseStore } from '../../state/useUniverseStore';
import { HintItem } from '../../types';

const DISCOVERY_HINTS: Omit<HintItem, 'id' | 'xPercent' | 'yPercent' | 'durationMs'>[] = [
  {
    title: 'Self-Healing Equilibrium',
    formula: 'F_heal = -k(r - r_0)',
    body: 'Disrupted particles organically return to their mathematical rest configuration over time.',
    category: 'physics',
  },
  {
    title: 'Hand Mode Navigation',
    formula: 'Canon: Visual Only',
    body: 'In Hand mode, pan and zoom across space. Particle blasting is suppressed while Canon targeting stays operational.',
    category: 'control',
  },
  {
    title: 'Golden Angle Phyllotaxis',
    formula: 'θ = n × 137.508°',
    body: 'Vogel’s irrational phyllotactic spiral produces optimal non-overlapping particle packing.',
    category: 'math',
  },
  {
    title: 'Schwarzschild Horizon',
    formula: 'r_s = 2GM / c²',
    body: 'Matter passing the photon sphere orbits relativistically before being sheared into the accretion disk.',
    category: 'physics',
  },
  {
    title: '4D Tesseract Rotation',
    formula: 'SO(4) = SO(3) × SO(3)',
    body: 'Observe simultaneous double rotations across X-W and Z-W hyperplanes via stereographic projection.',
    category: 'dimension',
  },
  {
    title: 'Lorenz Chaos Butterfly',
    formula: 'D_Hausdorff ≈ 2.06',
    body: 'A deterministic non-periodic flow exhibiting sensitive dependence on initial conditions.',
    category: 'math',
  },
  {
    title: 'Canon Pulse Modes',
    formula: 'Impulse Vector J = ∫ F dt',
    body: 'Open Canon to switch between Tri-Burst, Continuous Laser, and Radial kinetic impulses.',
    category: 'canon',
  },
];

export const FloatingHints: React.FC = () => {
  const { activeHints, addHint, removeHint, hintsEnabled, setHintsEnabled } = useUniverseStore();

  // Periodic hint scheduler with generous delay & cooldown between hints (no flooding/spam)
  useEffect(() => {
    if (!hintsEnabled) {
      activeHints.forEach((h) => removeHint(h.id));
      return;
    }

    let lastDismissTime = 0;

    const interval = setInterval(() => {
      const now = Date.now();
      // Ensure at least 35s cooldown since the previous hint was dismissed
      if (now - lastDismissTime < 35000) return;
      // Strict constraint: at most 1 hint displayed at any single moment
      if (activeHints.length >= 1) return;

      const randomTemplate = DISCOVERY_HINTS[Math.floor(Math.random() * DISCOVERY_HINTS.length)];
      // Safe position boundaries (avoid top-right control area and bottom footer)
      const xPercent = Math.floor(Math.random() * 36) + 8; // 8% to 44% from left
      const yPercent = Math.floor(Math.random() * 36) + 22; // 22% to 58% from top
      const durationMs = 10000; // 10 seconds visible duration

      const newHint: HintItem = {
        ...randomTemplate,
        id: `hint-${Date.now()}-${Math.random()}`,
        xPercent,
        yPercent,
        durationMs,
      };

      addHint(newHint);

      // Auto-dismiss timer
      setTimeout(() => {
        removeHint(newHint.id);
        lastDismissTime = Date.now();
      }, durationMs);
    }, 45000); // 45s between interval evaluations for deliberate, peaceful discovery

    return () => clearInterval(interval);
  }, [activeHints.length, addHint, removeHint, hintsEnabled]);

  if (!hintsEnabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none">
      {activeHints.map((hint) => (
        <div
          key={hint.id}
          style={{
            left: `${hint.xPercent}%`,
            top: `${hint.yPercent}%`,
          }}
          className="absolute max-w-[280px] sm:max-w-xs p-3.5 rounded-2xl bg-[#0c0f17]/90 dark:bg-[#0c0f17]/90 text-white backdrop-blur-xl border border-white/12 shadow-[0_12px_30px_rgba(0,0,0,0.5)] pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-300"
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
              {hint.category === 'dimension' ? (
                <Layers className="w-3.5 h-3.5 text-violet-400" />
              ) : hint.category === 'physics' ? (
                <Orbit className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Compass className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>{hint.title}</span>
            </div>
            {/* Mandatory Close 'x' icon per Section 15 */}
            <button
              type="button"
              onClick={() => removeHint(hint.id)}
              className="p-1 -mr-1 -mt-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss hint"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {hint.formula && (
            <div className="text-[10px] font-mono-math text-emerald-300/90 bg-black/40 px-2 py-0.5 rounded-md mb-1.5 inline-block">
              {hint.formula}
            </div>
          )}

          <p className="text-xs text-white/70 leading-relaxed mb-2">{hint.body}</p>

          <div className="flex items-center justify-end pt-1.5 border-t border-white/8">
            <button
              type="button"
              onClick={() => setHintsEnabled(false)}
              className="text-[10px] text-white/40 hover:text-amber-400 transition-colors"
            >
              Don&apos;t show hints
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
