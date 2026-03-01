import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Thay thế bằng Config lấy từ Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyAHa20cgWqUW0CSo2EPTJNOP8R9b8Hgu5I",
    authDomain: "logitrack-d088f.firebaseapp.com",
    projectId: "logitrack-d088f",
    storageBucket: "logitrack-d088f.firebasestorage.app",
    messagingSenderId: "224024418636",
    appId: "1:224024418636:web:095c71494265f722e457e9",
    measurementId: "G-N88ZQEJE92"
};

// Đảm bảo Firebase chỉ khởi tạo 1 lần duy nhất trong môi trường Next.js (SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
