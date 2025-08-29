// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkpr5ZuDs1u1n__dyVNKvhHXjUbFLebtw",
  authDomain: "ecommerce-app-c59a7.firebaseapp.com",
  projectId: "ecommerce-app-c59a7",
  storageBucket: "ecommerce-app-c59a7.firebasestorage.app",
  messagingSenderId: "359975323172",
  appId: "1:359975323172:web:834ddbfd9d4d7bf683fab1",
  measurementId: "G-MRFR802PPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);