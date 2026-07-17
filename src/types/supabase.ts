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
      blog_articles: {
        Row: {
          body: string | null
          category: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published_at: string
          read_time: string | null
          title: string
          trending: boolean
        }
        Insert: {
          body?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          read_time?: string | null
          title: string
          trending?: boolean
        }
        Update: {
          body?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          read_time?: string | null
          title?: string
          trending?: boolean
        }
        Relationships: []
      }
      companies: {
        Row: {
          business_type: string | null
          company_address: string | null
          company_website: string | null
          contact_person: string | null
          country: string | null
          created_at: string
          designation: string | null
          id: string
          logo_url: string | null
          name: string
          phone_country_code: string | null
          phone_number: string | null
          plan_tier: string | null
          registration_authority: string | null
          registration_number: string | null
        }
        Insert: {
          business_type?: string | null
          company_address?: string | null
          company_website?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          designation?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone_country_code?: string | null
          phone_number?: string | null
          plan_tier?: string | null
          registration_authority?: string | null
          registration_number?: string | null
        }
        Update: {
          business_type?: string | null
          company_address?: string | null
          company_website?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          designation?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone_country_code?: string | null
          phone_number?: string | null
          plan_tier?: string | null
          registration_authority?: string | null
          registration_number?: string | null
        }
        Relationships: []
      }
      company_members: {
        Row: {
          company_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_checklist_items: {
        Row: {
          detail: string | null
          gamca_approved: boolean
          id: string
          item_key: string
          label: string
          placement_id: string
          status: string
          sublabel: string | null
          updated_at: string
        }
        Insert: {
          detail?: string | null
          gamca_approved?: boolean
          id?: string
          item_key: string
          label: string
          placement_id: string
          status: string
          sublabel?: string | null
          updated_at?: string
        }
        Update: {
          detail?: string | null
          gamca_approved?: boolean
          id?: string
          item_key?: string
          label?: string
          placement_id?: string
          status?: string
          sublabel?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_checklist_items_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "placements"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_documents: {
        Row: {
          file_name: string
          file_path: string
          id: string
          item_key: string
          metadata: Json | null
          placement_id: string | null
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          file_name: string
          file_path: string
          id?: string
          item_key: string
          metadata?: Json | null
          placement_id?: string | null
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          file_name?: string
          file_path?: string
          id?: string
          item_key?: string
          metadata?: Json | null
          placement_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_documents_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "placements"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          company: string
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
        }
        Insert: {
          company: string
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
        }
        Update: {
          company?: string
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
        }
        Relationships: []
      }
      deployments: {
        Row: {
          created_at: string
          deployed_date: string | null
          escrow_balance: number
          escrow_currency: string
          id: string
          last_check_in: string | null
          next_check_in: string | null
          placement_id: string
          status: string
          updated_at: string
          wellbeing_score: number | null
        }
        Insert: {
          created_at?: string
          deployed_date?: string | null
          escrow_balance?: number
          escrow_currency?: string
          id?: string
          last_check_in?: string | null
          next_check_in?: string | null
          placement_id: string
          status: string
          updated_at?: string
          wellbeing_score?: number | null
        }
        Update: {
          created_at?: string
          deployed_date?: string | null
          escrow_balance?: number
          escrow_currency?: string
          id?: string
          last_check_in?: string | null
          next_check_in?: string | null
          placement_id?: string
          status?: string
          updated_at?: string
          wellbeing_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deployments_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: true
            referencedRelation: "placements"
            referencedColumns: ["id"]
          },
        ]
      }
      grievances: {
        Row: {
          deployment_id: string
          id: string
          opened_at: string
          resolution_note: string | null
          resolved_at: string | null
          severity: string
          status: string
          summary: string
        }
        Insert: {
          deployment_id: string
          id?: string
          opened_at?: string
          resolution_note?: string | null
          resolved_at?: string | null
          severity: string
          status?: string
          summary: string
        }
        Update: {
          deployment_id?: string
          id?: string
          opened_at?: string
          resolution_note?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "grievances_deployment_id_fkey"
            columns: ["deployment_id"]
            isOneToOne: false
            referencedRelation: "deployments"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          age_limit: string | null
          available_till: string | null
          benefits: string[]
          category: string
          company_id: string | null
          contract_duration: string | null
          created_at: string
          currency: string
          description: string | null
          destination_city: string | null
          destination_country: string | null
          employment_type: string
          experience_level: string
          external_id: string | null
          field_of_work: string | null
          id: string
          is_hot: boolean
          is_verified: boolean
          job_nature: string | null
          location: string
          note: string | null
          oep_license_no: string | null
          posted_at: string
          project: string | null
          published_on: string | null
          qualifications: string | null
          requirements: string[]
          salary_frequency: string
          salary_max: number | null
          salary_min: number | null
          scraped_at: string | null
          source: string
          source_url: string | null
          terms_applied: boolean | null
          title: string
          updated_at: string
          visa_status: string | null
        }
        Insert: {
          age_limit?: string | null
          available_till?: string | null
          benefits?: string[]
          category: string
          company_id?: string | null
          contract_duration?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          destination_city?: string | null
          destination_country?: string | null
          employment_type: string
          experience_level: string
          external_id?: string | null
          field_of_work?: string | null
          id?: string
          is_hot?: boolean
          is_verified?: boolean
          job_nature?: string | null
          location: string
          note?: string | null
          oep_license_no?: string | null
          posted_at?: string
          project?: string | null
          published_on?: string | null
          qualifications?: string | null
          requirements?: string[]
          salary_frequency?: string
          salary_max?: number | null
          salary_min?: number | null
          scraped_at?: string | null
          source?: string
          source_url?: string | null
          terms_applied?: boolean | null
          title: string
          updated_at?: string
          visa_status?: string | null
        }
        Update: {
          age_limit?: string | null
          available_till?: string | null
          benefits?: string[]
          category?: string
          company_id?: string | null
          contract_duration?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          destination_city?: string | null
          destination_country?: string | null
          employment_type?: string
          experience_level?: string
          external_id?: string | null
          field_of_work?: string | null
          id?: string
          is_hot?: boolean
          is_verified?: boolean
          job_nature?: string | null
          location?: string
          note?: string | null
          oep_license_no?: string | null
          posted_at?: string
          project?: string | null
          published_on?: string | null
          qualifications?: string | null
          requirements?: string[]
          salary_frequency?: string
          salary_max?: number | null
          salary_min?: number | null
          scraped_at?: string | null
          source?: string
          source_url?: string | null
          terms_applied?: boolean | null
          title?: string
          updated_at?: string
          visa_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      placements: {
        Row: {
          ai_readiness_score: number | null
          company_id: string | null
          cover_note: string | null
          created_at: string
          id: string
          job_id: string | null
          job_order_code: string
          stage: number
          talent_id: string
          updated_at: string
        }
        Insert: {
          ai_readiness_score?: number | null
          company_id?: string | null
          cover_note?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          job_order_code: string
          stage?: number
          talent_id: string
          updated_at?: string
        }
        Update: {
          ai_readiness_score?: number | null
          company_id?: string | null
          cover_note?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          job_order_code?: string
          stage?: number
          talent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "placements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placements_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placements_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          created_at: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      scraper_runs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          jobs_found: number
          jobs_inserted: number
          jobs_updated: number
          source: string
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          jobs_found?: number
          jobs_inserted?: number
          jobs_updated?: number
          source?: string
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          jobs_found?: number
          jobs_inserted?: number
          jobs_updated?: number
          source?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      talent_profiles: {
        Row: {
          available: boolean
          badge: string | null
          category: string | null
          certifications: string[]
          city: string | null
          cnic: string | null
          created_at: string
          date_of_birth: string | null
          driving_license: string | null
          email: string | null
          experience_years: number
          field_of_work: string | null
          foreign_experience: string | null
          gender: string | null
          has_certification: string | null
          height: string | null
          id: string
          languages: string[]
          location: string
          name: string
          phone: string | null
          photo_url: string | null
          qualification: string | null
          relevant_experience_years: number | null
          role_title: string
          skills: string[]
          user_id: string | null
          verified: boolean
        }
        Insert: {
          available?: boolean
          badge?: string | null
          category?: string | null
          certifications?: string[]
          city?: string | null
          cnic?: string | null
          created_at?: string
          date_of_birth?: string | null
          driving_license?: string | null
          email?: string | null
          experience_years?: number
          field_of_work?: string | null
          foreign_experience?: string | null
          gender?: string | null
          has_certification?: string | null
          height?: string | null
          id?: string
          languages?: string[]
          location: string
          name: string
          phone?: string | null
          photo_url?: string | null
          qualification?: string | null
          relevant_experience_years?: number | null
          role_title: string
          skills?: string[]
          user_id?: string | null
          verified?: boolean
        }
        Update: {
          available?: boolean
          badge?: string | null
          category?: string | null
          certifications?: string[]
          city?: string | null
          cnic?: string | null
          created_at?: string
          date_of_birth?: string | null
          driving_license?: string | null
          email?: string | null
          experience_years?: number
          field_of_work?: string | null
          foreign_experience?: string | null
          gender?: string | null
          has_certification?: string | null
          height?: string | null
          id?: string
          languages?: string[]
          location?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          qualification?: string | null
          relevant_experience_years?: number | null
          role_title?: string
          skills?: string[]
          user_id?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      training_courses: {
        Row: {
          category: string
          certification: string | null
          created_at: string
          description: string | null
          duration: string | null
          enrolled_count: number
          id: string
          image_url: string | null
          level: string | null
          modules: number | null
          price: string | null
          provider: string | null
          rating: number | null
          skills: string[]
          title: string
        }
        Insert: {
          category: string
          certification?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          enrolled_count?: number
          id?: string
          image_url?: string | null
          level?: string | null
          modules?: number | null
          price?: string | null
          provider?: string | null
          rating?: number | null
          skills?: string[]
          title: string
        }
        Update: {
          category?: string
          certification?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          enrolled_count?: number
          id?: string
          image_url?: string | null
          level?: string | null
          modules?: number | null
          price?: string | null
          provider?: string | null
          rating?: number | null
          skills?: string[]
          title?: string
        }
        Relationships: []
      }
      training_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress: number
          talent_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number
          talent_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number
          talent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "training_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_enrollments_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_company_id: { Args: never; Returns: string }
      get_my_role: { Args: never; Returns: string }
      release_escrow: {
        Args: { p_amount: number; p_deployment_id: string }
        Returns: undefined
      }
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
