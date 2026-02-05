/**
 * Progress Store
 *
 * Tracks which lessons the user has completed and their current position
 * in the curriculum.
 *
 * - Signed-in users: progress is read/written to Firestore
 *   (collection: "users", doc: uid, field: "progress")
 * - Guest users: progress is stored in localStorage under
 *   the key "quantum-intuition-progress"
 *
 * Call initProgress() once after auth has initialised.
 */

import { createStore } from 'solid-js/store';
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { authState } from './auth';

// ============================================================================
// Store shape
// ============================================================================

export interface ProgressData {
  /** lessonId → true when completed */
  completedLessons: Record<string, boolean>;
  /** 1-based phase the user is currently on */
  currentPhase: number;
  /** The lesson ID currently being viewed, or null */
  currentLesson: string | null;
}

const EMPTY_PROGRESS: ProgressData = {
  completedLessons: {},
  currentPhase: 1,
  currentLesson: null,
};

// ============================================================================
// Reactive store
// ============================================================================

export const [progressState, setProgressState] = createStore<ProgressData>(
  { ...EMPTY_PROGRESS }
);

// ============================================================================
// Persistence helpers
// ============================================================================

const LOCAL_KEY = 'quantum-intuition-progress';

function loadFromLocalStorage(): ProgressData {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw) as ProgressData;
  } catch {
    // Silently ignore parse errors
  }
  return { ...EMPTY_PROGRESS };
}

function saveToLocalStorage(data: ProgressData) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

async function loadFromFirestore(uid: string): Promise<ProgressData> {
  const snap = await getDoc(doc(firestore, 'users', uid));
  if (snap.exists()) {
    const data = snap.data();
    if (data?.progress) return data.progress as ProgressData;
  }
  return { ...EMPTY_PROGRESS };
}

async function saveToFirestore(uid: string, data: ProgressData) {
  await setDoc(doc(firestore, 'users', uid), { progress: data }, { merge: true });
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Load saved progress based on current auth state.
 * Call this after initAuth() has resolved.
 */
export async function initProgress() {
  const uid = authState.user?.uid;
  const data = uid ? await loadFromFirestore(uid) : loadFromLocalStorage();
  setProgressState(data);
}

/**
 * Mark a lesson as completed and persist.
 */
export async function markLessonComplete(lessonId: string) {
  setProgressState('completedLessons', { ...progressState.completedLessons, [lessonId]: true });

  // Persist
  const uid = authState.user?.uid;
  if (uid) {
    await saveToFirestore(uid, { ...progressState });
  } else {
    saveToLocalStorage({ ...progressState });
  }
}

/**
 * Update the current lesson being viewed.
 */
export function setCurrentLesson(lessonId: string | null) {
  setProgressState('currentLesson', lessonId);
}

/**
 * Returns a number 0–1 representing fraction of lessons completed in a phase.
 *
 * @param phaseId - 1-based phase number
 * @param lessonIds - array of lesson IDs belonging to this phase
 */
export function getPhaseProgress(_phaseId: number, lessonIds: string[]): number {
  if (lessonIds.length === 0) return 0;
  const completed = lessonIds.filter((id) => progressState.completedLessons[id]).length;
  return completed / lessonIds.length;
}

/**
 * Total lessons completed across all phases.
 */
export function getTotalCompleted(): number {
  return Object.values(progressState.completedLessons).filter(Boolean).length;
}
