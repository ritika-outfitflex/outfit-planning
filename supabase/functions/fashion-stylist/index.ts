import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
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

    // Prepare wardrobe data for AI with pattern and color info
    const wardrobeData = items.map(item => ({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      color: item.color,
      hex_color: item.hex_color,
      pattern: item.pattern || 'solid',
      style_tags: item.style_tags || [],
      size: item.size,
      material: item.material,
      seasons: item.seasons || [],
      occasions: item.occasions || [],
      notes: item.notes
    }));

    const prompt = `You are a professional fashion stylist for the OutfitFlex app with expertise in color theory and pattern mixing.

CRITICAL COLOR COMBINATION RULES:
1. Complementary colors work well together (opposite on color wheel)
2. Analogous colors (adjacent on color wheel) create harmonious looks
3. Neutral colors (black, white, gray, beige, navy) pair with any color
4. Avoid clashing: red with pink, orange with purple (unless intentional high-fashion)
5. Use the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent

PATTERN MIXING RULES:
1. Mix different scale patterns (large floral with small stripes)
2. Keep similar color palettes when mixing patterns
3. Use solid colors to break up patterns
4. Limit to 2-3 patterns maximum per outfit
5. Pattern combinations that work:
   - Stripes + Florals
   - Geometric + Solid
   - Plaid + Solid
   - Abstract + Stripes
6. Avoid: Same pattern type (e.g., two different florals), competing busy patterns

COLOR-SPECIFIC PAIRING GUIDE:
- Blue: pairs with white, beige, brown, orange, yellow
- Red: pairs with black, white, navy, beige
- Green: pairs with beige, brown, white, navy
- Yellow: pairs with gray, navy, white, purple
- Pink: pairs with gray, white, navy, green
- Purple: pairs with gray, white, yellow, green

PATTERN-SPECIFIC PAIRING:
- Striped items: pair with solid colors or small geometric patterns
- Floral items: pair with solid neutrals or subtle textures
- Geometric items: pair with solid colors
- Plaid/Checkered: pair with solid colors only
- Animal print: treat as neutral, pair with solid colors

Filters requested:
- Occasion: ${filters.occasion || 'any'}
- Season: ${filters.season || 'any'}
- Weather: ${filters.weather || 'any'}
- Style preference: ${filters.style || 'any'}

Wardrobe items available (with color hex codes and patterns):
${JSON.stringify(wardrobeData, null, 2)}

Rules:
1. Apply color theory - NO random color combinations
2. Check pattern compatibility before pairing
3. Provide 2-3 outfit combinations ranked by color/pattern harmony
4. Each outfit must have:
   - title (descriptive name)
   - match_score (0-100, based on color/pattern harmony + filter match)
   - items (wardrobe item names)
   - footwear (from wardrobe or suggestion)
   - accessories (styling tips)
   - reasoning (explain the color/pattern choices)
   - color_harmony_score (0-100, how well colors work together)
   - pattern_balance (description of pattern mixing strategy)

Output JSON format:
{
  "outfits": [
    {
      "title": "Navy & Tan Business Casual",
      "match_score": 95,
      "color_harmony_score": 98,
      "pattern_balance": "Solid navy top with neutral tan bottoms - classic complementary pairing",
      "items": ["Navy Blazer", "Tan Chinos"],
      "footwear": "Brown Loafers",
      "accessories": "Silver watch, leather belt",
      "reasoning": "Navy and tan are timeless business colors. Both solid patterns keep it professional. Perfect for work occasion."
    }
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fashion stylist with expertise in color theory and pattern mixing. Always respond with valid JSON only, no additional text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
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