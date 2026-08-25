const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://vxwwxbnxjfgebvqrtjlb.supabase.co";
const supabaseAnonKey = "sb_publishable_oEHDold9Cjss4RL-xXf44A_LvKKir7d";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing Supabase connection...");
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "wahyualdiriyanto80@gmail.com",
      password: "password123",
    });

    console.log("Auth result user:", data?.user?.email);
    console.log("Auth result session:", !!data?.session);
    console.log("Auth result error:", error);
  } catch (err) {
    console.error("Catch error:", err);
  }
}

test();
