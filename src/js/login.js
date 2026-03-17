import { signInWithGoogle, supabase } from './supabase.js';

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', async () => {
    await signInWithGoogle();
});