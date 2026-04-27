export const SUSTAINABLE_TITLES_HK = [
    "低碳足跡實踐者",
    "無痕山林守護者",
    "綠色里程開拓者",
    "零碳漫步家",
    "純淨山徑巡邏員",
    "文化脈絡傳承人",
    "在地產業支持者",
    "老店保育同行人",
    "守護海岸的精靈",
    "生物多樣性摯友",
    "山野清道夫",
    "自然觀察家",
    "永續旅遊外交官",
    "生態平衡大師",
    "和諧旅程建築師",
    "地球友善領航員",
    "未來旅行定義者"
];

export const SITES_CONCLUSION_HK = [
    "你穿梭在西貢的碧海藍天間，每一步都是大自然留下的視覺情書",
    "從萬宜水庫的六角柱石到浪茄灣的細白沙灘，你見證了億年地質的史詩",
    "遠離城市喧囂，你在翠綠的山脈與蔚藍的海岸線之間找到了內心的靜謐",
    "每一個轉角都是一幅新的全景畫卷，重塑了你對「東方之珠」之美的認知",
    "山海無垠，草木蔥蘢，你見到了香港最動人的綠色底色"
];

export const SUSTAINABLE_CONCLUSION_HK = [
    "你用雙腳取代車輪，這趟旅程為地球減少了的負擔",
    "你堅持「無痕山林」原則，在享受風景的同時，也守護了生態環境",
    "你的每一份本地消費都是對本地經濟的微小支持，讓傳統在得以延續",
    "你讓科技與自然和諧共生，是一場真正的綠色低碳之旅程",
    "你讓大家知道低碳旅行不僅是冰冷的數字，更是對這片土地最深情的告白"
];

export const SUSTAINABLE_TITLES_ZH = [
    "灣區綠色先行者",
    "低碳智旅探索家",
    "科技與傳統的守護者",
    "健康生活傳播者",
    "產業脈搏見證人",
    "城市與自然的對話者",
    "大國重器研學家",
    "可持續生活實踐者",
    "珠海文化漫遊客",
    "未來製造觀測員",
    "身心靈平衡旅人",
    "綠色出行推廣大使",
    "灣區發展共鳴者",
    "智慧導覽親歷者",
    "平衡發展築夢人"
];

export const SITES_CONCLUSION_ZH = [
    "踏入這座城，你遊走於歷史的長廊與科技的前沿，感受著灣區蓬勃的跳動",
    "在中醫文化中汲取古老的智慧，在透明工廠與航空基地見證現代工業的發展",
    "珠海不僅是浪漫之城，更是科技之都，你親歷了傳統底蘊與大國重器的交織",
    "每一次停留，都是對城市發展的深度閱讀，你觸摸到了這座城市向上的韌性",
    "歷史與未來的對話，在你的足跡下匯聚成珠海最真實的城市畫像"
];

export const SUSTAINABLE_CONCLUSION_ZH = [
    "以最輕盈的方式穿梭於城市，將低碳出行的理念融入了對這座城市的探索",
    "關注健康更守護地球呼吸，你身體力行地詮釋了什麼是可持續發展的旅行",
    "用公交串聯起各景點，用腳步丈量城市，為這片熱土留下了最少的碳足跡",
    "科技進步與生態保護共同發展，這次旅程為城市共生提供了新的註腳",
    "你的每一程綠色出行，都是對這座美麗濱海城市最溫柔的承諾與回饋"
];

export function getRandomItems(arr, n) {
    if (!n || n <= 0 || !arr || arr.length === 0) {
        return null;
    }
    const count = Math.min(n, arr.length);
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const result = shuffled.slice(0, count);
    return result.length > 0 ? result : null;
}

export function formatToNChars(num, n = 4) {
    if (!num || isNaN(num) || Number(num) === 0 || n <= 0) {
        return null;
    }
    let formatted = Number(num).toPrecision(n);
    let result = parseFloat(formatted).toString();
    if (!result.includes('.')) {
        if (result.length < n) {
            result += '.' + '0'.repeat(n - result.length);
        }
    } else {
        while (result.replace('.', '').length < n) {
            result += '0';
        }
    }
    const maxLen = n + (result.includes('.') ? 1 : 0);
    const finalStr = result.length > maxLen ? result.substring(0, maxLen) : result;
    if (parseFloat(finalStr) === 0) {
        return null;
    }
    return parseFloat(finalStr);
}

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

export class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.current = null;
        this.size = 0;
    }
    add(key, value) {
        const newNode = new Node(key, value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.current = newNode;
        this.size++;
    }

    goForward() {
        if (this.current && this.current.next) {
            this.current = this.current.next;
            return this.current;
        }
        console.warn("LinkedList head");
        return null;
    }

    goBack() {
        if (this.current && this.current.prev) {
            this.current = this.current.prev;
            return this.current;
        }
        console.warn("LinkedList tail");
        return null;
    }

    get(key) {
        let current = this.head;
        
        while (current) {
            if (current.key === key) {
                return current;
            }
            current = current.next;
        }
        
        console.warn(`Fail to get Node "${key}"`);
        return null;
    }

    getValue(key) {
        const node = this.get(key);
        return node ? node.value : null;
    }

    getCurrentData() {
        return this.current ? { key: this.current.key, value: this.current.value } : null;
    }
}