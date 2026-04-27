import { supabase } from './supabase.js';

export const RECOMMENDED_PROMPTS = [
    "介紹一下破邊洲六角形岩柱成因",
    "平衡路線如何兼顧景觀與運動？",
    "萬宜水庫東壩有哪些地質奇觀？",
    "如何在海鮮街支持本地社區？",
    "從彩虹站到北潭湧怎樣最減碳？",
    "適合長輩的休閒路線能怎能走？",
    "適合孩子的休閒路線能怎能走？",
    "4.5h的硬派路線健行難度高嗎？",
    "在萬宜水庫如何實踐無痕山林？",
    "推薦的西貢全景拍攝點在哪裡？",
    "從珠海口岸入境怎樣走最減碳？",
    "珠海博物館裡有哪些鎮館之寶？",
    "中醫體驗館有哪些健康啟示？",
    "湯臣倍健如何體現可持續性？",
    "在珠海如何低碳出行？",
    "中航通飛有什麽成就？",
    "珠海還有什麽可持續景點？",
    "在珠海如何輕鬆并環保出行？"
];

export async function getAIResponse(prompt) {
    try {
        const { data, error } = await supabase.functions.invoke('chat-proxy', {
            body: { prompt: prompt }
        });

        if (error) throw error;
        console.log("Supabase AI response:", data);
        if (typeof data === 'object' && data !== null) {
            const content = data.choices?.[0]?.message?.content || data.data?.choices?.[0]?.message?.content || data.content;
            
            if (content) return content;
        }
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                return parsed.choices?.[0]?.message?.content || parsed.content || data;
            } catch (e) {
                return data;
            }
        }

        return String(data);

    } catch (error) {
        console.error("AI Error:", error);
        return "AI 抱歉，AI 助理暫時走神了，請稍後再試。";
    }
}