const SUPABASE_URL = "https://ixmaeziloyjbdbnidtvq.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_Ka1wFGVksfs-cO-uGOWbkg_OyPwKSDO";

const { createClient } = supabase;

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);