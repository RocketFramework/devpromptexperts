import { NotificationService, CreateNotificationDTO } from './NotificationService';
import { supabase } from '@/lib/supabase';

/**
 * NotificationTriggerService
 * Handles application-level notification triggers for business events.
 * This service is called from business logic to create notifications for users.
 */
export const NotificationTriggerService = {
  /**
   * Notify matching consultants when a new RFP is published
   */
  async notifyConsultantsOfNewRFP(rfpId: string) {
    try {
      // Fetch RFP details
      const { data: rfp, error: rfpError } = await supabase
        .from('project_requests')
        .select('*, clients(user_id)')
        .eq('id', rfpId)
        .single();

      if (rfpError || !rfp) throw rfpError;

      // Find matching consultants based on required_skills
      const { data: consultants, error: consultantsError } = await supabase
        .from('consultants')
        .select('user_id, skills, expertise')
        .eq('approval_status', 'approved')
        .eq('availability', 'available');

      if (consultantsError) throw consultantsError;

      // Filter consultants who have matching skills
      const matchingConsultants = consultants?.filter(consultant => {
        if (!rfp.required_skills || rfp.required_skills.length === 0) return true;
        
        const consultantSkills = [
          ...(consultant.skills || []),
          ...(consultant.expertise || [])
        ].map(s => s.toLowerCase());
        
        return rfp.required_skills.some((skill: string) => 
          consultantSkills.some(cs => cs.includes(skill.toLowerCase()))
        );
      }) || [];

      // Create notifications for matching consultants
      const notifications = matchingConsultants.map(consultant => ({
        user_id: consultant.user_id,
        type: 'project' as const,
        title: 'New Project Opportunity',
        message: `A new RFP matching your skills has been published: "${rfp.title}"`,
        link: `/consultant/${consultant.user_id}/find-projects?rfp=${rfpId}`,
        metadata: {
          rfp_id: rfpId,
          rfp_title: rfp.title,
          budget_range: rfp.budget_range,
          timeline: rfp.timeline
        }
      }));

      // Batch create notifications
      for (const notification of notifications) {
        await NotificationService.createNotification(notification);
      }

      return { success: true, notified: notifications.length };
    } catch (error) {
      console.error('Error notifying consultants of new RFP:', error);
      return { success: false, error };
    }
  },

  /**
   * Notify client when a consultant submits a proposal
   */
  async notifyClientOfNewProposal(proposalId: string) {
    try {
      const { data: proposal, error: proposalError } = await supabase
        .from('project_responses')
        .select(`
          *,
          project_requests!inner(
            *,
            clients!inner(user_id)
          ),
          consultants!inner(
            *,
            users!inner(full_name)
          )
        `)
        .eq('id', proposalId)
        .single();

      if (proposalError || !proposal) throw proposalError;

      const clientUserId = proposal.project_requests.clients.user_id;
      const consultantName = proposal.consultants.users.full_name;
      const rfpTitle = proposal.project_requests.title;

      await NotificationService.createNotification({
        user_id: clientUserId,
        type: 'project',
        title: 'New Proposal Received',
        message: `${consultantName} has submitted a proposal for "${rfpTitle}"`,
        link: `/client/${proposal.project_requests.client_id}/rfp/${proposal.project_request_id}/proposal/${proposalId}`,
        metadata: {
          proposal_id: proposalId,
          consultant_id: proposal.consultant_id,
          rfp_id: proposal.project_request_id,
          proposed_budget: proposal.proposed_budget
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error notifying client of new proposal:', error);
      return { success: false, error };
    }
  },

  /**
   * Notify consultant and seller when a proposal is accepted
   */
  async notifyProposalAccepted(proposalId: string) {
    try {
      const { data: proposal, error } = await supabase
        .from('project_responses')
        .select(`
          *,
          project_requests!inner(
            title,
            client_id,
            clients!inner(
              user_id,
              users!inner(full_name)
            )
          ),
          consultants!inner(user_id)
        `)
        .eq('id', proposalId)
        .single();

      if (error || !proposal) throw error;

      const consultantUserId = proposal.consultants.user_id;
      const clientName = proposal.project_requests.clients.users.full_name;
      const rfpTitle = proposal.project_requests.title;

      // Notify consultant
      await NotificationService.createNotification({
        user_id: consultantUserId,
        type: 'project',
        title: '🎉 Proposal Accepted!',
        message: `Congratulations! Your proposal for "${rfpTitle}" has been accepted by ${clientName}`,
        link: `/consultant/${consultantUserId}/dashboard/projects`,
        metadata: {
          proposal_id: proposalId,
          rfp_id: proposal.project_request_id,
          client_id: proposal.project_requests.client_id
        }
      });

      // TODO: Find and notify seller (referral) if exists
      // This would require querying commission_referral_relationships

      return { success: true };
    } catch (error) {
      console.error('Error notifying proposal accepted:', error);
      return { success: false, error };
    }
  },

  async notifyProposalInterviewing(proposalId: string) {
    try {
      const { data: proposal, error } = await supabase
        .from('project_responses')
        .select(`
          *,
          project_requests!inner(title),
          consultants!inner(user_id)
        `)
        .eq('id', proposalId)
        .single();

      if (error || !proposal) throw error;

      await NotificationService.createNotification({
        user_id: proposal.consultants.user_id,
        type: 'project',
        title: 'Proposal Interviewing',
        message: `Your proposal for "${proposal.project_requests.title}" is being interviewed by the client`,
        link: `/consultant/${proposal.consultants.user_id}/dashboard/projects`,
        metadata: {
          proposal_id: proposalId,
          rfp_id: proposal.project_request_id,
          client_id: proposal.project_requests.client_id
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error notifying proposal interviewing:', error);
      return { success: false, error };
    }
  },  

  async notifyProposalShortlisting(proposalId: string) {
    try {
      const { data: proposal, error } = await supabase
        .from('project_responses')
        .select(`
          *,
          project_requests!inner(title),
          consultants!inner(user_id)
        `)
        .eq('id', proposalId)
        .single();

      if (error || !proposal) throw error;

      await NotificationService.createNotification({
        user_id: proposal.consultants.user_id,
        type: 'project',
        title: 'Proposal Shortlisting',
        message: `Your proposal for "${proposal.project_requests.title}" is shortlisted`,
        link: `/consultant/${proposal.consultants.user_id}/dashboard/projects`,
        metadata: {
          proposal_id: proposalId,
          rfp_id: proposal.project_request_id,
          client_id: proposal.project_requests.client_id
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error notifying proposal shortlisting:', error);
      return { success: false, error };
    }
  },

  async notifyProposalReview(proposalId: string) {
    try {
      const { data: proposal, error } = await supabase
        .from('project_responses')
        .select(`
          *,
          project_requests!inner(title),
          consultants!inner(user_id)
        `)
        .eq('id', proposalId)
        .single();

      if (error || !proposal) throw error;

      await NotificationService.createNotification({
        user_id: proposal.consultants.user_id,
        type: 'project',
        title: 'Proposal Review',
        message: `Your proposal for "${proposal.project_requests.title}" is being reviewed`,
        link: `/consultant/${proposal.consultants.user_id}/dashboard/projects`,
        metadata: {
          proposal_id: proposalId,
          rfp_id: proposal.project_request_id,
          client_id: proposal.project_requests.client_id
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error notifying proposal review:', error);
      return { success: false, error };
    }
  },  
  
  /**
   * Notify consultant when a proposal is rejected
   */
  async notifyProposalRejected(proposalId: string, feedback?: string) {
    try {
      const { data: proposal, error } = await supabase
        .from('project_responses')
        .select(`
          *,
          project_requests!inner(title),
          consultants!inner(user_id)
        `)
        .eq('id', proposalId)
        .single();

      if (error || !proposal) throw error;

      await NotificationService.createNotification({
        user_id: proposal.consultants.user_id,
        type: 'project',
        title: 'Proposal Update',
        message: `Your proposal for "${proposal.project_requests.title}" was not selected. ${feedback ? 'Feedback: ' + feedback : 'Keep applying to more opportunities!'}`,
        link: `/consultant/${proposal.consultants.user_id}/find-projects`,
        metadata: {
          proposal_id: proposalId,
          rfp_id: proposal.project_request_id,
          feedback: feedback
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error notifying proposal rejected:', error);
      return { success: false, error };
    }
  },

  /**
   * Notify all parties when a project is completed
   */
  async notifyProjectCompleted(projectId: string) {
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_requests!inner(
            title,
            client_id,
            clients!inner(user_id)
          ),
          consultants!inner(user_id)
        `)
        .eq('id', projectId)
        .single();

      if (error || !project) throw error;

      const projectTitle = project.project_requests?.title || 'Project';

      // Notify client
      await NotificationService.createNotification({
        user_id: project.project_requests.clients.user_id,
        type: 'project',
        title: 'Project Completed',
        message: `"${projectTitle}" has been marked as completed. Please review the consultant's work.`,
        link: `/client/${project.project_requests.client_id}/rfp/${project.project_request_id}`,
        metadata: {
          project_id: projectId,
          consultant_id: project.consultant_id
        }
      });

      // Notify consultant
      await NotificationService.createNotification({
        user_id: project.consultants.user_id,
        type: 'project',
        title: '✅ Project Completed',
        message: `"${projectTitle}" has been completed. Awaiting client review.`,
        link: `/consultant/${project.consultants.user_id}/dashboard/projects`,
        metadata: {
          project_id: projectId
        }
      });

      // TODO: Notify seller if exists

      return { success: true };
    } catch (error) {
      console.error('Error notifying project completed:', error);
      return { success: false, error };
    }
  },

  /**
   * Notify consultant when payment is released
   */
  async notifyPaymentReleased(paymentId: string) {
    try {
      const { data: payment, error } = await supabase
        .from('project_payments')
        .select(`
          *,
          projects!inner(
            project_requests!inner(title)
          ),
          consultants!inner(user_id)
        `)
        .eq('id', paymentId)
        .single();

      if (error || !payment) throw error;

      await NotificationService.createNotification({
        user_id: payment.consultants.user_id,
        type: 'payment',
        title: '💰 Payment Released',
        message: `You've received a payment of $${payment.amount.toLocaleString()} for "${payment.projects.project_requests.title}"`,
        link: `/consultant/${payment.consultants.user_id}/dashboard/earnings`,
        metadata: {
          payment_id: paymentId,
          amount: payment.amount,
          project_id: payment.project_id
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error notifying payment released:', error);
      return { success: false, error };
    }
  },

  /**
   * Notify when an interview is scheduled
   */
  async notifyInterviewScheduled(interviewId: string) {
    try {
      const { data: interview, error } = await supabase
        .from('proposal_interviews')
        .select(`
          *,
          organizer:organizer_id(full_name),
          attendee:attendee_id(full_name)
        `)
        .eq('id', interviewId)
        .single();

      if (error || !interview) throw error;

      // Notify attendee (consultant)
      await NotificationService.createNotification({
        user_id: interview.attendee_id,
        type: 'project',
        title: '📅 Interview Scheduled',
        message: `Interview scheduled with ${interview.organizer.full_name} on ${new Date(interview.start_time).toLocaleDateString()}`,
        link: `/notifications`, // Could link to calendar or interview details
        metadata: {
          interview_id: interviewId,
          start_time: interview.start_time,
          meeting_url: interview.meeting_url
        }
      });

      // Notify organizer (client)
      await NotificationService.createNotification({
        user_id: interview.organizer_id,
        type: 'project',
        title: '📅 Interview Scheduled',
        message: `Interview scheduled with ${interview.attendee.full_name} on ${new Date(interview.start_time).toLocaleDateString()}`,
        link: `/notifications`,
        metadata: {
          interview_id: interviewId,
          start_time: interview.start_time,
          meeting_url: interview.meeting_url
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error notifying interview scheduled:', error);
      return { success: false, error };
    }
  }
};
