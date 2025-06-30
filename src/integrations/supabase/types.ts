export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_suggestions: {
        Row: {
          created_at: string | null
          id: string
          input_data: Json | null
          is_accepted: boolean | null
          suggestion_data: Json
          suggestion_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_data?: Json | null
          is_accepted?: boolean | null
          suggestion_data: Json
          suggestion_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          input_data?: Json | null
          is_accepted?: boolean | null
          suggestion_data?: Json
          suggestion_type?: string
          user_id?: string
        }
        Relationships: []
      }
      clothing_items: {
        Row: {
          brand: string | null
          category: string
          color: string
          created_at: string | null
          hex_color: string
          id: string
          image_url: string | null
          is_favorite: boolean | null
          last_worn: string | null
          material: string | null
          name: string
          notes: string | null
          occasions: string[] | null
          price: number | null
          purchase_date: string | null
          seasons: string[] | null
          size: string | null
          subcategory: string | null
          tags: string[] | null
          times_worn: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          brand?: string | null
          category: string
          color: string
          created_at?: string | null
          hex_color?: string
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          last_worn?: string | null
          material?: string | null
          name: string
          notes?: string | null
          occasions?: string[] | null
          price?: number | null
          purchase_date?: string | null
          seasons?: string[] | null
          size?: string | null
          subcategory?: string | null
          tags?: string[] | null
          times_worn?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          brand?: string | null
          category?: string
          color?: string
          created_at?: string | null
          hex_color?: string
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          last_worn?: string | null
          material?: string | null
          name?: string
          notes?: string | null
          occasions?: string[] | null
          price?: number | null
          purchase_date?: string | null
          seasons?: string[] | null
          size?: string | null
          subcategory?: string | null
          tags?: string[] | null
          times_worn?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fashion_chats: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          message: string
          response: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message: string
          response: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      outfit_calendar: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          outfit_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          outfit_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          outfit_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfit_calendar_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
        ]
      }
      outfit_items: {
        Row: {
          clothing_item_id: string
          created_at: string | null
          id: string
          outfit_id: string
        }
        Insert: {
          clothing_item_id: string
          created_at?: string | null
          id?: string
          outfit_id: string
        }
        Update: {
          clothing_item_id?: string
          created_at?: string | null
          id?: string
          outfit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfit_items_clothing_item_id_fkey"
            columns: ["clothing_item_id"]
            isOneToOne: false
            referencedRelation: "clothing_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfit_items_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
        ]
      }
      outfits: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_favorite: boolean | null
          last_worn: string | null
          name: string
          occasion: string | null
          season: string | null
          times_worn: number | null
          updated_at: string | null
          user_id: string
          weather: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          last_worn?: string | null
          name: string
          occasion?: string | null
          season?: string | null
          times_worn?: number | null
          updated_at?: string | null
          user_id: string
          weather?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          last_worn?: string | null
          name?: string
          occasion?: string | null
          season?: string | null
          times_worn?: number | null
          updated_at?: string | null
          user_id?: string
          weather?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          body_type: string | null
          budget_range: string | null
          color_preferences: string[] | null
          id: string
          lifestyle: string | null
          preferred_brands: string[] | null
          size_info: Json | null
          style_preferences: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body_type?: string | null
          budget_range?: string | null
          color_preferences?: string[] | null
          id?: string
          lifestyle?: string | null
          preferred_brands?: string[] | null
          size_info?: Json | null
          style_preferences?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body_type?: string | null
          budget_range?: string | null
          color_preferences?: string[] | null
          id?: string
          lifestyle?: string | null
          preferred_brands?: string[] | null
          size_info?: Json | null
          style_preferences?: string[] | null
          updated_at?: string | null
          user_id?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
