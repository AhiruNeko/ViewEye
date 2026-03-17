import { signInWithGoogle, isLogined } from './supabase.js';

const logined = await isLogined();
if (logined) {
    window.location.href = 'account.html';
}

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', async () => {
    await signInWithGoogle();
});