// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgisxeeq0hYN-7SF62IGkvZHPVmWnyThg",
  authDomain: "xyze-9b306.firebaseapp.com",
  projectId: "xyze-9b306",
  storageBucket: "xyze-9b306.firebasestorage.app",
  messagingSenderId: "814674031370",
  appId: "1:814674031370:web:aa8f08895c1d305b2540f3",
  measurementId: "G-33ZZ3HXVFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
