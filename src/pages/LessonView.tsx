/**
 * Lesson View Page
 *
 * Routes to the appropriate lesson component based on lessonId.
 * Each lesson is lazy-loaded for code splitting.
 */

import { type Component, createSignal, Show, lazy, Suspense, Switch, Match } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import { Canvas2D, PALETTE } from '../simulations/shared';
import { ControlsPanel, Slider, Toggle, PlaybackControls } from '../simulations/shared/Controls';
import { TimelineScrubber } from '../simulations/shared/TimelineScrubber';
import { markLessonComplete, progressState } from '../stores/progress';
import type p5 from 'p5';
import './LessonView.css';

// Lazy-loaded lesson components
const MaxwellTriumphLesson = lazy(() => import('../lessons/maxwell-triumph'));

// ============================================================================
// Types & constants
// ============================================================================

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

type Snapshot = Particle[];

/** Frames of history to buffer (5 seconds at 60 fps) */
const HISTORY_MAX = 300;

// ============================================================================
// Component
// ============================================================================

const LessonView: Component = () => {
  const params = useParams<{ lessonId: string }>();
  console.log('Loading lesson:', params.lessonId);

  // --------------------------------------------------------------------------
  // UI state
  // --------------------------------------------------------------------------
  const [playing, setPlaying] = createSignal(true);
  const [numParticles, setNumParticles] = createSignal(10);
  const [showTrails, setShowTrails] = createSignal(true);
  const [speed, setSpeed] = createSignal(1);

  // --------------------------------------------------------------------------
  // History / rewind state (plain vars shared via closure with p5 draw loop)
  // --------------------------------------------------------------------------
  let history: Snapshot[] = [];
  let currentIndex = 0;
  let scrubbing = false;

  /** Reactive mirrors for the scrubber UI — updated each frame */
  const [scrubHistoryLength, setScrubHistoryLength] = createSignal(0);
  const [scrubCurrentIndex, setScrubCurrentIndex] = createSignal(0);

  // --------------------------------------------------------------------------
  // Particle helpers
  // --------------------------------------------------------------------------
  let particles: Particle[] = [];

  const snapshot = (): Snapshot =>
    particles.map((p) => ({ x: p.x, y: p.y, vx: p.vx, vy: p.vy }));

  const restoreSnapshot = (snap: Snapshot) => {
    particles = snap.map((p) => ({ ...p }));
  };

  const pushHistory = () => {
    history.push(snapshot());
    if (history.length > HISTORY_MAX) {
      history.shift();
    }
    currentIndex = history.length - 1;
    setScrubHistoryLength(history.length);
    setScrubCurrentIndex(currentIndex);
  };

  const initParticles = (p: p5, count: number) => {
    particles = Array.from({ length: count }, () => ({
      x: p.random(50, p.width - 50),
      y: p.random(50, p.height - 50),
      vx: p.random(-2, 2),
      vy: p.random(-2, 2),
    }));
    history = [];
    currentIndex = 0;
    pushHistory();
  };

  // --------------------------------------------------------------------------
  // p5 callbacks
  // --------------------------------------------------------------------------

  const setup = (p: p5) => {
    p.background(...PALETTE.bg);
    initParticles(p, numParticles());
  };

  const draw = (p: p5) => {
    // Background — disable trails while scrubbing so each frame is crisp
    if (showTrails() && !scrubbing) {
      p.background(...PALETTE.bg, 25);
    } else {
      p.background(...PALETTE.bg);
    }

    // Physics step — only when playing forward, never while scrubbing
    if (!scrubbing) {
      for (const particle of particles) {
        particle.x += particle.vx * speed();
        particle.y += particle.vy * speed();

        if (particle.x < 10 || particle.x > p.width - 10) {
          particle.vx *= -1;
          particle.x = p.constrain(particle.x, 10, p.width - 10);
        }
        if (particle.y < 10 || particle.y > p.height - 10) {
          particle.vy *= -1;
          particle.y = p.constrain(particle.y, 10, p.height - 10);
        }
      }
      pushHistory();
    }

    // Render particles — coral when scrubbing (visual cue: "you're in the past")
    p.noStroke();
    const c = scrubbing ? PALETTE.coral : PALETTE.teal;
    p.fill(c[0], c[1], c[2]);

    for (const particle of particles) {
      p.ellipse(particle.x, particle.y, 12, 12);
    }

    // HUD
    p.fill(...PALETTE.textDim);
    p.textFont('Space Mono');
    p.textSize(12);
    p.text(`Particles: ${particles.length}`, 15, 25);

    if (scrubbing) {
      p.fill(...PALETTE.coral);
      p.text('◀ REWOUND — release to resume', 15, 42);
    } else {
      p.text(`t = ${(currentIndex / 60).toFixed(2)}s`, 15, 42);
    }
  };

  // --------------------------------------------------------------------------
  // Scrubber callbacks
  // --------------------------------------------------------------------------

  const handleScrubStart = () => {
    scrubbing = true;
  };

  const handleScrub = (frameIndex: number) => {
    const clamped = Math.max(0, Math.min(frameIndex, history.length - 1));
    currentIndex = clamped;
    setScrubCurrentIndex(clamped);
    if (history[clamped]) {
      restoreSnapshot(history[clamped]);
    }
  };

  /** Release: truncate future history, resume from this moment */
  const handleScrubEnd = () => {
    scrubbing = false;
    history = history.slice(0, currentIndex + 1);
    setScrubHistoryLength(history.length);
    setScrubCurrentIndex(currentIndex);
    setPlaying(true);
  };

  // --------------------------------------------------------------------------
  // Reset
  // --------------------------------------------------------------------------

  const handleReset = () => {
    particles = [];
    history = [];
    currentIndex = 0;
    setScrubHistoryLength(0);
    setScrubCurrentIndex(0);
  };

  // --------------------------------------------------------------------------
  // Render — Laplace's Demon (inline)
  // --------------------------------------------------------------------------

  const LaplaceDemonContent = () => (
    <div class="lesson-view">
      <header class="lesson-header">
        <A href="/" class="back-link">
          ← Dashboard
        </A>
        <div class="lesson-meta">
          <span class="lesson-phase">Phase 1</span>
          <h1>Laplace's Demon</h1>
          <p class="lesson-subtitle">
            Classical determinism and the clockwork universe
          </p>
        </div>
      </header>

      <div class="lesson-content">
        <section class="lesson-intro">
          <h2>The Clockwork Universe</h2>
          <p>
            In 1814, Pierre-Simon Laplace described an intellect that, given the
            position and velocity of every particle in the universe, could
            compute the entire future (and past) of the cosmos.
          </p>
          <blockquote>
            "We may regard the present state of the universe as the effect of
            its past and the cause of its future."
            <cite>— Pierre-Simon Laplace</cite>
          </blockquote>
          <p>
            This is <strong>classical determinism</strong>: the idea that the
            universe operates like a perfect machine, with no true randomness.
            Watch the particles below — if you know their starting positions and
            velocities, you can predict exactly where they'll be at any future
            time.
          </p>
          <p>
            Try it yourself: <strong>drag the timeline below the simulation
            backwards</strong> to rewind into the past. The particles will turn
            coral. When you <strong>release</strong>, the simulation resumes
            forward from exactly that moment — the future is fully determined.
          </p>
        </section>

        <section class="simulation-section">
          <h2>Interactive Simulation</h2>
          <p class="simulation-intro">
            Particles follow deterministic trajectories. Rewind the timeline,
            then release — the future replays from any point in time.
          </p>

          <div class="simulation-container">
            <div class="simulation-canvas-wrap">
              <Canvas2D
                width={600}
                height={400}
                setup={setup}
                draw={draw}
                paused={!playing()}
              />

              <div class="timeline-wrap">
                <TimelineScrubber
                  historyLength={scrubHistoryLength()}
                  maxHistory={HISTORY_MAX}
                  currentIndex={scrubCurrentIndex()}
                  onScrubStart={handleScrubStart}
                  onScrub={handleScrub}
                  onScrubEnd={handleScrubEnd}
                />
              </div>
            </div>

            <aside class="simulation-controls">
              <ControlsPanel title="Controls">
                <PlaybackControls
                  playing={playing()}
                  onTogglePlay={() => setPlaying(!playing())}
                  onReset={handleReset}
                  speed={speed()}
                  onSpeedChange={setSpeed}
                />
                <Slider
                  label="Number of Particles"
                  value={numParticles()}
                  onChange={(v) => setNumParticles(Math.round(v))}
                  min={1}
                  max={50}
                  step={1}
                  precision={0}
                />
                <Toggle
                  label="Show Trails"
                  checked={showTrails()}
                  onChange={setShowTrails}
                />
              </ControlsPanel>

              <div class="key-insights">
                <h3>Key Insights</h3>
                <ul>
                  <li>Same initial conditions → same outcome (determinism)</li>
                  <li>Rewind and release: the future is always the same</li>
                  <li>Chaos is different from true randomness</li>
                  <li>This worldview dominated physics for 200+ years</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section class="lesson-next">
          <h2>What's Next?</h2>
          <p>
            Classical determinism seemed complete... until experiments revealed
            cracks in the clockwork. Next, we'll explore Maxwell's unification
            of light, electricity, and magnetism.
          </p>

          <div class="lesson-complete-wrap">
            <Show
              when={progressState.completedLessons['laplace-demon']}
              fallback={
                <button
                  class="btn-complete"
                  onClick={() => markLessonComplete('laplace-demon')}
                >
                  Mark as Complete
                </button>
              }
            >
              <span class="lesson-completed-badge">✓ Completed</span>
            </Show>
          </div>

          <A href="/lesson/maxwell-triumph" class="next-lesson-link">
            Next: Maxwell's Triumph →
          </A>
        </section>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // Route to appropriate lesson
  // --------------------------------------------------------------------------

  return (
    <Suspense fallback={<div class="lesson-loading">Loading lesson...</div>}>
      <Switch fallback={<LaplaceDemonContent />}>
        <Match when={params.lessonId === 'maxwell-triumph'}>
          <MaxwellTriumphLesson />
        </Match>
        <Match when={params.lessonId === 'laplace-demon'}>
          <LaplaceDemonContent />
        </Match>
      </Switch>
    </Suspense>
  );
};

export default LessonView;
