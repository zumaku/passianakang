import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

export const isFirebaseConfigured = Boolean(apiKey && projectId && apiKey.trim() !== '' && projectId.trim() !== '');

let dbInstance = null;

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

    const apps = getApps();
    const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
    dbInstance = getFirestore(app);
    console.log('🔥 Firebase Cloud Firestore berhasil diinisialisasi.');
  } catch (error) {
    console.error('🔥 Gagal menginisialisasi Firebase:', error);
  }
} else {
  console.info('ℹ️ Firebase kredensial belum diisi di file .env. Menggunakan LocalStorage Mode.');
}

export const db = dbInstance;
