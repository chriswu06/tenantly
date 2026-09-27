
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "advocates": {
                  Row: {
                    "created_at": string,"email": string,"full_name": string,"id": string,"is_admin": boolean,"notify_hearing": boolean,"notify_lookup": boolean,"notify_shared": boolean,"organization_id": string,"role": Database["public"]['Enums']["advocate_role"]
                  }
                  Insert: {
                    "created_at"?: string,"email": string,"full_name": string,"id": string,"is_admin"?: boolean,"notify_hearing"?: boolean,"notify_lookup"?: boolean,"notify_shared"?: boolean,"organization_id": string,"role"?: Database["public"]['Enums']["advocate_role"]
                  }
                  Update: {
                    "created_at"?: string,"email"?: string,"full_name"?: string,"id"?: string,"is_admin"?: boolean,"notify_hearing"?: boolean,"notify_lookup"?: boolean,"notify_shared"?: boolean,"organization_id"?: string,"role"?: Database["public"]['Enums']["advocate_role"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "advocates_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"case_events": {
                  Row: {
                    "actor": string,"advocate_id": string | null,"case_id": string,"created_at": string,"id": string,"title": string
                  }
                  Insert: {
                    "actor": string,"advocate_id"?: string | null,"case_id": string,"created_at"?: string,"id"?: string,"title": string
                  }
                  Update: {
                    "actor"?: string,"advocate_id"?: string | null,"case_id"?: string,"created_at"?: string,"id"?: string,"title"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "case_events_advocate_id_fkey"
      columns: ["advocate_id"]
isOneToOne: false
      referencedRelation: "advocates"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "case_events_case_id_fkey"
      columns: ["case_id"]
isOneToOne: false
      referencedRelation: "cases"
      referencedColumns: ["id"]
    }
                  ]
                },"cases": {
                  Row: {
                    "access_token_hash": string,"assignee_id": string | null,"case_number": string | null,"certification_received_at": string | null,"certification_requested_at": string | null,"checklist": NonNullable<Json>,"court": string | null,"created_at": string,"extracted": NonNullable<Json>,"filing_date": string | null,"hearing_at": string | null,"id": string,"in_baltimore_city": boolean | null,"jurisdiction": string | null,"landlord_name": string | null,"latitude": number | null,"license_number_on_complaint": string | null,"license_result": Database["public"]['Enums']["license_result"],"longitude": number | null,"normalized_address": string | null,"organization_id": string | null,"outcome": Database["public"]['Enums']["case_outcome"] | null,"outcome_reported_at": string | null,"property_address": string | null,"reference": string,"shared_at": string | null,"stage": Database["public"]['Enums']["case_stage"],"summons_path": string | null,"tenant_first_name": string | null,"tenant_language": string | null,"tenant_phone": string | null,"updated_at": string
                  }
                  Insert: {
                    "access_token_hash": string,"assignee_id"?: string | null,"case_number"?: string | null,"certification_received_at"?: string | null,"certification_requested_at"?: string | null,"checklist"?: NonNullable<Json>,"court"?: string | null,"created_at"?: string,"extracted"?: NonNullable<Json>,"filing_date"?: string | null,"hearing_at"?: string | null,"id"?: string,"in_baltimore_city"?: boolean | null,"jurisdiction"?: string | null,"landlord_name"?: string | null,"latitude"?: number | null,"license_number_on_complaint"?: string | null,"license_result"?: Database["public"]['Enums']["license_result"],"longitude"?: number | null,"normalized_address"?: string | null,"organization_id"?: string | null,"outcome"?: Database["public"]['Enums']["case_outcome"] | null,"outcome_reported_at"?: string | null,"property_address"?: string | null,"reference"?: string,"shared_at"?: string | null,"stage"?: Database["public"]['Enums']["case_stage"],"summons_path"?: string | null,"tenant_first_name"?: string | null,"tenant_language"?: string | null,"tenant_phone"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "access_token_hash"?: string,"assignee_id"?: string | null,"case_number"?: string | null,"certification_received_at"?: string | null,"certification_requested_at"?: string | null,"checklist"?: NonNullable<Json>,"court"?: string | null,"created_at"?: string,"extracted"?: NonNullable<Json>,"filing_date"?: string | null,"hearing_at"?: string | null,"id"?: string,"in_baltimore_city"?: boolean | null,"jurisdiction"?: string | null,"landlord_name"?: string | null,"latitude"?: number | null,"license_number_on_complaint"?: string | null,"license_result"?: Database["public"]['Enums']["license_result"],"longitude"?: number | null,"normalized_address"?: string | null,"organization_id"?: string | null,"outcome"?: Database["public"]['Enums']["case_outcome"] | null,"outcome_reported_at"?: string | null,"property_address"?: string | null,"reference"?: string,"shared_at"?: string | null,"stage"?: Database["public"]['Enums']["case_stage"],"summons_path"?: string | null,"tenant_first_name"?: string | null,"tenant_language"?: string | null,"tenant_phone"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "cases_assignee_id_fkey"
      columns: ["assignee_id"]
isOneToOne: false
      referencedRelation: "advocates"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "cases_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"invitations": {
                  Row: {
                    "accepted_at": string | null,"created_at": string,"email": string,"expires_at": string,"id": string,"invited_by": string | null,"is_admin": boolean,"organization_id": string,"role": Database["public"]['Enums']["advocate_role"],"token": string
                  }
                  Insert: {
                    "accepted_at"?: string | null,"created_at"?: string,"email": string,"expires_at"?: string,"id"?: string,"invited_by"?: string | null,"is_admin"?: boolean,"organization_id": string,"role"?: Database["public"]['Enums']["advocate_role"],"token"?: string
                  }
                  Update: {
                    "accepted_at"?: string | null,"created_at"?: string,"email"?: string,"expires_at"?: string,"id"?: string,"invited_by"?: string | null,"is_admin"?: boolean,"organization_id"?: string,"role"?: Database["public"]['Enums']["advocate_role"],"token"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "invitations_invited_by_fkey"
      columns: ["invited_by"]
isOneToOne: false
      referencedRelation: "advocates"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "invitations_organization_id_fkey"
      columns: ["organization_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"license_checks": {
                  Row: {
                    "case_id": string,"checked_at": string,"error": string | null,"id": string,"lookup_address": string | null,"method": string,"response_ms": number | null,"result": Database["public"]['Enums']["license_result"],"source": string
                  }
                  Insert: {
                    "case_id": string,"checked_at"?: string,"error"?: string | null,"id"?: string,"lookup_address"?: string | null,"method": string,"response_ms"?: number | null,"result": Database["public"]['Enums']["license_result"],"source": string
                  }
                  Update: {
                    "case_id"?: string,"checked_at"?: string,"error"?: string | null,"id"?: string,"lookup_address"?: string | null,"method"?: string,"response_ms"?: number | null,"result"?: Database["public"]['Enums']["license_result"],"source"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "license_checks_case_id_fkey"
      columns: ["case_id"]
isOneToOne: false
      referencedRelation: "cases"
      referencedColumns: ["id"]
    }
                  ]
                },"license_records": {
                  Row: {
                    "case_id": string,"id": string,"license_number": string,"source": string,"status": string,"valid_from": string | null,"valid_to": string | null
                  }
                  Insert: {
                    "case_id": string,"id"?: string,"license_number": string,"source": string,"status": string,"valid_from"?: string | null,"valid_to"?: string | null
                  }
                  Update: {
                    "case_id"?: string,"id"?: string,"license_number"?: string,"source"?: string,"status"?: string,"valid_from"?: string | null,"valid_to"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "license_records_case_id_fkey"
      columns: ["case_id"]
isOneToOne: false
      referencedRelation: "cases"
      referencedColumns: ["id"]
    }
                  ]
                },"organizations": {
                  Row: {
                    "accepts_referrals": boolean,"callback_phone": string | null,"created_at": string,"description": string | null,"id": string,"languages": string | null,"name": string,"short_description": string | null,"slug": string
                  }
                  Insert: {
                    "accepts_referrals"?: boolean,"callback_phone"?: string | null,"created_at"?: string,"description"?: string | null,"id"?: string,"languages"?: string | null,"name": string,"short_description"?: string | null,"slug": string
                  }
                  Update: {
                    "accepts_referrals"?: boolean,"callback_phone"?: string | null,"created_at"?: string,"description"?: string | null,"id"?: string,"languages"?: string | null,"name"?: string,"short_description"?: string | null,"slug"?: string
                  }
                  Relationships: [
                    
                  ]
                },"outcome_reports": {
                  Row: {
                    "id": string,"outcome": Database["public"]['Enums']["case_outcome"],"reported_on": string
                  }
                  Insert: {
                    "id"?: string,"outcome": Database["public"]['Enums']["case_outcome"],"reported_on"?: string
                  }
                  Update: {
                    "id"?: string,"outcome"?: Database["public"]['Enums']["case_outcome"],"reported_on"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "current_advocate_is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"current_organization_id":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"delete_expired_unshared_cases":
{ Args: Record<PropertyKey, never>; Returns: number
                           }
          }
          Enums: {
            "advocate_role": "staff_attorney"|"supervising_attorney"|"paralegal"|"intake_specialist","case_outcome": "raised_license_defense"|"case_dismissed"|"case_postponed"|"did_not_raise_defense"|"did_not_attend","case_stage": "needs_review"|"verifying"|"needs_certification"|"ready_for_court"|"closed","field_confidence": "confirmed"|"needs_review"|"uncertain"|"missing","license_result": "pending"|"no_license"|"expired"|"active"|"needs_review"|"could_not_verify"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "advocate_role": ["staff_attorney", "supervising_attorney", "paralegal", "intake_specialist"],"case_outcome": ["raised_license_defense", "case_dismissed", "case_postponed", "did_not_raise_defense", "did_not_attend"],"case_stage": ["needs_review", "verifying", "needs_certification", "ready_for_court", "closed"],"field_confidence": ["confirmed", "needs_review", "uncertain", "missing"],"license_result": ["pending", "no_license", "expired", "active", "needs_review", "could_not_verify"]
          }
        }
} as const

