// Import Firebase SDK
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-7I3AT7aTBTUYg1lgpOhNjaFLkTwp1ZM",
  authDomain: "liftoff-bc783.firebaseapp.com",
  projectId: "liftoff-bc783",
  storageBucket: "liftoff-bc783.firebasestorage.app",
  messagingSenderId: "106356079600",
  appId: "1:106356079600:web:e01049817d3d22d2c77b35",
  measurementId: "G-LETDFSPEHV"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
const firestore = getFirestore(app);

export { firestore };
