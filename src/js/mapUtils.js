import { LinkedList } from './utils.js';
import { formatToNChars } from './utils.js';

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
    '均衡綫路': '均衡了徒步與賞景，適合大部分人。該路綫結合徒步與公共交通的低碳出行方式，推崇無痕山林原則，避免打擾當地居民生活，在自然與腳步間取得完美平衡。',
    '休閑綫路': '以賞景爲主，較爲輕鬆，適合帶有老人小孩的家庭出行，也適合度假放鬆。行程搭乘公共交通前往，在休閑中探訪文化與自然遺跡並支持本地經濟，用低碳足跡守護郊野靜謐。',
    '硬核綫路': '包含高强度徒步鍛煉，也能欣賞沿途風景和探尋文化與自然遺跡，適合登山愛好者或探險家。挑戰自我之餘，請自備水樽減少塑膠廢物，共同守護原始生態。'
}

export const GUIDEBOOK_URL_HK = {
    '均衡綫路': 'assets/guidebook_HK.pdf',
    '休閑綫路': 'assets/guidebook_HK.pdf',
    '硬核綫路': 'assets/guidebook_HK.pdf'
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
            HKD: () => getRandomNormal(150, 300),
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
            HKD: () => getRandomNormal(150, 300),
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
            HKD: () => getRandomNormal(150, 300),
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
            HKD: () => getRandomNormal(150, 300),
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
            HKD: () => getRandomNormal(150, 300),
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
            HKD: () => getRandomNormal(150, 300),
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

export const ROUTES_LINKED_LISTS_HK = () => { return generateRoutesLinkedLists(ROUTES_HK); };

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
    '彩虹站': '位於香港九龍黃大仙區牛池灣牛池灣鄉地底，是港鐵觀塘線上的重要交通樞紐，前往西貢多數巴士的起點。',
    '西貢': '集海濱風光、海鮮美食與市集文化於一體之地。',
    '北潭凹': '香港熱門的遠足活動起訖點，位於新界西貢半島中部，西貢東郊野公園和西貢西郊野公園之間。',
    '北潭涌': '西貢東郊野公園門戶，設有遊客中心和公共停車場。',
    '西灣亭': '前往西灣村的便捷起點，適合輕裝徒步者。',
    '萬宜水庫東壩': '萬宜水庫東壩是香港聯合國教科文組織世界地質公園的重要景點，擁有世界罕見的六角形火山岩柱，以及防波堤上的巨大錨形石。',
    'WM Hotel': '西貢新興海濱度假酒店，設計現代，適合休閒住宿。',
    '西貢碼頭': '西貢的心臟地帶，漁船、渡輪與海鮮市場交織的活力空間。',
    '萬宜遊樂場': '是香港的一個公園和遊樂場，設有籃球場，寵物友好。',
    'Lobster Une': '西貢海鮮街上的知名龍蝦主題餐廳。',
    '海鮮街': '西貢最熱鬧的美食街道，活海鮮現挑現做。',
    '天后古廟': '西貢最古老的廟宇之一，漁民的精神寄託。',
    '火山探知館': '香港地質火山歷史的互動式展覽館。',
    '破邊洲': '萬宜水庫東壩外的海蝕奇觀，六角柱石群最為震撼。',
    '浪茄灣': '香港最美沙灘之一，水清沙幼，群山環抱。',
    '西灣山': '麥理浩徑第二段的製高點，俯瞰大浪灣全景。',
    '聯合國教科文組織世界地質公園': '透過保育、教育及可持續發展的整體概念，將地質遺產與當地自然及文化遺產相結合，促進社區與自然的和諧共生。',
    '西灣村': '大浪西灣旁的寧靜村落，有茶座可補給。',
    '咸田灣': '西貢大浪灣四大海灣之一，以獨木橋和沙灘聞名。',
    '赤徑': '寧靜的內灣濕地，紅樹林與古村落並存。'
}

export const DETAILS_HK = {
    '彩虹站': '位於香港九龍黃大仙區牛池灣牛池灣鄉地底，是港鐵觀塘線上的重要交通樞紐，前往西貢多數巴士的起點。' +
        '彩虹站位於九龍東，是前往西貢區的主要轉乘點。站外設有多個巴士總站，乘客可在此搭乘92號或96R號巴士直達西貢市中心。' +
        '彩虹站周邊以住宅區為主，亦有小型商場和街市。1984年，香港電影《緣分》曾於彩虹站取景，亦為片中男主角張國榮及女主角張曼玉玩緣分遊戲的其中一個地點。' +
        '交通方式：港鐵觀塘線直達。乘客可搭乘每日 05:30 – 23:30 營運的九巴92路，或24小時服務的專線小巴1A；' +
        '假日則可選擇服務時間為 07:30 – 19:00 的九巴96R路。',

    '西貢': '集海濱風光、海鮮美食與市集文化於一體之地。西貢市是西貢區的中心，以海鮮街、碼頭和漁船景觀聞名。' +
        '遊客可在此品嚐新鮮海產，或租船出海。西貢半島亦是前往周邊島嶼和徒步路線的起點，交通便利，設施齊全，有香港「後花園」之名。' +
        '這裡不僅是居民生活的中心，更是探索西貢郊野公園的轉運站。' +
        '交通方式：乘坐1A號小巴，從彩虹站C2出口（近坪石邨）往返西貢碼頭，該專線24小時服務。' +
        '在此可轉乘九巴94路前往北潭涌、北潭凹，或乘29R小巴前往西灣亭。',

    '北潭凹': '香港熱門的遠足活動起訖點，位於新界西貢半島中部，西貢東郊野公園和西貢西郊野公園之間。' +
        '北潭凹是西貢半島中部一個山坳，該地的中部是一塊塊長滿草和灌木的休耕梯田，梯田的北面和南面被山坡包圍，山坡上長滿林木和天然植物，這片林地與西貢東郊野公園的茂林綠野連成一體。' +
        '東面的山坡有一條河，向西而下，流經休耕梯田。北潭凹村後的風水林有部分受到干擾，但林中的植物品種也頗多，包括受保護的香港大沙葉（Pavetta hongkongensis）。' +
        '交通方式：從西貢市中心乘94號巴士（每日 06:00 – 21:30）或假日的96R路至「北潭凹」站下車，班次約為 15–30 分鐘一班。',

    '北潭涌': '西貢東郊野公園門戶，設有遊客中心和公共停車場。北潭涌是進入西貢東郊野公園的主要入口，已建成西貢郊野公園遊客中心，專門介紹昔日西貢鄉村習俗、生態環境及風景區等等。' +
        '保良局在北潭涌設置保良局北潭涌渡假營供宿營遊客逗留，同時亦有官方康樂及文化事務署管理的麥理浩夫人度假村和香港小童群益會管理的白普理營。' +
        '3個渡假營申請使用者眾，排期需時。' +
        '交通方式：從西貢市中心乘94號巴士至「北潭涌」站下車。此處也是假日轉乘專線小巴9A前往萬宜水庫東壩的唯一轉乘點。',

    '西灣亭': '前往西灣村的便捷起點，適合輕裝徒步者。是香港西貢區的一座涼亭，位於西貢西灣路的盡頭處、通往西灣村之小路的起點，可以眺望萬宜水庫及糧船灣洲等地方。' +
        '有專線小巴直達，方便前往西灣村、大浪西灣等地。此路段較平坦，適合家庭或初學者，沿途風景優美，是西貢著名的郊遊入口之一。' +
        '交通方式：從西貢市中心（惠民路）乘29R專線小巴至「西灣亭」總站，服務時間為每日 07:30 – 18:30，班次約 30–60 分鐘。',

    '萬宜水庫東壩': '萬宜水庫東壩是香港聯合國教科文組織世界地質公園的重要景點，擁有世界罕見的六角形火山岩柱，以及防波堤上的巨大錨形石。' +
        '萬宜水庫位於西貢東郊野公園，風景秀麗，其南岸的路段是著名遠足路徑──麥理浩徑的第一段，是熱門的郊遊勝地。' +
        '水庫東壩附近一帶的山崖曾經是建設水庫時開闢的採石場，開鑿後的山崖敞露出世界罕有的流紋質火山岩六角形岩柱，成為香港能夠近距離觀賞這種地質奇觀的最佳地點。' +
        '交通方式：假日可乘9A專線小巴直達；非假日需先乘94或96R至北潭涌，再沿麥理浩徑步行約 2.5 小時前往。',

    'WM Hotel': '西貢新興海濱度假酒店，設計現代，適合休閒住宿。WM Hotel是西貢近年新開的高端酒店，位於西貢市海濱，部分房間可享海景。' +
        '酒店以簡約白色為主調，建築融入大自然，設有無邊際泳池、多間主題餐廳和大型活動場地，適合家庭度假、情侶約會或舉辦海濱婚禮。' +
        '其地理位置優越，鄰近西貢市中心及碼頭，讓旅客在享受郊野樂趣與海上運動後，能擁有高品質的休憩與用餐空間，是探索「香港後花園」的頂級住宿選擇。' +
        '交通方式：從西貢碼頭步行約10分鐘可達；或乘巴士至「西貢」總站後步行前往。',

    '西貢碼頭': '西貢的心臟地帶，漁船、渡輪與海鮮市場交織的活力空間。西貢碼頭建於1980年代初，是當地漁民停泊船隻的地方，亦是遊客乘船前往橋咀洲、鹽田仔、半月灣等離島的出發點。' +
        '碼頭周邊聚集了大量海鮮檔和街頭小食，每逢週末，岸邊停滿了售賣鮮魚的小艇，形成獨特的「水上市場」景觀。' +
        '這裡不僅是交通樞紐，更是體驗西貢悠閒漁村文化的最佳地點，每天清晨可以看到漁民忙碌作業，黃昏時分則是觀賞日落避風塘美景的絕佳位置。' +
        '交通方式：可搭乘 1A、92、96R、299X、792M 等多條巴士與小巴線路至「西貢」總站，步行即達。',

    '萬宜遊樂場': '是香港的一個公園和遊樂場，設有籃球場，寵物友好。萬宜遊樂場位於西貢市中心，緊鄰惠民路，是本地居民日常休憩與運動的核心場所。' +
        '遊樂場內設有多樣化的兒童遊樂設施、標準籃球場以及綠化充足的休息區域，環境整潔且具備現代化設施，是家長帶孩子放電的好去處。' +
        '由於其位置靠近巴士總站，許多遠足回程的旅客也會在此稍作休息，享受市中心鬧中取靜的輕鬆氛圍。' +
        '交通方式：從西貢碼頭或西貢巴士總站步行約 3-5 分鐘即可到達。',

    'Lobster Une': '西貢海鮮街上的知名龍蝦主題餐廳。Lobster Une 坐落於風景如畫的海鮮街，主打創意與傳統結合的各式龍蝦料理，包括招牌芝士焗龍蝦、避風塘炒龍蝦及口感濃郁的龍蝦湯。' +
        '餐廳強調食材的即日捕撈與新鮮呈現，選用的龍蝦肉質彈牙，配以獨家調製的醬料，深受饕客推崇。' +
        '店內裝潢簡約而不失格調，半開放式的設計讓食客能一邊享受美食，一邊飽覽西貢海港的醉人景色，是慶祝節日或商務宴請的理想之選。' +
        '交通方式：位於西貢碼頭旁的海鮮街內，步行即達。',

    '海鮮街': '西貢最熱鬧的美食街道，活海鮮現挑現做。海鮮街是西貢最標誌性的地標，街道兩旁林立著數十家擁有數十年歷史的海鮮餐廳，門口巨大的水族箱展示著種類繁多的珍稀海產。' +
        '遊客可以親自挑選生猛的魚、蝦、蟹、貝類，再交由餐廳以清蒸、薑蔥或椒鹽等粵式手法現場加工，完美保留食材的原汁原味。' +
        '夜晚時分，整條街道霓虹閃爍，充滿港式情懷，其中不乏獲得米其林推薦的知名老店，是全香港乃至全球遊客體驗地道「海上美食天堂」的最佳去處。' +
        '交通方式：緊鄰西貢碼頭，步行約 2 分鐘即可進入街道入口。',

    '天后古廟': '西貢最古老的廟宇之一，漁民的精神寄託。西貢天后古廟建於清代，與相鄰的關帝廟組成了「天后關帝古廟」，共同守護著西貢的安寧。' +
        '古廟主祀掌管海洋的天后娘娘，長期以來是當地漁民出海前祈求平安、居民祈求順遂的重要心靈座標。廟宇建築保留了傳統嶺南風格，屋脊上的陶塑藝術與室內的精緻木雕交相輝映，展現了深厚的歷史韻味。' +
        '每逢天后誕，這裡更會舉辦盛大的賀誕活動，香火極其鼎盛，是探尋西貢傳統民間信仰與建築藝術的最佳窗口。' +
        '交通方式：位於西貢市中心普通道，從西貢碼頭步行約 5-8 分鐘即達。',

    '火山探知館': '香港地質火山歷史的互動式展覽館。火山探知館位於西貢碼頭海濱，是香港聯合國教科文組織世界地質公園的核心訪客中心。' +
        '館內通過精密的比例模型、互動式多媒體展板及來自全球各地的岩石標本，生動展示了香港在一億四千萬年前經歷的壯烈火山噴發歷史，以及舉世罕見的六角柱石成因。' +
        '探知館提供多種語言的導覽服務，並備有地質公園的詳細地圖與行程建議，非常適合親子家庭在展開戶外探險前，先來一場有趣的地球科學預習課。' +
        '交通方式：位於西貢巴士總站旁，從西貢碼頭步行 1 分鐘即可到達入口。',

    '破邊洲': '萬宜水庫東壩外的海蝕奇觀，六角柱石群最為震撼。破邊洲原本是糧船灣的一部分，因長期受到太平洋海浪的猛烈侵蝕，最終脫離陸地形成一座孤立的海蝕柱島。' +
        '島上佈滿整齊排列、垂直入海的巨大六角形流紋質火山岩柱，從高處俯瞰，猶如一架巨大的海上排簫，景觀極其震撼。' +
        '遊客可從東壩起點沿著山徑登高遠眺這座自然界的鬼斧神工，感受滄海桑田的地質變遷，是攝影愛好者捕捉香港極致自然美景的「必拍」聖地。' +
        '交通方式：需先乘車抵達萬宜水庫東壩，沿麥理浩徑第一段旁的小徑上山步行約 30 分鐘可觀賞全景。',

    '浪茄灣': '香港最美沙灘之一，水清沙幼，群山環抱。浪茄灣坐落在萬宜水庫東壩與西灣山之間，擁有如明信片般純淨的弧形沙灘，其水質長年保持一級，沙質潔白細軟。' +
        '由於位置偏遠且無車路直達，這裡免受了外界的喧囂污染，保留了極其原始的自然風光，被許多資深遠足者譽為香港版的「馬爾地夫」。' +
        '這裡不僅是遠足者的休息站，更是熱門的官方露營地點，清晨可觀日出，夜晚可賞星空，讓人完全沉浸在山海一色的純淨世界中。' +
        '交通方式：從萬宜水庫東壩步行約 30 分鐘可達（需翻越一段山徑，經麥理浩徑第二段起點）。',

    '西灣山': '麥理浩徑第二段的製高點，俯瞰大浪灣全景。西灣山海拔 314 米，雖然海拔不算極高，但因其地理位置突出，成為麥理浩徑中最具標誌性的觀景點之一。' +
        '登山路徑兩側視野開闊，攀至山頂時，可以 360 度俯瞰東面大浪灣、西灣、咸田灣的湛藍海岸線，以及西面萬宜水庫的碧綠湖景，山海交織的立體感極強。' +
        '雖然上山路段缺乏遮蔭且石階較多，具有一定體力挑戰，但登頂後所見的絕美全景絕對讓每一位徒步者感到不虛此行。' +
        '交通方式：可從西灣亭或萬宜水庫東壩出發，沿麥理浩徑第二段指標徒步登山。',

    '聯合國教科文組織世界地質公園': '聯合國教科文組織世界地質公園是具有國際地質意義的單一融合地理區域，透過保育、教育及可持續發展的整體概念，將地質遺產與當地自然及文化遺產相結合。' +
        '香港地質公園以其舉世罕見、覆蓋範圍廣闊的酸性六角火山岩柱群為核心特色，橫跨西貢火山岩園區與新界東北沉積岩園區。' +
        '這裡不僅是重要的地質學研究基地，更透過完善的步道與導覽系統，將珍貴的地球歷史轉化為公眾可親身觸摸、觀察的自然教室，讓大眾在飽覽奇景之餘，深刻理解環境保護與自然共生的重要性。',

    '西灣村': '大浪西灣旁的寧靜村落，有茶座可補給。西灣村緊鄰被譽為「大浪四灣」之首的西灣，是一座擁有悠久歷史的客家古村，現已成為麥理浩徑上著名的驛站。' +
        '村內保留了純樸的鄉村建築與氛圍，開設有幾間頗具風情的簡易茶座，提供現煮的餐蛋麵、冰凍豆腐花、椰青及各式飲品，亦有部分民居提供簡單住宿。' +
        '這裡是徒步者在挑戰西灣山後或前往咸田灣前的重要補給地，在此坐聽浪濤聲，享受一份離島特有的靜謐時光，是無數遠足者的心靈慰藉。' +
        '交通方式：從西灣亭總站下車後，沿山徑緩緩下坡步行約 30–40 分鐘即可抵達。',

    '咸田灣': '西貢大浪灣四大海灣之一，以獨木橋和沙灘聞名。咸田灣以其寬闊綿長的銀白色沙灘與澄瑩見底的海水著稱，是遠離現代文明的自然樂園。' +
        '海灣中有一座由木板簡易搭建的獨木橋，橫跨於清澈的溪流之上，與後方的青山綠水構成了一幅經典的田園水鄉風景，是每位遊客到訪必拍的標誌物。' +
        '村內設有茶座提供基本餐食，這裡因其優質的環境成為露營愛好者的天堂，在海浪聲中入眠，體驗最極致的戶外野趣。' +
        '交通方式：從西灣村出發，沿麥理浩徑第二段翻越一個山頭，步行約 1 小時即可到達。',

    '赤徑': '寧靜的內灣濕地，紅樹林與古村落並存。赤徑地位特殊，坐落在避風的內灣深處，形成了與外海截然不同的內陸濕地景觀，擁有大片茂密的紅樹林與充滿生機的泥灘。' +
        '赤徑村歷史可追溯至數百年前，村中斷壁殘垣的古老石屋與靜謐的草坪交織出一種時光倒流的頹廢美感。' +
        '這裡環境幽靜，常可見到野牛漫步，也是觀察潮汐動植物、星空攝影及靜心冥想的絕佳去處，是麥理浩徑上最具神祕感與層次感的自然綠洲。' +
        '交通方式：從北潭凹沿麥理浩徑第二段緩緩下坡步行約 30 分鐘可達；或從黃石碼頭乘搭街渡（船）直達赤徑碼頭。'
};

export const IMGS_HK = {
    '彩虹站': ['./assets/HK_IMGS/彩虹站1.jpg', './assets/HK_IMGS/彩虹站2.jpg', './assets/HK_IMGS/彩虹站3.jpg', './assets/HK_IMGS/彩虹站4.jpg'],
    '西貢': ['./assets/HK_IMGS/西貢1.jpg', './assets/HK_IMGS/西貢2.jpg'],
    '北潭凹': ['./assets/HK_IMGS/北潭凹1.jpg', './assets/HK_IMGS/北潭凹2.jpg'],
    '北潭涌': ['./assets/HK_IMGS/北潭涌1.jpg', './assets/HK_IMGS/北潭涌2.jpg', './assets/HK_IMGS/北潭涌3.jpg'],
    '西灣亭': ['./assets/HK_IMGS/西灣亭1.jpg', './assets/HK_IMGS/西灣亭2.jpg'],
    '萬宜水庫東壩': ['./assets/HK_IMGS/萬宜水庫東壩1.jpg', './assets/HK_IMGS/萬宜水庫東壩2.jpg'],
    'WM Hotel': ['./assets/HK_IMGS/WM Hotel1.jpg', './assets/HK_IMGS/WM Hotel2.jpg', './assets/HK_IMGS/WM Hotel3.jpg'],
    '西貢碼頭': ['./assets/HK_IMGS/西貢碼頭1.jpg', './assets/HK_IMGS/西貢碼頭2.jpg', './assets/HK_IMGS/西貢碼頭3.jpg', './assets/HK_IMGS/西貢碼頭4.jpg', './assets/HK_IMGS/西貢碼頭5.jpg', './assets/HK_IMGS/西貢碼頭6.jpg', './assets/HK_IMGS/西貢碼頭7.jpg'],
    '萬宜遊樂場': ['./assets/HK_IMGS/萬宜遊樂場1.jpg', './assets/HK_IMGS/萬宜遊樂場2.jpg'],
    'Lobster Une': ['./assets/HK_IMGS/Lobster Une1.jpg', './assets/HK_IMGS/Lobster Une2.jpg'],
    '海鮮街': ['./assets/HK_IMGS/海鮮街1.jpg', './assets/HK_IMGS/海鮮街2.jpg', './assets/HK_IMGS/海鮮街3.jpg'],
    '天后古廟': ['./assets/HK_IMGS/天后古廟.jpg'],
    '火山探知館': ['./assets/HK_IMGS/火山探知館1.jpg', './assets/HK_IMGS/火山探知館2.jpg', './assets/HK_IMGS/火山探知館3.jpg'],
    '破邊洲': ['./assets/HK_IMGS/破邊洲1.jpg', './assets/HK_IMGS/破邊洲2.jpg', './assets/HK_IMGS/破邊洲3.jpg'],
    '浪茄灣': ['./assets/HK_IMGS/浪茄灣1.jpg', './assets/HK_IMGS/浪茄灣2.jpg'],
    '西灣山': ['./assets/HK_IMGS/西灣山.jpg'],
    '聯合國教科文組織世界地質公園': ['./assets/HK_IMGS/聯合國教科文組織世界地質公園1.jpg', './assets/HK_IMGS/聯合國教科文組織世界地質公園2.jpg'],
    '西灣村': ['./assets/HK_IMGS/西灣村1.jpg', './assets/HK_IMGS/西灣村2.jpg'],
    '咸田灣': ['./assets/HK_IMGS/咸田灣.jpg'],
    '赤徑': ['./assets/HK_IMGS/赤徑1.jpg', './assets/HK_IMGS/赤徑2.jpg'],
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

// 珠海

export const STOP_LOCATIONS_ZH = {
    '珠海入境處': [22.20757937782282, 113.57616519282976]
};

export const NORMAL_LOCATIONS_ZH = {
    '珠海博物館': [22.296468, 113.572318],
    '湯臣倍健透明工廠': [22.042412672892333, 113.32304152768775],
    '中航通飛': [22.00495722161329, 113.36747603302453],
    '中醫藥體驗館': [22.137763749973058, 113.45805829490341]
};

export const DESCRIPTION_ZH = {
    '珠海入境處': '连接香港、珠海与澳门的超级枢纽。这里采用创新的通关模式，高效衔接湾区交通脉络，展示大湾区现代工程的智慧。',
    '珠海博物館': '融合了歷史、文化和藝術，擁有豐富的藏品，并提供互動體驗，展現了珠海的變化和文化遺產，推動了文化可持續性。',
    '湯臣倍健透明工廠': '4A級景點，采用“全程透明化生產”，展示了生產的不同階段，也可以了解到營養科學和體驗健康膳食等知識，推動個人健康可持續性。',
    '中航通飛': '廠毗鄰珠海機場，可以深入了解中國工業實力的崛起歷程，瞭解我國航空業發展，彰顯國家科技實力可持續性。',
    '中醫藥體驗館': '運用建模技術再現了著名中醫的形象，通過講述從盤古開天地到中醫的成就，讓游客瞭解了中醫文化的博大精深與發展歷史，推動文化可持續性。'
};

export const DETAILS_ZH = {
    '珠海入境處': '港珠澳大橋入境處作為粵港澳大灣區互聯互通的“超級門戶”，在高效運作中蘊含著深刻的文化可持續性與人文關懷。 ' +
        '它不僅是跨國交通的管理節點，更是三地文化交融與協作的象徵性空間。首先，入境處在設計與管理上融合了智慧化與人性化理念，' +
        '透過「合作查驗、一次放行」的創新通關模式，極大縮短了旅客與車輛的等候時間，減少了因排隊怠速產生的碳排放，' +
        '這本身就是對生態環境永續發展的正面回應。其次，它主動承擔起文化傳播「第一站」的職能，在入境大堂與候檢區域，' +
        '透過電子螢幕、文化展板及宣傳手冊，持續展示珠海、香港、澳門三地的非物質文化遺產、節慶活動與旅遊資訊，' +
        '讓每年數以千萬計的入境旅客在踏入內地的第一時間就能感受到嶺南文化的魅力，成為講好大灣區故事的前沿窗口。' +
        '此外，入境處與週邊旅遊、交通系統無縫銜接，從港珠澳大橋觀光巴士到珠海口岸的購物與休憩空間，' +
        '形成了一個輻射式的人文旅遊生態，引導旅客將行程延伸至珠海博物館、日月貝歌劇院等地標，' +
        '間接帶動了文化場館與文旅產業的經濟永續性。更重要的是，港珠澳大橋本身作為世界級超級工程，' +
        '其建設與運營本身就是“中國智慧”與“工匠精神”的文化物證，而入境處作為其關鍵組成部分，' +
        '在日常管理中不斷強化著這個文化符號的象徵意義，激勵著每位旅客對工程奇蹟的敬意與對三地融合的認同。' +
        '透過科技賦能、文化嵌入與綠色運營，港珠澳大橋入境處正在從單一的檢查關口，轉型為兼具效率、溫度與文化內涵的可持續門戶，' +
        '為大灣區一體化發展注入源源不絕的文化活力與生態意識。',
    '珠海博物館': '珠海博物館作為城市文化記憶的守護者與革新者，正透過多元立體的實踐路徑，深刻詮釋著文化永續性的內涵。' +
        '在展​​陳方式上，它大膽突破靜態陳列的傳統模式，將“劇遊珠博”沉浸式體驗、非遺活態展覽與數位互動裝置有機融合，' +
        '讓「三灶鶴舞」「水上婚嫁」等本土非物質文化遺產不再是櫥窗裡的標本，而是可參與、可體驗的鮮活日常，' +
        '有效激發了年輕一代對本土文化的認同感與傳承熱情，為文化延續注入了源源不斷的代際活力。' +
        '在物質保護層面，博物館積極推進文物的科學修復與預防性保護，同時藉助3D全息投影、AR/VR等數位技術，' +
        '為館藏文物建立高精度的“數位檔案”，既減少了對脆弱文物的物理接觸損耗，又打破了時空限制，' +
        '建構起一座永不落幕的線上文化殿堂，實現了文化遺產的永久保存與全民共享。' +
        '在教育傳播方面，博物館主動打破物理圍牆，透過與暨南大學等院校共建教育基地、開展拓印與模擬考古進校園活動，' +
        '以及開發超過200種融入館藏IP的文創產品（如寶鏡灣岩畫雪糕、海昏侯文物冰箱貼等），' +
        '讓文化不僅“帶得走”“用得上”，更透過文創收益反哺文物保護與研究，形成了可持續的文化經濟閉環。' +
        '特別值得一提的是，珠海博物館與珠海規劃展覽館以「龍鳳相連」的建築格局比鄰而居。' +
        '一館回望千年歷史，一館展望城市未來，這種獨特的空間對話關係，使其成為真正的“城市文化會客廳”，' +
        '在快速城市化過程中牢牢錨定了城市的靈魂，確保了本土文脈在時代變遷中的平穩接續與創新發展。' +
        '正因如此，珠海博物館不僅是歷史的收藏者，更是驅動文化永續發展的核心引擎與活力源泉。',
    '湯臣倍健透明工廠': '湯臣倍健透明工廠以「誠信比聰明更重要」為核心價值觀，構建了一套完整的個人健康可持續性支持體系。 ' +
        '首先，它通過全過程透明化的生產模式——從全球32個國家精選優質原料、引進15個國家200多台先進設備、開放1000多項檢測項目，' +
        '讓消費者親眼見證產品從原料到成品的每一個環節，累計已接待超過194萬人次參觀。這種「所見即所得」的信任建立機制，' +
        '賦能個體做出明智的健康消費決策，避免因資訊不對稱而產生的盲目補充，從源頭上保障了個人健康管理路徑的科學起點。' +
        '其次，透明工廠內的營養探索館通過高科技互動體驗，將專業營養知識轉化為可感知的個人健康實踐——從骨密度檢測到人體成分分析，' +
        '參觀者可以獲得即時的健康數據反饋，並得到個性化的膳食建議。這種「檢測-評估-建議」的閉環體驗，' +
        '幫助個體建立對自身健康狀況的科學認知，從被動接受轉向主動管理，形成可持續的健康生活習慣。' +
        '再者，透明工廠所承載的「科學營養」策略，通過持續的科研投入（累計研發投入達6.37億元、擁有專利451項），' +
        '不斷推出更精準、更個性化的營養解決方案，如針對中國人飲食習慣開發的零碘銅添加多維片、以及源自本土的LPB27益生菌株等。' +
        '這種以循證科學為基礎的產品創新，確保了個體在生命各階段都能獲得適宜的營養支持，真正實現了個人健康幹預的長期可持續性。' +
        '此外，透明工廠還將公益觸角延伸至弱勢群體，連續13年開展兒童營養支教計劃，累計培養460名營養教師、惠及超過12萬名兒童。' +
        '這種健康知識與技能的代際傳遞，從更宏觀的層面夯實了個體健康可持續性的社會基礎，讓科學營養的理念如同種子在每個人的生活中生根發芽。' +
        '通過透明建立信任、以科技賦能個體、用公益播種希望，湯臣倍健透明工廠正在重新定義個人健康可持續性的實現路徑——它不是一蹴而就的保健品消費，' +
        '而是一場貫穿生命全程、基於科學認知、由個體主動參與的健康價值共創。',
    '中航通飛': '走進中航通飛公司的參觀之旅，是一場近距離感受國家航空科技發展永續性的深度體驗。' +
        '在珠海基地的巨大總裝廠房內，參觀者可以親眼目睹AG600“鯤龍”滅火/水上救援水陸兩棲飛機的完整裝配流程，' +
        '這款全球正在研發最大的水陸兩棲飛機，不僅是我國航空工業自主創新的標誌性成果，更承載著服務國家緊急救援體系建設的長遠使命。 ' +
        '透過觀察科技人員對複合材料加工、航電系統整合及靜力測試的全流程控制，參觀者能切身理解：真正的航空科技永續性，' +
        '並非依賴某項短期突破，而是建立在從設計研發、材料製程到總裝試飛的完整產業鏈能力之上。 ' +
        '公司展示的脈動生產線與數位化組裝系統，體現了智慧製造對生產精度與效率的系統性提升，' +
        '這種製造方式的變革，不僅降低了批量化生產的人為誤差，更為後續型號迭代與產能釋放提供了可靠基礎，' +
        '從而確保科技成果能夠穩定轉化為持續的國家競爭力。同時，中航通飛長期投入基礎研究，與國內多所航空院校保持聯合攻關，' +
        '在航空複合材料應用、飛行控制演算法等關鍵領域形成技術儲備，這意味著每項新產品都不是從零開始，' +
        '而是沿著不斷優化的技術樹逐步生長，這種累積式的進步路徑，正是科技發展永續性的核心特徵。' +
        '在參觀過程中，講解員不會迴避研製過程中的技術挫折——從動力匹配到飛行控制律的反复調試，這些真實經歷恰恰構成了組織能力成長的基石，' +
        '使得航空人精神與系統級研發能力得以代際傳承。此外，AG600系列針對森林滅火、海洋巡查、島礁補給等實際應用場景的持續開發，' +
        '顯示了航空技術的落地始終與國家戰略需求深度耦合，這種需求驅動的研發邏輯避免了脫離現實的“空中樓閣”，' +
        '讓每項投入都能夠轉化為國家安全與民生保障的實績，進而反哺下一階段的科研投入。' +
        '從更大視野來看，中航通飛透過向公眾開放參觀、組織航空科普講座與工業旅遊項目，' +
        '將航空強國意識植入到青少年群體的認知世界之中，為未來航空人才的儲備厚植了社會土壤。' +
        '因此，對中航通飛公司的參觀所感受到的，不只是一座現代化工廠的壯觀景象，' +
        '而是一個以自主創新為動力、以系統能力為基礎、以國家需求為導向的航空科技可持續生態，它的每一次起飛與降落，都在為國家的長期發展與安全邊界增添一份不可替代的確定性。',
    '中醫藥體驗館': '位於橫琴粵澳深度合作區的珠海中醫藥文化體驗館，以建築面積約3.6萬平方米的沉浸式空間，構建了一個承載中醫藥歷史文化發展可持續性的「活態傳承場域」。' +
        '場館以「蓮花」為建築靈感——這是澳門的區花，三片舒展的弧形花瓣寓意「生長、健康、平衡」的中醫哲學，立面仿生葉脈肌理與開窗模擬的植物細胞結構相呼應，' +
        '將中醫藥「天人合一」理念凝練為可感知的建築語言。在內部展陳上，體驗館突破傳統博物館的靜態敘事，創新採用「主題分層、移步換景」的布展理念，' +
        '以「中醫藥之源、之路、之靈、之魂」為軸線，串聯起從盤古開天闢地的神話源起到新時代中醫藥發展的完整時間脈絡。' +
        '其中最引人注目的是，場館由五次榮獲奧斯卡金像獎的紐西蘭維塔工作室領銜創意設計，首次將電影級特效技術用於中醫藥文化表達。十餘尊歷史名醫巨像全部經由真人演員3D建模，矽膠皮膚下「血管」若隱若現，髮絲由工匠手工植入，' +
        '孫思邈、李時珍、張仲景等醫者形象纖毫畢現，彷彿「伸手就能觸碰千年醫典」。三樓沉浸式草木森林中，霧氣氤氳，' +
        '18棵會「呼吸」的發光巨樹撐起蒼穹，草藥精靈在光影間翩躚舞動，腳下氣韻流轉，構建出一個宛如潘朵拉星球的治癒能量場。' +
        '這種「中國故事，國際表達」的跨界融合，正是歷史文化發展可持續性的核心邏輯——古老的中醫藥智慧若只停留在故紙堆與藥櫃中，終將被時代稀釋；' +
        '但通過國際前沿的視覺語彙與沉浸式體驗重新「翻譯」，晦澀的醫理變成了可感可觸的奇趣探索，千年智慧得以被年輕一代與全球遊客欣然接納。' +
        '更值得關注的是，體驗館並非孤立的文旅項目，而是粵澳合作中醫藥科技產業園大健康板塊的旗艦項目，緊密聯動「醫、康、研、製、服」五位一體的全產業鏈條。' +
        '館內五層設有研學及中醫藥人才教育培訓中心，與北京中醫藥大學合作培養國內外中醫藥人才，為中醫藥事業的長遠發展持續注入新生力量。' +
        '通過「一館鏈雙城」的運營模式，它催化澳琴兩地在技術、人才、產業標準上的深度對接，讓文化傳承與產業生態形成良性循環。' +
        '從建築上的「蓮花」意象與澳門地域符號的融合，到國際團隊對中國傳統智慧的現代表達，再到文旅體驗與產業研發的人才反哺，' +
        '珠海中醫藥文化體驗館證明了一個根本道理：文化的可持續性，不是將傳統封存於玻璃展櫃，而是在與當代科技、國際審美、產業生態的深度對話中不斷被激活、被重述、被交付給下一個時代。' +
        '當遊客走出場館回望那朵在夕陽下熠熠生輝的「鋼鐵蓮花」時，感受到的不只是一次奇趣打卡，更是中華文明穿越數千年依然生機勃勃的底氣。',
};

export const ROUTES_ZH = {
    '科文智旅': {
        day1: {
            route: ['珠海入境處', '珠海博物館', '中醫藥體驗館', '湯臣倍健透明工廠', '中航通飛', '珠海入境處'],
            transportLabel: ['公交', '公交', '公交', '公交', '公交'],
            transportation: [
                'https://surl.amap.com/hEIygho11DR', 
                'https://surl.amap.com/hATyE7k1z3Kx',
                'https://surl.amap.com/hKpmJLgh6wK',
                'https://surl.amap.com/hMIx9X0K9JD',
                'https://surl.amap.com/hZ3YRGmLehQ'
            ],
            CO2e: [null, 2.39, 4.68, 4.45, 2.20, 7.55],
            HKD: () => getRandomNormal(50, 100),
            distance: [null, 20.9, 33.4, 31.8, 15.7, 53.9],
            visits: [null, 1, 1, null, null],
            surroundings: [
                [],
                [],
                [],
                [],
                []
            ],
            accommodation: null
        }
    }
};

export const ROUTES_LINKED_LISTS_ZH = () => { 
    return generateRoutesLinkedLists(ROUTES_ZH);
};

export const ROUTES_DESC_ZH = {
    '科文智旅': '從歷史到科技，從個人健康到國家科技發展的可持續，這趟旅程融合了文脈與智造前沿，以低碳之姿解讀珠海的獨特脈動。旅程采用公交的低碳出行方式，適合想學習科技文化的家庭出行。全程公交時間較長，可適當乘坐的士出行。'
};

export const GUIDEBOOK_URL_ZH = {
    '科文智旅': 'assets/guidebook_ZH.pdf'
}

export const GOOGLE_MAP_ZH = {
    '珠海入境處': 'https://maps.app.goo.gl/jcvQeeYavAoMHQKf6',
    '珠海博物館': 'https://maps.app.goo.gl/ihT2wGMKm6U38AvD9',
    '湯臣倍健透明工廠': 'https://maps.app.goo.gl/3P9UcteNw1f5ChC88',
    '中航通飛': 'https://maps.app.goo.gl/WjioCXSo2rbUhapg9',
    '中醫藥體驗館': 'https://maps.app.goo.gl/nJ2TduCfn3wMGxar9'
};

export const TOILET_ZH = {
    '珠海入境處': true,
    '珠海博物館': true,
    '湯臣倍健透明工廠': true,
    '中航通飛': true,
    '中醫藥體驗館': true
};

export const RESTAURANT_ZH = {
    '珠海入境處': true,
    '珠海博物館': true,
    '湯臣倍健透明工廠': true,
    '中航通飛': false,
    '中醫藥體驗館': true
};

export const IMGS_ZH = {
    '珠海入境處': [
        './assets/ZH_IMGS/珠海入境處.jpg'
    ],
    '珠海博物館': [
        './assets/ZH_IMGS/珠海博物館1.jpg', 
        './assets/ZH_IMGS/珠海博物館2.jpg',
        './assets/ZH_IMGS/珠海博物館3.jpg', 
        './assets/ZH_IMGS/珠海博物館4.jpg',
        './assets/ZH_IMGS/珠海博物館5.jpg', 
        './assets/ZH_IMGS/珠海博物館6.jpg',
        './assets/ZH_IMGS/珠海博物館7.jpg'
    ],
    '湯臣倍健透明工廠': [
        './assets/ZH_IMGS/湯臣倍健透明工廠1.jpg',
        './assets/ZH_IMGS/湯臣倍健透明工廠2.jpg',
        './assets/ZH_IMGS/湯臣倍健透明工廠3.jpg',
        './assets/ZH_IMGS/湯臣倍健透明工廠4.jpg',
        './assets/ZH_IMGS/湯臣倍健透明工廠5.jpg',
        './assets/ZH_IMGS/湯臣倍健透明工廠6.jpg',
    ],
    '中航通飛': [
        './assets/ZH_IMGS/中航通飛1.jpg',
        './assets/ZH_IMGS/中航通飛2.jpg',
        './assets/ZH_IMGS/中航通飛3.jpg',
        './assets/ZH_IMGS/中航通飛4.jpg',
        './assets/ZH_IMGS/中航通飛5.jpg',
        './assets/ZH_IMGS/中航通飛6.jpg',
    ],
    '中醫藥體驗館': [
        './assets/ZH_IMGS/中醫藥體驗館1.jpg',
        './assets/ZH_IMGS/中醫藥體驗館2.jpg',
        './assets/ZH_IMGS/中醫藥體驗館3.jpg',
        './assets/ZH_IMGS/中醫藥體驗館4.jpg',
        './assets/ZH_IMGS/中醫藥體驗館5.jpg',
        './assets/ZH_IMGS/中醫藥體驗館6.jpg',
    ]
};

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
                    CO2e: formatToNChars(info.CO2e[i] || null),
                    distance: formatToNChars(info.distance[i] || null),
                    visits: formatToNChars(info.visits[i] || null),
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
                    HKD: formatToNChars(HKD || null),
                    totalCO2e: formatToNChars(totalCO2e || null),
                    totalDistance: formatToNChars(totalDistance || null),
                    totalHKD: formatToNChars(totalHKD || null),
                    totalVisits: formatToNChars(totalVisits || null),
                    accommodation: info.accommodation || null,
                    surroundings: null
                });
            } else {
                linkedLists[routeName].add(key - 0.5, {
                    type: 'allDone',
                    day: dayIndex + 1,
                    totalCO2e: formatToNChars(totalCO2e || null),
                    totalDistance: formatToNChars(totalDistance || null),
                    totalHKD: formatToNChars(totalHKD || null),
                    totalVisits: formatToNChars(totalVisits || null),
                    surroundings: null
                });
            }
        });
    })
    return linkedLists;
}