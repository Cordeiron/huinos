import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("ERRO CRÍTICO: As credenciais do Supabase (SUPABASE_URL e SUPABASE_KEY) não foram encontradas nas variáveis de ambiente!");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
