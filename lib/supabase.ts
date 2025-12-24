
import { createClient } from '@supabase/supabase-js';

const getSupabaseEnv = () => {
    try {
        const env = (import.meta as any).env;
        return {
            url: env?.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://pvrxpsyaqyqpjxvmwjxv.supabase.co',
            key: env?.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cnhwc3lhcXlxcGp4dm13anh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NjU2NjIsImV4cCI6MjA4MjE0MTY2Mn0.3rBHYbvShoEKg7EbHJ2JRk55P0bQb2eKqV6itAiGuNo'
        };
    } catch (e) {
        return {
            url: 'https://pvrxpsyaqyqpjxvmwjxv.supabase.co',
            key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cnhwc3lhcXlxcGp4dm13anh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NjU2NjIsImV4cCI6MjA4MjE0MTY2Mn0.3rBHYbvShoEKg7EbHJ2JRk55P0bQb2eKqV6itAiGuNo'
        };
    }
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseEnv();

export const isSupabaseConfigured = Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl !== 'undefined' &&
    !supabaseUrl.includes('pvrxpsyaqyqpjxvmwjxv') // Optional: detects if it's still using the hardcoded fallback
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
