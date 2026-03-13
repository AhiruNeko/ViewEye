// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xyzovwbnldmjjrjbowxx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5em92d2JubGRtampyamJvd3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTEyOTIsImV4cCI6MjA4ODM2NzI5Mn0.5xcRkBlrJwJP0jQN1KGt3yz_5adCVCfoGTtEvr7H2qw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
