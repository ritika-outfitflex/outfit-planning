import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { details } = await req.json();
    
    if (!details || !details.category) {
      return new Response(JSON.stringify({ error: 'Item details required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Generate a short, descriptive name for a clothing item with these details:
- Category: ${details.category}
${details.subcategory ? `- Subcategory: ${details.subcategory}` : ''}
${details.color ? `- Color: ${details.color}` : ''}
${details.pattern ? `- Pattern: ${details.pattern}` : ''}
${details.material ? `- Material: ${details.material}` : ''}
${details.sleeveType ? `- Sleeve Type: ${details.sleeveType}` : ''}
${details.pantStyle ? `- Pant Style: ${details.pantStyle}` : ''}
${details.neckline ? `- Neckline: ${details.neckline}` : ''}
${details.fit ? `- Fit: ${details.fit}` : ''}

Generate a concise, natural-sounding name (3-6 words) that captures the essence of this item.
Examples: "Navy Blue V-Neck T-Shirt", "Black Skinny Jeans", "Floral Wide Leg Pants"

Return ONLY the name, no quotes or extra text.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a fashion expert who creates clear, descriptive names for clothing items.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI error:', response.status, await response.text());
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error('AI service error');
    }

    const data = await response.json();
    const name = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ name }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});