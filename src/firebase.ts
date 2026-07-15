/// <reference types="vite/client" />

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration loaded from environment variables with safe fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCpyKxJpf8AMnVzSVnVpc7JnmiE40YwxoU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "salgadaria-crm.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "salgadaria-crm",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "salgadaria-crm.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "471732996330",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:471732996330:web:e50becc32042136231af93",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XZ9XTDX2M3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore (using default database for the custom project)
export const db = getFirestore(app);

export default app;
