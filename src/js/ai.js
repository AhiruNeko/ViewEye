import { supabase } from './supabase.js';

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