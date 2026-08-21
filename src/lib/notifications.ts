import { supabase } from "@/integrations/supabase/client";

export interface NotificationSubscription {
  id: string;
  email: string;
  notification_type: "livestream" | "programs" | "all";
  is_active: boolean;
  created_at: string;
}

/**
 * Subscribe user to notifications
 */
export const subscribeToNotifications = async (
  email: string,
  notificationType: "livestream" | "programs" | "all" = "all"
): Promise<{ success: boolean; message: string; data?: NotificationSubscription }> => {
  try {
    // Check if email already exists
    const { data: existing, error: fetchError } = await (supabase as any)
      .from("notification_subscriptions")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows returned (which is fine for new subscriptions)
      throw fetchError;
    }

    if (existing) {
      // Update existing subscription
      const { data, error } = await (supabase as any)
        .from("notification_subscriptions")
        .update({
          notification_type: notificationType,
          is_active: true,
        })
        .eq("email", email)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: "Subscription updated successfully",
        data,
      };
    }

    // Create new subscription
    const { data, error } = await (supabase as any)
      .from("notification_subscriptions")
      .insert([
        {
          email,
          notification_type: notificationType,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: "Successfully subscribed to notifications",
      data,
    };
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    return {
      success: false,
      message: "Failed to subscribe. Please try again.",
    };
  }
};

/**
 * Unsubscribe user from notifications
 */
export const unsubscribeFromNotifications = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await (supabase as any)
      .from("notification_subscriptions")
      .update({ is_active: false })
      .eq("email", email);

    if (error) throw error;

    return {
      success: true,
      message: "Successfully unsubscribed from notifications",
    };
  } catch (error) {
    console.error("Error unsubscribing from notifications:", error);
    return {
      success: false,
      message: "Failed to unsubscribe. Please try again.",
    };
  }
};

/**
 * Check if email is subscribed
 */
export const checkSubscription = async (
  email: string
): Promise<NotificationSubscription | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from("notification_subscriptions")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return null;
  }
};
