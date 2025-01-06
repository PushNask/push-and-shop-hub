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
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_permissions: {
        Row: {
          admin_id: string | null
          created_at: string | null
          id: string
          permission: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          permission: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          permission?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_permissions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics: {
        Row: {
          active_products: number | null
          created_at: string | null
          date: string
          id: string
          pending_approvals: number | null
          seller_id: string | null
          total_chats: number | null
          total_revenue: number | null
          total_views: number | null
        }
        Insert: {
          active_products?: number | null
          created_at?: string | null
          date?: string
          id?: string
          pending_approvals?: number | null
          seller_id?: string | null
          total_chats?: number | null
          total_revenue?: number | null
          total_views?: number | null
        }
        Update: {
          active_products?: number | null
          created_at?: string | null
          date?: string
          id?: string
          pending_approvals?: number | null
          seller_id?: string | null
          total_chats?: number | null
          total_revenue?: number | null
          total_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          both_options: boolean | null
          category: string
          created_at: string | null
          currency: string
          delivery_option: Database["public"]["Enums"]["delivery_option"] | null
          description: string | null
          expiry: string | null
          id: string
          images: string[] | null
          link_slot: number | null
          pickup: boolean | null
          price: number
          seller_id: string | null
          shipping: boolean | null
          status: string | null
          title: string
        }
        Insert: {
          both_options?: boolean | null
          category: string
          created_at?: string | null
          currency?: string
          delivery_option?:
            | Database["public"]["Enums"]["delivery_option"]
            | null
          description?: string | null
          expiry?: string | null
          id?: string
          images?: string[] | null
          link_slot?: number | null
          pickup?: boolean | null
          price: number
          seller_id?: string | null
          shipping?: boolean | null
          status?: string | null
          title: string
        }
        Update: {
          both_options?: boolean | null
          category?: string
          created_at?: string | null
          currency?: string
          delivery_option?:
            | Database["public"]["Enums"]["delivery_option"]
            | null
          description?: string | null
          expiry?: string | null
          id?: string
          images?: string[] | null
          link_slot?: number | null
          pickup?: boolean | null
          price?: number
          seller_id?: string | null
          shipping?: boolean | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assigned_regions: string[] | null
          country: string | null
          created_at: string | null
          email: string
          failed_login_attempts: number | null
          id: string
          is_verified: boolean | null
          last_login: string | null
          name: string | null
          password_changed_at: string | null
          phone: string | null
          role: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          assigned_regions?: string[] | null
          country?: string | null
          created_at?: string | null
          email: string
          failed_login_attempts?: number | null
          id: string
          is_verified?: boolean | null
          last_login?: string | null
          name?: string | null
          password_changed_at?: string | null
          phone?: string | null
          role?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          assigned_regions?: string[] | null
          country?: string | null
          created_at?: string | null
          email?: string
          failed_login_attempts?: number | null
          id?: string
          is_verified?: boolean | null
          last_login?: string | null
          name?: string | null
          password_changed_at?: string | null
          phone?: string | null
          role?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          payment_method: string
          product_id: string | null
          seller_id: string | null
          status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          id?: string
          payment_method: string
          product_id?: string | null
          seller_id?: string | null
          status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          payment_method?: string
          product_id?: string | null
          seller_id?: string | null
          status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "featured_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "standard_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      featured_products: {
        Row: {
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          expiry: string | null
          id: string | null
          images: string[] | null
          link_slot: number | null
          price: number | null
          seller_country: string | null
          seller_email: string | null
          seller_id: string | null
          status: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      standard_products: {
        Row: {
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          expiry: string | null
          id: string | null
          images: string[] | null
          link_slot: number | null
          price: number | null
          seller_country: string | null
          seller_email: string | null
          seller_id: string | null
          status: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      delivery_option: "pickup" | "shipping" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
