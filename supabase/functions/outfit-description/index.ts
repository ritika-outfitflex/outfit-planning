import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, occasion, weather, season } = await req.json();

    console.log('Generating outfit description for:', { items, occasion, weather, season });

    const prompt = `You are a professional fashion stylist. Create a stylish and engaging description for an outfit based on these items:

Items: ${items.map((item: any) => `${item.name} (${item.category}, ${item.color})`).join(', ')}
${occasion ? `Occasion: ${occasion}` : ''}
${weather ? `Weather: ${weather}` : ''}
${season ? `Season: ${season}` : ''}

Write a short, fashionable description (2-3 sentences) that:
1. Describes how the pieces work together
2. Mentions the style/vibe of the outfit
3. Uses fashion terminology and be inspiring
4. Keep it concise and engaging

Also suggest if there are multiple ways to style these items, create 2-3 alternative outfit combinations using the same items with brief descriptions for each.

Return a JSON response with this structure:
{
  "mainDescription": "Main outfit description",
  "alternatives": [
    {
      "name": "Alternative outfit name",
      "description": "Brief description",
      "items": ["item1", "item2", "item3"]
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
          { role: 'system', content: 'You are a professional fashion stylist who creates engaging outfit descriptions.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let result;
    
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.log('Failed to parse JSON, using raw response');
      result = {
        mainDescription: data.choices[0].message.content,
        alternatives: []
      };
    }

    console.log('Generated outfit description:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating outfit description:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate description',
      mainDescription: 'A stylish outfit perfect for any occasion!',
      alternatives: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});