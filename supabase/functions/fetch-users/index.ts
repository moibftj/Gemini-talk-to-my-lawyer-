import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  if (req.method !== 'GET') {
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

  // RBAC: Only lawyer and admin can fetch users
  if (role !== 'lawyer' && role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get('status');

  let query = supabase.from('users').select('*');
  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
});
