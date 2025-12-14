import { supabase } from '@/lib/supabase'

export class ProposalCommunicationsService {
  static async getMessages(responseId: string) {
    const { data, error } = await supabase
      .from('proposal_communications')
      .select(`
        *,
        sender:sender_id (
          full_name,
          profile_image_url
        )
      `)
      .eq('project_response_id', responseId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  }

  static async sendMessage(responseId: string, senderId: string, senderType: string, message: string) {
    const { data, error } = await supabase
      .from('proposal_communications')
      .insert({
        project_response_id: responseId,
        sender_id: senderId,
        sender_type: senderType,
        message: message,
        is_read: false
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async markAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('proposal_communications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
