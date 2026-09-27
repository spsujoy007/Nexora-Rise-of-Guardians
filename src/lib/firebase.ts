import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

// ============================================================
// This file is the single ON/OFF switch for "mock mode" vs "live mode."
//
// Every mock in the app (fake login, mock reports, mock AI, SVG map)
// checks `isFirebaseConfigured` (or its own key, for Gemini/Maps/
// Cloudinary) and falls back automatically. There is nothing to delete —
// fill in frontend/.env with real values and the app graduates to live
// data on its own. Leave .env empty and it runs exactly as it does today.
// ============================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_GOOGLE_AUTH_apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_GOOGLE_AUTH_authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_GOOGLE_AUTH_projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_GOOGLE_AUTH_storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_GOOGLE_AUTH_messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || import.meta.env.VITE_GOOGLE_AUTH_appId,
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let app: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  authInstance = getAuth(app)
  dbInstance = getFirestore(app)
} else {
  // Expected during local/demo development — not an error.
  console.info('[NEXORA] Firebase env vars not set — running in mock data mode.')
}

export const auth = authInstance
export const db = dbInstance
export const googleProvider = new GoogleAuthProvider()

export const isGeminiConfigured = Boolean(import.meta.env.VITE_GEMINI_API_KEY)
export const isMapsConfigured = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
export const isCloudinaryConfigured = Boolean(
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
)
