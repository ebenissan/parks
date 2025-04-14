
// This file adds custom type definitions for our Supabase database tables

import { Database as GeneratedDatabase } from "@/integrations/supabase/types";

// Extend the generated database types with our custom tables
declare module "@/integrations/supabase/types" {
  interface Database extends GeneratedDatabase {
    public: {
      Tables: {
        parks: {
          Row: {
            id: number;
            name: string;
            total_reviews: number;
            avg_rating: number;
            total_positive: number;
            total_negative: number;
            overall_sentiment: string;
            position: string | null;
            description: string;
          };
          Insert: {
            id?: number;
            name: string;
            total_reviews?: number;
            avg_rating?: number;
            total_positive?: number;
            total_negative?: number;
            overall_sentiment?: string;
            position?: string | null;
            description?: string;
          };
          Update: {
            id?: number;
            name?: string;
            total_reviews?: number;
            avg_rating?: number;
            total_positive?: number;
            total_negative?: number;
            overall_sentiment?: string;
            position?: string | null;
            description?: string;
          };
        };
        reviews: {
          Row: {
            id: number;
            park_id: number;
            username: string;
            rating: number;
            comment: string;
            positive_score: number;
            negative_score: number;
            created_at: string;
          };
          Insert: {
            id?: number;
            park_id: number;
            username?: string;
            rating: number;
            comment: string;
            positive_score?: number;
            negative_score?: number;
            created_at?: string;
          };
          Update: {
            id?: number;
            park_id?: number;
            username?: string;
            rating?: number;
            comment?: string;
            positive_score?: number;
            negative_score?: number;
            created_at?: string;
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
  }
}
