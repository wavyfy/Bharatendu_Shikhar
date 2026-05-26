// Diagnostic: check profiles table and auth users
// Run: node --env-file=apps/admin/.env.local scripts/check-profiles.mjs

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ Missing env vars");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log("✅ Admin client created");
console.log("URL:", url);

// 1. List all auth users
const { data: users, error: usersError } = await admin.auth.admin.listUsers();
if (usersError) {
  console.error("❌ auth.admin.listUsers error:", usersError.message);
} else {
  console.log(`\n👥 Auth users (${users.users.length}):`);
  users.users.forEach((u) => {
    console.log(`  - id: ${u.id}  email: ${u.email}`);
  });
}

// 2. List all profiles rows
const { data: profiles, error: profilesError } = await admin
  .from("profiles")
  .select("*");

if (profilesError) {
  console.error("\n❌ profiles query error:", profilesError.message, profilesError.code);
  console.error("  Hint: table may not exist or column names differ");
} else {
  console.log(`\n📋 Profiles rows (${profiles.length}):`);
  profiles.forEach((p) => console.log(" ", JSON.stringify(p)));
}

// 3. Cross-check - do user IDs match profile IDs?
if (users?.users && profiles) {
  console.log("\n🔍 ID cross-check:");
  users.users.forEach((u) => {
    const match = profiles.find((p) => p.id === u.id);
    console.log(`  ${u.email}: profile ${match ? "✅ FOUND role=" + match.role : "❌ MISSING"}`);
  });
}
