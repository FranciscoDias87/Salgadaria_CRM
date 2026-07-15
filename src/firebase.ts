/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration loaded directly from the platform's config
const firebaseConfig = {
  apiKey: "AIzaSyCpyKxJpf8AMnVzSVnVpc7JnmiE40YwxoU",
  authDomain: "salgadaria-crm.firebaseapp.com",
  projectId: "salgadaria-crm",
  storageBucket: "salgadaria-crm.firebasestorage.app",
  messagingSenderId: "471732996330",
  appId: "1:471732996330:web:e50becc32042136231af93",
  measurementId: "G-XZ9XTDX2M3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore (using default database for the custom project)
export const db = getFirestore(app);

export default app;
