import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// ⚠️  Replace these values with your own Firebase project config
// Go to: https://console.firebase.google.com → Project Settings → Your apps → Web app
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const DOC_REF = doc(db, 'appdata', 'main');

/** Load all app data from Firestore */
export async function loadFromFirestore() {
  const snap = await getDoc(DOC_REF);
  if (snap.exists()) return snap.data();
  return null;
}

/** Save all app data to Firestore */
export async function saveToFirestore(data) {
  await setDoc(DOC_REF, data, { merge: true });
}
