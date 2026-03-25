import { LinkedList } from './utils.js';
import { formatToFourChars } from './utils.js';

let currentMap = null;
let locationLayer = null;

// 香港

export const STOP_LOCATIONS_HK = {
    '彩虹站': [22.334952492505064, 114.20898295313086],

    '西貢': [22.382204483656448, 114.2738303509608],

    '北潭凹': [22.420619525333258, 114.33195437348171],
    '北潭涌': [22.397216626228307, 114.31925347428599],
    '西灣亭': [22.394808336734126, 114.36017762550597],
    '萬宜水庫東壩': [22.362059626691234, 114.37143623814325]
};

export const ROUTES_DESC_HK = {
    '均衡綫路': '均衡了徒步與賞景，適合大部分人。',
    '休閑綫路': '以賞景爲主，較爲輕鬆，適合帶有老人小孩的家庭出行，也適合度假放鬆。',
    '硬核綫路': '包含高强度徒步鍛煉，也能欣賞沿途風景，適合登山愛好者或探險家。'
}

export const ROUTES_HK = {
    '均衡綫路': {
        day1: {
            route: ['彩虹站', '北潭涌', '萬宜水庫東壩', '西灣亭', '北潭涌', '西貢'],
            transportLabel: ['小巴', '小巴', '徒步', '小巴', '小巴'],
            transportation: [
                'https://maps.app.goo.gl/2YZEY9zFhg8VpmMa7',
                'https://maps.app.goo.gl/gPzRcNdvJSkf9Py2A',
                'https://maps.app.goo.gl/83NAvyBf5B2DUaYq9',
                'https://hkbus.fandom.com/wiki/%E5%B1%85%E6%B0%91%E5%B7%B4%E5%A3%ABNR29%E7%B7%9A',
                'https://maps.app.goo.gl/9kzgM4yXnoUsFe9C7'
            ],
            CO2e: [null, 2.813, 1.363, 1.190, 0.87, 1.131],
            HKD: () => getRandomNormal(250, 450),
            distance: [null, 19.4, 9.4, 7.0, 6.0, 7.8],
            visits: [null, null, 1, null, null, 2],
            surroundings: [
                ['彩虹站'],
                ['彩虹站', '北潭涌'],
                ['北潭涌'],
                ['北潭涌', '萬宜水庫東壩'],
                ['萬宜水庫東壩', '聯合國教科文組織世界地質公園', '破邊洲'],
                ['萬宜水庫東壩', '西灣亭', '浪茄灣', '西灣山'],
                ['西灣亭'],
                ['西灣亭', '北潭涌'],
                ['北潭涌'],
                ['北潭涌', '西貢'],
                ['西貢', 'WM Hotel', '西貢碼頭', '萬宜遊樂場', 'Lobster Une', '海鮮街', '天后古廟', '火山探知館']
            ],
            accommodation: 'WM Hotel'
        },
        day2: {
            route: ['西貢', '彩虹站'],
            transportLabel: ['小巴'],
            transportation: ['https://maps.app.goo.gl/MDS8v94vEg8Qozdd9'],
            CO2e: [null, 1.697],
            HKD: () => getRandomNormal(250, 450),
            distance: [null, 11.7],
            visits: [2, null],
            surroundings: [
                ['西貢', 'WM Hotel', '西貢碼頭', '萬宜遊樂場', 'Lobster Une', '海鮮街', '天后古廟', '火山探知館'],
                ['西貢', '彩虹站'],
                ['彩虹站']
            ],
            accommodation: 'WM Hotel'
        }
    },
    '休閑綫路': {
        day1: {
            route: ['彩虹站', '北潭涌', '萬宜水庫東壩', '西貢'],
            transportLabel: ['小巴', '小巴', '小巴'],
            transportation: [
                'https://maps.app.goo.gl/2YZEY9zFhg8VpmMa7',
                'https://maps.app.goo.gl/gPzRcNdvJSkf9Py2A',
                'https://maps.app.goo.gl/4iP25Rn3CihGF9yC6'
            ],
            CO2e: [null, 2.813, 1.363, 2.48],
            HKD: () => getRandomNormal(250, 450),
            distance: [null, 19.4, 9.4, 17.1],
            visits: [null, null, 1, 2],
            surroundings: [
                ['彩虹站'],
                ['彩虹站', '北潭涌'],
                ['北潭涌'],
                ['北潭涌', '萬宜水庫東壩'],
                ['萬宜水庫東壩', '聯合國教科文組織世界地質公園', '破邊洲'],
                ['萬宜水庫東壩', '西貢'],
                ['西貢', 'WM Hotel', '西貢碼頭', '萬宜遊樂場', 'Lobster Une', '海鮮街', '天后古廟', '火山探知館']
            ],
            accommodation: 'WM Hotel'
        },
        day2: {
            route: ['西貢', '北潭涌', '西灣亭', '北潭涌', '彩虹站'],
            transportLabel: ['小巴', '小巴', '小巴', '小巴'],
            transportation: [
                'https://maps.app.goo.gl/X3kznWoSXHBLARmU8',
                'https://hkbus.fandom.com/wiki/%E5%B1%85%E6%B0%91%E5%B7%B4%E5%A3%ABNR29%E7%B7%9A',
                'https://hkbus.fandom.com/wiki/%E5%B1%85%E6%B0%91%E5%B7%B4%E5%A3%ABNR29%E7%B7%9A',
                'https://maps.app.goo.gl/xyX1dz2ThHZT6jYy6'
            ],
            CO2e: [null, 1.131, 0.87, 0.87, 2.813],
            HKD: () => getRandomNormal(250, 450),
            distance: [null, 7.8, 6.0, 6.0, 19.4],
            visits: [2, null, null, null, null],
            surroundings: [
                ['西貢', 'WM Hotel', '西貢碼頭', '萬宜遊樂場', 'Lobster Une', '海鮮街', '天后古廟', '火山探知館'],
                ['西貢', '北潭涌'],
                ['北潭涌'],
                ['北潭涌', '西灣亭'],
                ['西灣亭'],
                ['西灣亭', '北潭涌'],
                ['北潭涌'],
                ['北潭涌', '彩虹站'],
                ['彩虹站']
            ],
            accommodation: 'WM Hotel'
        }
    },
    '硬核綫路': {
        day1: {
            route: ['彩虹站', '北潭涌', '萬宜水庫東壩', '西灣亭', '北潭涌', '西貢'],
            transportLabel: ['小巴', '小巴', '徒步', '小巴', '小巴'],
            transportation: [
                'https://maps.app.goo.gl/2YZEY9zFhg8VpmMa7',
                'https://maps.app.goo.gl/gPzRcNdvJSkf9Py2A',
                'https://maps.app.goo.gl/83NAvyBf5B2DUaYq9',
                'https://hkbus.fandom.com/wiki/%E5%B1%85%E6%B0%91%E5%B7%B4%E5%A3%ABNR29%E7%B7%9A',
                'https://maps.app.goo.gl/9kzgM4yXnoUsFe9C7'
            ],
            CO2e: [null, 2.813, 1.363, 1.190, 0.87, 1.131],
            HKD: () => getRandomNormal(250, 450),
            distance: [null, 19.4, 9.4, 7.0, 6.0, 7.8],
            visits: [null, null, 1, null, null, 2],
            surroundings: [
                ['彩虹站'],
                ['彩虹站', '北潭涌'],
                ['北潭涌'],
                ['北潭涌', '萬宜水庫東壩'],
                ['萬宜水庫東壩', '聯合國教科文組織世界地質公園', '破邊洲'],
                ['萬宜水庫東壩', '西灣亭', '浪茄灣', '西灣山'],
                ['西灣亭'],
                ['西灣亭', '北潭涌'],
                ['北潭涌'],
                ['北潭涌', '西貢'],
                ['西貢', 'WM Hotel', '西貢碼頭', '萬宜遊樂場', 'Lobster Une', '海鮮街', '天后古廟', '火山探知館']
            ],
            accommodation: 'WM Hotel'
        },
        day2: {
            route: ['西貢', '北潭涌', '北潭凹', '西灣亭', '北潭涌', '彩虹站'],
            transportLabel: ['小巴', '小巴', '徒步', '小巴', '小巴'],
            transportation: [
                'https://maps.app.goo.gl/X3kznWoSXHBLARmU8',
                'https://maps.app.goo.gl/eLPufqNqpyqFcvEx8',
                'https://maps.app.goo.gl/dt5A7CdNX5jj1DQG7',
                'https://hkbus.fandom.com/wiki/%E5%B1%85%E6%B0%91%E5%B7%B4%E5%A3%ABNR29%E7%B7%9A',
                'https://maps.app.goo.gl/xyX1dz2ThHZT6jYy6'
            ],
            CO2e: [null, 1.131, 0.479, 1.173, 0.87, 2.813],
            HKD: () => getRandomNormal(250, 450),
            distance: [null, 7.8, 3.3, 6.9, 6.0, 19.4],
            visits: [2, null, null, 1, null, null],
            surroundings: [
                ['西貢', 'WM Hotel', '西貢碼頭', '萬宜遊樂場', 'Lobster Une', '海鮮街', '天后古廟', '火山探知館'],
                ['西貢', '北潭涌'],
                ['北潭涌'],
                ['北潭涌', '北潭凹'],
                ['北潭凹'],
                ['北潭凹', '西灣亭', '西灣村', '咸田灣', '赤徑'],
                ['西灣亭'],
                ['西灣亭', '北潭涌'],
                ['北潭涌'],
                ['北潭涌', '彩虹站'],
                ['彩虹站']
            ],
            accommodation: 'WM Hotel'
        }
    }
}

export const ROUTES_LINKED_LISTS_HK = generateRoutesLinkedLists(ROUTES_HK);

export const NORMAL_LOCATIONS_HK = {
    'WM Hotel': [22.38552932793403, 114.27554214056737],
    '西貢碼頭': [22.381327136754805, 114.2739433233398],
    '萬宜遊樂場': [22.381341769689463, 114.27199802274066],
    'Lobster Une': [22.38108404248143, 114.27167727088982],
    '海鮮街': [22.379416925443252, 114.27206708756552],
    '天后古廟': [22.381050417252094, 114.27083890947377],
    '火山探知館': [22.382466832132476, 114.27402755672654],

    '破邊洲': [22.358335251766373, 114.37853133247764],
    '浪茄灣': [22.374462310789482, 114.37626441361076],
    '西灣山': [22.38804003347429, 114.3778717716697],
    '聯合國教科文組織世界地質公園': [22.364741482222602, 114.3756020687633],

    '西灣村': [22.39728309661538, 114.37077097167862],
    '咸田灣': [22.409644592366625, 114.37591185727526],
    '赤徑': [22.421803396744806, 114.35302302431909],
}

export const DESCRIPTION_HK = {
    '彩虹站': '',
    '西貢': '',
    '北潭凹': '',
    '北潭涌': '',
    '西灣亭': '',
    '萬宜水庫東壩': '',
    'WM Hotel': '',
    '西貢碼頭': '',
    '萬宜遊樂場': '',
    'Lobster Une': '',
    '海鮮街': '',
    '天后古廟': '',
    '火山探知館': '',
    '破邊洲': '',
    '浪茄灣': '',
    '西灣山': '',
    '聯合國教科文組織世界地質公園': '',
    '西灣村': '',
    '咸田灣': '',
    '赤徑': ''
}

export const DETAILS_HK = {
    '彩虹站': '',
    '西貢': '',
    '北潭凹': '',
    '北潭涌': '',
    '西灣亭': '',
    '萬宜水庫東壩': '',
    'WM Hotel': '',
    '西貢碼頭': '',
    '萬宜遊樂場': '',
    'Lobster Une': '',
    '海鮮街': '',
    '天后古廟': '',
    '火山探知館': '',
    '破邊洲': '',
    '浪茄灣': '',
    '西灣山': '',
    '聯合國教科文組織世界地質公園': '',
    '西灣村': '',
    '咸田灣': '',
    '赤徑': ''
}

export const TOILET_HK = {
    '彩虹站': true,
    '西貢': true,
    '北潭凹': true, // 公共厕所位于行山径终点附近
    '北潭涌': true, // 游客中心旁有大型公厕
    '西灣亭': true, // 只有临时/简易厕所，但通常标注为有
    '萬宜水庫東壩': true, // 凉亭附近有旱厕/移动厕所
    'WM Hotel': true,
    '西貢碼頭': true,
    '萬宜遊樂場': true,
    'Lobster Une': true,
    '海鮮街': true,
    '天后古廟': true,
    '火山探知館': true,
    '破邊洲': false, // 纯自然景观，无设施
    '浪茄灣': true,  // 营地附近有极简易旱厕
    '西灣山': false, // 山顶无设施
    '聯合國教科文組織世界地質公園': true, // 指东坝游客中心区域
    '西灣村': true,  // 村内餐厅提供或有公厕
    '咸田灣': true,  // 村内餐厅提供或有公厕
    '赤徑': true      // 青年旅舍或公厕
}

export const RESTAURANT_HK = {
    '彩虹站': true,
    '西貢': true,
    '北潭凹': false, // 只有自动贩卖机，无餐厅
    '北潭涌': true,  // 小食亭
    '西灣亭': false, // 仅为出发点，无餐厅
    '萬宜水庫東壩': false, // 极偶尔有流动小贩，正式餐厅为无
    'WM Hotel': true,
    '西貢碼頭': true,
    '萬宜遊乐場': true,
    'Lobster Une': true,
    '海鮮街': true,
    '天后古廟': true,
    '火山探知館': true, // 仅为展览馆
    '破邊洲': false,
    '浪茄灣': false,
    '西灣山': false,
    '聯合國教科文組織世界地質公園': false,
    '西灣村': true,  // 有多家士多和茶座
    '咸田灣': true,  // 有著名的安记/海星士多
    '赤徑': false     // 只有极简易士多，有时不营业，建议设为 false 
}

export const GOOGLE_MAP_HK = {
    '彩虹站': 'https://maps.app.goo.gl/5pEHC2Vme6F1pDY67',
    '西貢': 'https://maps.app.goo.gl/mLoKtSq8pX4XDV9D8',
    '北潭凹': 'https://maps.app.goo.gl/oWkgZNF23kNjpZ4P7',
    '北潭涌': 'https://maps.app.goo.gl/dgHSyfxz1VC2qUqNA',
    '西灣亭': 'https://maps.app.goo.gl/Db9CEEwCJ5HSF3MN8',
    '萬宜水庫東壩': 'https://maps.app.goo.gl/4yvBsPGfWiU7cqWMA',
    'WM Hotel': 'https://maps.app.goo.gl/GJz8hsxPn3X7a8a77',
    '西貢碼頭': 'https://maps.app.goo.gl/TNA3GmmS4q2UW9S57',
    '萬宜遊樂場': 'https://maps.app.goo.gl/hC3yzQtFvzXMpvxXA',
    'Lobster Une': 'https://maps.app.goo.gl/w7CqMcBooWzLczhP9',
    '海鮮街': 'https://maps.app.goo.gl/EjQMrUqTFuUVQbG47',
    '天后古廟': 'https://maps.app.goo.gl/a9CKEK2nQELKSbqbA',
    '火山探知館': 'https://maps.app.goo.gl/WuFhFoiv2MrfGJnJ9',
    '破邊洲': 'https://maps.app.goo.gl/roKEqxjFVg81neAS6',
    '浪茄灣': 'https://maps.app.goo.gl/jpcdHkPkQtUyBsUM6',
    '西灣山': 'https://maps.app.goo.gl/H7HwLxNFcXjMXt8F6',
    '聯合國教科文組織世界地質公園': 'https://maps.app.goo.gl/aK3pFktbJK4U9iny6',
    '西灣村': 'https://maps.app.goo.gl/PYsLTGrnrByBr1oq9',
    '咸田灣': 'https://maps.app.goo.gl/vE7vEJCxbBroGyHa7',
    '赤徑': 'https://maps.app.goo.gl/Gtu4ZJf71PVLN3vi7'
}

export const VIRTUAL_TOUR_HK = {
    '彩虹站': 'https://app.cloudpano.com/tours/LfdIOTJSE',
    '西貢': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=bMmR8VCu3I',
    '北潭凹': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=YdHtnjZRvx0',
    '北潭涌': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=9dgP6b3OdK9',
    '西灣亭': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=2gIlMpZ0Bs',
    '萬宜水庫東壩': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=pjye9qrVsH',
    'WM Hotel': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=ampyHmXQtrn',
    '西貢碼頭': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=x-QXu8tQC1',
    '萬宜遊樂場': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=dvO54hYaJo',
    'Lobster Une': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=dvO54hYaJo',
    '海鮮街': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=FUa9l7bxKc',
    '天后古廟': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=ONqgnZN3Tu',
    '火山探知館': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=o9JzzJamBW',
    '破邊洲': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=zYS_hBv3hX',
    '浪茄灣': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=LtjZnABe0M',
    '西灣山': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=5-PFouAxGf',
    '聯合國教科文組織世界地質公園': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=6teh5XF5nd',
    '西灣村': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=7oT637kAC0',
    '咸田灣': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=awBK4My9pT',
    '赤徑': 'https://app.cloudpano.com/tours/LfdIOTJSE?sceneId=k3Ep1dVyI'
}

export const HTML_HK = {
    '彩虹站': 'ChoiHungStation.html',
    '西貢': 'SaiKung.html',
    '北潭凹': 'PakTamAu.html',
    '北潭涌': 'PakTamChung.html',
    '西灣亭': 'SaiWanPavilion.html',
    '萬宜水庫東壩': 'HighIslandEastDam.html',
    'WM Hotel': 'WMHotel.html',
    '西貢碼頭': 'SaiKungPier.html',
    '萬宜遊樂場': 'ManYeePlayground.html',
    'Lobster Une': 'LobsterUne.html',
    '海鮮街': 'SeafoodStreet.html',
    '天后古廟': 'TinHauTemple.html',
    '火山探知館': 'VolcanoDiscoveryCentre.html',
    '破邊洲': 'PoPinChau.html',
    '浪茄灣': 'LongKeWan.html',
    '西灣山': 'SaiWanShan.html',
    '聯合國教科文組織世界地質公園': 'Geopark.html',
    '西灣村': 'SaiWanVillage.html',
    '咸田灣': 'HamTinWan.html',
    '赤徑': 'ChekKeng.html'
};

// 珠海

export const STOP_LOCATIONS_ZH = {};

export const NORMAL_LOCATIONS_ZH = {};

export const DESCRIPTION_ZH = {};

export const DETAILS_ZH = {};

export const HTML_ZH = {};

export const ROUTES_ZH = {};

export const ROUTES_LINKED_LISTS_ZH = generateRoutesLinkedLists(ROUTES_ZH);

export const ROUTES_DESC_ZH = {};

export const GOOGLE_MAP_ZH = {};

export const TOILET_ZH = {};

export const RESTAURANT_ZH = {};

// Route info end here

/**
 * 在指定區間內按正態分佈取值
 * @param {number} min - 最小值 (如 150)
 * @param {number} max - 最大值 (如 600)
 * @param {number} skew - 偏度 (1為標準正態，小於1向高值偏移，大於1向低值偏移)
 * @returns {number} 隨機整數
 */
function getRandomNormal(min, max, skew = 1) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; 
    if (num > 1 || num < 0) return getRandomNormal(min, max, skew);
    num = Math.pow(num, skew);
    num *= (max - min);
    num += min;
    
    return Math.round(num);
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

function generateRoutesLinkedLists(routes) {
    let linkedLists = {};
    Object.entries(routes).forEach(([routeName, route]) => {
        linkedLists[routeName] = new LinkedList();
        let key = 0;
        let totalCO2e = 0;
        let totalDistance = 0;
        let totalHKD = 0;
        let totalVisits = 0;
        Object.entries(route).forEach(([day, info], dayIndex) => {
            const length = info.route.length;
            for (let i = 0; i < length; i++, key++) {
                linkedLists[routeName].add(key, {
                    type: 'atLocation',
                    location: info.route[i],
                    nextLocation: info.route[i + 1] || null,
                    day: dayIndex + 1,
                    CO2e: formatToFourChars(info.CO2e[i] || null),
                    distance: formatToFourChars(info.distance[i] || null),
                    visits: formatToFourChars(info.visits[i] || null),
                    surroundings: info.surroundings[i * 2] || null
                });
                totalCO2e += info.CO2e[i] || 0;
                totalDistance += info.distance[i] || 0;
                totalVisits += info.visits[i] || 0;
                if (i < length - 1) {
                    linkedLists[routeName].add(key + 0.5, {
                        type: 'onRoute',
                        from: info.route[i],
                        to: info.route[i + 1],
                        transportLabel: info.transportLabel[i] || null,
                        transportation: info.transportation[i] || null,
                        surroundings: info.surroundings[i * 2 + 1] || null
                    });
                }
            }
            const HKD = info.HKD();
            totalHKD += HKD || 0;
            if (dayIndex < Object.keys(route).length - 1) {
                linkedLists[routeName].add(key - 0.5, {
                    type: 'aDayDone',
                    day: dayIndex + 1,
                    HKD: formatToFourChars(HKD || null),
                    totalCO2e: formatToFourChars(totalCO2e || null),
                    totalDistance: formatToFourChars(totalDistance || null),
                    totalHKD: formatToFourChars(totalHKD || null),
                    totalVisits: formatToFourChars(totalVisits || null),
                    accommodation: info.accommodation || null,
                    surroundings: null
                });
            } else {
                linkedLists[routeName].add(key - 0.5, {
                    type: 'allDone',
                    day: dayIndex + 1,
                    totalCO2e: formatToFourChars(totalCO2e || null),
                    totalDistance: formatToFourChars(totalDistance || null),
                    totalHKD: formatToFourChars(totalHKD || null),
                    totalVisits: formatToFourChars(totalVisits || null),
                    surroundings: null
                });
            }
        });
    })
    return linkedLists;
}