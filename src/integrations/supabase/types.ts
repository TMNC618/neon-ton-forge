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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      deposits: {
        Row: {
          admin_note: string | null
          amount: number
          created_at: string | null
          id: string
          processed_at: string | null
          processed_by: string | null
          status: Database["public"]["Enums"]["deposit_status"] | null
          tx_hash: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          amount: number
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["deposit_status"] | null
          tx_hash: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_note?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["deposit_status"] | null
          tx_hash?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mining_sessions: {
        Row: {
          created_at: string | null
          earned_amount: number | null
          end_time: string | null
          id: string
          initial_balance: number
          is_active: boolean | null
          start_time: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          earned_amount?: number | null
          end_time?: string | null
          id?: string
          initial_balance: number
          is_active?: boolean | null
          start_time?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          earned_amount?: number | null
          end_time?: string | null
          id?: string
          initial_balance?: number
          is_active?: boolean | null
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance: number | null
          created_at: string | null
          earning_profit: number | null
          earning_referral: number | null
          email: string
          id: string
          is_active: boolean | null
          last_mining_start: string | null
          mining_active: boolean | null
          mining_balance: number | null
          phone_number: string | null
          referral_code: string | null
          referred_by: string | null
          tera_balance: number | null
          updated_at: string | null
          username: string
          wallet_address: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          earning_profit?: number | null
          earning_referral?: number | null
          email: string
          id: string
          is_active?: boolean | null
          last_mining_start?: string | null
          mining_active?: boolean | null
          mining_balance?: number | null
          phone_number?: string | null
          referral_code?: string | null
          referred_by?: string | null
          tera_balance?: number | null
          updated_at?: string | null
          username: string
          wallet_address?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          earning_profit?: number | null
          earning_referral?: number | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_mining_start?: string | null
          mining_active?: boolean | null
          mining_balance?: number | null
          phone_number?: string | null
          referral_code?: string | null
          referred_by?: string | null
          tera_balance?: number | null
          updated_at?: string | null
          username?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          bonus_amount: number | null
          created_at: string | null
          id: string
          is_rewarded: boolean | null
          referred_id: string
          referrer_id: string
        }
        Insert: {
          bonus_amount?: number | null
          created_at?: string | null
          id?: string
          is_rewarded?: boolean | null
          referred_id: string
          referrer_id: string
        }
        Update: {
          bonus_amount?: number | null
          created_at?: string | null
          id?: string
          is_rewarded?: boolean | null
          referred_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          fee: number | null
          from_currency: string | null
          id: string
          reference_id: string | null
          to_currency: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          fee?: number | null
          from_currency?: string | null
          id?: string
          reference_id?: string | null
          to_currency?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          fee?: number | null
          from_currency?: string | null
          id?: string
          reference_id?: string | null
          to_currency?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          admin_note: string | null
          amount: number
          created_at: string | null
          currency: string | null
          fee: number | null
          final_amount: number
          id: string
          processed_at: string | null
          processed_by: string | null
          status: Database["public"]["Enums"]["withdraw_status"] | null
          updated_at: string | null
          user_id: string
          wallet_address: string
          withdraw_type: string | null
        }
        Insert: {
          admin_note?: string | null
          amount: number
          created_at?: string | null
          currency?: string | null
          fee?: number | null
          final_amount: number
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["withdraw_status"] | null
          updated_at?: string | null
          user_id: string
          wallet_address: string
          withdraw_type?: string | null
        }
        Update: {
          admin_note?: string | null
          amount?: number
          created_at?: string | null
          currency?: string | null
          fee?: number | null
          final_amount?: number
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["withdraw_status"] | null
          updated_at?: string | null
          user_id?: string
          wallet_address?: string
          withdraw_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_balance: {
        Args: { _amount: number; _balance_type?: string; _user_id: string }
        Returns: boolean
      }
      apply_referral_code: {
        Args: { _referral_code: string }
        Returns: boolean
      }
      approve_deposit: {
        Args: { _deposit_id: string; _note?: string }
        Returns: boolean
      }
      approve_withdrawal: {
        Args: { _note?: string; _withdrawal_id: string }
        Returns: boolean
      }
      create_withdrawal: {
        Args: {
          _amount: number
          _currency?: string
          _wallet_address: string
          _withdraw_type?: string
        }
        Returns: string
      }
      generate_referral_code: { Args: never; Returns: string }
      get_admin_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      process_referral_bonus: {
        Args: { _deposit_amount: number }
        Returns: boolean
      }
      reduce_user_balance: {
        Args: { _amount: number; _balance_type?: string; _user_id: string }
        Returns: boolean
      }
      reject_deposit: {
        Args: { _deposit_id: string; _note?: string }
        Returns: boolean
      }
      reject_withdrawal: {
        Args: { _note?: string; _withdrawal_id: string }
        Returns: boolean
      }
      start_mining: { Args: never; Returns: boolean }
      stop_mining: { Args: never; Returns: number }
      swap_tera_to_ton: { Args: { _amount: number }; Returns: number }
      swap_ton_to_tera: { Args: { _amount: number }; Returns: number }
      toggle_user_status: { Args: { _user_id: string }; Returns: boolean }
      update_setting: { Args: { _key: string; _value: Json }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      deposit_status: "pending" | "approved" | "rejected"
      transaction_type:
        | "deposit"
        | "withdrawal"
        | "mining"
        | "swap"
        | "referral"
        | "profit"
      withdraw_status: "pending" | "approved" | "rejected"
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
    Enums: {
      app_role: ["admin", "user"],
      deposit_status: ["pending", "approved", "rejected"],
      transaction_type: [
        "deposit",
        "withdrawal",
        "mining",
        "swap",
        "referral",
        "profit",
      ],
      withdraw_status: ["pending", "approved", "rejected"],
    },
  },
} as const
