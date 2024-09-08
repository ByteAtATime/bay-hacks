// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDirIKMEOSE2WROAKQcHDHElyZxuYBnVb0",
	authDomain: "bayhacks-2024.firebaseapp.com",
	projectId: "bayhacks-2024",
	storageBucket: "bayhacks-2024.appspot.com",
	messagingSenderId: "1068677885298",
	appId: "1:1068677885298:web:e96ef5ce73de2f277a41eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
