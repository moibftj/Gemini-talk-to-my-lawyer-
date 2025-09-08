const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://liepvjfiezgjrchbdwnb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZXB2amZpZXpnanJjaGJkd25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyODMyNjYsImV4cCI6MjA3Mjg1OTI2Nn0.qNQdxdbA75p5MXTJimYfMEE9tt5BEpoAr_VTKNOLs0Y";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Try to get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session check:', sessionError ? 'Error' : 'Success');
    if (sessionError) console.error('Session Error:', sessionError.message);

    // Try to query the database
    const { data, error } = await supabase
      .from('profiles')  // trying to query the profiles table which is commonly created by default
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error.message);
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('Database response:', data);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();
