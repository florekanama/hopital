// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ujswkxqlkeyegananzqn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqc3dreHFsa2V5ZWdhbmFuenFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MTkzNzYsImV4cCI6MjA2OTE5NTM3Nn0.8xIhBPiZMxdrPcyQHOp4Y1AWhaJu9LErfc6DK4eoE1o'


// Options de configuration recommandées
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
     storage: typeof window !== 'undefined' ? localStorage : undefined,
    detectSessionInUrl: false
  },
  global: {
    headers: { 'x-application-name': 'MonApplication' }
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions)