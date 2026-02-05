/**
 * Quantum Intuition - Main Application
 *
 * A learning application for building deep understanding of quantum mechanics
 * and the many-worlds interpretation.
 */

import { Router, Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import { AppShell } from './components/layout/AppShell';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PhaseOverview = lazy(() => import('./pages/PhaseOverview'));
const LessonView = lazy(() => import('./pages/LessonView'));

function App() {
  return (
    <Router root={AppShell}>
      <Route path="/" component={Dashboard} />
      <Route path="/phase/:phaseId" component={PhaseOverview} />
      <Route path="/lesson/:lessonId" component={LessonView} />
    </Router>
  );
}

export default App;
