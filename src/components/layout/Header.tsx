/**
 * Header Component
 *
 * Top navigation bar with breadcrumbs, progress indicator, and auth button.
 */

import { type Component, createSignal } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import { AuthButton } from '../auth/AuthButton';
import { LoginModal } from '../auth/LoginModal';
import { getTotalCompleted } from '../../stores/progress';
import './Header.css';

const TOTAL_LESSONS = 24;

export const Header: Component = () => {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = createSignal(false);

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

  const completedCount = () => getTotalCompleted();
  const progressPercent = () => (completedCount() / TOTAL_LESSONS) * 100;

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
            <div class="progress-fill" style={{ width: `${progressPercent()}%` }} />
          </div>
          <span class="progress-text">{completedCount()}/{TOTAL_LESSONS}</span>
        </div>

        <AuthButton onSignInClick={() => setShowLoginModal(true)} />
      </div>

      {/* Login modal — rendered here so it floats above everything */}
      <LoginModal show={showLoginModal()} onClose={() => setShowLoginModal(false)} />
    </header>
  );
};

export default Header;
