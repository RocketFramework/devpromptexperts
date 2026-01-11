import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export interface UserSettings {
  user_id: string;
  notification_preferences: NotificationPreferences;
  general_settings: GeneralSettings;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationPreferences {
  notify_review_received?: boolean;
  notify_commission_calculated?: boolean;
  notify_new_message?: boolean;
  notify_payment_released?: boolean;
  notify_project_completed?: boolean;
  notify_proposal_submitted?: boolean;
  notify_ob_interview_scheduled?: boolean;
  notify_rfp_published?: boolean;
  notify_proposal_shortlisted?: boolean;
  notify_consultant_approved?: boolean;
  notify_onboarding_completed?: boolean;
}

export interface GeneralSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
}

export class SettingsService {
  static async getSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If not found, returning default empty structure for UI to handle or create on first save
      if (error.code === 'PGRST116') {
        return {
          user_id: userId,
          notification_preferences: {},
          general_settings: {}
        } as UserSettings;
      }
      throw error;
    }

    return data as UserSettings;
  }

  static async updateSettings(userId: string, settings: Partial<UserSettings>) {
    // Check if exists first
    const { data: existing } = await supabase
      .from('user_settings')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('user_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } else {
      // Insert if not exists
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: userId,
          notification_preferences: settings.notification_preferences || {},
          general_settings: settings.general_settings || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
}
