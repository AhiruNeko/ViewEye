import { supabase } from './supabase.js';

export async function getAIResponse(prompt) {
    try {
        const { data, error } = await supabase.functions.invoke('chat-proxy', {
            body: { prompt: prompt }
        });

        if (error) throw error;

        // --- 核心调试步骤 ---
        console.log("Supabase 返回的原始 data:", data);
        console.log("Data 的类型:", typeof data);
        // ------------------

        // 情况 A：data 已经是解析好的对象
        if (typeof data === 'object' && data !== null) {
            // 尝试不同的路径，有的 API 转发层会把结果放在 data.data 里
            const content = data.choices?.[0]?.message?.content || data.data?.choices?.[0]?.message?.content || data.content;
            
            if (content) return content;
        }

        // 情况 B：data 是个 JSON 字符串（需要手动转一次）
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                return parsed.choices?.[0]?.message?.content || parsed.content || data;
            } catch (e) {
                return data; // 如果转不动，说明它本身就是我们要的文字
            }
        }

        return String(data); // 最后的保底，强制转字符串

    } catch (error) {
        console.error("AI Error:", error);
        return "AI 助手暂时无法回复。";
    }
}