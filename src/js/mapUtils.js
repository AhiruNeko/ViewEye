let currentMap = null;
let locationLayer = null;

// 车站站点
export const STOP_LOCATIONS_HK = {
    '彩虹站': [22.334952492505064, 114.20898295313086],

    '西贡': [22.382204483656448, 114.2738303509608],

    '北潭凹': [22.420619525333258, 114.33195437348171],
    '北潭涌': [22.397216626228307, 114.31925347428599],
    '西湾亭': [22.394808336734126, 114.36017762550597],
    '万宜水库东坝': [22.362059626691234, 114.37143623814325]
};

// 游览地点
export const NORMAL_LOCATIONS_HK = {
    'WM Hotel': [22.38552932793403, 114.27554214056737],
    '西贡码头': [22.381327136754805, 114.2739433233398],
    '万宜游乐场': [22.381341769689463, 114.27199802274066],
    'Lobster Une': [22.38108404248143, 114.27167727088982],
    '海鲜街': [22.379416925443252, 114.27206708756552],
    '天后古庙': [22.381050417252094, 114.27083890947377],
    '火山探知馆': [22.382466832132476, 114.27402755672654],

    '破边洲': [22.358335251766373, 114.37853133247764],
    '浪茄湾': [22.374462310789482, 114.37626441361076],
    '西湾山': [22.38804003347429, 114.3778717716697],

    '西湾村': [22.39728309661538, 114.37077097167862],
    '咸田湾': [22.409644592366625, 114.37591185727526],
    '赤径': [22.421803396744806, 114.35302302431909]
}

export const ROUTES_HK = {

}

export const DESCRIPTION_HK = {
    '彩虹站': '',
    '西贡': '',
    '北潭凹': '',
    '北潭涌': '',
    '西湾亭': '',
    '万宜水库东坝': '',
    'WM Hotel': '',
    '西贡码头': '',
    '万宜游乐场': '',
    'Lobster Une': '',
    '海鲜街': '',
    '天后古庙': '',
    '火山探知馆': '',
    '破边洲': '',
    '浪茄湾': '',
    '西湾山': '',
    '西湾村': '',
    '咸田湾': '',
    '赤径': ''
}

export const DETAILS_HK = {
    '彩虹站': '',
    '西贡': '',
    '北潭凹': '',
    '北潭涌': '',
    '西湾亭': '',
    '万宜水库东坝': '',
    'WM Hotel': '',
    '西贡码头': '',
    '万宜游乐场': '',
    'Lobster Une': '',
    '海鲜街': '',
    '天后古庙': '',
    '火山探知馆': '',
    '破边洲': '',
    '浪茄湾': '',
    '西湾山': '',
    '西湾村': '',
    '咸田湾': '',
    '赤径': ''
}

/**
 * 初始化地图工具，关联地图实例
 * @param {L.Map} map - Leaflet 地图实例
 */
export function initMapUtils(map) {
    currentMap = map;
    locationLayer = L.layerGroup().addTo(map);
}

/**
 * 3. 在地图上添加标记
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @param {Function|null} [clickFunc] - 点击标记时的回调函数
 */
export function addLocation(lat, lng, clickFunc) {
    if (!locationLayer) {
        console.error("MapUtils not initialized with a map instance.");
        return;
    }

    const isClickable = typeof clickFunc === 'function';
    
    // 创建标记
    const marker = L.marker([lat, lng], {
        interactive: true // 确保可以交互
    }).addTo(locationLayer);
    
    if (isClickable) {
        // 设置鼠标指针为手型
        marker.getElement().style.cursor = 'pointer';

        // 绑定点击事件
        marker.on('click', (e) => {
            clickFunc(e, lat, lng);
        });

        // 绑定 Hover 效果
        const defaultIcon = new L.Icon.Default();
        const hoverIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // 定义高亮图标
        const highlightIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [35, 56],
            iconAnchor: [17, 56],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // 定义高亮时的 Hover 图标 (更大一点)
        const highlightHoverIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [40, 64],
            iconAnchor: [20, 64],
            popupAnchor: [1, -34],
            shadowSize: [46, 46]
        });

        marker.on('mouseover', () => {
            const currentIconUrl = marker.options.icon.options.iconUrl || "";
            if (currentIconUrl.indexOf('red') !== -1) {
                // 如果是高亮状态，变为更大红
                marker.setIcon(highlightHoverIcon);
            } else {
                // 否则变为绿色 hover
                marker.setIcon(hoverIcon);
            }
            marker.setZIndexOffset(1000);
        });

        marker.on('mouseout', () => {
            const currentIconUrl = marker.options.icon.options.iconUrl || "";
            if (currentIconUrl.indexOf('red') !== -1) {
                // 恢复为普通红（高亮状态）
                marker.setIcon(highlightIcon);
            } else {
                // 恢复为默认蓝
                marker.setIcon(defaultIcon);
            }
            marker.setZIndexOffset(0);
        });
    }
    
    return marker;
}

/**
 * 4. 从地图上移除指定坐标的标记
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 */
export function removeLocation(lat, lng) {
    if (!locationLayer) return;
    locationLayer.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            const pos = layer.getLatLng();
            if (pos.lat === lat && pos.lng === lng) {
                locationLayer.removeLayer(layer);
            }
        }
    });
}

/**
 * 5. 清除地图上所有由 addLocation 添加的标记
 */
export function removeAllLocation() {
    if (!locationLayer) return;
    locationLayer.clearLayers();
}

/**
 * 6. 高亮标记指定坐标
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 */
export function highlightLocation(lat, lng) {
    if (!locationLayer) return;
    
    // 自定义高亮图标 (红色并放大)
    const highlightIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [35, 56], // 原始尺寸是 [25, 41]，放大一点
        iconAnchor: [17, 56],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    locationLayer.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            const pos = layer.getLatLng();
            if (pos.lat === lat && pos.lng === lng) {
                layer.setIcon(highlightIcon);
                layer.setZIndexOffset(1000); // 确保高亮的标记在最上层
            }
        }
    });
}

/**
 * 7. 恢复指定坐标标记为普通显示
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 */
export function removeHighlight(lat, lng) {
    if (!locationLayer) return;
    
    // 默认蓝图标
    const defaultIcon = new L.Icon.Default();

    locationLayer.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            const pos = layer.getLatLng();
            if (pos.lat === lat && pos.lng === lng) {
                layer.setIcon(defaultIcon);
                layer.setZIndexOffset(0);
            }
        }
    });
}

/**
 * 8. 恢复所有高亮标记为普通显示
 */
export function removeAllHighlight() {
    if (!locationLayer) return;
    
    const defaultIcon = new L.Icon.Default();

    locationLayer.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            layer.setIcon(defaultIcon);
            layer.setZIndexOffset(0);
        }
    });
}

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

/**
 * 1. 逆地理编码：坐标 -> 地名
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @returns {Promise<string>} - 返回详细地址字符串
 */
export async function getAddressFromCoords(lat, lng) {
    try {
        const url = `${NOMINATIM_BASE_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const response = await fetch(url, {
            headers: { 'User-Agent': 'ViewEye-App' }
        });
        
        if (!response.ok) throw new Error("Request failed");
        
        const data = await response.json();
        return data.display_name || "Unknown";
    } catch (error) {
        console.error("Locating error: ", error);
        return "Locating failed";
    }
}

/**
 * 2. 地理编码：地名 -> 坐标
 * @param {string} address - 地名或详细地址
 * @returns {Promise<{lat: number, lng: number}|null>} - 返回坐标对象或 null
 */
export async function getCoordsFromAddress(address) {
    try {
        const url = `${NOMINATIM_BASE_URL}/search?format=jsonv2&q=${encodeURIComponent(address)}`;
        
        const response = await fetch(url, {
            headers: { 'User-Agent': 'ViewEye-App' }
        });
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error("Locating error: ", error);
        return null;
    }
}