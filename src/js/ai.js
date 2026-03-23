import { supabase } from './supabase.js';

export const RECOMMENDED_PROMPTS = [
    "介绍一下破边洲六角形岩柱成因",
    "平衡路线如何兼顾景观与运动？",
    "万宜水库东坝有哪些地质奇观？",
    "如何在海鲜街支持本地社区？",
    "從彩虹站到北潭涌怎樣最减碳？",
    "适合長輩的休闲路线能怎麽走？",
    "适合孩子的休闲路线能怎麽走？",
    "4.5h的硬核路线徒步难度大吗？",
    "在万宜水库如何实践无痕山林？",
    "推荐的西貢全景拍摄点在哪？"
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