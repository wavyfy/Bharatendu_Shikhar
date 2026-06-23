export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      advertisement_placements: {
        Row: {
          advertisement_id: string
          created_at: string
          id: string
          slot_identifier: string
        }
        Insert: {
          advertisement_id: string
          created_at?: string
          id?: string
          slot_identifier: string
        }
        Update: {
          advertisement_id?: string
          created_at?: string
          id?: string
          slot_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_placements_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisements: {
        Row: {
          advertiser_name: string
          advertiser_phone: string | null
          created_at: string
          created_by: string
          end_date: string
          id: string
          image_url: string
          is_active: boolean
          redirect_url: string | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          advertiser_name: string
          advertiser_phone?: string | null
          created_at?: string
          created_by: string
          end_date: string
          id?: string
          image_url: string
          is_active?: boolean
          redirect_url?: string | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          advertiser_name?: string
          advertiser_phone?: string | null
          created_at?: string
          created_by?: string
          end_date?: string
          id?: string
          image_url?: string
          is_active?: boolean
          redirect_url?: string | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_badges: {
        Row: {
          article_id: number
          badge_id: number
        }
        Insert: {
          article_id: number
          badge_id: number
        }
        Update: {
          article_id?: number
          badge_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "article_badges_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      article_live_updates: {
        Row: {
          article_id: number
          content: string
          created_at: string
          created_by: string
          headline: string
          id: number
          updated_at: string
        }
        Insert: {
          article_id: number
          content: string
          created_at?: string
          created_by: string
          headline: string
          id?: number
          updated_at?: string
        }
        Update: {
          article_id?: number
          content?: string
          created_at?: string
          created_by?: string
          headline?: string
          id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_live_updates_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          category_id: number | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: number
          is_live: boolean
          published_at: string | null
          region_id: number | null
          slug: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category_id?: number | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: never
          is_live?: boolean
          published_at?: string | null
          region_id?: number | null
          slug: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category_id?: number | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: never
          is_live?: boolean
          published_at?: string | null
          region_id?: number | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          color: string
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: number
          name: string
          slug: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: never
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      device_tokens: {
        Row: {
          created_at: string | null
          id: number
          platform: string | null
          token: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          platform?: string | null
          token: string
        }
        Update: {
          created_at?: string | null
          id?: never
          platform?: string | null
          token?: string
        }
        Relationships: []
      }
      elections: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          featured_image_url: string | null
          region_id: number | null
          status: string
          is_published: boolean
          display_order: number
          voting_date: string | null
          result_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          featured_image_url?: string | null
          region_id?: number | null
          status?: string
          is_published?: boolean
          display_order?: number
          voting_date?: string | null
          result_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          featured_image_url?: string | null
          region_id?: number | null
          status?: string
          is_published?: boolean
          display_order?: number
          voting_date?: string | null
          result_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "elections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elections_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          }
        ]
      }
      election_groups: {
        Row: {
          id: string
          election_id: string
          title: string
          sort_order: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          election_id: string
          title: string
          sort_order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          election_id?: string
          title?: string
          sort_order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "election_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "election_groups_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          }
        ]
      }
      election_candidates: {
        Row: {
          id: string
          group_id: string
          candidate_name: string
          party_name: string | null
          party_symbol_url: string | null
          photo_url: string | null
          votes: number
          is_winner: boolean
          sort_order: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_id: string
          candidate_name: string
          party_name?: string | null
          party_symbol_url?: string | null
          photo_url?: string | null
          votes?: number
          is_winner?: boolean
          sort_order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          candidate_name?: string
          party_name?: string | null
          party_symbol_url?: string | null
          photo_url?: string | null
          votes?: number
          is_winner?: boolean
          sort_order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "election_candidates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "election_candidates_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "election_groups"
            referencedColumns: ["id"]
          }
        ]
      }
      election_updates: {
        Row: {
          id: string
          election_id: string
          title: string
          content: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          election_id: string
          title: string
          content: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          election_id?: string
          title?: string
          content?: string
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "election_updates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "election_updates_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          }
        ]
      }
      epapers: {
        Row: {
          author_id: string | null
          created_at: string | null
          expiry_date: string | null
          id: number
          pdf_url: string
          published_at: string | null
          region_id: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: never
          pdf_url: string
          published_at?: string | null
          region_id?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: never
          pdf_url?: string
          published_at?: string | null
          region_id?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "epapers_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "epapers_uploaded_by_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          is_active: boolean
          role: string
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          is_active?: boolean
          role: string
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          role?: string
        }
        Relationships: []
      }
      regions: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: never
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          about_us: string | null
          correction_policy: string | null
          copyright_text: string | null
          editorial_policy: string | null
          privacy_policy: string | null
          terms_conditions: string | null
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          facebook_url: string | null
          favicon_url: string | null
          featured_articles_count: number
          hero_subtitle: string | null
          hero_title: string | null
          hide_all_ads: boolean | null
          id: number
          instagram_url: string | null
          linkedin_url: string | null
          maintenance_message: string | null
          maintenance_mode: boolean
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          notify_email: string | null
          notify_on_new_article: boolean
          og_image_url: string | null
          site_logo_dark_url: string | null
          site_logo_url: string | null
          site_name: string
          site_url: string | null
          site_tagline: string | null
          twitter_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          about_us?: string | null
          correction_policy?: string | null
          copyright_text?: string | null
          editorial_policy?: string | null
          privacy_policy?: string | null
          terms_conditions?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          facebook_url?: string | null
          favicon_url?: string | null
          featured_articles_count?: number
          hero_subtitle?: string | null
          hero_title?: string | null
          hide_all_ads?: boolean | null
          id?: number
          instagram_url?: string | null
          linkedin_url?: string | null
          maintenance_message?: string | null
          maintenance_mode?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          notify_email?: string | null
          notify_on_new_article?: boolean
          og_image_url?: string | null
          site_logo_dark_url?: string | null
          site_logo_url?: string | null
          site_name?: string
          site_url?: string | null
          site_tagline?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          about_us?: string | null
          correction_policy?: string | null
          copyright_text?: string | null
          editorial_policy?: string | null
          privacy_policy?: string | null
          terms_conditions?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          facebook_url?: string | null
          favicon_url?: string | null
          featured_articles_count?: number
          hero_subtitle?: string | null
          hero_title?: string | null
          hide_all_ads?: boolean | null
          id?: number
          instagram_url?: string | null
          linkedin_url?: string | null
          maintenance_message?: string | null
          maintenance_mode?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          notify_email?: string | null
          notify_on_new_article?: boolean
          og_image_url?: string | null
          site_logo_dark_url?: string | null
          site_logo_url?: string | null
          site_name?: string
          site_url?: string | null
          site_tagline?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_ad_for_slot: {
        Args: { p_slot: string }
        Returns: {
          advertiser_name: string
          advertiser_phone: string
          created_at: string
          created_by: string
          end_date: string
          id: string
          image_url: string
          is_active: boolean
          redirect_url: string
          start_date: string
          title: string
          updated_at: string
        }[]
      }
      get_occupied_slots: {
        Args: {
          p_end_date: string
          p_exclude_ad_id?: string
          p_start_date: string
        }
        Returns: {
          slot_identifier: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
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
