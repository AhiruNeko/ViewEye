import { supabase, isLogined } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. 初始化地图 西贡
    const map = L.map('map', {
        zoomControl: false
    }).setView([22.382183545063885, 114.27381914090027], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 2. 导航栏登录状态
    const navBtn = document.getElementById('navBtn');
    const checkLogin = async () => {
        const logined = await isLogined();
        if (logined) {
            navBtn.textContent = '我的賬戶';
            navBtn.href = 'account.html';
        } else {
            navBtn.textContent = '登入';
            navBtn.href = 'login.html';
        }
    };
    checkLogin();

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
            }
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

    // 5. 移动端状态切换
    let mobileState = 'collapsed'; // 'collapsed', 'half-screen', 'full-screen'
    
    const updateMobileCard = () => {
        infoCard.classList.remove('collapsed', 'half-screen', 'full-screen');
        infoCard.classList.add(mobileState);
        if (desktopFab) desktopFab.style.display = 'none';
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
});