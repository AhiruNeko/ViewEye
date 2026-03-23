import { recordPreviousPage, isLogined } from './supabase.js';
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
    ROUTES_ZH
} from './mapUtils.js';

import { getAIResponse } from './ai.js';

document.addEventListener('DOMContentLoaded', async () => {
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

    const getCoords = (name) => {
        return STOP_LOCATIONS_HK[name] || NORMAL_LOCATIONS_HK[name];
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

    // --- AI 聊天逻辑 ---
    const aiContainer = document.getElementById('ai-container');
    const aiToggleBtn = document.getElementById('ai-toggle-btn');
    const aiInput = document.getElementById('ai-input');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiResponseArea = document.getElementById('ai-response-area');
    const aiLoading = aiResponseArea.querySelector('.ai-loading');
    const aiResponseText = document.getElementById('ai-response-text');

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
        const prompt = aiInput.value.trim();
        if (!prompt) return;

        // 显示响应区域和加载动画
        aiResponseArea.classList.remove('hidden');
        aiLoading.classList.remove('hidden');
        aiResponseText.textContent = '';
        aiInput.value = '';

        try {
            const response = await getAIResponse(prompt);
            aiResponseText.textContent = response;
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
        const coords = getCoords(title);
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
            <div class="item-header">${title}</div>
            <div class="item-detail">
                <p>${text}</p>
                <a href="#">了解更多</a>
            </div>
        `;

        // 统一的激活逻辑：高亮、展开、滚动
        const activateLocation = (fromMap = false) => {
            removeAllHighlight();
            clearRouting();
            highlightLocation(lat, lng);
            
            // 如果卡片是收起的，则打开它
            if (infoCard.classList.contains('collapsed')) {
                if (isMobile()) {
                    mobileState = 'half-screen';
                    updateMobileCard();
                } else {
                    toggleDesktopCard();
                }
            }

            // 展开所属的一级分类
            catDiv.classList.add('expanded');

            // 激活当前二级分类（展开文段）
            document.querySelectorAll('.location-item').forEach(item => item.classList.remove('active'));
            itemDiv.classList.add('active');

            // 如果是从地图点击触发的，则滚动到侧边栏对应位置
            if (fromMap) {
                itemDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // 地图视图平移到该点
            map.panTo([lat, lng], { animate: true });
        };

        // 点击侧边栏标题的行为
        itemDiv.querySelector('.item-header').addEventListener('click', () => {
            if (itemDiv.classList.contains('active')) {
                itemDiv.classList.remove('active');
                removeHighlight(lat, lng);
            } else {
                activateLocation(false);
            }
        });

        // 将地点添加到地图，并设置点击标记后的行为
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
                html += `<li>${stop}`;
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

        itemDiv.innerHTML = `
            <div class="item-header">${routeName}</div>
            <div class="item-detail">
                ${generateDayHtml(1, routeInfo.day1)}
                ${generateDayHtml(2, routeInfo.day2)}
            </div>
        `;

        // 辅助函数：绘制特定一天的路线（直接使用虚线直线连接）
        const drawDayRoute = (dayData, color = '#1100ff') => {
            if (!dayData || dayData.route.length < 2) return null;
            
            const waypoints = dayData.route
                .map(name => getCoords(name))
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

        // 初始化注册路线
    Object.keys(ROUTES_HK).forEach(key => registerRoutes(key, 0));
    // Object.keys(ROUTES_ZH).forEach(key => registerRoutes(key, 1)); // 暂时为空

    // --- 新增内容浮入浮出逻辑 (保持原有逻辑) ---
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
    window.startNav = function() {
        navPanel.classList.remove('nav-hidden');
        navState = 'collapsed';
        updateNavUI();
        collapseAI(); // 开启导航时收起 AI
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