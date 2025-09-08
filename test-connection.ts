import supabase from './services/supabase';

async function testConnection() {
  try {
    // Try to get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session check:', sessionError ? 'Error' : 'Success');
    if (sessionError) console.error('Session Error:', sessionError.message);

    // Try to query the database
    const { data, error } = await supabase
      .from('_schema')
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
