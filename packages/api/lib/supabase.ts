import { createClient } from "@supabase/supabase-js";

export const supabase = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
};
