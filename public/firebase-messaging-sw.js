// Give the service worker access to Firebase Messaging.Add commentMore actions
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDAxoUg-Td7oPp93JdcRa64G6HJshuUdbg",
  authDomain: "desarrolllo-nube-santander.firebaseapp.com",
  projectId: "desarrolllo-nube-santander",
  storageBucket: "desarrolllo-nube-santander.firebasestorage.app",
  messagingSenderId: "97185845131",
  appId: "1:97185845131:web:915ce2796a0932b1a1698e",
  measurementId: "G-EZZG7C09QJ"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
});
