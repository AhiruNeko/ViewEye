//supabase 初始化
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = 'https://xyzovwbnldmjjrjbowxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5em92d2JubGRtampyamJvd3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTEyOTIsImV4cCI6MjA4ODM2NzI5Mn0.5xcRkBlrJwJP0jQN1KGt3yz_5adCVCfoGTtEvr7H2qw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function recordPreviousPage(page) {
    localStorage.setItem('previousPage', page);
}

function loadPreviousPage() {
    const page = localStorage.getItem('previousPage') || 'index.html';
    localStorage.removeItem('previousPage');
    return page;
}

// supabase 谷歌登录
export async function signInWithGoogle() {
    const directUrl = window.location.href.replace('login.html', loadPreviousPage());
    console.log("directUrl: ", directUrl);
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: directUrl,
        },
    });
    if (error) {
        console.error('Google error:', error.message);
        return;
    }
    return data;
}

// supabase 登出
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Sign out error:', error.message);
    }
}

//supabase 获取当前用户
export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Get user error:', error.message);
    }
    return data;
}

export async function isLogined() {
    const SUPABASE_KEY = 'sb-xyzovwbnldmjjrjbowxx-auth-token';
    // console.log(window.location.pathname);
    let MAX_RETRIES = 10;
    if (window.location.pathname === '/src/login.html' || window.location.pathname === '/login.html') {
        MAX_RETRIES = 1;
    }
    const RETRY_INTERVAL = 150;

    for (let i = 0; i < MAX_RETRIES; i++) {
        const sessionStr = localStorage.getItem(SUPABASE_KEY);
        
        if (sessionStr) {
            try {
                const session = JSON.parse(sessionStr);
                const hasToken = !!session.access_token;
                const expiresAt = session.expires_at;
                const now = Math.floor(Date.now() / 1000);
                const isNotExpired = expiresAt ? now < expiresAt : true;

                if (hasToken && isNotExpired) {
                    console.log(`[Auth] Login status confirmed on ${i + 1}th check.`);
                    return true;
                }
            } catch (e) {
                console.error("Decoding Supabase Token fail", e);
            }
        }
        console.log(`[Auth] checking (${i + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
    }

    console.warn("[Auth] Failed to check login status after maximum retries.");
    return false;
    // try {
    //     const { data: { session }, error } = await supabase.auth.getSession();
        
    //     if (error) {
    //         console.error('Check login status failed:', error.message);
    //         return false;
    //     }
    //     return !!(session && session.user);
    // } catch (err) {
    //     console.error('Unexpected error in isLogined:', err);
    //     return false;
    // }
}