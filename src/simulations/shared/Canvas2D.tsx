/**
 * Canvas2D Component
 *
 * SolidJS wrapper for p5.js canvas rendering.
 * Provides a reactive interface for 2D physics simulations.
 */

import { onMount, onCleanup, createEffect, type Component, type JSX } from 'solid-js';
import type p5 from 'p5';

export interface Canvas2DProps {
  /** Setup function called once when canvas initializes */
  setup?: (p: p5) => void;
  /** Draw function called every frame */
  draw?: (p: p5) => void;
  /** Canvas width (default: 800) */
  width?: number;
  /** Canvas height (default: 600) */
  height?: number;
  /** Additional CSS class */
  class?: string;
  /** Additional inline styles */
  style?: JSX.CSSProperties;
  /** Reactive parameters that should trigger re-initialization */
  params?: Record<string, unknown>;
  /** Whether the simulation is paused */
  paused?: boolean;
  /** Frame rate (default: 60) */
  frameRate?: number;
}

/**
 * A SolidJS component that wraps p5.js for 2D canvas rendering.
 *
 * @example
 * ```tsx
 * <Canvas2D
 *   width={600}
 *   height={400}
 *   setup={(p) => {
 *     p.background(13, 12, 10);
 *   }}
 *   draw={(p) => {
 *     p.ellipse(p.mouseX, p.mouseY, 20, 20);
 *   }}
 * />
 * ```
 */
export const Canvas2D: Component<Canvas2DProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let p5Instance: p5 | undefined;

  onMount(async () => {
    if (!containerRef) return;

    // Dynamically import p5.js
    const p5Module = await import('p5');
    const P5 = p5Module.default;

    // Create p5 instance in instance mode
    p5Instance = new P5((p: p5) => {
      p.setup = () => {
        const canvas = p.createCanvas(props.width ?? 800, props.height ?? 600);
        canvas.parent(containerRef!);
        p.frameRate(props.frameRate ?? 60);

        // Call user's setup function
        props.setup?.(p);
      };

      p.draw = () => {
        if (props.paused) {
          return;
        }
        props.draw?.(p);
      };
    });
  });

  onCleanup(() => {
    p5Instance?.remove();
    p5Instance = undefined;
  });

  // Handle pause/resume reactively
  createEffect(() => {
    if (p5Instance) {
      if (props.paused) {
        p5Instance.noLoop();
      } else {
        p5Instance.loop();
      }
    }
  });

  // Handle resize reactively
  createEffect(() => {
    const width = props.width ?? 800;
    const height = props.height ?? 600;

    if (p5Instance) {
      p5Instance.resizeCanvas(width, height);
    }
  });

  return (
    <div
      ref={containerRef}
      class={`canvas-2d-container ${props.class ?? ''}`}
      style={{
        width: `${props.width ?? 800}px`,
        height: `${props.height ?? 600}px`,
        ...props.style,
      }}
    />
  );
};

// ============================================================================
// Utility Types for Simulations
// ============================================================================

/**
 * Parameters for controlling a simulation.
 */
export interface SimulationControls {
  /** Whether the simulation is paused */
  paused: boolean;
  /** Toggle pause state */
  togglePause: () => void;
  /** Reset the simulation to initial state */
  reset: () => void;
  /** Current simulation time */
  time: number;
  /** Time scale (1 = real-time, 0.5 = half-speed, etc.) */
  timeScale: number;
  /** Set time scale */
  setTimeScale: (scale: number) => void;
}

/**
 * Color palette matching the design system.
 * Use these in p5.js draw calls.
 */
export const PALETTE = {
  bg: [13, 12, 10] as const,
  bgElevated: [26, 24, 22] as const,
  text: [232, 228, 220] as const,
  textDim: [106, 101, 96] as const,
  textMuted: [74, 72, 69] as const,
  accent: [196, 163, 90] as const,
  teal: [90, 138, 135] as const,
  green: [122, 154, 106] as const,
  coral: [184, 122, 106] as const,
  lavender: [138, 122, 154] as const,
  success: [120, 140, 93] as const,
  error: [184, 106, 106] as const,
} as const;

/**
 * Helper to convert palette colors to p5.js color format.
 */
export function paletteColor(
  p: p5,
  colorName: keyof typeof PALETTE,
  alpha: number = 255
): p5.Color {
  const [r, g, b] = PALETTE[colorName];
  return p.color(r, g, b, alpha);
}

export default Canvas2D;
