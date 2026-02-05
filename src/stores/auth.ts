/**
 * Auth Store
 *
 * Manages authentication state for the app.
 * Supports Google OAuth sign-in and an anonymous guest mode.
 *
 * Guest mode stores progress in localStorage only.
 * Signed-in users get progress synced to Firestore.
 */

import { createStore } from 'solid-js/store';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase';

// ============================================================================
// Store shape
// ============================================================================

/**
 * Plain-object snapshot of a Firebase User.
 *
 * Firebase's User is a class with getters — SolidJS's Proxy-based store
 * cannot observe those.  We extract the fields we need into a plain object
 * so reactivity works correctly.
 */
export interface UserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface AuthState {
  /** Plain-object user info, or null */
  user: UserInfo | null;
  /** True while we're waiting for the initial auth check */
  loading: boolean;
  /** True when the user chose "Continue as Guest" */
  isGuest: boolean;
}

/** Extract reactive-safe fields from a Firebase User */
function toUserInfo(u: User): UserInfo {
  return {
    uid: u.uid,
    displayName: u.displayName,
    email: u.email,
    photoURL: u.photoURL,
  };
}

// ============================================================================
// Reactive store
// ============================================================================

export const [authState, setAuthState] = createStore<AuthState>({
  user: null,
  loading: true,
  isGuest: false,
});

// ============================================================================
// Initialisation — call once at app mount
// ============================================================================

/**
 * Subscribe to Firebase Auth state changes.
 * Call this once (e.g. in index.tsx after rendering).
 */
export function initAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Signed in via Google — extract into a plain object so the store can track it
      setAuthState({ user: toUserInfo(user), loading: false, isGuest: false });
    } else if (!authState.isGuest) {
      // Not signed in and not explicitly in guest mode —
      // treat as guest by default (no login wall).
      setAuthState({ user: null, loading: false, isGuest: true });
    }
  });
}

// ============================================================================
// Actions
// ============================================================================

const googleProvider = new GoogleAuthProvider();

/**
 * Open the Google sign-in popup.
 */
export async function loginWithGoogle() {
  try {
    setAuthState({ loading: true });
    await signInWithPopup(auth, googleProvider);
    // onAuthStateChanged will fire and update the store
  } catch (err) {
    console.error('Google sign-in failed:', err);
    setAuthState({ loading: false });
  }
}

/**
 * Explicitly enter guest mode (no Firebase sign-in).
 */
export function loginAsGuest() {
  setAuthState({ user: null, loading: false, isGuest: true });
}

/**
 * Sign out the current user and fall back to guest mode.
 */
export async function logout() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign-out failed:', err);
  }
  setAuthState({ user: null, loading: false, isGuest: true });
}

// ============================================================================
// Helpers
// ============================================================================

/** Returns true when we have a real signed-in user */
export const isSignedIn = () => authState.user !== null;
