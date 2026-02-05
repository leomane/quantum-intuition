/**
 * Header Component
 *
 * Top navigation bar with breadcrumbs and progress indicator.
 */

import { type Component } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import './Header.css';

export const Header: Component = () => {
  const location = useLocation();

  // Simple breadcrumb logic (will be enhanced later)
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') {
      return [{ label: 'Dashboard', href: '/' }];
    }
    if (path.startsWith('/lesson/')) {
      return [
        { label: 'Dashboard', href: '/' },
        { label: 'Lesson', href: path },
      ];
    }
    if (path.startsWith('/phase/')) {
      return [
        { label: 'Dashboard', href: '/' },
        { label: 'Phase', href: path },
      ];
    }
    return [{ label: 'Dashboard', href: '/' }];
  };

  return (
    <header class="app-header">
      <nav class="breadcrumbs">
        {getBreadcrumbs().map((crumb, index) => (
          <>
            {index > 0 && <span class="breadcrumb-separator">/</span>}
            <A href={crumb.href} class="breadcrumb-link">
              {crumb.label}
            </A>
          </>
        ))}
      </nav>

      <div class="header-actions">
        <div class="progress-indicator">
          <span class="progress-label">Progress</span>
          <div class="progress-bar">
            <div class="progress-fill" style={{ width: '15%' }} />
          </div>
          <span class="progress-text">3/24</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
