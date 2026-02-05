/**
 * Maxwell's Triumph — Lesson Component
 *
 * Phase 1, Lesson 2: The unification of electricity, magnetism, and light.
 * Maxwell's prediction of the speed of light from electromagnetic constants.
 */

import { type Component, Show } from 'solid-js';
import { A } from '@solidjs/router';
import { markLessonComplete, progressState } from '../../stores/progress';
import MaxwellSimulation from './MaxwellSimulation';
import './index.css';

const LESSON_ID = 'maxwell-triumph';

const MaxwellTriumphLesson: Component = () => {
  return (
    <div class="lesson-view">
      <header class="lesson-header">
        <A href="/" class="back-link">
          ← Dashboard
        </A>
        <div class="lesson-meta">
          <span class="lesson-phase">Phase 1</span>
          <h1>Maxwell's Triumph</h1>
          <p class="lesson-subtitle">
            Unifying light, electricity, and magnetism
          </p>
        </div>
      </header>

      <div class="lesson-content">
        <section class="lesson-intro">
          <h2>Three Mysteries Become One</h2>
          <p>
            In the 1860s, physics had three seemingly separate mysteries:
            electricity (lightning, static shocks), magnetism (compass needles,
            lodestones), and light (the stuff from the sun). They appeared to
            follow different rules, governed by different laws.
          </p>
          <p>
            James Clerk Maxwell changed everything. He discovered that a changing
            electric field creates a magnetic field, and a changing magnetic
            field creates an electric field. These coupled fields could sustain
            each other, propagating through space as a self-reinforcing wave.
          </p>
          <p>
            When Maxwell calculated the speed of these electromagnetic waves
            using only laboratory measurements of electric and magnetic
            constants (ε₀ and μ₀), he got a number suspiciously close to the
            known speed of light:
          </p>
          <blockquote>
            "This velocity is so nearly that of light that it seems we have
            strong reason to conclude that light itself... is an electromagnetic
            disturbance."
            <cite>— James Clerk Maxwell, 1865</cite>
          </blockquote>
          <p>
            The simulation below takes you through four stages: from the
            "separate worlds" of electricity and magnetism, through the key
            experimental discoveries, to the full electromagnetic wave.
            In Stage 4, watch the <strong>teal wave</strong> (electric field E)
            and <strong>coral wave</strong> (magnetic field B) travel together
            at the speed of light. Try adjusting ε₀ and μ₀ to see Maxwell's
            prediction emerge from these constants.
          </p>
        </section>

        <section class="simulation-section">
          <h2>Interactive Simulation</h2>
          <p class="simulation-intro">
            Watch electromagnetic waves propagate through space. Adjust the
            wavelength to explore the spectrum, or tweak the fundamental
            constants to see Maxwell's prediction in action.
          </p>

          <MaxwellSimulation />

          <div class="key-insights">
            <h3>Key Insights</h3>
            <ul>
              <li>
                <strong>c = 1/√(ε₀μ₀)</strong> — The speed of light emerges from
                electric and magnetic constants
              </li>
              <li>
                Light, radio waves, X-rays, and gamma rays are all
                electromagnetic waves — the same phenomenon at different
                wavelengths
              </li>
              <li>
                E and B fields oscillate perpendicular to each other and to the
                direction of travel
              </li>
              <li>
                Maxwell predicted this mathematically in 1865; Hertz confirmed
                it experimentally in 1887
              </li>
            </ul>
          </div>
        </section>

        <section class="lesson-next">
          <h2>What's Next?</h2>
          <p>
            Maxwell's equations were a triumph of 19th-century physics — elegant,
            complete, and confirmed by experiment. But they contained a hidden
            prediction that would unravel the classical worldview. When applied
            to hot, glowing objects, Maxwell's theory predicted something
            impossible: that they should emit infinite energy at short
            wavelengths.
          </p>
          <p>
            This was the <strong>ultraviolet catastrophe</strong>, and resolving
            it would require a radical new idea about the nature of energy
            itself.
          </p>

          <div class="lesson-complete-wrap">
            <Show
              when={progressState.completedLessons[LESSON_ID]}
              fallback={
                <button
                  class="btn-complete"
                  onClick={() => markLessonComplete(LESSON_ID)}
                >
                  Mark as Complete
                </button>
              }
            >
              <span class="lesson-completed-badge">✓ Completed</span>
            </Show>
          </div>

          <A href="/lesson/uv-catastrophe" class="next-lesson-link">
            Next: The UV Catastrophe →
          </A>
        </section>
      </div>
    </div>
  );
};

export default MaxwellTriumphLesson;
