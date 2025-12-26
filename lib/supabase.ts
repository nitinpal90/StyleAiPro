
export const isSupabaseConfigured = false;
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: () => Promise.resolve(),
    signUp: () => Promise.resolve({ error: { message: "Auth disabled" } }),
    signInWithPassword: () => Promise.resolve({ error: { message: "Auth disabled" } }),
  }
} as any;
