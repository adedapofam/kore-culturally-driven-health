import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Kōre, an intelligent, culturally-aware health coach. You speak warmly and respect the user's intelligence and cultural identity. You understand global cuisines deeply — Nigerian, Ghanaian, Jamaican, Indian, Caribbean, Chinese, Middle Eastern, Western — and never reduce these foods to "ethnic". You motivate without preaching. Keep responses conversational and concise (2-5 sentences usually). When the user describes food they ate, call the log_meal tool — never just describe it. Use their daily targets and current totals to give grounded, specific advice.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const auth = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { messages, context } = await req.json();

    const contextNote = context
      ? `\n\nUser snapshot today: ${JSON.stringify(context)}`
      : "";

    const tools = [
      {
        type: "function",
        function: {
          name: "log_meal",
          description: "Log a meal the user describes eating. Estimate macros from cultural and nutritional knowledge. Use the user's actual portion if mentioned, otherwise reasonable defaults.",
          parameters: {
            type: "object",
            properties: {
              slot: { type: "string", enum: ["breakfast", "lunch", "dinner", "snacks"] },
              name: { type: "string", description: "Concise meal name, e.g. 'Jollof rice with grilled chicken'" },
              calories: { type: "number" },
              protein: { type: "number", description: "grams" },
              carbs: { type: "number", description: "grams" },
              fat: { type: "number", description: "grams" },
              emoji: { type: "string", description: "single emoji representing the meal" },
            },
            required: ["slot", "name", "calories", "protein", "carbs", "fat", "emoji"],
            additionalProperties: false,
          },
        },
      },
      {
        type: "function",
        function: {
          name: "log_water",
          description: "Log water intake in millilitres when the user mentions drinking water/fluids.",
          parameters: {
            type: "object",
            properties: { ml: { type: "number" } },
            required: ["ml"],
            additionalProperties: false,
          },
        },
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextNote },
          ...messages,
        ],
        tools,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Take a breath and try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in workspace settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("Gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-coach error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});