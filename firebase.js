// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIH8IqyH-2yF97RRTUnimpdIZLcZk7ABE",
    authDomain: "smasherss.firebaseapp.com",
    projectId: "smasherss",
    storageBucket: "smasherss.firebasestorage.app",
    messagingSenderId: "380184635565",
    appId: "1:380184635565:web:bacb9a89f2a06d3fa37e24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;