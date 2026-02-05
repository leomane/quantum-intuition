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
  apiKey:                 'AIzaSyDiUVNtlNwUkrr7kMvZFbB5Ck8G_riIWOQ',
  authDomain:             'quantum-intuition.firebaseapp.com',
  projectId:              'quantum-intuition',
  storageBucket:          'quantum-intuition.firebasestorage.app',
  messagingSenderId:      '685977627423',
  appId:                  '1:685977627423:web:9c429f3029ed80a2625e2a',
};

// ---------------------------------------------------------------------------
// Initialise once
// ---------------------------------------------------------------------------
export const firebaseApp = initializeApp(firebaseConfig);
export const auth         = getAuth(firebaseApp);
export const firestore    = getFirestore(firebaseApp);
