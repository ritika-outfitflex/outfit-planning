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

    const prompt = `You are an expert fashion stylist. Suggest outfit combinations from the user's wardrobe database. Always tailor the suggestions to the given filters:

Filters:
- Occasion: ${filters.occasion || 'any'}
- Season: ${filters.season || 'any'}
- Weather: ${filters.weather || 'any'}
- Style preference: ${filters.style || 'any'}

Rules:
1. Suggest complete outfit sets (top + bottom + footwear + optional accessories or layering)
2. Ensure the outfit matches the occasion (e.g., Work → shirts, blazers, trousers; Party → dresses, stylish tops, heels)
3. Match the season/weather (e.g., Summer → breathable fabrics, Winter → jackets/layers, Rainy → waterproof footwear)
4. Respect the style filter (Minimalist → neutral tones/simple cuts, Boho → flowy/colorful, etc.)
5. Use items only from the wardrobe dataset provided. If not enough items exist, suggest the closest alternative
6. Return maximum 5 outfit suggestions
7. Each outfit should have a match score between 70-98%

Wardrobe items available:
${JSON.stringify(wardrobeData, null, 2)}

Return results in this exact JSON structure (no additional text):
{
  "outfits": [
    {
      "title": "White Shirt & Black Trousers",
      "match_score": "92%",
      "items": ["White Cotton Shirt", "Black Slim-fit Trousers", "Brown Leather Belt", "Oxford Shoes"],
      "occasion": "Work",
      "reasoning": "Formal yet breathable look for summer workday in sunny weather."
    }
  ]
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