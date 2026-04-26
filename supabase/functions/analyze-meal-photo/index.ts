import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { imageBase64, slot } = await req.json();
    if (!imageBase64) return new Response(JSON.stringify({ error: "imageBase64 required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a nutrition vision expert. Identify the meal in the photo and estimate macros. You know West African, Caribbean, South Asian, East Asian, Middle Eastern, Western and Latin American cuisines. Always call the return_meal tool — never reply with prose.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: `Identify this meal and estimate macros. Slot: ${slot ?? "unknown"}.` },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_meal",
            description: "Return the identified meal with estimated macros",
            parameters: {
              type: "object",
              properties: {
                name: { type: "string" },
                calories: { type: "number" },
                protein: { type: "number" },
                carbs: { type: "number" },
                fat: { type: "number" },
                emoji: { type: "string" },
                confidence: { type: "string", enum: ["low", "medium", "high"] },
              },
              required: ["name", "calories", "protein", "carbs", "fat", "emoji", "confidence"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_meal" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit reached" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await response.text();
      return new Response(JSON.stringify({ error: t }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) return new Response(JSON.stringify({ error: "No meal detected" }), { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const meal = JSON.parse(call.function.arguments);
    return new Response(JSON.stringify(meal), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("analyze-meal-photo error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});