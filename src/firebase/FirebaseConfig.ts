// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import * as firebaseui from 'firebaseui'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAxoUg-Td7oPp93JdcRa64G6HJshuUdbg",
  authDomain: "desarrolllo-nube-santander.firebaseapp.com",
  projectId: "desarrolllo-nube-santander",
  storageBucket: "desarrolllo-nube-santander.firebasestorage.app",
  messagingSenderId: "97185845131",
  appId: "1:97185845131:web:915ce2796a0932b1a1698e",
  measurementId: "G-EZZG7C09QJ"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
export const firebaseUi = new firebaseui.auth.AuthUI(firebaseAuth);
firebaseAuth.useDeviceLanguage();
export { firebaseAuth };
