import { getCurrentUser, signOut, isLogined, recordPreviousPage } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const IS_LOGINED = isLogined();
    if (!IS_LOGINED) {
        window.location.href = 'login.html';
    }
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const lastSignIn = document.getElementById('lastSignIn');
    const createdAt = document.getElementById('createdAt');
    const signOutBtn = document.getElementById('signOutBtn');

    try {
        const { user } = await getCurrentUser();

        if (user) {
            const profile = user.user_metadata;
            
            if (profile.avatar_url) {
                userAvatar.src = profile.avatar_url;
            } else if (profile.full_name) {
                userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=10b981&color=fff`;
            }

            userName.textContent = profile.full_name || 'ViewEye 用戶';
            userEmail.textContent = user.email;
            
            // 格式化日期
            const formatDate = (dateString) => {
                if (!dateString) return '-';
                const date = new Date(dateString);
                return date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            };

            lastSignIn.textContent = formatDate(user.last_sign_in_at);
            createdAt.textContent = formatDate(user.created_at);

        } else {
            window.location.href = 'login.html';
            recordPreviousPage('account.html');
        }
    } catch (error) {
        console.error('Loading error:', error);
        userName.textContent = '加載失敗';
        userEmail.textContent = '請檢查網絡連接';
    }

    // 登出逻辑
    signOutBtn.addEventListener('click', async () => {
        await signOut();
        recordPreviousPage('account.html');
        window.location.href = 'login.html';
    });
});