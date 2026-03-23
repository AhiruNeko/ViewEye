import { signInWithGoogle, isLogined } from './supabase.js';

const IS_LOGINED = isLogined();
if (IS_LOGINED) {
    window.location.href = 'account.html';
}

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', async () => {
    await signInWithGoogle();
});