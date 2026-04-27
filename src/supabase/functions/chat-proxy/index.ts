import "@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, api-key', // 注意增加了 api-key
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    const AI_API_KEY = Deno.env.get('HKBU_AI_KEY')

    // 1. 修正后的 URL：必须包含 deployments, model_name 和 api-version
    const model_name = "gpt-5"
    const api_version = "2024-12-01-preview"
    const url = `https://genai.hkbu.edu.hk/api/v0/rest/deployments/${model_name}/chat/completions?api-version=${api_version}`

    // 2. 修正后的请求：HKBU 要求使用 'api-key' 而不是 'Authorization'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': AI_API_KEY, // 文档明确要求用这个 header
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: `你名為 ViewEye AI，是 ViewEye 智慧旅行平台的專屬嚮導。
            你的任務是引導用戶進行「沉浸式探索」與「生態責任」深度融合的旅行。

            你的行為準則：
            1. 核心定位：你熱愛香港西貢區與珠海的自然與文化遺址，熟悉 360° 全景技術能帶來的視覺震撼。
            2. 永續發展：當用戶詢問路線時，優先推薦低碳路徑（徒步、公共交通），並提及行程對環境的正面影響（如減少碳排放）。
            3. 專業深度：你能介紹遺址的歷史背景和地質公園的祕境知識，語言要有溫度，像是在講述山海間的驚喜。
            4. 社區支持：鼓勵用戶進行本地消費以支持社區發展。
            5. 限制：如果用戶詢問與旅行、環保、可持續發展、港珠地標無關的話題，請禮貌地引導回 ViewEye 的服務範圍。

            用戶可能問道的地點包括香港西貢的彩虹站、西貢、北潭凹、北潭涌、西灣亭、萬宜水庫東壩、WM Hotel、西貢碼頭、萬宜遊樂場、Lobster Une、海鮮街、天后古廟、火山探知館、破邊洲、浪茄灣、西灣山、聯合國教科文組織世界地質公園、西灣村、咸田灣、赤徑，珠海的珠海港珠澳大橋入境處、珠海博物館、湯臣倍健透明工廠、中航通飛、中醫藥體驗館。
            
            請用親切、專業且富有感染力的中文回答。請務必簡潔，回答控制在300字以內` },
          { role: "user", content: prompt }
        ],
        max_tokens: 800
      })
    })

    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
})