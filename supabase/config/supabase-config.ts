/**
 * LinkUp Design System 2026
 * Supabase Client Configuration
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables (to be set in .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client-side Supabase client (for authenticated users)
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
};

// Server-side Supabase client (with service role - for admin operations)
export const createSupabaseServerClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase service role key not configured');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

// Type definitions for Supabase database
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          telegram_id: string | null;
          telegram_username: string | null;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          language: string;
          timezone: string;
          latitude: number | null;
          longitude: number | null;
          radius: number;
          trust_score: number;
          xp_total: number;
          xp_current: number;
          level: number;
          is_premium: boolean;
          is_organizer: boolean;
          is_business: boolean;
          is_verified: boolean;
          member_since: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
          category_id: string | null;
          start_date: string;
          end_date: string;
          all_day: boolean;
          location_name: string | null;
          location_address: string | null;
          latitude: number | null;
          longitude: number | null;
          max_participants: number | null;
          current_participants: number;
          min_participants: number;
          price: number;
          is_free: boolean;
          currency: string;
          organizer_id: string;
          business_id: string | null;
          status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
          is_featured: boolean;
          is_trending: boolean;
          is_premium: boolean;
          average_rating: number;
          rating_count: number;
          view_count: number;
          share_count: number;
          save_count: number;
          requires_approval: boolean;
          allow_cancelled: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at' | 'current_participants'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          current_participants?: number;
        };
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          image_url: string | null;
          deep_link: string | null;
          data: Record<string, unknown>;
          is_read: boolean;
          is_archived: boolean;
          read_at: string | null;
          push_sent: boolean;
          push_sent_at: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      // Add other tables as needed
    };
    Functions: {
      // RPC functions are callable via rpc()
    };
  };
};

// Export singleton clients
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;
let supabaseServerClient: ReturnType<typeof createSupabaseServerClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient();
  }
  return supabaseClient;
};

export const getSupabaseServerClient = () => {
  if (!supabaseServerClient) {
    supabaseServerClient = createSupabaseServerClient();
  }
  return supabaseServerClient;
};

// Export default client
export const supabase = getSupabaseClient();
