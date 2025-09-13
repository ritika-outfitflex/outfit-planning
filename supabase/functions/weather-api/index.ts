import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { latitude, longitude } = await req.json();

    // Using free weather API service with more accurate units
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto&temperature_unit=celsius`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    
    // Map weather codes to descriptions
    const getWeatherDescription = (code: number): string => {
      if (code === 0) return 'clear sky';
      if (code <= 3) return 'partly cloudy';
      if (code <= 48) return 'foggy';
      if (code <= 67) return 'rainy';
      if (code <= 77) return 'snowy';
      if (code <= 82) return 'rainy';
      if (code <= 86) return 'snowy';
      if (code <= 99) return 'thunderstorm';
      return 'unknown';
    };

    const weatherData = {
      temperature: Math.round(data.current.temperature_2m),
      description: getWeatherDescription(data.current.weather_code),
      condition: getWeatherDescription(data.current.weather_code),
      location: 'Current Location'
    };

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    
    // Return fallback data
    const fallbackData = {
      temperature: 22,
      description: 'partly cloudy',
      condition: 'cloudy',
      location: 'Current Location'
    };

    return new Response(JSON.stringify(fallbackData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});