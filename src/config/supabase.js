const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

console.log(`Supabase connected on ${process.env.NODE_ENV}`);

module.exports = supabase;
