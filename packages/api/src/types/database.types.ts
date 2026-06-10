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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
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
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          facebook_url: string | null
          favicon_url: string | null
          featured_articles_count: number
          hero_subtitle: string | null
          hero_title: string | null
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
          site_logo_url: string | null
          site_name: string
          site_tagline: string | null
          twitter_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          facebook_url?: string | null
          favicon_url?: string | null
          featured_articles_count?: number
          hero_subtitle?: string | null
          hero_title?: string | null
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
          site_logo_url?: string | null
          site_name?: string
          site_tagline?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          facebook_url?: string | null
          favicon_url?: string | null
          featured_articles_count?: number
          hero_subtitle?: string | null
          hero_title?: string | null
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
          site_logo_url?: string | null
          site_name?: string
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
