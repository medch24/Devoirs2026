// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVJW_Y-OXbcGB68wA-DaWNRuV7-YpyIQY",
  authDomain: "devoirs-6dcc9.firebaseapp.com",
  projectId: "devoirs-6dcc9",
  storageBucket: "devoirs-6dcc9.firebasestorage.app",
  messagingSenderId: "746244942149",
  appId: "1:746244942149:web:402443f72301917ccdb62c",
  measurementId: "G-2CFHEVS3H5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
