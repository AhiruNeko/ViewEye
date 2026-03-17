import { getCurrentUser, supabase } from './supabase.js';

supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
        const cleanUrl = window.location.origin + window.location.pathname + window.location.search;
        window.history.replaceState(null, document.title, cleanUrl);
    }
    if (session?.user) {
        const uid = session.user.id;
        const { data, error } = await supabase
            .from('users')
            .upsert(
                { 
                    uid: uid, 
                }, 
                { onConflict: 'uid' } 
            )
            .select();

        if (error) {
            console.error("Insert error:", error.message);
        } else {
            console.log("User info upserted successfully:", data);
        }
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const navBtn = document.getElementById('navBtn');

    try {
        const { user } = await getCurrentUser();
        if (user) {
            navBtn.textContent = '賬戶';
            navBtn.href = 'account.html';
        } else {
            navBtn.textContent = '登錄';
            navBtn.href = 'login.html';
        }
    } catch (error) {
        console.error('User loaded error:', error);
        navBtn.textContent = '登錄';
        navBtn.href = 'login.html';
    }
});