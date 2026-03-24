import { isLogined, recordPreviousPage } from './supabase.js';
import { VIRTUAL_TOUR_HK } from './mapUtils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const panoPlayer = document.getElementById('pano-player');
    if (!panoPlayer) return;
    const rawSite = new URLSearchParams(window.location.search);
    const currentScene = rawSite ? decodeURIComponent(rawSite.get('site')) : null;
    console.log('currentScene', currentScene);
    if (currentScene && VIRTUAL_TOUR_HK[currentScene]) {
        panoPlayer.src = VIRTUAL_TOUR_HK[currentScene];
    }

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
