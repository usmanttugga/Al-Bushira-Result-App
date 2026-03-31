// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChclTU2pz1ZdAGOarLpa2UXATX1swQbgk",
  authDomain: "al-bushira-result-app.firebaseapp.com",
  projectId: "al-bushira-result-app",
  storageBucket: "al-bushira-result-app.firebasestorage.app",
  messagingSenderId: "503562051525",
  appId: "1:503562051525:web:ab370652905f8fdddd35ac",
  measurementId: "G-76YQCCJ5X1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);