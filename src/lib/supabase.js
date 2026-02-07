import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ubftxzqlnfrbacnkhwnn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZnR4enFsbmZyYmFjbmtod25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTg3MDMsImV4cCI6MjA4NTE5NDcwM30.lKdyBNGjDF3CxmUNptam_ZSBIg_xIzjAwRWwVDA2hJM' // You need to provide this

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
