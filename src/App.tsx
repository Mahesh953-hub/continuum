/**
 * Continuum: Mathematical Living Particle Universe
 * Authoritative Application Entry Component
 */

import React, { useEffect } from 'react';
import { UniverseCanvas } from './ui/canvas/UniverseCanvas';
import { PrimaryControls } from './ui/controls/PrimaryControls';
import { CanonMiniMenu } from './ui/canon/CanonMiniMenu';
import { PencilMenu } from './ui/pencil/PencilMenu';
import { ParticleLabModal } from './ui/lab/ParticleLabModal';
import { FloatingHints } from './ui/hints/FloatingHints';
import { UniverseFooter } from './ui/common/UniverseFooter';
import { GitHubButton } from './ui/common/GitHubButton';
import { useUniverseStore } from './state/useUniverseStore';

export default function App() {
  const { theme, setTheme, labModalOpen, setLabModalOpen } = useUniverseStore();

  // Initialize theme from system or browser preference (Section 2.3)
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  return (
    <main
      id="continuum-root-viewport"
      className="relative w-screen h-screen overflow-hidden bg-[var(--bg-universe)] select-none touch-none"
    >
      {/* Fullscreen Mathematical Living Particle Simulation Viewport */}
      <UniverseCanvas />

      {/* Primary 4 Controls (Hand, Pencil, Random, Canon) */}
      <PrimaryControls />

      {/* Canon Targeting & Impulse Mini-Menu */}
      <CanonMiniMenu />

      {/* Pencil Comprehensive Universe Architect & Configuration Modal */}
      <PencilMenu />

      {/* Particle Physics Laboratory & Tweak Experimentation Suite */}
      <ParticleLabModal isOpen={labModalOpen} onClose={() => setLabModalOpen(false)} />

      {/* Randomized Contextual Math Discovery Hints */}
      <FloatingHints />

      {/* Technical Identity Footer */}
      <UniverseFooter />

      {/* Bottom Right Repository Link */}
      <GitHubButton />
    </main>
  );
}
