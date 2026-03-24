import { isLogined, recordPreviousPage, getCurrentUser } from './supabase.js';

const getLS = (key) => {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return null;
    const v = String(raw).trim();
    if (!v || v === 'null' || v === 'undefined') return null;
    return v;
};

const getNum = (key) => {
    const v = getLS(key);
    if (v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

const fmt = (n, unit, digits = 1) => {
    if (n === null || n === undefined) return '--';
    const rounded = Math.round(n * Math.pow(10, digits)) / Math.pow(10, digits);
    return `${rounded}${unit}`;
};

document.addEventListener('DOMContentLoaded', async () => {

    const navBtn = document.getElementById('navBtn');
    const shareBtn = document.getElementById('shareBtn');
    const reportCard = document.getElementById('reportCard');
    const reportStage = document.getElementById('reportStage');

    const logined = await isLogined();
    const reportPrepared = localStorage.getItem('reportPrepared');
    if (!logined && reportPrepared !== 'true') {
        recordPreviousPage('map.html');
        window.location.href = 'login.html';
        return;
    } else if (!logined && reportPrepared === 'true') {
        recordPreviousPage('report.html');
        window.location.href = 'login.html';
        return;
    } else if (logined && reportPrepared === 'true') {
        localStorage.removeItem('reportPrepared');
    } else if (logined && reportPrepared !== 'true') {
        window.location.href = 'map.html';
    }
    if (navBtn) {
        navBtn.textContent = '我的賬戶';
        navBtn.href = 'account.html';
    }

    const fitReport = () => {
        if (!reportCard || !reportStage) return;
        const designW = 750;
        const designH = 1000;
        const cw = reportCard.clientWidth || 0;
        const ch = reportCard.clientHeight || 0;
        if (!cw || !ch) return;
        const scale = Math.min(cw / designW, ch / designH);
        reportStage.style.transformOrigin = 'top left';
        reportStage.style.transform = `scale(${scale})`;
    };
    fitReport();
    window.addEventListener('resize', fitReport);
    window.addEventListener('orientationchange', fitReport);
    // 保险：多次尝试，适配字体/图片加载后尺寸变动
    setTimeout(fitReport, 0);
    setTimeout(fitReport, 120);
    setTimeout(fitReport, 300);
    setTimeout(fitReport, 600);

    const userData = await getCurrentUser();
    const user = userData?.user;
    const userName = user?.user_metadata?.name || user?.user_metadata?.full_name || '用戶';

    const parent = getLS('parent');
    const routeName = getLS('routeName') || '未選擇路綫';
    const region = parent === '1' ? '珠海' : '香港西貢';

    const keyword1 = getLS('keyword1') || '低碳出行';
    const keyword2 = getLS('keyword2') || '在地支持';

    const totalCO2e = getNum('totalCO2e');
    const totalDistance = getNum('totalDistance');
    const totalHKD = getNum('totalHKD');
    const totalVisits = getNum('totalVisits');

    const conclusion1Text = getLS('conclusion1');
    const conclusion2Text = getLS('conclusion2');
    const conclusion3Text = getLS('conclusion3');
    const conclusion4Text = getLS('conclusion4');

    const reportTitle = document.getElementById('reportTitle');
    const reportRoute = document.getElementById('reportRoute');
    const metricCO2e = document.getElementById('metricCO2e');
    const metricDistance = document.getElementById('metricDistance');
    const metricHKD = document.getElementById('metricHKD');
    const metricVisits = document.getElementById('metricVisits');
    const k1 = document.getElementById('keyword1');
    const k2 = document.getElementById('keyword2');
    const conclusion1 = document.getElementById('conclusion-text-1');
    const conclusion2 = document.getElementById('conclusion-text-2');
    const conclusion3 = document.getElementById('conclusion-text-3');
    const conclusion4 = document.getElementById('conclusion-text-4');

    if (conclusion1) conclusion1.textContent = conclusion1Text || '--';
    if (conclusion2) conclusion2.textContent = conclusion2Text || '--';
    if (conclusion3) conclusion3.textContent = conclusion3Text || '--';
    if (conclusion4) conclusion4.textContent = conclusion4Text || '--';

    if (reportTitle) reportTitle.textContent = `恭喜你，${userName}！`;
    if (reportRoute) reportRoute.textContent = `${region} · ${routeName}`;
    if (metricCO2e) metricCO2e.textContent = fmt(totalCO2e, 'kg', 2);
    if (metricDistance) metricDistance.textContent = fmt(totalDistance, 'km', 1);
    if (metricHKD) metricHKD.textContent = fmt(totalHKD, 'HKD', 0);
    if (metricVisits) metricVisits.textContent = totalVisits === null ? '--' : `${Math.round(totalVisits)}次`;
    if (k1) k1.textContent = keyword1;
    if (k2) k2.textContent = keyword2;

    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const card = document.getElementById('reportCard');
            if (!card) return;
            if (!window.html2canvas) {
                alert('圖片渲染模組載入失敗，請刷新頁面後重試。');
                return;
            }
            const text = `我完成了 ${region} · ${routeName} 的旅行！\n減碳：${fmt(totalCO2e, 'kg', 2)}\n綠色里程：${fmt(totalDistance, 'km', 1)}\n本地經濟貢獻：${fmt(totalHKD, 'HKD', 0)}\n探訪遺址：${totalVisits === null ? '--' : `${Math.round(totalVisits)}次`}\n關鍵詞：${keyword1}、${keyword2}\n\nViewEye`;
            const prevText = shareBtn.textContent;
            shareBtn.disabled = true;
            shareBtn.textContent = '生成圖片中…';
            try {
                const canvas = await window.html2canvas(card, {
                    useCORS: true,
                });
                const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
                if (blob) {
                    const file = new File([blob], 'vieweye-report.png', { type: 'image/png' });
                    if (navigator.canShare && navigator.canShare({files: [file]})) {
                        try {
                            await navigator.share({
                                title: '我的 ViewEye 旅行报告',
                                text,
                                files: [file]
                            });
                            return;
                        } catch (e) {
                            console.log('分享失敗', e);
                        }
                    } else {                    
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'vieweye-report.png';
                        document.body.appendChild(link);
                        link.click();
                        URL.revokeObjectURL(link.href);
                        link.remove();
                        alert('已產生報告圖片並開始下載，請在相簿/下載中分享該圖片');
                    }
                    return;
                }
            } catch (e) {
                alert('報告圖片失敗，請稍後再試。');
                return;
            } finally {
                shareBtn.disabled = false;
                shareBtn.textContent = prevText;
            }
        });
    }
});
