import { getCurrentUser, isLogined } from './supabase.js';

const logined = await isLogined();
if (!logined) {
    window.location.href = 'login.html';
}

const navBtn = document.getElementById("navBtn")
const user = await getCurrentUser();
if (!user) {
    window.location.href = 'login.html';
}
navBtn.textContent = "我的賬戶";
navBtn.href = "account.html";
