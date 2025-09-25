import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.2.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { data: user, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (authError || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Fetch user role
  const { data: userData, error: roleError } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (roleError || !userData) {
    return new Response('User data not found', { status: 404 });
  }
  const role = userData.role;

  // RBAC: Lawyer and admin can generate; client can request (assuming they provide context)
  if (role !== 'lawyer' && role !== 'admin' && role !== 'client') {
    return new Response('Forbidden', { status: 403 });
  }

  const { prompt, context } = await req.json();
  if (!prompt) {
    return new Response('Prompt required', { status: 400 });
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(`${context || ''} Generate a legal letter draft: ${prompt}`);
  const draft = result.response.text();

  // Optionally save to database
  const { error: insertError } = await supabase.from('letter_drafts').insert({
    user_id: user.id,
    draft,
    created_at: new Date().toISOString(),
  });
  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ draft }), { status: 200 });
});
