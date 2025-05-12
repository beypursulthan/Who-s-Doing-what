// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA_kCLMwEu8s3dS37QshL2VwsvLQmq7G_4",
    authDomain: "who-s-doing-what.firebaseapp.com",
    projectId: "who-s-doing-what",
    storageBucket: "who-s-doing-what.firebasestorage.app",
    messagingSenderId: "712181770483",
    appId: "1:712181770483:web:239568c38511d857a5ef86",
    measurementId: "G-6JBZM34N73"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 