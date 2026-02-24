export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "patient" | "physio";
          full_name: string;
          email: string | null;
          physio_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: "patient" | "physio";
          full_name: string;
          email?: string | null;
          physio_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "patient" | "physio";
          full_name?: string;
          email?: string | null;
          physio_id?: string | null;
          updated_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          video_url: string | null;
          created_by: string | null;
          is_global: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category?: string;
          video_url?: string | null;
          created_by?: string | null;
          is_global?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          category?: string;
          video_url?: string | null;
          is_global?: boolean;
        };
      };
      workout_plans: {
        Row: {
          id: string;
          patient_id: string;
          physio_id: string;
          name: string;
          description: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          physio_id: string;
          name?: string;
          description?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          active?: boolean;
          updated_at?: string;
        };
      };
      plan_items: {
        Row: {
          id: string;
          plan_id: string;
          exercise_id: string;
          order: number;
          sets: number;
          reps: number | null;
          duration: number | null;
          rest_time: number;
          rest_after: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          exercise_id: string;
          order: number;
          sets?: number;
          reps?: number | null;
          duration?: number | null;
          rest_time?: number;
          rest_after?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          order?: number;
          sets?: number;
          reps?: number | null;
          duration?: number | null;
          rest_time?: number;
          rest_after?: number | null;
          notes?: string | null;
        };
      };
      workout_logs: {
        Row: {
          id: string;
          patient_id: string;
          plan_id: string | null;
          started_at: string;
          completed_at: string;
          duration_seconds: number | null;
          exercises_completed: number | null;
          total_sets_completed: number | null;
          feedback_score: number | null;
          feedback_notes: string | null;
        };
        Insert: {
          id?: string;
          patient_id: string;
          plan_id?: string | null;
          started_at: string;
          completed_at?: string;
          duration_seconds?: number | null;
          exercises_completed?: number | null;
          total_sets_completed?: number | null;
          feedback_score?: number | null;
          feedback_notes?: string | null;
        };
        Update: {
          completed_at?: string;
          duration_seconds?: number | null;
          exercises_completed?: number | null;
          total_sets_completed?: number | null;
          feedback_score?: number | null;
          feedback_notes?: string | null;
        };
      };
      recipes: {
        Row: {
          id: string;
          slug: string;
          name: string;
          day_type: "workout" | "rest";
          meal_slot: "colazione" | "spuntino" | "pranzo" | "merenda" | "cena";
          difficulty: string;
          prep_time: number;
          category: string | null;
          tags: string[];
          ingredients: string[];
          steps: string[];
          tips: string | null;
          protein_grams: number;
          carbs_grams: number;
          fats_grams: number;
          calories: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          day_type: "workout" | "rest";
          meal_slot: "colazione" | "spuntino" | "pranzo" | "merenda" | "cena";
          difficulty?: string;
          prep_time: number;
          category?: string | null;
          tags?: string[];
          ingredients: string[];
          steps: string[];
          tips?: string | null;
          protein_grams: number;
          carbs_grams: number;
          fats_grams: number;
          calories: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          difficulty?: string;
          prep_time?: number;
          category?: string | null;
          tags?: string[];
          ingredients?: string[];
          steps?: string[];
          tips?: string | null;
          protein_grams?: number;
          carbs_grams?: number;
          fats_grams?: number;
          calories?: number;
        };
      };
      nutrition_logs: {
        Row: {
          id: string;
          patient_id: string;
          date: string;
          meal_slot: string;
          recipe_id: string | null;
          custom_name: string | null;
          protein_grams: number;
          carbs_grams: number;
          fats_grams: number;
          calories: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          date?: string;
          meal_slot: string;
          recipe_id?: string | null;
          custom_name?: string | null;
          protein_grams?: number;
          carbs_grams?: number;
          fats_grams?: number;
          calories?: number;
          created_at?: string;
        };
        Update: {
          meal_slot?: string;
          recipe_id?: string | null;
          custom_name?: string | null;
          protein_grams?: number;
          carbs_grams?: number;
          fats_grams?: number;
          calories?: number;
        };
      };
      calorie_budgets: {
        Row: {
          patient_id: string;
          workout_day_calories: number;
          rest_day_calories: number;
        };
        Insert: {
          patient_id: string;
          workout_day_calories?: number;
          rest_day_calories?: number;
        };
        Update: {
          workout_day_calories?: number;
          rest_day_calories?: number;
        };
      };
      invite_codes: {
        Row: {
          id: string;
          code: string;
          physio_id: string;
          used_by: string | null;
          used_at: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          physio_id: string;
          used_by?: string | null;
          used_at?: string | null;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          used_by?: string | null;
          used_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
