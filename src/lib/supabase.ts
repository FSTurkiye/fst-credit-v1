import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rmcmlwgfbywkaarblgvf.supabase.co";
const supabaseKey = "sb_publishable_eUUiwXIzs8_BwUeKJvZ4NQ_tkdT5Oys";

export const supabase = createClient(supabaseUrl, supabaseKey);