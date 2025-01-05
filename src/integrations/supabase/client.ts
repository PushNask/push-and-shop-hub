import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asbkbfyymabugonuomrk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYmtiZnl5bWFidWdvbnVvbXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ0MTI4MDAsImV4cCI6MjAxOTk4ODgwMH0.GE6E3OnBR3VH2vQXu0UvZBGMGR8jQdWEFQlOZ9bTrPQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);