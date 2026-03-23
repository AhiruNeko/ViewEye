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
          { role: "system", content: "你是一个专业的 ViewEye 旅游助手。" },
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