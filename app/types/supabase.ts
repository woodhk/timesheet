export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          hours_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          hours_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          hours_spent?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      time_entries: {
        Row: {
          id: string
          task_id: string
          user_id: string
          duration_seconds: number
          started_at: string
          ended_at: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          duration_seconds: number
          started_at: string
          ended_at: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          duration_seconds?: number
          started_at?: string
          ended_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          entry_date: string
          accomplishment: string | null
          learning: string | null
          hardest_moment: string | null
          focus_time: string | null
          avoidance: string | null
          decision_regret: string | null
          energy_sources: string | null
          time_intentionality: string | null
          goals_reflection: string | null
          tomorrow_action: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entry_date: string
          accomplishment?: string | null
          learning?: string | null
          hardest_moment?: string | null
          focus_time?: string | null
          avoidance?: string | null
          decision_regret?: string | null
          energy_sources?: string | null
          time_intentionality?: string | null
          goals_reflection?: string | null
          tomorrow_action?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entry_date?: string
          accomplishment?: string | null
          learning?: string | null
          hardest_moment?: string | null
          focus_time?: string | null
          avoidance?: string | null
          decision_regret?: string | null
          energy_sources?: string | null
          time_intentionality?: string | null
          goals_reflection?: string | null
          tomorrow_action?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
  }
} 