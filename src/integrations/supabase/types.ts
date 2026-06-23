export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          password_hash: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          password_hash: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          password_hash?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      partnerships: {
        Row: {
          amount: number | null
          created_at: string
          email: string
          id: string
          level: string
          message: string | null
          name: string
          payment_method: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          email: string
          id?: string
          level: string
          message?: string | null
          name: string
          payment_method: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          email?: string
          id?: string
          level?: string
          message?: string | null
          name?: string
          payment_method?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string | null
          created_at: string
          date: string | null
          excerpt: string | null
          id: string
          image: string | null
          link: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          date?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          link?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          date?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          link?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      live_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender_name: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender_name: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          created_at: string
          id: string
          location: string | null
          method: string | null
          name: string
          phone: string
          prayer_text: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          method?: string | null
          name: string
          phone: string
          prayer_text: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          method?: string | null
          name?: string
          phone?: string
          prayer_text?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      membership_requests: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string
          gender: string | null
          id: string
          last_name: string
          marital_status: string | null
          membership_type: string | null
          message: string | null
          phone: string
          state: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          marital_status?: string | null
          membership_type?: string | null
          message?: string | null
          phone: string
          state?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          marital_status?: string | null
          membership_type?: string | null
          message?: string | null
          phone?: string
          state?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donor_email: string | null
          donor_name: string | null
          id: string
          status: string
          transaction_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          status?: string
          transaction_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          status?: string
          transaction_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          end_date: string | null
          event_type: string | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          registration_link: string | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          registration_link?: string | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          registration_link?: string | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string
          email: string
          event_id: string
          event_name: string
          full_name: string
          gender: string | null
          id: string
          location: string | null
          notes: string | null
          phone: string
          school: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          event_name: string
          full_name: string
          gender?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          phone: string
          school?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          event_name?: string
          full_name?: string
          gender?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          phone?: string
          school?: string | null
          status?: string
        }
        Relationships: []
      }
      carousel_images: {
        Row: {
          created_at: string
          id: string
          image_name: string
          image_url: string
          order_index: number
          page: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_name: string
          image_url: string
          order_index?: number
          page?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_name?: string
          image_url?: string
          order_index?: number
          page?: string
          updated_at?: string
        }
        Relationships: []
      }
      church_schedule: {
        Row: {
          color: string | null
          created_at: string
          day: string
          description: string | null
          details: string | null
          id: string
          image: string | null
          live_link: string | null
          order_index: number
          time_string: string
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          day: string
          description?: string | null
          details?: string | null
          id?: string
          image?: string | null
          live_link?: string | null
          order_index?: number
          time_string: string
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          day?: string
          description?: string | null
          details?: string | null
          id?: string
          image?: string | null
          live_link?: string | null
          order_index?: number
          time_string?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_gallery: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          id: string
          priority: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          priority?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          priority?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          created_at: string
          content: string
          id: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          author: string
          created_at?: string
          content: string
          id?: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          author?: string
          created_at?: string
          content?: string
          id?: string
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
