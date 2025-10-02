// Fix: Moved the Deno types reference to the top of the file to ensure it's processed correctly by the TypeScript language server.
/// <reference types="https://esm.sh/@supabase/functions-js@2/src/edge-runtime.d.ts" />

// Fix: Add explicit Deno declaration to solve TypeScript errors when the Deno environment types are not automatically picked up.
declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

import { serve } from "https://deno.land/std@0.201.0/http/server.ts";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

// NOTE: For this to work, you must set the `RESEND_API_KEY` in your Supabase project's secrets.
// You can get a key from https://resend.com/
// The `FROM_EMAIL` should be a domain you've verified with Resend.
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL"); 

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!RESEND_API_KEY || !FROM_EMAIL) {
    return new Response(JSON.stringify({ error: "Email service is not configured on the server. Missing API key or FROM address." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const payload: EmailPayload = await req.json();

    const resendPayload = {
      from: `Law Letter AI <${FROM_EMAIL}>`,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(resendPayload),
    });

    const data = await response.json();

    if (!response.ok) {
        // Resend provides useful error messages in the response body
        const errorMessage = data.message || `Failed to send email with status: ${response.status}`;
        throw new Error(errorMessage);
    }

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully." }), {
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
