/**
 * Lesson View Page
 *
 * Displays a single lesson with content, simulation, and exploration.
 */

import { type Component, createSignal } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import { Canvas2D, PALETTE } from '../simulations/shared';
import { ControlsPanel, Slider, Toggle, PlaybackControls } from '../simulations/shared/Controls';
import type p5 from 'p5';
import './LessonView.css';

const LessonView: Component = () => {
  const params = useParams<{ lessonId: string }>();

  // For now, we use the params to log the lesson ID (will be used for content lookup)
  console.log('Loading lesson:', params.lessonId);

  // Simulation state
  const [playing, setPlaying] = createSignal(true);
  const [numParticles, setNumParticles] = createSignal(10);
  const [showTrails, setShowTrails] = createSignal(true);
  const [speed, setSpeed] = createSignal(1);

  // Particle state (would normally be in a store/simulation module)
  let particles: { x: number; y: number; vx: number; vy: number }[] = [];

  const initParticles = (p: p5, count: number) => {
    particles = Array.from({ length: count }, () => ({
      x: p.random(50, p.width - 50),
      y: p.random(50, p.height - 50),
      vx: p.random(-2, 2),
      vy: p.random(-2, 2),
    }));
  };

  const setup = (p: p5) => {
    p.background(...PALETTE.bg);
    initParticles(p, numParticles());
  };

  const draw = (p: p5) => {
    // Semi-transparent background for trails effect
    if (showTrails()) {
      p.background(...PALETTE.bg, 25);
    } else {
      p.background(...PALETTE.bg);
    }

    // Update and draw particles
    p.noStroke();
    p.fill(...PALETTE.teal);

    for (const particle of particles) {
      // Update position
      particle.x += particle.vx * speed();
      particle.y += particle.vy * speed();

      // Bounce off walls
      if (particle.x < 10 || particle.x > p.width - 10) {
        particle.vx *= -1;
        particle.x = p.constrain(particle.x, 10, p.width - 10);
      }
      if (particle.y < 10 || particle.y > p.height - 10) {
        particle.vy *= -1;
        particle.y = p.constrain(particle.y, 10, p.height - 10);
      }

      // Draw particle
      p.ellipse(particle.x, particle.y, 12, 12);
    }

    // Draw info
    p.fill(...PALETTE.textDim);
    p.textFont('Space Mono');
    p.textSize(12);
    p.text(`Particles: ${particles.length}`, 15, 25);
    p.text(`t = ${(p.frameCount * 0.016 * speed()).toFixed(2)}s`, 15, 42);
  };

  const handleReset = () => {
    // Re-initialize will happen on next setup
    particles = [];
  };

  return (
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
        </section>

        <section class="simulation-section">
          <h2>Interactive Simulation</h2>
          <p class="simulation-intro">
            Observe how particles follow deterministic trajectories. The same
            initial conditions always produce the same outcome.
          </p>

          <div class="simulation-container">
            <Canvas2D
              width={600}
              height={400}
              setup={setup}
              draw={draw}
              paused={!playing()}
            />

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
                  onChange={(v) => {
                    setNumParticles(Math.round(v));
                  }}
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
          <A href="/lesson/maxwell-triumph" class="next-lesson-link">
            Next: Maxwell's Triumph →
          </A>
        </section>
      </div>
    </div>
  );
};

export default LessonView;
