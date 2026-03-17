import { signInWithGoogle, getCurrentUser } from './supabase.js';

const user = await getCurrentUser();
if (user) {
    window.location.href = 'account.html';
}

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', async () => {
    await signInWithGoogle();
});