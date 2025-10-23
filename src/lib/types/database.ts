export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "student" | "professor" | "admin";
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: "student" | "professor" | "admin";
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      classes: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          code: string | null;
          section: string | null;
          term: string | null;
          timezone: string;
          join_code: string | null;
          join_code_expires_at: string | null;
          is_join_open: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          code?: string | null;
          section?: string | null;
          term?: string | null;
          timezone: string;
          join_code?: string | null;
          join_code_expires_at?: string | null;
          is_join_open?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["classes"]["Row"]>;
      };
      enrollments: {
        Row: {
          class_id: string;
          user_id: string;
          role: "student" | "ta";
          status: "active" | "removed";
          created_at: string;
        };
        Insert: {
          class_id: string;
          user_id: string;
          role?: "student" | "ta";
          status?: "active" | "removed";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["enrollments"]["Row"]>;
      };
      attendance_sessions: {
        Row: {
          id: string;
          class_id: string;
          title: string | null;
          open_at: string;
          close_at: string;
          rotates_every_seconds: number;
          require_geo: boolean;
          geo_lat: number | null;
          geo_lng: number | null;
          geo_radius_m: number | null;
          status: "scheduled" | "open" | "closed" | "archived";
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          title?: string | null;
          open_at: string;
          close_at: string;
          rotates_every_seconds?: number;
          require_geo?: boolean;
          geo_lat?: number | null;
          geo_lng?: number | null;
          geo_radius_m?: number | null;
          status?: "scheduled" | "open" | "closed" | "archived";
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["attendance_sessions"]["Row"]>;
      };
      session_tokens: {
        Row: {
          id: number;
          session_id: string;
          token_hash: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          session_id: string;
          token_hash: string;
          expires_at: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["session_tokens"]["Row"]>;
      };
      checkins: {
        Row: {
          id: string;
          session_id: string;
          class_id: string;
          user_id: string;
          method: "qr" | "code" | "manual";
          status: "present" | "late" | "excused" | "absent";
          device_fingerprint: string | null;
          ip_inet: string | null;
          geo: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          class_id: string;
          user_id: string;
          method: "qr" | "code" | "manual";
          status?: "present" | "late" | "excused" | "absent";
          device_fingerprint?: string | null;
          ip_inet?: string | null;
          geo?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["checkins"]["Row"]>;
      };
      adjustments: {
        Row: {
          id: string;
          checkin_id: string;
          changed_by: string;
          previous_status: string | null;
          new_status: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          checkin_id: string;
          changed_by: string;
          previous_status?: string | null;
          new_status: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["adjustments"]["Row"]>;
      };
      audit_logs: {
        Row: {
          id: number;
          actor_id: string | null;
          action: string;
          entity: string | null;
          entity_id: string | null;
          data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          actor_id?: string | null;
          action: string;
          entity?: string | null;
          entity_id?: string | null;
          data?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]>;
      };
    };
    Functions: Record<string, never>;
    Enums: never;
    CompositeTypes: never;
  };
}
