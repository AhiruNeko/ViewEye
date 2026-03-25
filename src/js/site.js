import { getCurrentUser, isLogined, recordPreviousPage } from './supabase.js';
import { getAIResponse, RECOMMENDED_PROMPTS } from './ai.js';
import {
    DESCRIPTION_HK,
    DESCRIPTION_ZH,
    DETAILS_HK,
    DETAILS_ZH,
    IMGS_HK,
    IMGS_ZH,
    TOILET_HK,
    TOILET_ZH,
    RESTAURANT_HK,
    RESTAURANT_ZH,
    GOOGLE_MAP_HK,
    GOOGLE_MAP_ZH
} from './mapUtils.js';

let currentImgs = [];
let currentIndex = 0;

const titleEl = () => document.getElementById('siteTitle');
const descEl = () => document.getElementById('siteDescription');
const imgEl = () => document.getElementById('carouselImg');
const counterEl = () => document.getElementById('imgCounter');
const prevBtnEl = () => document.getElementById('prevImgBtn');
const nextBtnEl = () => document.getElementById('nextImgBtn');
const textEl = () => document.getElementById('siteText');

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const renderCarousel = () => {
    const img = imgEl();
    const counter = counterEl();
    const prevBtn = prevBtnEl();
    const nextBtn = nextBtnEl();
    if (!img || !counter || !prevBtn || !nextBtn) return;

    const total = currentImgs.length;
    if (total === 0) {
        img.removeAttribute('src');
        img.alt = '暂无图片';
        counter.textContent = '0 / 0';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }

    currentIndex = clamp(currentIndex, 0, total - 1);
    img.src = currentImgs[currentIndex];
    img.alt = `地点图片 ${currentIndex + 1}`;
    counter.textContent = `${currentIndex + 1} / ${total}`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === total - 1;
};

window.setTitle = function setTitle(title) {
    const el = titleEl();
    if (!el) return;
    el.textContent = title ?? '';
};

window.setDescription = function setDescription(description) {
    const el = descEl();
    if (!el) return;
    el.textContent = description ?? '';
};

window.setImg = function setImg(imgs) {
    if (!Array.isArray(imgs)) {
        currentImgs = [];
        currentIndex = 0;
        renderCarousel();
        return;
    }
    currentImgs = imgs.filter((x) => x !== null && x !== undefined && String(x).trim().length > 0);
    currentIndex = 0;
    renderCarousel();
};

window.setText = function setText(text) {
    const el = textEl();
    if (!el) return;
    el.textContent = text ?? '';
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const site = urlParams.get('site') || "彩虹站";

    setTitle(site);
    const description = DESCRIPTION_HK[site] || DESCRIPTION_ZH[site];
    setDescription(description);
    const details = DETAILS_HK[site] || DETAILS_ZH[site];
    setText(details);
    const imgs = IMGS_HK[site] || IMGS_ZH[site];
    setImg(imgs);
    const specialIcons = document.getElementById('special-icons');
    const toilet = (TOILET_HK[site] || TOILET_ZH[site]) ? `<img src="./assets/toilet.svg" style="width: 0.95rem; opacity: 0.5;"></img>` : '';
    const restaurant = (RESTAURANT_HK[site] || RESTAURANT_ZH) ? `<img src="./assets/restaurant.svg" style="width: 0.95rem; opacity: 0.5;"></img>` : '';
    const siteUrl = window.location.href.replace('site.html', `/virtual-tour.html?site=${site}`);
    const mapUrl = GOOGLE_MAP_HK[site] || GOOGLE_MAP_ZH[site];
    specialIcons.innerHTML = `
        ${toilet}
        ${restaurant}
        <a href="${siteUrl}" class="item-detail">360°全景圖</a>
        <a href="${mapUrl}" class="item-detail" target="_blank">Google Map</a>
    `;

    const navBtn = document.getElementById('navBtn');
    const logined = await isLogined();
    const user = await getCurrentUser();
    if (logined) {
        navBtn.textContent = '我的賬戶';
        navBtn.href = 'account.html';
    } else {
        window.location.href = 'login.html';
        recordPreviousPage('site.html');
    }

    const prevBtn = prevBtnEl();
    const nextBtn = nextBtnEl();
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = clamp(currentIndex - 1, 0, currentImgs.length - 1);
            renderCarousel();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = clamp(currentIndex + 1, 0, currentImgs.length - 1);
            renderCarousel();
        });
    }
    renderCarousel();

    const aiContainer = document.getElementById('ai-container');
    const aiToggleBtn = document.getElementById('ai-toggle-btn');
    const aiInput = document.getElementById('ai-input');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiRandomBtn = document.getElementById('ai-random-btn');
    const aiResponseArea = document.getElementById('ai-response-area');
    const aiLoading = aiResponseArea?.querySelector('.ai-loading') || null;
    const aiResponseText = document.getElementById('ai-response-text');

    let currentPlaceholder = '';
    let lastPrompt = '';
    const pickRandomPrompt = () => {
        if (!Array.isArray(RECOMMENDED_PROMPTS) || RECOMMENDED_PROMPTS.length === 0) return '';
        if (RECOMMENDED_PROMPTS.length === 1) return RECOMMENDED_PROMPTS[0];
        let t = '';
        do {
            t = RECOMMENDED_PROMPTS[Math.floor(Math.random() * RECOMMENDED_PROMPTS.length)];
        } while (t === lastPrompt);
        lastPrompt = t;
        return t;
    };
    const setRandomPlaceholder = () => {
        if (!aiInput) return;
        currentPlaceholder = pickRandomPrompt();
        aiInput.placeholder = currentPlaceholder;
    };
    setRandomPlaceholder();

    const collapseAI = () => {
        if (!aiContainer) return;
        aiContainer.classList.remove('ai-expanded');
    };

    const toggleAI = () => {
        if (!aiContainer) return;
        aiContainer.classList.toggle('ai-expanded');
        if (aiContainer.classList.contains('ai-expanded') && aiInput) {
            aiInput.focus();
        }
    };

    const handleAISend = async () => {
        if (!aiInput || !aiResponseArea || !aiResponseText) return;
        const typed = aiInput.value.trim();
        const prompt = typed || currentPlaceholder;
        if (!prompt) return;

        aiResponseArea.classList.remove('hidden');
        if (aiLoading) aiLoading.classList.remove('hidden');
        const name = user.user.user_metadata.name || '用戶';
        aiResponseText.innerHTML = `<div class="ai-msg user"><span class="label">${name}</span><div class="content">${esc(prompt)}</div></div>`;

        aiInput.value = '';
        setRandomPlaceholder();

        try {
            const response = await getAIResponse(prompt);
            aiResponseText.innerHTML += `<div class="ai-msg ai"><span class="label">AI</span><div class="content">${esc(response)}</div></div>`;
        } finally {
            if (aiLoading) aiLoading.classList.add('hidden');
            aiResponseArea.scrollTo({ top: aiResponseArea.scrollHeight, behavior: 'smooth' });
        }
    };

    if (aiToggleBtn) aiToggleBtn.addEventListener('click', toggleAI);
    if (aiRandomBtn) {
        aiRandomBtn.addEventListener('click', () => {
            setRandomPlaceholder();
            aiInput?.focus();
        });
    }
    if (aiSendBtn) aiSendBtn.addEventListener('click', handleAISend);
    if (aiInput) {
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleAISend();
        });
    }

    window.collapseAI = collapseAI;
});
