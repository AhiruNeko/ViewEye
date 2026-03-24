export const SUSTAINABLE_TITLES = [
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

export const SITES_CONCLUSION_ZH = [];

export const SUSTAINABLE_CONCLUSION_ZH = [];

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

export function formatToFourChars(num) {
    if (!num || isNaN(num) || Number(num) === 0) {
        return null;
    }
    let formatted = Number(num).toPrecision(4);
    let result = parseFloat(formatted).toString();
    if (!result.includes('.')) {
        if (result.length < 4) {
            result += '.' + '0'.repeat(4 - result.length);
        }
    } else {
        while (result.replace('.', '').length < 4) {
            result += '0';
        }
    }
    const finalStr = result.length > 5 ? result.substring(0, 5) : result;
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