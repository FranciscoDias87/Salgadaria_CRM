/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration loaded directly from the platform's config
const firebaseConfig = {
  apiKey: "AIzaSyDv71VYtRxku3_7XsV6pNitMwI6jiBfFAE",
  authDomain: "gen-lang-client-0653304332.firebaseapp.com",
  projectId: "gen-lang-client-0653304332",
  storageBucket: "gen-lang-client-0653304332.firebasestorage.app",
  messagingSenderId: "704759621106",
  appId: "1:704759621106:web:9d04bcf56fe07c962cf76b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore with the dedicated database ID provided
const databaseId = "ai-studio-salgadariacrm-e2f258a5-ff10-45c2-a8d1-2c6f0c42d6dd";
export const db = getFirestore(app, databaseId);

export default app;
