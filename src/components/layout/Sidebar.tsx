/**
 * Sidebar Component
 *
 * Navigation sidebar showing curriculum phases and lessons.
 */

import { type Component, For, createSignal } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import './Sidebar.css';

interface Phase {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  lessons: { id: string; title: string }[];
}

// Curriculum phases (will be moved to curriculum module later)
const phases: Phase[] = [
  {
    id: 1,
    title: 'Classical World',
    subtitle: 'Its Cracks',
    color: 'var(--teal)',
    lessons: [
      { id: 'laplace-demon', title: "Laplace's Demon" },
      { id: 'maxwell-triumph', title: "Maxwell's Triumph" },
      { id: 'uv-catastrophe', title: 'The UV Catastrophe' },
      { id: 'photoelectric-puzzle', title: 'The Photoelectric Puzzle' },
    ],
  },
  {
    id: 2,
    title: 'Quantization',
    subtitle: 'Emerges',
    color: 'var(--green)',
    lessons: [
      { id: 'planck-desperate', title: "Planck's Desperate Act" },
      { id: 'einstein-photons', title: "Einstein's Photons" },
      { id: 'discrete-continuous', title: 'Discrete vs Continuous' },
      { id: 'matter-waves', title: 'Matter Waves' },
    ],
  },
  {
    id: 3,
    title: 'Quantum Mechanics',
    subtitle: 'Proper',
    color: 'var(--coral)',
    lessons: [
      { id: 'bohr-atom', title: "Bohr's Atom" },
      { id: 'atomic-orbitals', title: 'Atomic Orbitals' },
      { id: 'uncertainty', title: 'Uncertainty Principle' },
      { id: 'wave-function', title: 'The Wave Function' },
      { id: 'superposition', title: 'Superposition' },
      { id: 'double-slit', title: 'The Double Slit' },
      { id: 'measurement', title: 'The Measurement Problem' },
    ],
  },
  {
    id: 4,
    title: 'Entropy',
    subtitle: 'Decoherence',
    color: 'var(--accent)',
    lessons: [
      { id: 'boltzmann', title: "Boltzmann's Insight" },
      { id: 'thermodynamics', title: 'Thermodynamic Connections' },
      { id: 'shannon', title: "Shannon's Surprise" },
      { id: 'entropy-connection', title: 'The Deep Connection' },
      { id: 'decoherence', title: 'Decoherence' },
    ],
  },
  {
    id: 5,
    title: 'Many-Worlds',
    subtitle: 'Interpretation',
    color: 'var(--lavender)',
    lessons: [
      { id: 'copenhagen', title: "Copenhagen's Story" },
      { id: 'collapse-problems', title: 'Problems with Collapse' },
      { id: 'schrodinger-serious', title: 'Taking Schrödinger Seriously' },
      { id: 'branching', title: 'Branching Reality' },
      { id: 'no-branches', title: "Why We Don't See Branches" },
    ],
  },
];

export const Sidebar: Component = () => {
  const location = useLocation();
  const [expandedPhase, setExpandedPhase] = createSignal<number | null>(1);

  const togglePhase = (phaseId: number) => {
    setExpandedPhase(expandedPhase() === phaseId ? null : phaseId);
  };

  const isActive = (lessonId: string) => {
    return location.pathname === `/lesson/${lessonId}`;
  };

  return (
    <aside class="sidebar">
      <div class="sidebar-header">
        <A href="/" class="sidebar-logo">
          <span class="logo-icon">Q</span>
          <span class="logo-text">Quantum Intuition</span>
        </A>
      </div>

      <nav class="sidebar-nav">
        <For each={phases}>
          {(phase) => (
            <div class="phase-group">
              <button
                class="phase-header"
                classList={{ expanded: expandedPhase() === phase.id }}
                onClick={() => togglePhase(phase.id)}
                style={{ '--phase-color': phase.color }}
              >
                <span class="phase-number">{phase.id}</span>
                <div class="phase-info">
                  <span class="phase-title">{phase.title}</span>
                  <span class="phase-subtitle">{phase.subtitle}</span>
                </div>
                <span class="phase-chevron">›</span>
              </button>

              <div
                class="phase-lessons"
                classList={{ expanded: expandedPhase() === phase.id }}
              >
                <For each={phase.lessons}>
                  {(lesson) => (
                    <A
                      href={`/lesson/${lesson.id}`}
                      class="lesson-link"
                      classList={{ active: isActive(lesson.id) }}
                      style={{ '--phase-color': phase.color }}
                    >
                      {lesson.title}
                    </A>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </nav>

      <div class="sidebar-footer">
        <A href="/settings" class="sidebar-link">Settings</A>
        <A href="/glossary" class="sidebar-link">Glossary</A>
      </div>
    </aside>
  );
};

export default Sidebar;
