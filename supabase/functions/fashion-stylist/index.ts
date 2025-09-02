import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filters, user_id } = await req.json();
    
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Fetch user's clothing items
    const { data: items, error } = await supabase
      .from('clothing_items')
      .select('*')
      .eq('user_id', user_id);

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch wardrobe items' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ outfits: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare wardrobe data for AI
    const wardrobeData = items.map(item => ({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      color: item.color,
      size: item.size,
      material: item.material,
      seasons: item.seasons || [],
      occasions: item.occasions || [],
      notes: item.notes
    }));

    const prompt = `You are a professional fashion stylist for the OutfitFlex app.
You must suggest outfits using the user's wardrobe only.

Wardrobe items will always be provided with names and image URLs.

Use only items from wardrobe for tops, bottoms, dresses, layering, and accessories.

For footwear:
- If footwear exists in wardrobe, suggest from wardrobe.
- If no footwear is in wardrobe, recommend suitable styles (e.g., "white sneakers", "tan loafers") but clearly mark them as suggestions only.

Always include accessory or styling tips (e.g., "pair with a slim black belt" or "add a silver pendant necklace").

Filters:
- Occasion: ${filters.occasion || 'any'}
- Season: ${filters.season || 'any'}
- Weather: ${filters.weather || 'any'}
- Style preference: ${filters.style || 'any'}

Rules:
1. Outfits must match Occasion, Season, Weather, and Style preference given by the user.
2. Provide 2–3 outfit combinations.
3. Each outfit must return:
   - title (short name for outfit)
   - match_score (percentage of fit)
   - items (list of wardrobe items by name → so app can fetch stored image URLs)
   - footwear (either wardrobe item or text suggestion if wardrobe has none)
   - accessories (tips on accessories to complete the look)
   - reasoning (why this outfit fits the filters)

Wardrobe items available:
${JSON.stringify(wardrobeData, null, 2)}

Output must be JSON in this exact structure:
{
  "outfits": [
    {
      "title": "Workday Minimalist",
      "match_score": "92%",
      "items": ["White Polka Top", "Blue Cargo Jeans"],
      "footwear": "White Sneakers (suggestion)",
      "accessories": "Simple silver chain, black tote bag",
      "reasoning": "Breathable outfit for summer workday, minimalist and functional."
    }
  ],
  "feedback": {
    "like_dislike": "User can mark Like or Dislike for training."
  }
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fashion stylist. Always respond with valid JSON only, no additional text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    let suggestions;
    try {
      suggestions = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw AI response:', aiResponse);
      return new Response(JSON.stringify({ error: 'Invalid AI response format' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store AI suggestions in database for analytics
    for (const outfit of suggestions.outfits) {
      await supabase
        .from('ai_suggestions')
        .insert({
          user_id: user_id,
          suggestion_type: 'outfit',
          input_data: filters,
          suggestion_data: outfit
        });
    }

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fashion-stylist function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});