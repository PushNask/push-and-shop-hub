import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asbkbfyymabugonuomrk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYmtiZnl5bWFidWdvbnVvbXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMjgwNjUsImV4cCI6MjA1MTYwNDA2NX0.j3ipg778NwO04F0utpyz-dMtmX6QuPEpY7x0VzbgpK0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);