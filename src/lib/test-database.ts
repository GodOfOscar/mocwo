// Quick Database Testing Script
// Add this to your project to verify all tables and policies are working

import { supabase } from "@/integrations/supabase/client";

export const testDatabaseSetup = async () => {
  console.log("🔍 Testing Supabase Database Setup...\n");

  const tables = [
    "admin_users",
    "partnerships",
    "news",
    "live_messages",
    "prayer_requests",
    "membership_requests",
    "contact_submissions",
    "donations",
    "events",
    "media_gallery",
    "announcements",
    "testimonials"
  ];

  const results: Record<string, string> = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .limit(1);

      if (error) {
        results[table] = `❌ Error: ${error.message}`;
      } else {
        results[table] = "✅ Exists and accessible";
      }
    } catch (err: any) {
      results[table] = `❌ Exception: ${err.message}`;
    }
  }

  console.log("📊 Database Table Status:");
  console.log("==========================");
  Object.entries(results).forEach(([table, status]) => {
    console.log(`${table.padEnd(25)} ${status}`);
  });

  // Test insert (prayer request)
  console.log("\n🧪 Testing Insert Operation...");
  try {
    const { error } = await supabase
      .from("prayer_requests")
      .insert([
        {
          name: "Test User",
          phone: "+233123456789",
          location: "Accra",
          prayer_text: "Test prayer request",
          method: "sms"
        }
      ]);

    if (error) {
      console.log(`❌ Insert failed: ${error.message}`);
    } else {
      console.log("✅ Insert successful");
    }
  } catch (err: any) {
    console.log(`❌ Insert exception: ${err.message}`);
  }

  // Test real-time subscription
  console.log("\n📡 Testing Real-time Subscription...");
  try {
    const subscription = supabase
      .channel("test-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_messages" },
        (payload) => {
          console.log("✅ Real-time subscription working:", payload);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Real-time subscription active");
        }
      });

    // Clean up after 5 seconds
    setTimeout(() => {
      subscription.unsubscribe();
    }, 5000);
  } catch (err: any) {
    console.log(`⚠️ Real-time subscription note: ${err.message}`);
  }

  console.log("\n✨ Database setup test complete!");
};

// Call this function in your dev environment
// testDatabaseSetup();
