import { recordPreviousPage, isLogined, getCurrentUser } from './supabase.js';
import { 
    initMapUtils, 
    addLocation, 
    removeLocation, 
    removeAllLocation, 
    highlightLocation, 
    removeHighlight, 
    removeAllHighlight,
    STOP_LOCATIONS_HK,
    NORMAL_LOCATIONS_HK,
    DESCRIPTION_HK,
    DETAILS_HK,
    ROUTES_HK,
    ROUTES_DESC_HK,
    ROUTES_LINKED_LISTS_HK,
    HTML_HK,
    ROUTES_ZH,
    ROUTES_DESC_ZH,
    ROUTES_LINKED_LISTS_ZH,
    STOP_LOCATIONS_ZH,
    NORMAL_LOCATIONS_ZH,
    DESCRIPTION_ZH,
    DETAILS_ZH,
    HTML_ZH,
    GOOGLE_MAP_HK,
    GOOGLE_MAP_ZH,
    TOILET_ZH,
    RESTAURANT_ZH,
    TOILET_HK,
    RESTAURANT_HK,
} from './mapUtils.js';

import { getAIResponse, RECOMMENDED_PROMPTS } from './ai.js';
import { SUSTAINABLE_TITLES, getRandomItems, SUSTAINABLE_CONCLUSION_HK, SUSTAINABLE_CONCLUSION_ZH, SITES_CONCLUSION_HK, SITES_CONCLUSION_ZH } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    // console.log(ROUTES_LINKED_LISTS_HK);
    // 状态管理
    let mobileState = 'collapsed'; // 'collapsed', 'half-screen', 'full-screen'
    let navState = 'collapsed'; // 'collapsed', 'half-screen', 'full-screen'

    // 1. 初始化地图 西贡
    const map = L.map('map', {
        zoomControl: false
    }).setView([22.382183545063885, 114.27381914090027], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 初始化地图工具函数并暴露给全局，方便调试
    initMapUtils(map);
    window.addLocation = addLocation;
    window.removeLocation = removeLocation;
    window.removeAllLocation = removeAllLocation;
    window.highlightLocation = highlightLocation;
    window.removeHighlight = removeHighlight;
    window.removeAllHighlight = removeAllHighlight;

    // 路线控制器列表
    let routingControls = [];

    const clearRouting = () => {
        routingControls.forEach(control => {
            if (control.getPlan) {
                map.removeControl(control);
            } else if (map.hasLayer(control)) {
                map.removeLayer(control);
            }
        });
        routingControls = [];
    };

    const getCoords = (name, parent) => {
        switch (parent) {
            case 0: return STOP_LOCATIONS_HK[name] || NORMAL_LOCATIONS_HK[name];
            case 1: return STOP_LOCATIONS_ZH[name] || NORMAL_LOCATIONS_ZH[name];
        }
    };

    // 2. 导航栏登录状态
    const navBtn = document.getElementById('navBtn');
    const IS_LOGINED = await isLogined();
    if (IS_LOGINED) {
        navBtn.textContent = '我的賬戶';
        navBtn.href = 'account.html';
    } else {
        window.location.href = 'login.html';
        recordPreviousPage('map.html');
    }
    const user = await getCurrentUser();
    const name = user.user.user_metadata.name || '用戶';

    // 3. 卡片交互逻辑
    const infoCard = document.getElementById('info-card');
    const toggleBtn = document.getElementById('toggle-card');
    const desktopFab = document.getElementById('desktop-fab');
    const cardHandle = document.querySelector('.card-handle');
    const mapControls = document.querySelector('.map-controls');

    // 检测是否为移动端
    const isMobile = () => window.innerWidth <= 768;

    // 桌面端切换函数
    const toggleDesktopCard = () => {
        const isCollapsed = infoCard.classList.toggle('collapsed');
        if (mapControls) {
            mapControls.classList.toggle('shifted', !isCollapsed);
        }
        if (desktopFab) {
            if (isCollapsed) {
                desktopFab.style.opacity = '1';
                desktopFab.style.pointerEvents = 'auto';
                desktopFab.style.transform = 'translateX(0)';
            } else {
                desktopFab.style.opacity = '0';
                desktopFab.style.pointerEvents = 'none';
                desktopFab.style.transform = 'translateX(20px)';
                collapseAI(); // 展开地点列表时收起 AI
            }
        } else if (!isCollapsed) {
            collapseAI(); // 展开地点列表时收起 AI
        }
    };

    // 4. 地图控制功能
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const locateBtn = document.getElementById('locate-user');
    const openVirtualTourBtn = document.getElementById('open-virtual-tour');

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => map.zoomIn());
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => map.zoomOut());

    // 用户位置功能
    let userMarker = null;
    let userCircle = null;

    const onLocationFound = (e) => {
        const radius = e.accuracy / 2;

        if (userMarker) {
            userMarker.setLatLng(e.latlng);
            userCircle.setLatLng(e.latlng).setRadius(radius);
        } else {
            userMarker = L.marker(e.latlng).addTo(map)
                .bindPopup("你在此").openPopup();
            userCircle = L.circle(e.latlng, radius).addTo(map);
        }
        
        locateBtn.classList.add('active');
    };

    const onLocationError = (e) => {
        alert("无法获取位置: " + e.message);
        locateBtn.classList.remove('active');
    };

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    if (locateBtn) {
        locateBtn.addEventListener('click', () => {
            map.locate({ setView: true, maxZoom: 16 });
        });
    }
    if (openVirtualTourBtn) {
        openVirtualTourBtn.addEventListener('click', () => {
            window.location.href = 'virtual-tour.html';
        });
    }

    // --- AI 聊天逻辑 ---
    const aiContainer = document.getElementById('ai-container');
    const aiToggleBtn = document.getElementById('ai-toggle-btn');
    const aiInput = document.getElementById('ai-input');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiRandomBtn = document.getElementById('ai-random-btn');
    const aiResponseArea = document.getElementById('ai-response-area');
    const aiLoading = aiResponseArea.querySelector('.ai-loading');
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
        currentPlaceholder = pickRandomPrompt();
        aiInput.placeholder = currentPlaceholder;
    };
    setRandomPlaceholder();
    if (aiRandomBtn) {
        aiRandomBtn.addEventListener('click', () => {
            setRandomPlaceholder();
            aiInput.focus();
        });
    }
    const esc = (s) => s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const toggleAI = () => {
        aiContainer.classList.toggle('ai-expanded');
        if (aiContainer.classList.contains('ai-expanded')) {
            aiInput.focus();
        }
    };

    const collapseAI = () => {
        aiContainer.classList.remove('ai-expanded');
    };

    const handleAISend = async () => {
        const typed = aiInput.value.trim();
        const prompt = typed || currentPlaceholder;
        if (!prompt) return;

        aiResponseArea.classList.remove('hidden');
        aiLoading.classList.remove('hidden');
        aiResponseText.innerHTML = '';
        aiResponseText.innerHTML = `<div class="ai-msg user"><span class="label">${name}</span><div class="content">${esc(prompt)}</div></div>`;
        aiInput.value = '';
        setRandomPlaceholder();

        try {
            const response = await getAIResponse(prompt);
            aiResponseText.innerHTML += `<div class="ai-msg ai"><span class="label">ViewEye AI</span><div class="content">${esc(response)}</div></div>`;
            // 自动滚动到底部
            aiResponseArea.scrollTo({
                top: aiResponseArea.scrollHeight,
                behavior: 'smooth'
            });
        } catch (error) {
            aiResponseText.textContent = '抱歉，AI 暫時無法回答，請稍後再試。';
            console.error('AI Error:', error);
        } finally {
            aiLoading.classList.add('hidden');
        }
    };

    aiToggleBtn.addEventListener('click', toggleAI);
    aiSendBtn.addEventListener('click', handleAISend);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAISend();
    });

    // 互斥逻辑：如果 AI 展开，而导航或信息卡片也要展开，则收起 AI
    // 同时也需要在已有的 updateMobileCard 和 updateNavUI 中调用 collapseAI

    // 5. 移动端状态切换
    const updateMobileCard = () => {
        infoCard.classList.remove('collapsed', 'half-screen', 'full-screen');
        infoCard.classList.add(mobileState);
        if (desktopFab) desktopFab.style.display = 'none';

        // 互斥逻辑：如果下方卡片展开，上方导航栏必须完全收起，AI 也要收起
        if (isMobile() && (mobileState === 'half-screen' || mobileState === 'full-screen')) {
            if (navState !== 'collapsed') {
                navState = 'collapsed';
                updateNavUI();
            }
            collapseAI(); // 收起 AI
        }
    };

    if (cardHandle) {
        cardHandle.addEventListener('click', () => {
            if (!isMobile()) return;
            
            if (mobileState === 'collapsed') {
                mobileState = 'half-screen';
            } else if (mobileState === 'half-screen') {
                mobileState = 'full-screen';
            } else {
                mobileState = 'collapsed';
            }
            updateMobileCard();
        });

        // 简单的滑动逻辑 (可选增强)
        let startY = 0;
        cardHandle.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });

        cardHandle.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const diff = startY - endY;

            if (Math.abs(diff) > 50) { // 滑动距离阈值
                if (diff > 0) { // 向上滑
                    if (mobileState === 'collapsed') mobileState = 'half-screen';
                    else if (mobileState === 'half-screen') mobileState = 'full-screen';
                } else { // 向下滑
                    if (mobileState === 'full-screen') mobileState = 'half-screen';
                    else if (mobileState === 'half-screen') mobileState = 'collapsed';
                }
                updateMobileCard();
            }
        });
    }

    // 桌面端状态切换
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (isMobile()) return;
            toggleDesktopCard();
        });
    }

    if (desktopFab) {
        desktopFab.addEventListener('click', () => {
            if (isMobile()) return;
            toggleDesktopCard();
        });
    }

    // 6. 地点分类逻辑
    const locationsContainer = document.getElementById('locations');
    const routesContainer = document.getElementById('routes');
    const categories = ['香港', '珠海'];
    
    // 初始化地点分类
    categories.forEach((name, index) => {
        const catDiv = document.createElement('div');
        catDiv.className = 'location-category';
        catDiv.id = `cat-loc-${index}`;
        catDiv.innerHTML = `
            <div class="category-header">${name}</div>
            <div class="category-content"></div>
        `;
        catDiv.querySelector('.category-header').addEventListener('click', () => {
            catDiv.classList.toggle('expanded');
        });
        locationsContainer.appendChild(catDiv);
    });

    // 初始化路线分类
    categories.forEach((name, index) => {
        const catDiv = document.createElement('div');
        catDiv.className = 'location-category';
        catDiv.id = `cat-route-${index}`;
        catDiv.innerHTML = `
            <div class="category-header">${name}</div>
            <div class="category-content"></div>
        `;
        catDiv.querySelector('.category-header').addEventListener('click', () => {
            catDiv.classList.toggle('expanded');
        });
        routesContainer.appendChild(catDiv);
    });

    /**
     * 注册地点并添加到侧边栏及地图
     */
    window.registerLocation = registerLocation;
    function registerLocation(title, text, parent) {
        let html = window.location.href;
        const siteUrl = window.location.href.replace('map.html', `/virtual-tour.html?site=${title}`);
        let mapUrl = window.location.href;
        let toilet = `<img src="./assets/toilet.svg" style="width: 0.95rem; opacity: 0.5;"></img>`;
        let restaurant = `<img src="./assets/restaurant.svg" style="width: 0.95rem; opacity: 0.5;"></img>`;
        switch (parent) {
            case 0: if (html) html = 'sites/' + HTML_HK[title]; mapUrl = GOOGLE_MAP_HK[title]; 
                    toilet = TOILET_HK[title] ? toilet : '';
                    restaurant = RESTAURANT_HK[title] ? restaurant : '';
                    break;
            case 1: if (html) html = 'sites/' + HTML_ZH[title]; mapUrl = GOOGLE_MAP_ZH[title]; 
                    toilet = TOILET_ZH[title] ? toilet : '';
                    restaurant = RESTAURANT_ZH[title] ? restaurant : '';
                    break;
        }
        const coords = getCoords(title, parent);
        if (!coords) {
            console.warn(`Location not found: ${title}`);
            return;
        }

        const [lat, lng] = coords;
        const catDiv = document.getElementById(`cat-loc-${parent}`);
        const contentDiv = catDiv.querySelector('.category-content');

        const itemDiv = document.createElement('div');
        itemDiv.className = 'location-item';
        itemDiv.id = `item-${title.replace(/\s+/g, '-')}`;
        itemDiv.innerHTML = `
            <div class="item-header">
                ${title}
                ${toilet}
                ${restaurant}
            </div>
            <div class="item-detail">
                <p>${text}</p>
                <a href="${html}" style="margin-right: 0.2rem;">瞭解更多</a>
                <a href="${siteUrl}" style="margin-left: 0.2rem; margin-right: 0.2rem;">360°全景圖</a>
                <a href="${mapUrl}" style="margin-left: 0.2rem;" target="_blank">Google Map</a>
            </div>
        `;

        const activateLocation = (fromMap = false) => {
            removeAllHighlight();
            clearRouting();
            highlightLocation(lat, lng);
            if (infoCard.classList.contains('collapsed')) {
                if (isMobile()) {
                    mobileState = 'half-screen';
                    updateMobileCard();
                } else {
                    toggleDesktopCard();
                }
            }

            catDiv.classList.add('expanded');
            document.querySelectorAll('.location-item').forEach(item => item.classList.remove('active'));
            itemDiv.classList.add('active');
            if (fromMap) {
                setTimeout(() => {
                    itemDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
            map.panTo([lat, lng], { animate: true });
        };

        itemDiv.querySelector('.item-header').addEventListener('click', () => {
            if (itemDiv.classList.contains('active')) {
                itemDiv.classList.remove('active');
                removeHighlight(lat, lng);
            } else {
                activateLocation(false);
            }
        });
        addLocation(lat, lng, () => {
            if (itemDiv.classList.contains('active')) {
                itemDiv.classList.remove('active');
                removeHighlight(lat, lng);
            } else {
                activateLocation(true);
            }
        });

        contentDiv.appendChild(itemDiv);
    };

    window.registerRoutes = registerRoutes;
    function registerRoutes(routeName, parent) {
        const routesData = parent === 0 ? ROUTES_HK : ROUTES_ZH;
        const routeInfo = routesData[routeName];
        if (!routeInfo) {
            console.warn(`Route not found: ${routeName}`);
            return;
        }

        const catDiv = document.getElementById(`cat-route-${parent}`);
        const contentDiv = catDiv.querySelector('.category-content');

        const itemDiv = document.createElement('div');
        itemDiv.className = 'location-item route-item';
        itemDiv.id = `route-${routeName.replace(/\s+/g, '-')}`;

        const generateDayHtml = (dayNum, dayData) => {
            if (!dayData) return '';
            let html = `
                <div class="route-day" data-day="${dayNum}">
                    <strong>
                        Day ${dayNum}
                        <div class="toggle-group">
                            <span class="toggle-label">${dayData.route.length > 0 ? '綫路已顯示' : '綫路已隱藏'}</span>
                            <label class="day-toggle">
                                <input type="checkbox" checked class="day-vis-toggle" data-day="${dayNum}">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </strong>
                    <ul>`;
            dayData.route.forEach((stop, index) => {
                html += `
                    <li>${stop}
                    <svg onclick="openLocationFromNav('${stop}')" style="cursor: pointer; opacity: 0.7;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                `;
                if (index < dayData.route.length - 1) {
                    const transport = dayData.transportLabel[index];
                    const navUrl = dayData.transportation[index];
                    html += `
                        <div class="transport-info">
                            <span class="transport-label">${transport}</span>
                            <a href="${navUrl}" target="_blank" class="nav-icon" title="导航">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                            </a>
                        </div>
                    `;
                }
                html += `</li>`;
            });
            html += `</ul></div>`;
            return html;
        };

        const routeDesc = parent === 0 ? ROUTES_DESC_HK[routeName] : ROUTES_DESC_ZH[routeName];

        itemDiv.innerHTML = `
            <div class="item-header">${routeName}</div>
            <div class="item-detail">
                ${routeDesc ? `<p>${routeDesc}</p>` : ''}
                <button type="button" class="start-btn">开始旅程</button>
                ${generateDayHtml(1, routeInfo.day1)}
                ${generateDayHtml(2, routeInfo.day2)}
            </div>
        `;

        itemDiv.querySelector('.start-btn').addEventListener('click', () => {
            localStorage.setItem('routeName', routeName);
            localStorage.setItem('parent', parent);
            startNav(routeName, parent);
            let routeLinkedList;
            switch (parent) {
                case 0: routeLinkedList = ROUTES_LINKED_LISTS_HK[routeName]; break;
                case 1: routeLinkedList = ROUTES_LINKED_LISTS_ZH[routeName]; break;
            }           
            routeLinkedList.current = routeLinkedList.head;
            const info = routeLinkedList.current.value;
            setNavAtLocation(info.location, info.nextLocation, info.CO2e, info.distance, info.visits, info.surroundings);
        });

        // 辅助函数：绘制特定一天的路线（直接使用虚线直线连接）
        const drawDayRoute = (dayData, color = '#1100ff') => {
            if (!dayData || dayData.route.length < 2) return null;
            
            const waypoints = dayData.route
                .map(name => getCoords(name, parent))
                .filter(coords => coords)
                .map(coords => L.latLng(coords[0], coords[1]));

            if (waypoints.length < 2) return null;

            // 直接绘制虚线直线连接
            const polyline = L.polyline(waypoints, {
                color: color,
                opacity: 0.6,
                weight: 5,
                dashArray: '10, 10'
            }).addTo(map);

            routingControls.push(polyline);
            return polyline;
        };

        const activateRoute = () => {
            removeAllHighlight();
            clearRouting();

            // 收集所有站点的坐标
            const allStops = [];
            if (routeInfo.day1) allStops.push(...routeInfo.day1.route);
            if (routeInfo.day2) allStops.push(...routeInfo.day2.route);
            
            // 去重并高亮站点
            const uniqueStops = [...new Set(allStops)];
            uniqueStops.forEach(stopName => {
                const coords = getCoords(stopName);
                if (coords) highlightLocation(coords[0], coords[1]);
            });

            // 初始化显示状态
            const d1Toggle = itemDiv.querySelector('.day-vis-toggle[data-day="1"]');
            const d2Toggle = itemDiv.querySelector('.day-vis-toggle[data-day="2"]');

            if (d1Toggle && d1Toggle.checked) drawDayRoute(routeInfo.day1, '#1100ff');
            if (d2Toggle && d2Toggle.checked) drawDayRoute(routeInfo.day2, '#ef4444');

            // UI 交互
            if (infoCard.classList.contains('collapsed')) {
                if (isMobile()) {
                    mobileState = 'half-screen';
                    updateMobileCard();
                } else {
                    toggleDesktopCard();
                }
            }
            catDiv.classList.add('expanded');
            document.querySelectorAll('.location-item').forEach(item => item.classList.remove('active'));
            itemDiv.classList.add('active');

            // 缩放地图以包含所有点
            if (routeInfo.day1 && routeInfo.day1.route.length > 0) {
                const firstStop = getCoords(routeInfo.day1.route[0]);
                if (firstStop) map.panTo(firstStop, { animate: true });
            }
        };

        // 处理开关点击
        itemDiv.querySelectorAll('.day-vis-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止触发 item-header 的点击
                
                // 更新文字提示
                const label = toggle.closest('.toggle-group').querySelector('.toggle-label');
                if (label) {
                    label.textContent = toggle.checked ? '綫路已顯示' : '綫路已隱藏';
                }

                // 如果当前 item 是 active 的，则需要重新绘制路线
                if (itemDiv.classList.contains('active')) {
                    clearRouting();
                    const d1 = itemDiv.querySelector('.day-vis-toggle[data-day="1"]');
                    const d2 = itemDiv.querySelector('.day-vis-toggle[data-day="2"]');
                    if (d1 && d1.checked) drawDayRoute(routeInfo.day1, '#1100ff');
                    if (d2 && d2.checked) drawDayRoute(routeInfo.day2, '#ef4444');
                }
            });
        });

        itemDiv.querySelector('.item-header').addEventListener('click', () => {
            if (itemDiv.classList.contains('active')) {
                itemDiv.classList.remove('active');
                removeAllHighlight();
                clearRouting();
            } else {
                activateRoute();
            }
        });

        contentDiv.appendChild(itemDiv);
    }

    Object.keys(STOP_LOCATIONS_HK).forEach(key => registerLocation(key, DESCRIPTION_HK[key], 0));
    Object.keys(NORMAL_LOCATIONS_HK).forEach(key => registerLocation(key, DESCRIPTION_HK[key], 0));
    Object.keys(ROUTES_HK).forEach(key => registerRoutes(key, 0));

    const observerOptions = {
        root: document.querySelector('.hero-container'),
        threshold: 0.5 
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

    // 窗口大小改变时重置
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            if (infoCard.classList.contains('collapsed')) {
                if (desktopFab) {
                    desktopFab.style.display = 'flex';
                    desktopFab.style.opacity = '1';
                    desktopFab.style.pointerEvents = 'auto';
                }
                if (mapControls) mapControls.classList.remove('shifted');
            } else {
                if (mapControls) mapControls.classList.add('shifted');
            }
            infoCard.classList.remove('half-screen', 'full-screen');
        } else {
            if (desktopFab) desktopFab.style.display = 'none';
            if (mapControls) mapControls.classList.remove('shifted');
            updateMobileCard();
        }
    });

    // 初始化按钮显示
    if (!isMobile()) {
        if (desktopFab) desktopFab.style.display = 'flex';
    } else {
        if (desktopFab) desktopFab.style.display = 'none';
    }

    // --- 实时导航栏逻辑 ---
    const navPanel = document.getElementById('nav-panel');
    const stopNavBtn = document.getElementById('stop-nav-btn');
    const navHeader = document.querySelector('.nav-header');
    const navHandle = document.querySelector('.nav-handle');
    const navStatusEl = document.getElementById('nav-status');
    const navNextEl = document.getElementById('nav-next');
    const navRegionEl = document.getElementById('nav-region');
    const navRouteEl = document.getElementById('nav-route');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const navAccommodation = document.getElementById('nav-accommodation');
    const accInfo = document.getElementById('acc-info');
    const generateReportBtn = document.getElementById('generate-report-btn');

    generateReportBtn.addEventListener('click', () => {
        localStorage.setItem('reportPrepared', 'true');
        window.location.href = 'report.html'
    });

    accInfo.addEventListener('click', () => {
        openLocationFromNav(navAccommodation.textContent);
    });

    nextBtn.addEventListener('click', () => {
        const routeName = localStorage.getItem('routeName');
        const parent = localStorage.getItem('parent');
        if (!routeName || !parent) return;
        let routeLinkedList;
        switch (parent) {
            case '0': routeLinkedList = ROUTES_LINKED_LISTS_HK[routeName]; break;
            case '1': routeLinkedList = ROUTES_LINKED_LISTS_ZH[routeName]; break;
        }
        if (!routeLinkedList) return;
        const node = routeLinkedList.goForward();
        if (!node) return;
        const info = node.value;
        switch (info.type) {
            case 'atLocation': setNavAtLocation(info.location, info.nextLocation, info.CO2e, info.distance, info.visits, info.surroundings); break;
            case 'onRoute': setNavOnRoute(info.from, info.to, info.transportLabel, info.transportation, info.surroundings); break;
            case 'aDayDone': setNavADayDone(info.day, info.totalCO2e, info.totalDistance, info.totalHKD, info.totalVisits, info.accommodation, info.surroundings); break;
            case 'allDone': setNavAllDone(info.totalCO2e, info.totalDistance, info.totalHKD, info.totalVisits, info.surroundings); break;
        }
    }); 

    backBtn.addEventListener('click', () => {
        const routeName = localStorage.getItem('routeName');
        const parent = localStorage.getItem('parent');
        if (!routeName || !parent) return;
        let routeLinkedList;
        switch (parent) {
            case '0': routeLinkedList = ROUTES_LINKED_LISTS_HK[routeName]; break;
            case '1': routeLinkedList = ROUTES_LINKED_LISTS_ZH[routeName]; break;
        }
        if (!routeLinkedList) return;
        const node = routeLinkedList.goBack();
        if (!node) return;
        const info = node.value;
        switch (info.type) {
            case 'atLocation': setNavAtLocation(info.location, info.nextLocation, info.CO2e, info.distance, info.visits, info.surroundings); break;
            case 'onRoute': setNavOnRoute(info.from, info.to, info.transportLabel, info.transportation, info.surroundings); break;
            case 'aDayDone': setNavADayDone(info.day, info.totalCO2e, info.totalDistance, info.totalHKD, info.totalVisits, info.accommodation, info.surroundings); break;
            case 'allDone': setNavAllDone(info.totalCO2e, info.totalDistance, info.totalHKD, info.totalVisits, info.surroundings); break;
        }
    }); 

    const navSections = {
        atLocation: document.getElementById('nav-section-at-location'),
        onRoute: document.getElementById('nav-section-on-route'),
        dayIndex: document.getElementById('nav-section-day-index'),
        allDone: document.getElementById('nav-section-all-done')
    };
    const navSustain = {
        atLocation: document.getElementById('nav-sustain-at-location'),
        dayIndex: document.getElementById('nav-sustain-day-index'),
        allDone: document.getElementById('nav-sustain-all-done')
    };
    const navSurroundingsSection = document.getElementById('nav-section-surroundings');
    const navSurroundingsEl = document.getElementById('nav-surroundings');

    const setTextOrHide = (el, text) => {
        if (!el) return;
        if (text === null || text === undefined) {
            el.classList.add('hidden');
            return;
        }
        const s = String(text).trim();
        if (!s) {
            el.classList.add('hidden');
            return;
        }
        el.classList.remove('hidden');
        el.textContent = s;
    };

    const hasValue = (v) => v !== null && v !== undefined && String(v).trim().length > 0;

    const getAnyCoords = (locName) => STOP_LOCATIONS_HK[locName] || NORMAL_LOCATIONS_HK[locName] || STOP_LOCATIONS_ZH[locName] || NORMAL_LOCATIONS_ZH[locName];

    const openLocationFromNav = (locName) => {
        const coords = getAnyCoords(locName);
        if (!coords) return;

        navState = 'collapsed';
        navPanel.classList.remove('half-screen', 'full-screen');
        navPanel.classList.add('collapsed');

        if (isMobile()) {
            mobileState = 'half-screen';
            updateMobileCard();
        } else if (infoCard.classList.contains('collapsed')) {
            toggleDesktopCard();
        }

        const safeId = locName.replace(/\s+/g, '-');
        let itemDiv = document.getElementById(`item-${safeId}`);
        if (!itemDiv) {
            itemDiv = Array.from(document.querySelectorAll('.location-item')).find(el => {
                const h = el.querySelector('.item-header');
                return h && h.textContent.trim() === locName;
            }) || null;
        }

        if (itemDiv) {
            const catDiv = itemDiv.closest('.location-category');
            if (catDiv) catDiv.classList.add('expanded');
            document.querySelectorAll('.location-item').forEach(item => item.classList.remove('active'));
            itemDiv.classList.add('active');
            setTimeout(() => {
                itemDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 250);
        }

        removeAllHighlight();
        highlightLocation(coords[0], coords[1]);
        map.panTo([coords[0], coords[1]], { animate: true });
    };
    window.openLocationFromNav = openLocationFromNav;

    const setSurroundings = (surroundings) => {
        if (!navSurroundingsSection || !navSurroundingsEl) return;
        navSurroundingsEl.innerHTML = '';

        if (!Array.isArray(surroundings) || surroundings.length === 0) {
            navSurroundingsSection.classList.add('hidden');
            return;
        }

        const valid = surroundings.filter(s => hasValue(s));
        if (valid.length === 0) {
            navSurroundingsSection.classList.add('hidden');
            return;
        }

        valid.forEach((name) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'nav-chip';
            btn.textContent = name;
            btn.addEventListener('click', () => openLocationFromNav(name));
            navSurroundingsEl.appendChild(btn);
        });
        navSurroundingsSection.classList.remove('hidden');
    };

    const setRowValue = (rowId, valueElId, value) => {
        const row = document.getElementById(rowId);
        const valEl = valueElId ? document.getElementById(valueElId) : null;
        if (!row) return;

        if (value === null || value === undefined) {
            row.classList.add('hidden');
            if (valEl) valEl.textContent = '';
            return;
        }
        const s = String(value).trim();
        if (!s) {
            row.classList.add('hidden');
            if (valEl) valEl.textContent = '';
            return;
        }
        row.classList.remove('hidden');
        if (valEl) valEl.textContent = s;
    };

    const setRowLink = (rowId, linkId, href) => {
        const row = document.getElementById(rowId);
        const linkEl = document.getElementById(linkId);
        if (!row || !linkEl) return;

        if (href === null || href === undefined) {
            row.classList.add('hidden');
            linkEl.removeAttribute('href');
            return;
        }
        const s = String(href).trim();
        if (!s) {
            row.classList.add('hidden');
            linkEl.removeAttribute('href');
            return;
        }
        row.classList.remove('hidden');
        linkEl.href = s;
    };

    const setRowEmphasis = (rowId, enable) => {
        const row = document.getElementById(rowId);
        if (!row) return;
        row.classList.toggle('nav-row-emphasis', !!enable && !row.classList.contains('hidden'));
    };

    const showOnlySection = (key) => {
        Object.entries(navSections).forEach(([k, el]) => {
            if (!el) return;
            if (k === key) el.classList.remove('hidden');
            else el.classList.add('hidden');
        });
    };

    const sectionHasVisibleRows = (sectionEl) => {
        if (!sectionEl) return false;
        return Array.from(sectionEl.querySelectorAll('.nav-row')).some(r => !r.classList.contains('hidden'));
    };

    function setNavAtLocation(location, nextLocatioin, CO2e, distance, visits, surroundings) {
        showOnlySection('atLocation');

        setRowValue('nav-row-cur-location', 'nav-cur-location', location);
        setRowValue('nav-row-next-location', 'nav-next-location', nextLocatioin);
        setRowValue('nav-row-co2e', 'nav-co2e', hasValue(CO2e) ? `${CO2e}kg` : null);
        setRowValue('nav-row-distance', 'nav-distance', hasValue(distance) ? `${distance}km` : null);
        setRowValue('nav-row-visits', 'nav-visits', visits);
        setRowEmphasis('nav-row-co2e', hasValue(CO2e));
        setRowEmphasis('nav-row-distance', hasValue(distance));
        setRowEmphasis('nav-row-visits', hasValue(visits));
        if (navSustain.atLocation) {
            navSustain.atLocation.classList.toggle('hidden', !(hasValue(CO2e) || hasValue(distance)));
        }
        setSurroundings(surroundings);

        setTextOrHide(navNextEl, location === null || location === undefined ? null : `${location}`);
        setTextOrHide(navStatusEl, nextLocatioin === null || nextLocatioin === undefined ? null : `下一站: ${nextLocatioin}`);

        if (navSections.atLocation && !sectionHasVisibleRows(navSections.atLocation)) {
            navSections.atLocation.classList.add('hidden');
        }
    };
    window.setNavAtLocation = setNavAtLocation;

    function setNavOnRoute(from, to, transportLable, transportation, surroundings) {
        showOnlySection('onRoute');

        setRowValue('nav-row-from', 'nav-from', from);
        setRowValue('nav-row-to', 'nav-to', to);
        setRowValue('nav-row-transport-label', 'nav-transport-label', transportLable);
        setRowLink('nav-row-transport-link', 'nav-transport-link', transportation);
        setSurroundings(surroundings);

        const routeText = (from !== null && from !== undefined && String(from).trim()) || (to !== null && to !== undefined && String(to).trim())
            ? `${[from, to].filter(v => v !== null && v !== undefined && String(v).trim()).join(' → ')}`
            : null;
        setTextOrHide(navNextEl, routeText);
        setTextOrHide(navStatusEl, transportLable === null || transportLable === undefined ? null : `交通: ${transportLable}`);

        if (navSections.onRoute && !sectionHasVisibleRows(navSections.onRoute)) {
            navSections.onRoute.classList.add('hidden');
        }
    };
    window.setNavOnRoute = setNavOnRoute;

    function setNavADayDone(day, totalCO2e, totalDistance, totalHKD, totalVisits, accommodation, surroundings) {
        showOnlySection('dayIndex');

        setRowValue('nav-row-accommodation', 'nav-accommodation', hasValue(accommodation) ? accommodation : null);
        setRowValue('nav-row-total-co2e', 'nav-total-co2e', hasValue(totalCO2e) ? `${totalCO2e}kg` : null);
        setRowValue('nav-row-total-distance', 'nav-total-distance', hasValue(totalDistance) ? `${totalDistance}km` : null);
        setRowValue('nav-row-total-hkd', 'nav-total-hkd', hasValue(totalHKD) ? `${totalHKD}HKD` : null);
        setRowValue('nav-row-total-visits', 'nav-total-visits', totalVisits);
        setRowEmphasis('nav-row-total-co2e', hasValue(totalCO2e));
        setRowEmphasis('nav-row-total-distance', hasValue(totalDistance));
        setRowEmphasis('nav-row-total-hkd', hasValue(totalHKD));
        setRowEmphasis('nav-row-total-visits', hasValue(totalVisits));
        if (navSustain.dayIndex) {
            navSustain.dayIndex.classList.toggle('hidden', !(hasValue(totalVisits) || hasValue(totalCO2e) || hasValue(totalDistance) || hasValue(totalHKD)));
        }
        setSurroundings(surroundings);

        setTextOrHide(navNextEl, day === null || day === undefined ? null : `您已完成第${day}天的行程！`);
        setTextOrHide(navStatusEl, null);

        if (navSections.dayIndex && !sectionHasVisibleRows(navSections.dayIndex)) {
            navSections.dayIndex.classList.add('hidden');
        }
    };
    window.setNavADayDone = setNavADayDone;

    function setNavAllDone(totalCO2e, totalDistance, totalHKD, totalVisits, surroundings) {
        localStorage.setItem('totalCO2e', totalCO2e);
        localStorage.setItem('totalDistance', totalDistance);
        localStorage.setItem('totalHKD', totalHKD);
        localStorage.setItem('totalVisits', totalVisits);
        const keywords = getRandomItems(SUSTAINABLE_TITLES, 2);
        localStorage.setItem('keyword1', keywords[0]);
        localStorage.setItem('keyword2', keywords[1]);
        let SUSTAINABLE_CONCLUSION, SITES_CONCLUSION;
        const parent = localStorage.getItem('parent');
        switch (parent) {
            case '0': SUSTAINABLE_CONCLUSION = SUSTAINABLE_CONCLUSION_HK; SITES_CONCLUSION = SITES_CONCLUSION_HK; break;
            case '1': SUSTAINABLE_CONCLUSION = SUSTAINABLE_CONCLUSION_ZH; SITES_CONCLUSION = SITES_CONCLUSION_ZH; break;
        }
        const sus = getRandomItems(SUSTAINABLE_CONCLUSION, 2);
        const sit = getRandomItems(SITES_CONCLUSION, 2);
        localStorage.setItem('conclusion1', sit[0]);
        localStorage.setItem('conclusion2', sus[0]);
        localStorage.setItem('conclusion3', sit[1]);
        localStorage.setItem('conclusion4', sus[1]);
        showOnlySection('allDone');

        setRowValue('nav-row-all-co2e', 'nav-all-co2e', hasValue(totalCO2e) ? `${totalCO2e}kg` : null);
        setRowValue('nav-row-all-distance', 'nav-all-distance', hasValue(totalDistance) ? `${totalDistance}km` : null);
        setRowValue('nav-row-all-hkd', 'nav-all-hkd', hasValue(totalHKD) ? `${totalHKD}HKD` : null);
        setRowValue('nav-row-all-visits', 'nav-all-visits', totalVisits);
        setRowEmphasis('nav-row-all-co2e', hasValue(totalCO2e));
        setRowEmphasis('nav-row-all-distance', hasValue(totalDistance));
        setRowEmphasis('nav-row-all-hkd', hasValue(totalHKD));
        setRowEmphasis('nav-row-all-visits', hasValue(totalVisits));
        if (navSustain.allDone) {
            navSustain.allDone.classList.toggle('hidden', !(hasValue(totalCO2e) || hasValue(totalDistance) || hasValue(totalHKD)));
        }
        setSurroundings(surroundings);

        setTextOrHide(navNextEl, '您已完成這趟旅程！');
        setTextOrHide(navStatusEl, null);

        if (navSections.allDone && !sectionHasVisibleRows(navSections.allDone)) {
            navSections.allDone.classList.add('hidden');
        }
    };
    window.setNavAllDone = setNavAllDone;
    
    const updateNavUI = () => {
        navPanel.classList.remove('collapsed', 'half-screen', 'full-screen');
        navPanel.classList.add(navState);

        // 互斥逻辑：如果上方导航栏展开，下方信息卡片必须完全收起，AI 也要收起
        if (isMobile() && (navState === 'half-screen' || navState === 'full-screen')) {
            if (mobileState !== 'collapsed') {
                mobileState = 'collapsed';
                updateMobileCard();
            }
            collapseAI(); // 收起 AI
        }
    };

    /**
     * 开始导航：显示导航栏
     */
    window.startNav = function(routeName, parent) {
        navPanel.classList.remove('nav-hidden');
        navState = 'collapsed';
        updateNavUI();
        collapseAI();
        let region = '';
        switch (parent) {
            case 0: region = '香港-西贡'; break;
            case 1: region = '珠海'; break;
        }
        setTextOrHide(navRegionEl, region);
        setTextOrHide(navRouteEl, routeName);
    };

    /**
     * 停止导航：隐藏导航栏
     */
    window.stopNav = function() {
        navPanel.classList.add('nav-hidden');
    };

    // 退出导航按钮
    if (stopNavBtn) {
        stopNavBtn.addEventListener('click', (e) => {
            if (confirm('確認退出嗎?')) {
                e.stopPropagation();
                stopNav();
            }
        });
    }

    // 点击 Header 切换状态
    if (navHeader) {
        navHeader.addEventListener('click', () => {
            if (isMobile()) {
                if (navState === 'collapsed') navState = 'half-screen';
                else if (navState === 'half-screen') navState = 'full-screen';
                else navState = 'collapsed';
            } else {
                // 电脑端只有收起和展开
                navState = (navState === 'collapsed') ? 'full-screen' : 'collapsed';
            }
            updateNavUI();
        });
    }

    // 移动端手柄滑动交互
    if (navHandle) {
        let startY = 0;
        navHandle.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });

        navHandle.addEventListener('touchend', (e) => {
            if (!isMobile()) return;
            const endY = e.changedTouches[0].clientY;
            const diff = endY - startY;

            if (Math.abs(diff) > 50) {
                if (diff > 0) { // 向下滑
                    if (navState === 'collapsed') navState = 'half-screen';
                    else if (navState === 'half-screen') navState = 'full-screen';
                } else { // 向上滑
                    if (navState === 'full-screen') navState = 'half-screen';
                    else if (navState === 'half-screen') navState = 'collapsed';
                }
                updateNavUI();
            }
        });
    }
});
