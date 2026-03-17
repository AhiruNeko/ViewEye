import { getCurrentUser, supabase } from './supabase.js';

const navBtn = document.getElementById("navBtn")
const user = await getCurrentUser();
if (!user) {
    window.location.href = 'login.html';
}
navBtn.textContent = "我的賬戶";
navBtn.href = "account.html";
