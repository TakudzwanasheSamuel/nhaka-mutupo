/**
 * Firebase web settings. These values are public by design: access is
 * controlled by the security rules in firestore.rules, not by hiding them.
 *
 * They can also be set as environment variables (NEXT_PUBLIC_FIREBASE_*),
 * which take priority, for example in Vercel's project settings.
 */
const FALLBACK = {
  apiKey: 'AIzaSyBCZUA7NnRbvLjLDT6kBE_e5PFRm99cguc',
  authDomain: 'wezalapa.firebaseapp.com',
  projectId: 'wezalapa',
  storageBucket: 'wezalapa.firebasestorage.app',
  messagingSenderId: '14191620868',
  appId: '1:14191620868:web:70bce5cdb16f6d800a9651',
};

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || FALLBACK.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || FALLBACK.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || FALLBACK.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || FALLBACK.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || FALLBACK.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || FALLBACK.appId,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

/**
 * Accounts with these emails become admins the first time they sign in.
 * Keep this list in step with ADMIN_EMAILS in firestore.rules.
 */
/**
 * While cultural review is under way, entries waiting for review are playable
 * by everyone (unresolved entries never are). Admins can switch this off on the
 * admin side once enough entries are verified; that live setting overrides this.
 */
export const DEFAULT_SHOW_PENDING = true;

export const BOOTSTRAP_ADMINS = ['takudzwanashesamuel@gmail.com'];
