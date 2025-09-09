import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "https://liepvjfiezgjrchbdwnb.supabase.co";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZXB2amZpZXpnanJjaGJkd25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyODMyNjYsImV4cCI6MjA3Mjg1OTI2Nn0.qNQdxdbA75p5MXTJimYfMEE9tt5BEpoAr_VTKNOLs0Y";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing required Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;