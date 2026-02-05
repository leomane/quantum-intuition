/**
 * Firebase Configuration
 *
 * Replace the placeholder values below with your project's config from:
 *   Firebase Console → Project Settings → General → Your apps → Web
 *
 * Steps to set up:
 *   1. Go to https://console.firebase.google.com
 *   2. Click "Create a project" → name it "quantum-intuition"
 *   3. Enable Google Analytics if prompted (optional)
 *   4. In the left sidebar → click the gear icon → "Project settings"
 *   5. Under "Your apps" → click "</>" (Web) → register with nickname "quantum-intuition"
 *   6. Copy the firebaseConfig object values into the placeholders below
 *   7. In the left sidebar → "Authentication" → "Get started" → enable "Google"
 *   8. In the left sidebar → "Firestore Database" → "Create database" → choose region
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ---------------------------------------------------------------------------
// ⚠️  REPLACE THESE VALUES with your Firebase project config
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey:                 'YOUR_API_KEY',
  authDomain:             'YOUR_PROJECT.firebaseapp.com',
  projectId:              'YOUR_PROJECT_ID',
  storageBucket:          'YOUR_PROJECT.firebasestorage.app',
  messagingSenderId:      'YOUR_SENDER_ID',
  appId:                  'YOUR_APP_ID',
};

// ---------------------------------------------------------------------------
// Initialise once
// ---------------------------------------------------------------------------
export const firebaseApp = initializeApp(firebaseConfig);
export const auth         = getAuth(firebaseApp);
export const firestore    = getFirestore(firebaseApp);
