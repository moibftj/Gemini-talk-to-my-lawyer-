// FIX: Switched CDN to esm.sh to resolve Deno type definition errors.
/// <reference types="https://esm.sh/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

// Follow this guide to deploy the function to your Supabase project:
// https://supabase.com/docs/guides/functions/deploy

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.4'

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service_role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch all letters from the letters table
    const { data: letters, error } = await supabaseAdmin
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ letters }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});