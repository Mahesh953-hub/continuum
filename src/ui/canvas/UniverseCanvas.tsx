/**
 * Continuum Fullscreen Simulation Canvas Viewport
 * Handles WebGL/Canvas2D initialization, touch/pointer gesture arbitration,
 * camera pan/zoom in Hand mode, and particle blasts vs Canon impulses.
 */

import React, { useEffect, useRef } from 'react';
import { UniverseEngine } from '../../engine/simulation/UniverseEngine';
import { useUniverseStore } from '../../state/useUniverseStore';

export const UniverseCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<UniverseEngine | null>(null);

  // Zustand Store selectors
  const {
    handMode,
    canonMode,
    canon,
    activeShapeId,
    activePresetId,
    particleCount,
    physics,
    healing,
    dimensionConfig,
    appearance,
    camera,
    updateCamera,
    setPerformanceMetrics,
  } = useUniverseStore();

  // Gesture state tracking
  const isPointerDownRef = useRef<boolean>(false);
  const pointerStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);

  // Initialize Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new UniverseEngine(canvas);
    engineRef.current = engine;

    engine.onMetricsUpdate = (fps, count) => {
      setPerformanceMetrics(fps, count);
    };

    const handleResize = () => {
      engine.resize(window.innerWidth, window.innerHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    engine.start();

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, [setPerformanceMetrics]);

  // Sync state changes to engine instance
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.handMode = handMode;
    engine.physics = physics;
    engine.healing = healing;
    engine.dimensionConfig = dimensionConfig;
    engine.appearance = appearance;
    engine.canon = canon;
    engine.camera = camera;
    engine.activePresetId = activePresetId;
  }, [handMode, physics, healing, dimensionConfig, appearance, canon, camera, activePresetId]);

  // Shape transition
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.transitionToShape(activeShapeId);
  }, [activeShapeId]);

  // Particle count adjustment
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.initParticles(particleCount);
  }, [particleCount]);

  // Helper to map screen client coordinates to universe coordinates
  const screenToUniverse = (clientX: number, clientY: number) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const zoom = camera.zoom;
    const universeX = (clientX - width / 2) / zoom + camera.x;
    const universeY = (clientY - height / 2) / zoom + camera.y;
    return { universeX, universeY };
  };

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Only primary button
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isPointerDownRef.current = true;
    pointerStartPosRef.current = { x: e.clientX, y: e.clientY };
    cameraStartPosRef.current = { x: camera.x, y: camera.y };

    const { universeX, universeY } = screenToUniverse(e.clientX, e.clientY);

    // If Canon mode active -> fire Canon
    if (canonMode) {
      engineRef.current?.fireCanon(universeX, universeY);
      return;
    }

    // If Hand mode is OFF -> direct particle blast
    if (!handMode) {
      engineRef.current?.applyBlast(universeX, universeY, 130, 3.2);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;

    const { universeX, universeY } = screenToUniverse(e.clientX, e.clientY);

    // If Hand mode is ON: drag pans the camera
    if (handMode) {
      const dx = (e.clientX - pointerStartPosRef.current.x) / camera.zoom;
      const dy = (e.clientY - pointerStartPosRef.current.y) / camera.zoom;
      updateCamera({
        x: cameraStartPosRef.current.x - dx,
        y: cameraStartPosRef.current.y - dy,
      });
      return;
    }

    // If Hand mode is OFF and Canon is OFF -> continuous swipe disturbance
    if (!canonMode) {
      engineRef.current?.applyBlast(universeX, universeY, 90, 1.8);
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    touchDistanceRef.current = null;
  };

  // Wheel zoom around cursor
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.909;
    const newZoom = Math.max(0.2, Math.min(6.0, camera.zoom * zoomFactor));

    // Zoom toward pointer coordinate
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mouseX = e.clientX - width / 2;
    const mouseY = e.clientY - height / 2;

    const newCamX = camera.x + mouseX / camera.zoom - mouseX / newZoom;
    const newCamY = camera.y + mouseY / camera.zoom - mouseY / newZoom;

    updateCamera({ zoom: newZoom, x: newCamX, y: newCamY });
  };

  // Multi-touch pinch-to-zoom support
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

      if (touchDistanceRef.current !== null) {
        const ratio = dist / touchDistanceRef.current;
        const newZoom = Math.max(0.2, Math.min(6.0, camera.zoom * ratio));
        updateCamera({ zoom: newZoom });
      }
      touchDistanceRef.current = dist;
    }
  };

  return (
    <canvas
      id="continuum-universe-canvas"
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      className={`fixed inset-0 w-full h-full block touch-none select-none z-0 ${
        canonMode ? 'cursor-crosshair' : handMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    />
  );
};
