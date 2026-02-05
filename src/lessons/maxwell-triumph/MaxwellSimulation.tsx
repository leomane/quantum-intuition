/**
 * Maxwell's Triumph — Multi-Stage Electromagnetic Wave Simulation
 *
 * Four progressive stages that build understanding:
 * 1. Separate Worlds - Static E and B fields shown separately
 * 2. The Coupling - How changing E creates B and vice versa
 * 3. The Source - Oscillating charge generating both fields
 * 4. The Wave - Full propagating EM wave with controls
 */

import { type Component, createSignal, createEffect, For, Show } from 'solid-js';
import { Canvas2D, PALETTE } from '../../simulations/shared';
import {
  ControlsPanel,
  Slider,
  Button,
} from '../../simulations/shared/Controls';
import {
  EPSILON_0,
  MU_0,
  SPEED_OF_LIGHT,
  DEFAULT_WAVELENGTH_NM,
  WAVELENGTH_MIN_NM,
  WAVELENGTH_MAX_NM,
  EPSILON_SLIDER_MIN,
  EPSILON_SLIDER_MAX,
  MU_SLIDER_MIN,
  MU_SLIDER_MAX,
  calculateSpeedOfLight,
  wavelengthToInfo,
  formatWavelength,
  formatSpeedOfLight,
} from './constants';
import type p5 from 'p5';
import './MaxwellSimulation.css';

// =============================================================================
// Stage definitions
// =============================================================================

interface Stage {
  id: string;
  title: string;
  description: string;
}

const STAGES: Stage[] = [
  {
    id: 'separate',
    title: 'Separate Worlds',
    description: 'Before Maxwell, electricity and magnetism seemed like completely different phenomena.',
  },
  {
    id: 'coupling',
    title: 'The Coupling',
    description: 'A changing electric field creates a magnetic field. A changing magnetic field creates an electric field. They sustain each other.',
  },
  {
    id: 'discoveries',
    title: 'The Discoveries',
    description: 'Two experiments revealed the deep connection: Oersted (1820) showed current creates magnetism. Faraday (1831) showed moving magnets create current.',
  },
  {
    id: 'wave',
    title: 'The Wave',
    description: 'Light, radio, X-rays — all electromagnetic waves. Maxwell calculated their speed from electric and magnetic constants.',
  },
];

// =============================================================================
// Component
// =============================================================================

const MaxwellSimulation: Component = () => {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [currentStage, setCurrentStage] = createSignal(0);
  const [playing, setPlaying] = createSignal(true);

  // Wave properties (Stage 4)
  const [wavelengthNm, setWavelengthNm] = createSignal(DEFAULT_WAVELENGTH_NM);
  const [epsilon, setEpsilon] = createSignal(EPSILON_0);
  const [mu, setMu] = createSignal(MU_0);
  const [lockC, setLockC] = createSignal(false); // When true, c stays constant, Z₀ changes

  // Stage 3: Discoveries interactivity
  const [currentOn, setCurrentOn] = createSignal(true);
  const [currentStrength, setCurrentStrength] = createSignal(1); // 0.2 to 2.0
  const [magnetOscillating, setMagnetOscillating] = createSignal(true);
  let lastMagnetY = 0; // For calculating velocity
  let magnetVelocity = 0;

  // Derived values
  const currentC = () => calculateSpeedOfLight(epsilon(), mu());
  const wavelengthInfo = () => wavelengthToInfo(wavelengthNm());
  const impedance = () => Math.sqrt(mu() / epsilon()); // Z₀ = √(μ₀/ε₀)
  const IMPEDANCE_0 = Math.sqrt(MU_0 / EPSILON_0); // ~377 Ω

  // Handlers for ε₀ and μ₀ that respect lockC mode
  const handleEpsilonChange = (newEpsilon: number) => {
    setEpsilon(newEpsilon);
    if (lockC()) {
      // Adjust μ₀ to keep c constant: c² = 1/(ε₀μ₀) → μ₀ = 1/(c²ε₀)
      const newMu = 1 / (SPEED_OF_LIGHT * SPEED_OF_LIGHT * newEpsilon);
      setMu(newMu);
    }
  };

  const handleMuChange = (newMu: number) => {
    setMu(newMu);
    if (lockC()) {
      // Adjust ε₀ to keep c constant: ε₀ = 1/(c²μ₀)
      const newEpsilon = 1 / (SPEED_OF_LIGHT * SPEED_OF_LIGHT * newMu);
      setEpsilon(newEpsilon);
    }
  };

  // Animation time
  let time = 0;

  const stage = () => STAGES[currentStage()];

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  const nextStage = () => {
    if (currentStage() < STAGES.length - 1) {
      setCurrentStage(currentStage() + 1);
      time = 0;
    }
  };

  const prevStage = () => {
    if (currentStage() > 0) {
      setCurrentStage(currentStage() - 1);
      time = 0;
    }
  };

  const resetToReality = () => {
    setEpsilon(EPSILON_0);
    setMu(MU_0);
  };

  // ---------------------------------------------------------------------------
  // Wavelength slider (logarithmic)
  // ---------------------------------------------------------------------------
  const logMin = Math.log10(WAVELENGTH_MIN_NM);
  const logMax = Math.log10(WAVELENGTH_MAX_NM);

  const wavelengthToSlider = (nm: number) =>
    (Math.log10(nm) - logMin) / (logMax - logMin);

  const sliderToWavelength = (val: number) =>
    Math.pow(10, logMin + val * (logMax - logMin));

  const [sliderValue, setSliderValue] = createSignal(
    wavelengthToSlider(DEFAULT_WAVELENGTH_NM)
  );

  createEffect(() => {
    setWavelengthNm(sliderToWavelength(sliderValue()));
  });

  // ---------------------------------------------------------------------------
  // p5.js setup and draw
  // ---------------------------------------------------------------------------
  const setup = (p: p5) => {
    p.background(...PALETTE.bg);
  };

  const draw = (p: p5) => {
    p.background(...PALETTE.bg);

    const stageId = STAGES[currentStage()].id;

    // Stage-specific animation speeds
    if (stageId === 'wave') {
      // Animation speed reflects frequency: f = c/λ
      // Normalized so default wavelength + default c = 1x speed
      const frequencyRatio = (currentC() / SPEED_OF_LIGHT) * (DEFAULT_WAVELENGTH_NM / wavelengthNm());
      time += 0.016 * frequencyRatio;
    } else if (stageId === 'coupling') {
      // Fixed 0.5x speed for Stage 2 - slower pace for understanding
      time += 0.016 * 0.5;
    } else {
      time += 0.016; // Normal speed for other stages
    }

    switch (stageId) {
      case 'separate':
        drawSeparateWorlds(p);
        break;
      case 'coupling':
        drawCoupling(p);
        break;
      case 'discoveries':
        drawDiscoveries(p);
        break;
      case 'wave':
        drawWave(p);
        break;
    }
  };

  // ---------------------------------------------------------------------------
  // Stage 1: Separate Worlds
  // ---------------------------------------------------------------------------
  function drawSeparateWorlds(p: p5) {
    const w = p.width;
    const h = p.height;
    const midX = w / 2;

    // Dividing line
    p.stroke(...PALETTE.textMuted, 100);
    p.strokeWeight(1);
    p.line(midX, 0, midX, h);

    // LEFT: Electric field from a point charge
    const chargeX = midX / 2;
    const chargeY = h / 2;

    // Draw field lines radiating outward
    p.stroke(...PALETTE.teal, 180);
    p.strokeWeight(2);
    const numLines = 12;
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const innerR = 20;
      const outerR = 120;
      const x1 = chargeX + Math.cos(angle) * innerR;
      const y1 = chargeY + Math.sin(angle) * innerR;
      const x2 = chargeX + Math.cos(angle) * outerR;
      const y2 = chargeY + Math.sin(angle) * outerR;
      p.line(x1, y1, x2, y2);

      // Arrowhead
      drawArrowhead(p, x2, y2, angle, PALETTE.teal);
    }

    // Draw positive charge
    p.fill(...PALETTE.teal);
    p.noStroke();
    p.ellipse(chargeX, chargeY, 24, 24);
    p.fill(...PALETTE.bg);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.textFont('Space Mono');
    p.text('+', chargeX, chargeY);

    // Label
    p.fill(...PALETTE.teal);
    p.textSize(14);
    p.text('Electric Field', chargeX, h - 30);
    p.textSize(11);
    p.fill(...PALETTE.textDim);
    p.text('from a charge', chargeX, h - 14);

    // RIGHT: Magnetic field from a bar magnet
    const magnetX = midX + midX / 2;
    const magnetY = h / 2;
    const magnetW = 80;
    const magnetH = 30;

    // Draw bar magnet
    p.noStroke();
    // North pole (red-ish)
    p.fill(180, 100, 100);
    p.rect(magnetX - magnetW / 2, magnetY - magnetH / 2, magnetW / 2, magnetH);
    // South pole (blue-ish)
    p.fill(100, 100, 180);
    p.rect(magnetX, magnetY - magnetH / 2, magnetW / 2, magnetH);

    // Labels on magnet
    p.fill(...PALETTE.text);
    p.textSize(12);
    p.text('N', magnetX - magnetW / 4, magnetY);
    p.text('S', magnetX + magnetW / 4, magnetY);

    // Draw magnetic field lines (dipole pattern)
    p.stroke(...PALETTE.coral, 180);
    p.strokeWeight(2);
    p.noFill();

    // Field lines curving from N to S
    const fieldLines = [
      { startAngle: -0.3, curve: 60 },
      { startAngle: -0.15, curve: 40 },
      { startAngle: 0.15, curve: 40 },
      { startAngle: 0.3, curve: 60 },
    ];

    for (const fl of fieldLines) {
      // Top arc
      p.beginShape();
      for (let t = 0; t <= 1; t += 0.05) {
        const x = magnetX - magnetW / 2 + t * magnetW;
        const yOffset = -fl.curve * Math.sin(t * Math.PI);
        p.vertex(x, magnetY - magnetH / 2 + yOffset - 10);
      }
      p.endShape();

      // Bottom arc
      p.beginShape();
      for (let t = 0; t <= 1; t += 0.05) {
        const x = magnetX - magnetW / 2 + t * magnetW;
        const yOffset = fl.curve * Math.sin(t * Math.PI);
        p.vertex(x, magnetY + magnetH / 2 + yOffset + 10);
      }
      p.endShape();
    }

    // Label
    p.fill(...PALETTE.coral);
    p.noStroke();
    p.textSize(14);
    p.text('Magnetic Field', magnetX, h - 30);
    p.textSize(11);
    p.fill(...PALETTE.textDim);
    p.text('from a magnet', magnetX, h - 14);

    // Top labels
    p.fill(...PALETTE.textMuted);
    p.textSize(12);
    p.text('ELECTRICITY', chargeX, 25);
    p.text('MAGNETISM', magnetX, 25);
  }

  // ---------------------------------------------------------------------------
  // Stage 2: The Coupling
  // ---------------------------------------------------------------------------
  function drawCoupling(p: p5) {
    const w = p.width;
    const h = p.height;
    const centerX = w / 2;
    const centerY = h / 2;

    // Cycle through 4 phases
    const cycleTime = 4; // seconds per cycle
    const phase = (time % cycleTime) / cycleTime;
    const phaseIndex = Math.floor(phase * 4);

    // E and B magnitudes (oscillating 90° out of phase)
    const ePhase = phase * Math.PI * 2;
    const eMag = Math.sin(ePhase);
    const bMag = Math.cos(ePhase);

    // Draw coordinate system
    p.stroke(...PALETTE.textMuted, 60);
    p.strokeWeight(1);
    p.line(centerX - 150, centerY, centerX + 150, centerY);
    p.line(centerX, centerY - 120, centerX, centerY + 120);

    // E field arrow (vertical, teal)
    const eLen = eMag * 80;
    drawFieldArrow(p, centerX - 40, centerY, 0, eLen, PALETTE.teal, 'E');

    // B field arrow (horizontal, coral) - shown as "into/out of screen"
    const bSize = Math.abs(bMag) * 40;
    drawFieldCircle(p, centerX + 40, centerY, bSize, bMag > 0, PALETTE.coral, 'B');

    // Phase indicator ring
    p.noFill();
    p.stroke(...PALETTE.textMuted, 100);
    p.strokeWeight(2);
    p.ellipse(centerX, centerY + 140, 60, 60);

    // Phase dot
    const dotAngle = -Math.PI / 2 + phase * Math.PI * 2;
    const dotX = centerX + Math.cos(dotAngle) * 30;
    const dotY = centerY + 140 + Math.sin(dotAngle) * 30;
    p.fill(...PALETTE.accent);
    p.noStroke();
    p.ellipse(dotX, dotY, 10, 10);

    // Explanation text based on phase
    const explanations = [
      { text: 'E field is maximum, B field is zero', sub: 'E is about to decrease...' },
      { text: 'E is decreasing → creates B field', sub: 'Changing E induces B' },
      { text: 'B field is maximum, E field is zero', sub: 'B is about to decrease...' },
      { text: 'B is decreasing → creates E field', sub: 'Changing B induces E' },
    ];

    const exp = explanations[phaseIndex];
    p.fill(...PALETTE.text);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.text(exp.text, centerX, 35);
    p.fill(...PALETTE.textDim);
    p.textSize(12);
    p.text(exp.sub, centerX, 55);

    // Coupling arrows
    if (phaseIndex === 1 || phaseIndex === 3) {
      p.stroke(...PALETTE.accent, 150);
      p.strokeWeight(2);
      if (phaseIndex === 1) {
        // E → B arrow
        drawCurvedArrow(p, centerX - 20, centerY - 30, centerX + 20, centerY - 30, -20);
      } else {
        // B → E arrow
        drawCurvedArrow(p, centerX + 20, centerY + 30, centerX - 20, centerY + 30, 20);
      }
    }

    // Labels
    p.fill(...PALETTE.textMuted);
    p.textSize(11);
    p.noStroke();
    p.text('One complete cycle', centerX, h - 20);
  }

  // ---------------------------------------------------------------------------
  // Stage 3: The Discoveries (Oersted + Faraday)
  // ---------------------------------------------------------------------------
  function drawDiscoveries(p: p5) {
    const w = p.width;
    const h = p.height;
    const midX = w / 2;

    // Dividing line
    p.stroke(...PALETTE.textMuted, 60);
    p.strokeWeight(1);
    p.line(midX, 30, midX, h - 30);

    // === LEFT PANEL: OERSTED (1820) ===
    drawOerstedPanel(p, 0, midX);

    // === RIGHT PANEL: FARADAY (1831) ===
    drawFaradayPanel(p, midX, w);

    // Panel titles
    p.fill(...PALETTE.textMuted);
    p.noStroke();
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(11);
    p.textFont('Space Mono');
    p.text('OERSTED (1820)', midX / 2, 12);
    p.text('FARADAY (1831)', midX + midX / 2, 12);
  }

  function drawOerstedPanel(p: p5, left: number, right: number) {
    const centerX = (left + right) / 2;
    const centerY = p.height / 2;
    const h = p.height;
    const isOn = currentOn();
    const strength = currentStrength();

    // Wire (vertical)
    p.stroke(...PALETTE.textMuted, 180);
    p.strokeWeight(6);
    p.line(centerX, centerY - 100, centerX, centerY + 100);

    // Current flow animation (electrons moving through wire)
    if (isOn) {
      p.fill(...PALETTE.accent);
      p.noStroke();
      // More dots and faster movement for stronger current
      const numDots = Math.floor(6 + strength * 4);
      const dotSpeed = 1 + strength * 0.8;
      const dotSize = 6 + strength * 2;
      for (let i = 0; i < numDots; i++) {
        const t = ((time * dotSpeed + i / numDots) % 1);
        const dotY = centerY - 100 + t * 200;
        p.ellipse(centerX, dotY, dotSize, dotSize);
      }

      // Magnetic field circles (right-hand rule)
      // Field radius and intensity scale with current strength
      const maxRadius = 50 + strength * 35; // 50-120 based on strength
      const numRings = Math.floor(2 + strength * 2); // 2-6 rings
      for (let r = 1; r <= numRings; r++) {
        const radius = (r / numRings) * maxRadius;
        // Alpha scales with current strength
        const baseAlpha = 100 + strength * 60;
        const alpha = Math.max(50, baseAlpha - r * 25);

        // Animate field appearance
        const fieldStrength = Math.min(1, time * 2);
        const animatedRadius = radius * fieldStrength;

        if (animatedRadius > 10) {
          p.stroke(...PALETTE.coral, alpha);
          // Line thickness scales with strength
          p.strokeWeight(1.5 + strength * 0.5);
          p.noFill();
          p.ellipse(centerX, centerY, animatedRadius * 2, animatedRadius * 2);

          // Direction indicators (dots showing field coming out on left, going in on right)
          if (r === Math.ceil(numRings / 2) || r === numRings) {
            // Left side: field coming out (dot)
            const indicatorSize = 4 + strength * 2;
            p.fill(...PALETTE.coral, alpha);
            p.noStroke();
            p.ellipse(centerX - animatedRadius, centerY, indicatorSize, indicatorSize);

            // Right side: field going in (X)
            p.stroke(...PALETTE.coral, alpha);
            p.strokeWeight(1 + strength * 0.5);
            const xSize = 2 + strength * 1.5;
            p.line(centerX + animatedRadius - xSize, centerY - xSize,
                   centerX + animatedRadius + xSize, centerY + xSize);
            p.line(centerX + animatedRadius + xSize, centerY - xSize,
                   centerX + animatedRadius - xSize, centerY + xSize);
          }
        }
      }
    }

    // Current direction arrow
    const arrowColor = isOn ? PALETTE.accent : PALETTE.textMuted;
    p.stroke(arrowColor[0], arrowColor[1], arrowColor[2]);
    p.strokeWeight(2);
    const arrowY = centerY - 120;
    p.line(centerX - 20, arrowY, centerX + 20, arrowY);
    p.line(centerX, arrowY - 15, centerX, arrowY + 15);
    if (isOn) {
      drawArrowhead(p, centerX, arrowY + 15, Math.PI / 2, PALETTE.accent);
      p.fill(...PALETTE.accent);
    } else {
      p.fill(...PALETTE.textMuted);
    }
    p.noStroke();
    p.textSize(10);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(isOn ? 'Current ON' : 'Current OFF', centerX, arrowY - 18);

    // Caption
    p.fill(...PALETTE.text);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(11);
    if (isOn) {
      const strengthLabel = strength < 0.7 ? 'Weak' : strength > 1.4 ? 'Strong' : 'Medium';
      p.text(`${strengthLabel} current → ${strengthLabel.toLowerCase()} B field`, centerX, h - 50);
      p.fill(...PALETTE.coral);
      p.textSize(10);
      p.text('B ∝ I (proportional)', centerX, h - 35);
    } else {
      p.fill(...PALETTE.textDim);
      p.text('No current, no magnetic field', centerX, h - 42);
    }
  }

  function drawFaradayPanel(p: p5, left: number, right: number) {
    const centerX = (left + right) / 2;
    const centerY = p.height / 2;
    const h = p.height;

    // Magnet position - oscillate if toggle is on
    const isOscillating = magnetOscillating();
    const magnetYOffset = isOscillating ? Math.sin(time * 3) * 40 : 0;
    const magnetYPos = centerY - 60 + magnetYOffset;
    const magnetW = 60;
    const magnetH = 24;

    // Calculate velocity for induced current effect
    const currentMagnetY = magnetYOffset / 40; // Normalize to -1 to 1
    magnetVelocity = (currentMagnetY - lastMagnetY) * 60;
    lastMagnetY = currentMagnetY;

    // Draw bar magnet
    p.noStroke();
    // North pole (red)
    p.fill(180, 80, 80);
    p.rect(centerX - magnetW / 2, magnetYPos - magnetH / 2, magnetW / 2, magnetH, 3, 0, 0, 3);
    // South pole (blue)
    p.fill(80, 80, 180);
    p.rect(centerX, magnetYPos - magnetH / 2, magnetW / 2, magnetH, 0, 3, 3, 0);

    // Pole labels
    p.fill(...PALETTE.text);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(10);
    p.text('N', centerX - magnetW / 4, magnetYPos);
    p.text('S', centerX + magnetW / 4, magnetYPos);

    // Wire coil below magnet
    const coilY = centerY + 50;
    const coilW = 80;
    const coilH = 40;
    const numLoops = 5;

    p.stroke(...PALETTE.textMuted, 180);
    p.strokeWeight(3);
    p.noFill();

    // Draw coil loops (side view - horizontal ellipses stacked)
    for (let i = 0; i < numLoops; i++) {
      const loopX = centerX - coilW / 2 + (i + 0.5) * (coilW / numLoops);
      p.ellipse(loopX, coilY, 12, coilH);
    }

    // Current induced by moving magnet
    const isMoving = isOscillating && Math.abs(magnetVelocity) > 0.3;
    const inducedCurrent = magnetVelocity * 0.3;

    if (isMoving) {
      // Glow effect on coil
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      ctx.shadowColor = `rgb(${PALETTE.accent[0]}, ${PALETTE.accent[1]}, ${PALETTE.accent[2]})`;
      ctx.shadowBlur = 15;

      p.stroke(...PALETTE.accent, 200);
      p.strokeWeight(4);
      for (let i = 0; i < numLoops; i++) {
        const loopX = centerX - coilW / 2 + (i + 0.5) * (coilW / numLoops);
        p.ellipse(loopX, coilY, 12, coilH);
      }

      ctx.shadowBlur = 0;

      // Current flow indicators
      p.fill(...PALETTE.accent);
      p.noStroke();
      const flowDir = inducedCurrent > 0 ? 1 : -1;
      for (let i = 0; i < 3; i++) {
        const t = ((time * 2 * flowDir + i / 3) % 1 + 1) % 1;
        const flowX = centerX - coilW / 2 + t * coilW;
        p.ellipse(flowX, coilY - coilH / 2 + 5, 6, 6);
        p.ellipse(flowX, coilY + coilH / 2 - 5, 6, 6);
      }
    }

    // Status label above magnet
    p.fill(...PALETTE.textDim);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(10);
    if (isOscillating) {
      p.fill(...PALETTE.accent);
      p.text('Magnet oscillating', centerX, magnetYPos - magnetH / 2 - 50);
    } else {
      p.text('Magnet stationary', centerX, magnetYPos - magnetH / 2 - 15);
    }

    // Caption
    p.textSize(11);
    if (isMoving) {
      p.fill(...PALETTE.text);
      p.text('Moving magnet creates current!', centerX, h - 50);
      p.fill(...PALETTE.teal);
      p.textSize(10);
      p.text('Changing B induces E (current)', centerX, h - 35);
    } else {
      p.fill(...PALETTE.textDim);
      p.text('Stationary magnet = no current', centerX, h - 42);
    }
  }

  // ---------------------------------------------------------------------------
  // Stage 4: The Wave
  // ---------------------------------------------------------------------------
  function drawWave(p: p5) {
    const w = p.width;
    const h = p.height;
    const centerY = h / 2;

    // Speed ratio affects wave animation speed (frequency visualization)
    const speedRatio = currentC() / SPEED_OF_LIGHT;
    const isModified = Math.abs(speedRatio - 1) > 0.01;

    // Map wavelength slider to visual cycles (shorter wavelength = more cycles)
    // sliderValue goes from 0 (short wavelength/UV) to 1 (long wavelength/radio)
    const minCycles = 1.5;  // At longest wavelength
    const maxCycles = 4;    // At shortest wavelength
    const numCycles = maxCycles - sliderValue() * (maxCycles - minCycles);
    const visualWavelength = w / numCycles;

    const amplitude = h * 0.28;
    const k = (2 * Math.PI) / visualWavelength;
    // Animation speed scales with c - this visualizes frequency change!
    // f = c/λ, so if c doubles, frequency doubles (wave oscillates faster)
    const omega = k * speedRatio * 80;

    // Draw axis
    p.stroke(...PALETTE.textMuted, 60);
    p.strokeWeight(1);
    p.line(0, centerY, w, centerY);

    // Enable glow
    const ctx = p.drawingContext as CanvasRenderingContext2D;

    // Draw E field (teal, vertical)
    drawGlowingWave(p, ctx, {
      amplitude,
      k,
      omega,
      time,
      centerY,
      width: w,
      color: PALETTE.teal,
      vertical: true,
    });

    // Draw B field (coral, phase-shifted)
    drawGlowingWave(p, ctx, {
      amplitude: amplitude * 0.6,
      k,
      omega,
      time,
      centerY,
      width: w,
      color: PALETTE.coral,
      vertical: false,
    });

    ctx.shadowBlur = 0;

    // Field labels with expanded names
    p.fill(...PALETTE.teal);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.text('E (electric)', 12, centerY - amplitude * 0.8);

    p.fill(...PALETTE.coral);
    p.text('B (magnetic)', 12, centerY + amplitude * 0.7);

    // Wavelength marker
    drawWavelengthMarker(p, 50, 50 + visualWavelength, centerY + amplitude + 25);

    // === Speed of light display (top-right) ===
    drawSpeedDisplay(p, w - 15, 15, currentC(), isModified);

    // Propagation arrow with dynamic label
    p.stroke(...PALETTE.textMuted);
    p.strokeWeight(2);
    p.line(w - 80, centerY, w - 30, centerY);
    drawArrowhead(p, w - 30, centerY, 0, PALETTE.textMuted);
    p.noStroke();
    p.fill(...PALETTE.textDim);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text('propagation', w - 55, centerY + 8);
  }

  // Speed display overlay for Stage 4
  function drawSpeedDisplay(p: p5, x: number, y: number, c: number, isModified: boolean) {
    const panelW = 155;
    const panelH = isModified ? 58 : 42;

    // Determine color based on speed comparison
    // Red = slower than light, Green = faster than light, Blue = equal to light
    const ratio = c / SPEED_OF_LIGHT;
    let borderColor: readonly [number, number, number];
    let textColor: readonly [number, number, number];

    if (Math.abs(ratio - 1) < 0.01) {
      // Equal to our universe (blue/teal)
      borderColor = PALETTE.teal;
      textColor = PALETTE.teal;
    } else if (ratio > 1) {
      // Faster than light (green)
      borderColor = PALETTE.success;
      textColor = PALETTE.success;
    } else {
      // Slower than light (red/coral)
      borderColor = PALETTE.coral;
      textColor = PALETTE.coral;
    }

    // Background panel
    p.fill(13, 12, 10, 230);
    p.stroke(borderColor[0], borderColor[1], borderColor[2], isModified ? 200 : 150);
    p.strokeWeight(1.5);
    p.rect(x - panelW, y, panelW, panelH, 6);

    // "WAVE SPEED" label
    p.fill(...PALETTE.textDim);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(9);
    p.textFont('Space Mono');
    p.text('WAVE SPEED', x - panelW + 10, y + 8);

    // Speed value
    const speedStr = formatSpeedOfLight(c);
    p.fill(textColor[0], textColor[1], textColor[2]);
    p.textSize(12);
    p.text(`c = ${speedStr}`, x - panelW + 10, y + 22);

    // Percentage difference (only if modified)
    if (isModified) {
      const pctDiff = (ratio - 1) * 100;
      const diffStr = pctDiff > 0 ? `+${pctDiff.toFixed(0)}%` : `${pctDiff.toFixed(0)}%`;
      p.fill(...PALETTE.textDim);
      p.textSize(9);
      p.text(`${diffStr} vs reality`, x - panelW + 10, y + 40);
    }
  }

  // ---------------------------------------------------------------------------
  // Drawing helpers
  // ---------------------------------------------------------------------------

  function drawArrowhead(
    p: p5,
    x: number,
    y: number,
    angle: number,
    color: readonly [number, number, number],
    alpha: number = 255
  ) {
    p.push();
    p.translate(x, y);
    p.rotate(angle);
    p.fill(color[0], color[1], color[2], alpha);
    p.noStroke();
    p.triangle(0, 0, -8, -4, -8, 4);
    p.pop();
  }

  function drawFieldArrow(
    p: p5,
    x: number,
    y: number,
    _angle: number,
    length: number,
    color: readonly [number, number, number],
    label: string
  ) {
    if (Math.abs(length) < 5) {
      // Draw small dot when near zero
      p.fill(color[0], color[1], color[2], 100);
      p.noStroke();
      p.ellipse(x, y, 8, 8);
    } else {
      p.stroke(color[0], color[1], color[2]);
      p.strokeWeight(4);
      p.line(x, y, x, y - length);
      drawArrowhead(p, x, y - length, length > 0 ? -Math.PI / 2 : Math.PI / 2, color);
    }

    // Label
    p.fill(color[0], color[1], color[2]);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.textFont('Space Mono');
    p.text(label, x, y + 60);
  }

  function drawFieldCircle(
    p: p5,
    x: number,
    y: number,
    size: number,
    outOfPage: boolean,
    color: readonly [number, number, number],
    label: string,
    alpha: number = 255
  ) {
    p.stroke(color[0], color[1], color[2], alpha);
    p.strokeWeight(2);
    p.noFill();
    p.ellipse(x, y, size * 2, size * 2);

    if (size > 5) {
      p.fill(color[0], color[1], color[2], alpha);
      p.noStroke();
      if (outOfPage) {
        // Dot (coming out)
        p.ellipse(x, y, 6, 6);
      } else {
        // X (going in)
        p.stroke(color[0], color[1], color[2], alpha);
        p.strokeWeight(2);
        const s = size * 0.5;
        p.line(x - s, y - s, x + s, y + s);
        p.line(x + s, y - s, x - s, y + s);
      }
    }

    if (label) {
      p.fill(color[0], color[1], color[2], alpha);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.text(label, x, y + 60);
    }
  }

  function drawCurvedArrow(
    p: p5,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    curve: number
  ) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 + curve;

    // Draw curved line using bezier
    p.noFill();
    p.bezier(x1, y1, midX, midY, midX, midY, x2, y2);

    // Arrowhead
    const angle = Math.atan2(y2 - midY, x2 - midX);
    drawArrowhead(p, x2, y2, angle, PALETTE.accent);
  }

  interface GlowWaveParams {
    amplitude: number;
    k: number;
    omega: number;
    time: number;
    centerY: number;
    width: number;
    color: readonly [number, number, number];
    vertical: boolean;
  }

  function drawGlowingWave(p: p5, ctx: CanvasRenderingContext2D, params: GlowWaveParams) {
    const { amplitude, k, omega, time, centerY, width, color, vertical } = params;

    ctx.shadowColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.shadowBlur = 15;

    // Glow layer
    p.noFill();
    p.stroke(color[0], color[1], color[2], 100);
    p.strokeWeight(6);

    p.beginShape();
    for (let x = 0; x <= width; x += 3) {
      const phase = k * x - omega * time;
      const y = vertical
        ? centerY + amplitude * Math.sin(phase)
        : centerY + amplitude * Math.cos(phase);
      p.vertex(x, y);
    }
    p.endShape();

    // Core layer
    ctx.shadowBlur = 6;
    p.stroke(color[0], color[1], color[2], 255);
    p.strokeWeight(2);

    p.beginShape();
    for (let x = 0; x <= width; x += 3) {
      const phase = k * x - omega * time;
      const y = vertical
        ? centerY + amplitude * Math.sin(phase)
        : centerY + amplitude * Math.cos(phase);
      p.vertex(x, y);
    }
    p.endShape();
  }

  function drawWavelengthMarker(p: p5, startX: number, endX: number, y: number) {
    p.stroke(...PALETTE.textDim);
    p.strokeWeight(1);
    p.line(startX, y - 5, startX, y + 5);
    p.line(endX, y - 5, endX, y + 5);
    p.line(startX, y, endX, y);

    p.noStroke();
    p.fill(...PALETTE.textDim);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text('λ', (startX + endX) / 2, y + 6);
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div class="maxwell-simulation">
      {/* Stage navigation tabs */}
      <div class="stage-tabs">
        <For each={STAGES}>
          {(s, i) => (
            <button
              class="stage-tab"
              classList={{ active: currentStage() === i() }}
              onClick={() => { setCurrentStage(i()); time = 0; }}
            >
              <span class="stage-number">{i() + 1}</span>
              <span class="stage-title">{s.title}</span>
            </button>
          )}
        </For>
      </div>

      {/* Stage description */}
      <p class="stage-description">{stage().description}</p>

      {/* Stage 4: Definitions panel */}
      <Show when={currentStage() === 3}>
        <div class="definitions-panel">
          <div class="definition-item">
            <span class="def-symbol">ε₀</span>
            <span class="def-name">Permittivity</span>
            <span class="def-desc">How much space "resists" electric fields. Higher ε₀ = fields spread slower.</span>
          </div>
          <div class="definition-item">
            <span class="def-symbol">μ₀</span>
            <span class="def-name">Permeability</span>
            <span class="def-desc">How much space "supports" magnetic fields. Higher μ₀ = stronger magnetic response.</span>
          </div>
          <div class="definition-item">
            <span class="def-symbol">Z₀</span>
            <span class="def-name">Impedance</span>
            <span class="def-desc">The "resistance" of space to EM waves. Z₀ = √(μ₀/ε₀) ≈ 377 Ω in our universe.</span>
          </div>
        </div>
      </Show>

      <div class="simulation-layout">
        <div class="simulation-canvas-wrap">
          <Canvas2D
            width={600}
            height={400}
            setup={setup}
            draw={draw}
            paused={!playing()}
          />
        </div>

        <aside class="simulation-controls">
          {/* Stage 1: Explanatory legend */}
          <Show when={currentStage() === 0}>
            <ControlsPanel title="What You're Seeing">
              <div class="stage1-legend">
                <div class="legend-item">
                  <div class="legend-color" style={{ background: 'var(--teal)' }} />
                  <div class="legend-content">
                    <span class="legend-title">Electric Field</span>
                    <span class="legend-text">Lines radiate from charges</span>
                  </div>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style={{ background: 'var(--coral)' }} />
                  <div class="legend-content">
                    <span class="legend-title">Magnetic Field</span>
                    <span class="legend-text">Lines loop between poles</span>
                  </div>
                </div>
              </div>
              <p class="stage1-hint">
                Before Maxwell, these were thought to be completely unrelated forces.
                One came from charges, the other from magnets — two separate worlds.
              </p>
            </ControlsPanel>
          </Show>

          {/* Stage 2: Coupling - play/pause only, no speed control */}
          <Show when={currentStage() === 1}>
            <ControlsPanel title="Reading the Diagram">
              <div class="coupling-legend">
                <div class="legend-section">
                  <div class="legend-header">
                    <span class="legend-symbol e-field">E</span>
                    <span class="legend-name">Electric Field</span>
                  </div>
                  <p class="legend-desc">
                    Shown as a vertical arrow. Points up or down in the plane of the screen.
                  </p>
                </div>

                <div class="legend-section">
                  <div class="legend-header">
                    <span class="legend-symbol b-field">B</span>
                    <span class="legend-name">Magnetic Field</span>
                  </div>
                  <p class="legend-desc">
                    Points into or out of the screen (perpendicular to E).
                  </p>
                  <div class="b-direction-guide">
                    <div class="direction-item">
                      <span class="direction-icon out-of-screen" />
                      <span class="direction-label">Out of screen (toward you)</span>
                    </div>
                    <div class="direction-item">
                      <span class="direction-icon into-screen" />
                      <span class="direction-label">Into screen (away from you)</span>
                    </div>
                  </div>
                </div>

                <div class="legend-insight">
                  <p>
                    Watch the phase indicator circle — when E is changing most rapidly,
                    B reaches its peak (and vice versa). They're 90° out of phase!
                  </p>
                </div>

                <div class="coupling-playback">
                  <Button
                    variant={playing() ? 'secondary' : 'primary'}
                    onClick={() => setPlaying(!playing())}
                  >
                    {playing() ? '⏸ Pause' : '▶ Play'}
                  </Button>
                </div>
              </div>
            </ControlsPanel>
          </Show>

          {/* Stage 3: Discoveries controls - compact layout */}
          <Show when={currentStage() === 2}>
            <ControlsPanel title="Try It Yourself">
              <div class="experiments-grid">
                <div class="experiment-box">
                  <span class="experiment-label">Oersted (left)</span>
                  <button
                    class="current-toggle compact"
                    classList={{ active: currentOn() }}
                    onClick={() => setCurrentOn(!currentOn())}
                  >
                    <span class="toggle-indicator" />
                    <span class="toggle-label">
                      {currentOn() ? 'ON' : 'OFF'}
                    </span>
                  </button>
                  <Show when={currentOn()}>
                    <Slider
                      label="Strength"
                      value={currentStrength()}
                      onChange={setCurrentStrength}
                      min={0.2}
                      max={2}
                      step={0.1}
                      precision={1}
                    />
                  </Show>
                </div>
                <div class="experiment-box">
                  <span class="experiment-label">Faraday (right)</span>
                  <button
                    class="current-toggle compact"
                    classList={{ active: magnetOscillating() }}
                    onClick={() => setMagnetOscillating(!magnetOscillating())}
                  >
                    <span class="toggle-indicator" />
                    <span class="toggle-label">
                      {magnetOscillating() ? 'Moving' : 'Still'}
                    </span>
                  </button>
                </div>
              </div>
            </ControlsPanel>

            <ControlsPanel title="Key Relationships">
              <div class="relationships-compact">
                <div class="relationship-row">
                  <span class="relationship-cause">Current</span>
                  <span class="relationship-arrow">creates</span>
                  <span class="relationship-effect">B field</span>
                </div>
                <div class="relationship-row">
                  <span class="relationship-cause">Moving B</span>
                  <span class="relationship-arrow">creates</span>
                  <span class="relationship-effect">Current</span>
                </div>
              </div>
              <p class="unification-note">
                Maxwell saw that these are two sides of the same coin — the <em>electromagnetic</em> force.
              </p>
            </ControlsPanel>
          </Show>

          {/* Stage 4 specific controls - compact layout */}
          <Show when={currentStage() === 3}>
            <ControlsPanel title="Wavelength">
              <div class="wavelength-control-compact">
                <input
                  type="range"
                  class="slider-input"
                  min={0}
                  max={1}
                  step={0.001}
                  value={sliderValue()}
                  onInput={(e) => setSliderValue(parseFloat(e.currentTarget.value))}
                />
                <div class="wavelength-range-labels">
                  <span>UV</span>
                  <span>Visible</span>
                  <span>IR</span>
                  <span>Radio</span>
                </div>
                <div class="wavelength-readout">
                  <span class="wavelength-value">{formatWavelength(wavelengthNm())}</span>
                  <span
                    class="wavelength-region"
                    style={{
                      'background-color': wavelengthInfo().isVisible
                        ? `rgb(${wavelengthInfo().rgb.join(',')})`
                        : 'transparent',
                      border: wavelengthInfo().isVisible
                        ? 'none'
                        : '1px solid var(--text-muted)',
                    }}
                  >
                    {wavelengthInfo().label}
                  </span>
                </div>
              </div>
            </ControlsPanel>

            <ControlsPanel title="Properties of Space">
              <div class="mode-toggle-row">
                <button
                  class="mode-toggle"
                  classList={{ active: !lockC() }}
                  onClick={() => setLockC(false)}
                  title="Change ε₀ or μ₀ to see how the speed of light changes"
                >
                  Vary c
                </button>
                <button
                  class="mode-toggle"
                  classList={{ active: lockC() }}
                  onClick={() => setLockC(true)}
                  title="Keep c constant while varying the impedance Z₀"
                >
                  Lock c
                </button>
              </div>

              <div class="properties-grid">
                <div class="property-compact">
                  <div class="property-header-compact">
                    <span class="property-symbol">ε₀</span>
                  </div>
                  <Slider
                    label=""
                    value={epsilon()}
                    onChange={handleEpsilonChange}
                    min={EPSILON_SLIDER_MIN}
                    max={EPSILON_SLIDER_MAX}
                    precision={2}
                    showValue={false}
                  />
                  <span class="property-value-compact">{(epsilon() / 1e-12).toFixed(1)}×10⁻¹²</span>
                </div>
                <div class="property-compact">
                  <div class="property-header-compact">
                    <span class="property-symbol">μ₀</span>
                  </div>
                  <Slider
                    label=""
                    value={mu()}
                    onChange={handleMuChange}
                    min={MU_SLIDER_MIN}
                    max={MU_SLIDER_MAX}
                    precision={2}
                    showValue={false}
                  />
                  <span class="property-value-compact">{(mu() / 1e-6).toFixed(2)}×10⁻⁶</span>
                </div>
              </div>

              <Show when={!lockC()}>
                <div class="equation-inline">
                  <span class="equation-formula">c = 1/√(ε₀μ₀)</span>
                  <span class="equation-result">= {formatSpeedOfLight(currentC())}</span>
                </div>
                <Show when={Math.abs(currentC() - SPEED_OF_LIGHT) > 1000}>
                  <div class="speed-delta">
                    {currentC() > SPEED_OF_LIGHT
                      ? `+${((currentC() / SPEED_OF_LIGHT - 1) * 100).toFixed(0)}%`
                      : `${((currentC() / SPEED_OF_LIGHT - 1) * 100).toFixed(0)}%`}
                    {' '}vs reality
                  </div>
                </Show>
              </Show>

              <Show when={lockC()}>
                <div class="equation-inline locked">
                  <span class="equation-formula">c = {formatSpeedOfLight(SPEED_OF_LIGHT)}</span>
                  <span class="equation-result">(locked)</span>
                </div>
                <div class="impedance-display">
                  <span class="impedance-label">Z₀ = √(μ₀/ε₀)</span>
                  <span class="impedance-value">= {impedance().toFixed(0)} Ω</span>
                </div>
                <Show when={Math.abs(impedance() - IMPEDANCE_0) > 1}>
                  <div class="speed-delta">
                    {impedance() > IMPEDANCE_0
                      ? `+${((impedance() / IMPEDANCE_0 - 1) * 100).toFixed(0)}%`
                      : `${((impedance() / IMPEDANCE_0 - 1) * 100).toFixed(0)}%`}
                    {' '}impedance vs reality
                  </div>
                </Show>
              </Show>

              <Button variant="ghost" onClick={resetToReality}>
                Reset to Our Universe
              </Button>
            </ControlsPanel>
          </Show>

          {/* Navigation buttons */}
          <div class="stage-navigation">
            <Button
              variant="secondary"
              onClick={prevStage}
              disabled={currentStage() === 0}
            >
              ← Previous
            </Button>
            <Button
              variant="primary"
              onClick={nextStage}
              disabled={currentStage() === STAGES.length - 1}
            >
              Next →
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MaxwellSimulation;
