/**
 * AppShell Component
 *
 * Main layout wrapper providing sidebar navigation and header.
 */

import { type Component, Suspense } from 'solid-js';
import { type RouteSectionProps } from '@solidjs/router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './AppShell.css';

export const AppShell: Component<RouteSectionProps> = (props) => {
  return (
    <div class="app-shell">
      <Sidebar />
      <div class="app-main">
        <Header />
        <main class="app-content">
          <Suspense fallback={<LoadingFallback />}>
            {props.children}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const LoadingFallback: Component = () => {
  return (
    <div class="loading-fallback">
      <div class="loading-spinner" />
      <p>Loading...</p>
    </div>
  );
};

export default AppShell;
