import { isLogined, recordPreviousPage } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const navBtn = document.getElementById('navBtn');
    if (!navBtn) return;

    const logined = await isLogined();
    if (logined) {
        navBtn.textContent = '我的賬戶';
        navBtn.href = 'account.html';
        return;
    }

    window.location.href = 'login.html';
    recordPreviousPage('virtual-tour.html');
});
