
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://pvrxpsyaqyqpjxvmwjxv.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cnhwc3lhcXlxcGp4dm13anh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NjU2NjIsImV4cCI6MjA4MjE0MTY2Mn0.3rBHYbvShoEKg7EbHJ2JRk55P0bQb2eKqV6itAiGuNo';

// Check if we are running in a context where keys are actually provided
// Note: In some environments, process.env might be empty, so we check the default values.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
