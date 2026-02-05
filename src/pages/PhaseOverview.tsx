/**
 * Phase Overview Page
 *
 * Shows all lessons in a curriculum phase with descriptions.
 */

import { type Component } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import './PhaseOverview.css';

const PhaseOverview: Component = () => {
  const params = useParams();

  return (
    <div class="phase-overview">
      <header class="phase-header">
        <span class="phase-badge">Phase {params.phaseId}</span>
        <h1>Phase Overview</h1>
        <p class="phase-description">
          This page will show the lessons and learning objectives for Phase{' '}
          {params.phaseId}.
        </p>
      </header>

      <div class="coming-soon">
        <p>Phase content coming soon...</p>
        <A href="/" class="back-link">
          ← Back to Dashboard
        </A>
      </div>
    </div>
  );
};

export default PhaseOverview;
