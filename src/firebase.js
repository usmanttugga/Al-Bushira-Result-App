import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyChclTU2pz1ZdAGOarLpa2UXATX1swQbgk",
  authDomain: "al-bushira-result-app.firebaseapp.com",
  projectId: "al-bushira-result-app",
  storageBucket: "al-bushira-result-app.firebasestorage.app",
  messagingSenderId: "503562051525",
  appId: "1:503562051525:web:ab370652905f8fdddd35ac"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const DOC_REF = doc(db, 'appdata', 'main');

export async function loadFromFirestore() {
  const snap = await getDoc(DOC_REF);
  if (snap.exists()) return snap.data();
  return null;
}

export async function saveToFirestore(data) {
  await setDoc(DOC_REF, data, { merge: true });
}
