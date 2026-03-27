import { supabase, isLogined, recordPreviousPage } from './supabase.js';
import { formatToNChars } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { data: latestContributions, error } = await supabase
        .from('contributions')
        .select('*')
        .order('time', { ascending: false })
        .limit(1);

    const CO2eVal = document.getElementById('CO2e-val');
    const distanceVal = document.getElementById('dictance-val');
    const HKDVal = document.getElementById('HKD-val');
    const visitsVal = document.getElementById('visits-val');

    if (!error) {
        console.log(latestContributions);
        CO2eVal.textContent = formatToNChars(latestContributions[0].CO2e) + 'kg';
        distanceVal.textContent = formatToNChars(latestContributions[0].distance, 6) + 'km';
        HKDVal.textContent = formatToNChars(latestContributions[0].HKD, 6) + 'HKD';
        visitsVal.textContent = formatToNChars(latestContributions[0].visits) + '次';
    } else {
        console.log(error);
    }

    const startTourBtn = document.getElementById('start-tour-btn');
    const exploreBtn = document.getElementById('explore-btn');
    const navBtn = document.getElementById('navBtn');
    let isProcessing = false;

    const IS_LOGINED = await isLogined();
    if (IS_LOGINED) {
        navBtn.textContent = '我的賬戶';
        navBtn.href = 'account.html';
    } else {
        navBtn.textContent = '登入';
        navBtn.href = 'login.html';
        recordPreviousPage('index.html');
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Event:', event);
        const user = session?.user;

        if (user) {
            console.log('User loaded:', user);

            const cleanUrl = window.location.origin + window.location.pathname + window.location.search;
            window.history.replaceState(null, document.title, cleanUrl);

            if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && !isProcessing) {
                isProcessing = true;
                const uid = user.id;

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
                    console.error("Loading error:", error.message);
                } else {
                    console.log("Loaded:", data);
                }
                isProcessing = false;
            }

        }
    });

    // --- 新增内容浮入浮出逻辑 ---
    const observerOptions = {
        root: document.querySelector('.hero-container'),
        threshold: 0.5 // 当 50% 的内容可见时触发
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hero-section').forEach(section => {
        observer.observe(section);
    });
    
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.addEventListener('pointerup', () => {
            const nextSection = indicator.closest('.hero-section').nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        indicator.addEventListener('pointerdown', (e) => {
            e.preventDefault();
        });
    });

    document.querySelectorAll('.scroll-indicator-up').forEach(indicator => {
        indicator.addEventListener('pointerup', () => {
            const prevSection = indicator.closest('.hero-section').previousElementSibling;
            if (prevSection) {
                prevSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        indicator.addEventListener('pointerdown', (e) => {
            e.preventDefault();
        });
    });

    startTourBtn.addEventListener('pointerup', () => {
        // alert('2');
        if (IS_LOGINED) {
            // alert('3');
            recordPreviousPage('map.html');
            window.location.href = 'map.html';
        } else {
            // alert('4');
            window.location.href = 'login.html';
            recordPreviousPage('map.html');
        }
    });

    startTourBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
    });

    exploreBtn.addEventListener('pointerup', () => {
        window.location.href = 'virtual-tour.html';
    });

    exploreBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
    });
});