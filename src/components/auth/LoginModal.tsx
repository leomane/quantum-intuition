/**
 * LoginModal
 *
 * A centered modal that gives the user two choices:
 *   1. Sign in with Google (persists progress to Firestore)
 *   2. Continue as Guest (progress stored locally only)
 *
 * Props:
 *   show     – whether the modal is visible
 *   onClose  – dismiss callback
 */

import { type Component, Show } from 'solid-js';
import { loginWithGoogle, loginAsGuest } from '../../stores/auth';
import './LoginModal.css';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

export const LoginModal: Component<LoginModalProps> = (props) => {
  const handleGoogle = async () => {
    await loginWithGoogle();
    props.onClose();
  };

  const handleGuest = () => {
    loginAsGuest();
    props.onClose();
  };

  return (
    <Show when={props.show}>
      {/* Backdrop */}
      <div class="modal-backdrop" onClick={props.onClose} />

      {/* Modal card */}
      <div class="modal-card" role="dialog" aria-modal="true" aria-label="Sign in">
        <button class="modal-close" onClick={props.onClose} aria-label="Close">
          ×
        </button>

        <div class="modal-icon">Q</div>

        <h2 class="modal-title">Continue your journey</h2>
        <p class="modal-subtitle">
          Sign in to save your progress across sessions, or jump in as a guest.
        </p>

        <div class="modal-actions">
          {/* Google sign-in */}
          <button class="btn-google" onClick={handleGoogle}>
            <svg class="btn-google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <div class="modal-divider">
            <span>or</span>
          </div>

          {/* Guest */}
          <button class="btn-guest" onClick={handleGuest}>
            Continue as Guest
          </button>
        </div>

        <p class="modal-note">
          Guest progress is saved in your browser only and won't sync across devices.
        </p>
      </div>
    </Show>
  );
};

export default LoginModal;
