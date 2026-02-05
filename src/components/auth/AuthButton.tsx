/**
 * AuthButton
 *
 * Sits in the header.  Shows different states:
 *   - Loading spinner while Firebase checks auth
 *   - User avatar + name (with a click-to-sign-out dropdown) when signed in
 *   - "Sign in" ghost button when in guest mode
 */

import { type Component, createSignal, Show } from 'solid-js';
import { authState, logout } from '../../stores/auth';
import './AuthButton.css';

interface AuthButtonProps {
  /** Called when the guest user clicks "Sign in" */
  onSignInClick: () => void;
}

export const AuthButton: Component<AuthButtonProps> = (props) => {
  const [dropdownOpen, setDropdownOpen] = createSignal(false);

  // First letter of displayName for the avatar fallback
  const initials = () => {
    const name = authState.user?.displayName;
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div class="auth-button-wrap">
      {/* === Loading === */}
      <Show when={authState.loading}>
        <div class="auth-spinner" />
      </Show>

      {/* === Signed in === */}
      <Show when={!authState.loading && authState.user}>
        <button
          class="auth-avatar-btn"
          onClick={() => setDropdownOpen(!dropdownOpen())}
          aria-label={`Signed in as ${authState.user?.displayName}. Click for options.`}
        >
          <Show
            when={authState.user?.photoURL}
            fallback={<span class="auth-initials">{initials()}</span>}
          >
            <img
              class="auth-photo"
              src={authState.user!.photoURL!}
              alt={authState.user!.displayName ?? 'User'}
            />
          </Show>
          <span class="auth-name">{authState.user?.displayName?.split(' ')[0]}</span>
        </button>

        <Show when={dropdownOpen()}>
          <div class="auth-dropdown">
            <p class="auth-dropdown-name">{authState.user?.displayName}</p>
            <p class="auth-dropdown-email">{authState.user?.email}</p>
            <button class="auth-signout-btn" onClick={() => { logout(); setDropdownOpen(false); }}>
              Sign out
            </button>
          </div>
        </Show>
      </Show>

      {/* === Guest === */}
      <Show when={!authState.loading && !authState.user}>
        <button class="auth-signin-btn" onClick={props.onSignInClick}>
          Sign in
        </button>
      </Show>
    </div>
  );
};

export default AuthButton;
