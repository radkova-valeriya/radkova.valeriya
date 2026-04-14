// ========== FIREBASE AUTH ==========
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyArSzPNl80_orGdu5B8y8T_0ksIFR0xdaQ",
    authDomain: "valeriyaradkova-d61db.firebaseapp.com",
    projectId: "valeriyaradkova-d61db",
    storageBucket: "valeriyaradkova-d61db.firebasestorage.app",
    messagingSenderId: "404181139779",
    appId: "1:404181139779:web:90bd04d393d62b73c46ff6",
    measurementId: "G-XDPYTD6XDN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// DOM elements
const loginBtn = document.getElementById('login-btn');
const modal = document.getElementById('auth-modal');
const closeBtn = document.querySelector('.close');
const userProfile = document.getElementById('user-profile');
const userNameSpan = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');

if (loginBtn) loginBtn.onclick = () => modal.style.display = 'block';
if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

// Email signup
document.getElementById('email-signup')?.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => { modal.style.display = 'none'; alert('Регистрация успешна!'); })
        .catch(e => alert('Ошибка: ' + e.message));
});

// Email signin
document.getElementById('email-signin')?.addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then(() => { modal.style.display = 'none'; alert('Добро пожаловать!'); })
        .catch(e => alert('Ошибка: ' + e.message));
});

// Google login
document.getElementById('google-login')?.addEventListener('click', () => {
    signInWithPopup(auth, googleProvider)
        .then(() => modal.style.display = 'none')
        .catch(e => alert('Ошибка Google: ' + e.message));
});

// Auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userProfile) userProfile.style.display = 'inline-flex';
        if (userNameSpan) userNameSpan.innerText = user.email || user.displayName || 'Профиль';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (userProfile) userProfile.style.display = 'none';
    }
});

if (logoutBtn) logoutBtn.onclick = () => signOut(auth);

// ========== CURRENCY AND PRICES ==========
let rubToClp = 0;

async function fetchExchangeRates() {
    try {
        const rubToUsdRes = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
        const rubData = await rubToUsdRes.json();
        const rubToUsd = rubData.rates.USD;
        const usdToClpRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const usdData = await usdToClpRes.json();
        const usdToClp = usdData.rates.CLP;
        rubToClp = rubToUsd * usdToClp;
    } catch (error) {
        rubToClp = 15.5;
    }
}

const pricesRUB = {
    personal_single: 2000,
    personal_4: 7600,
   
