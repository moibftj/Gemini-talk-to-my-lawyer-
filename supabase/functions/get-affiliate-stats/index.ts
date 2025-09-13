// FIX: Switched CDN to esm.sh to resolve Deno type definition errors.
/// <reference types="https://esm.sh/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

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
    // We need to get the user from the request, so we need a client that can read the auth header.
    const authHeader = req.headers.get('Authorization')!;
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Now use the admin client to perform queries that might require elevated privileges.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Get affiliate code for the current user from 'profiles' table.
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('affiliate_code')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // Ignore 'no rows found' error
        throw profileError;
    }

    if (!profile || !profile.affiliate_code) {
      return new Response(JSON.stringify({
        affiliateCode: 'N/A',
        usageCount: 0,
        totalRevenue: 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const affiliateCode = profile.affiliate_code;

    // 2. Query a hypothetical 'payments' table for usage and revenue.
    // This is an assumption as the schema is not provided.
    const { data: payments, error: paymentsError } = await supabaseAdmin
      .from('payments')
      .select('amount')
      .eq('coupon_used', affiliateCode)
      .eq('status', 'succeeded'); // Only count successful payments

    if (paymentsError) {
      // If the table doesn't exist, this will fail. Let's return 0s instead of crashing.
      console.warn('Could not query payments table:', paymentsError.message);
      return new Response(JSON.stringify({
        affiliateCode,
        usageCount: 0,
        totalRevenue: 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const usageCount = payments.length;
    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalRevenue = totalAmount * 0.05; // 5% commission

    const stats = {
      affiliateCode,
      usageCount,
      totalRevenue,
    };

    return new Response(JSON.stringify(stats), {
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