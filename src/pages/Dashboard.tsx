/**
 * Dashboard Page
 *
 * Landing page showing curriculum overview and progress.
 */

import { type Component, For } from 'solid-js';
import { A } from '@solidjs/router';
import './Dashboard.css';

interface PhaseCard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  lessons: number;
  completed: number;
}

const phases: PhaseCard[] = [
  {
    id: 1,
    title: 'The Classical World',
    subtitle: '& Its Cracks',
    description:
      "Explore the clockwork universe of Laplace and Maxwell's elegant unification of light, electricity, and magnetism. Then discover the experiments that shattered classical certainty.",
    color: 'var(--teal)',
    lessons: 4,
    completed: 0,
  },
  {
    id: 2,
    title: 'Quantization',
    subtitle: 'Emerges',
    description:
      "Planck's desperate hypothesis, Einstein's radical photons, and de Broglie's matter waves. The universe reveals its discrete, granular nature.",
    color: 'var(--green)',
    lessons: 4,
    completed: 0,
  },
  {
    id: 3,
    title: 'Quantum Mechanics',
    subtitle: 'Proper',
    description:
      "Schrödinger's equation, superposition, and the measurement problem. The mathematical framework that describes reality at its most fundamental level.",
    color: 'var(--coral)',
    lessons: 7,
    completed: 0,
  },
  {
    id: 4,
    title: 'Entropy',
    subtitle: '& Decoherence',
    description:
      "Boltzmann meets Shannon: the deep connection between thermodynamic and information entropy. Understanding decoherence is key to many-worlds.",
    color: 'var(--accent)',
    lessons: 5,
    completed: 0,
  },
  {
    id: 5,
    title: 'Many-Worlds',
    subtitle: 'Interpretation',
    description:
      "The destination: Everett's radical proposal that takes Schrödinger's equation seriously. Why reality branches, and why we don't notice.",
    color: 'var(--lavender)',
    lessons: 5,
    completed: 0,
  },
];

const Dashboard: Component = () => {
  return (
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Journey to Many Worlds</h1>
        <p class="dashboard-subtitle">
          From classical certainty to quantum multiplicity
        </p>
      </header>

      <section class="curriculum-overview">
        <h2>Your Learning Path</h2>
        <p class="section-description">
          A guided journey through the ideas that revolutionized our
          understanding of reality. Each phase builds on the last, leading to a
          deep understanding of quantum mechanics and the many-worlds
          interpretation.
        </p>

        <div class="phase-cards">
          <For each={phases}>
            {(phase) => (
              <A
                href={`/phase/${phase.id}`}
                class="phase-card"
                style={{ '--phase-color': phase.color }}
              >
                <div class="phase-card-header">
                  <span class="phase-number">{phase.id}</span>
                  <div class="phase-progress">
                    <span class="progress-text">
                      {phase.completed}/{phase.lessons}
                    </span>
                  </div>
                </div>
                <h3 class="phase-title">
                  {phase.title}
                  <span class="phase-subtitle">{phase.subtitle}</span>
                </h3>
                <p class="phase-description">{phase.description}</p>
                <div class="phase-card-footer">
                  <span class="lessons-count">{phase.lessons} lessons</span>
                  <span class="start-link">Begin →</span>
                </div>
              </A>
            )}
          </For>
        </div>
      </section>

      <section class="quick-start">
        <h2>Continue Learning</h2>
        <A href="/lesson/laplace-demon" class="continue-card">
          <div class="continue-info">
            <span class="continue-phase" style={{ color: 'var(--teal)' }}>
              Phase 1
            </span>
            <h3>Laplace's Demon</h3>
            <p>
              Begin your journey with the clockwork universe of classical
              determinism.
            </p>
          </div>
          <span class="continue-arrow">→</span>
        </A>
      </section>
    </div>
  );
};

export default Dashboard;
