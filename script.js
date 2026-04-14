// ========== FIREBASE AUTH ==========
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, OAuthProvider } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

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
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

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

// Social logins
document.getElementById('google-login')?.addEventListener('click', () => {
    signInWithPopup(auth, googleProvider)
        .then(() => modal.style.display = 'none')
        .catch(e => alert('Ошибка Google: ' + e.message));
});

document.getElementById('facebook-login')?.addEventListener('click', () => {
    signInWithPopup(auth, facebookProvider)
        .then(() => modal.style.display = 'none')
        .catch(e => alert('Ошибка Facebook: ' + e.message));
});

document.getElementById('apple-login')?.addEventListener('click', () => {
    signInWithPopup(auth, appleProvider)
        .then(() => modal.style.display = 'none')
        .catch(e => alert('Ошибка Apple: ' + e.message));
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
    personal_8: 15000,
    group_4: 3200,
    group_8: 6000,
    group_12: 8700
};

function formatCLP(amount) {
    return Math.round(amount).toLocaleString('es-CL') + ' CLP';
}

function formatRUB(amount) {
    return amount.toLocaleString('ru-RU') + ' ₽';
}

function renderPrices(lang) {
    const container = document.getElementById('prices-container');
    if (!container) return;
    
    const isES = lang === 'es';
    const format = isES ? formatCLP : formatRUB;
    
    let ps, p4, p8, g4, g8, g12;
    
    if (isES && rubToClp > 0) {
        ps = rubToClp * pricesRUB.personal_single;
        p4 = rubToClp * pricesRUB.personal_4;
        p8 = rubToClp * pricesRUB.personal_8;
        g4 = rubToClp * pricesRUB.group_4;
        g8 = rubToClp * pricesRUB.group_8;
        g12 = rubToClp * pricesRUB.group_12;
    } else {
        ps = pricesRUB.personal_single;
        p4 = pricesRUB.personal_4;
        p8 = pricesRUB.personal_8;
        g4 = pricesRUB.group_4;
        g8 = pricesRUB.group_8;
        g12 = pricesRUB.group_12;
    }
    
    container.innerHTML = `
        <div class="price-card personal">
            <h3 data-ru="Персональные тренировки" data-es="Entrenamientos personales">Персональные тренировки</h3>
            <div class="price-pack"><span class="price-value">${format(ps)}</span> <span class="price-label" data-ru="разовое занятие" data-es="sesión única">разовое занятие</span></div>
            <div class="price-pack"><span class="price-value">${format(p4)}</span> <span class="price-label" data-ru="4 тренировки" data-es="4 entrenamientos">4 тренировки</span></div>
            <div class="price-pack"><span class="price-value">${format(p8)}</span> <span class="price-label" data-ru="8 тренировок" data-es="8 entrenamientos">8 тренировок</span></div>
        </div>
        <div class="price-card group">
            <h3 data-ru="Групповые занятия" data-es="Clases grupales">Групповые занятия</h3>
            <div class="price-pack"><span class="price-value">${format(g4)}</span> <span class="price-label" data-ru="4 занятия" data-es="4 clases">4 занятия</span></div>
            <div class="price-pack"><span class="price-value">${format(g8)}</span> <span class="price-label" data-ru="8 занятий" data-es="8 clases">8 занятий</span></div>
            <div class="price-pack"><span class="price-value">${format(g12)}</span> <span class="price-label" data-ru="12 занятий" data-es="12 clases">12 занятий</span></div>
            <p class="price-note" data-ru="С 1 апреля 2025" data-es="Desde el 1 de abril de 2025">С 1 апреля 2025</p>
        </div>
    `;
}

// ========== LANGUAGE ==========
let currentLang = localStorage.getItem('lang') || 'ru';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    document.querySelectorAll('[data-ru][data-es]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text && (el.tagName !== 'SPAN' || !el.classList.contains('price-value'))) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.innerHTML = text;
            }
        }
    });
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderPrices(lang);
}

// ========== BLOG ==========
function getBlogPosts() {
    const posts = localStorage.getItem('blog_posts');
    return posts ? JSON.parse(posts) : [];
}

function loadBlogPreview() {
    const container = document.getElementById('blog-preview');
    if (!container) return;
    
    const posts = getBlogPosts();
    const latest = posts.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    
    if (latest.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999;">Пока нет статей. Загляните позже!</p>';
        return;
    }
    
    container.innerHTML = latest.map(post => `
        <a href="article.html?id=${post.id}" class="blog-preview-card">
            <h3>${post.title_ru || post.title}</h3>
            <p>${(post.excerpt_ru || post.excerpt || '').substring(0, 100)}${(post.excerpt_ru || post.excerpt || '').length > 100 ? '...' : ''}</p>
            <div class="blog-preview-date">${new Date(post.date).toLocaleDateString()}</div>
        </a>
    `).join('');
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', async () => {
    await fetchExchangeRates();
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    
    renderPrices(currentLang);
    setLanguage(currentLang);
    loadBlogPreview();
});