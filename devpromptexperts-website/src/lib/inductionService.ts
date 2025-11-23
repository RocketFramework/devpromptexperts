// lib/inductionService.ts
import { InductionData, InductionContent, UserInductionProgress } from '@/types/';
import { UserRole } from '@/types/';

// Sample data - In real app, this would come from your database
const INDUCTION_CONTENT: Record<string, InductionContent> = {
  consultant: {
    title: "Elite AI Consultants",
    subtitle: "Founding Member Portal",
    badgeText: "Prestigious Member",
    statusText: "Exclusive Network Access",
    
    welcomeTitle: "Welcome, Elite Consultant!",
    welcomeDescription: "You've been selected to join our exclusive network of top-tier AI consultants. Complete your induction to start working on high-value projects and building your reputation.",
    highlightText: "🎯 Your Advantage: As a founding member, you get priority project access and higher commission rates.",
    
    videoTitle: "Platform Introduction Video",
    videoDuration: "8 minutes",
    videoRequired: true,
    learningPoints: [
      "Platform features and tools",
      "Project delivery standards",
      "Commission structure",
      "Client communication protocols"
    ],
    
    actions: [
      {
        id: "schedule_interview",
        icon: "calendar",
        title: "Schedule Interview",
        description: "Book your onboarding session with our partner success team",
        buttonText: "Schedule Now",
        buttonColor: "bg-blue-600 hover:bg-blue-700"
      },
      {
        id: "review_guidelines",
        icon: "document",
        title: "Review Guidelines",
        description: "Read our elite consultant handbook and code of conduct",
        buttonText: "View Guidelines",
        buttonColor: "bg-slate-700 hover:bg-slate-800",
        requiredStep: "watch_video"
      },
      {
        id: "join_community",
        icon: "users",
        title: "Join Community",
        description: "Connect with other elite consultants in our private network",
        buttonText: "Explore Network",
        buttonColor: "bg-purple-600 hover:bg-purple-700",
        requiredStep: "schedule_interview"
      }
    ],
    
    steps: [
      {
        id: "watch_video",
        title: "Watch Introduction Video",
        description: "Learn about platform features and expectations",
        duration: "8 min",
        required: true
      },
      {
        id: "schedule_interview",
        title: "Schedule Onboarding Interview",
        description: "Meet with our success team for personalized guidance",
        duration: "30 min",
        required: true
      },
      {
        id: "complete_profile",
        title: "Complete Profile & Portfolio",
        description: "Showcase your expertise to attract premium clients",
        duration: "15 min",
        required: true
      },
      {
        id: "accept_project",
        title: "Accept First Project",
        description: "Start working on your first high-value AI project",
        duration: "Varies",
        required: true
      }
    ],
    
    benefits: {
      title: "Elite Consultant Benefits",
      items: [
        { value: "80%", label: "Project Earnings", description: "" },
        { value: "Priority", label: "Project Access", description: "" },
        { value: "15%", label: "Referral Commission", description: "" },
        { value: "VIP", label: "Support", description: "" }
      ]
    },
    
    support: {
      title: "Need Immediate Assistance?",
      description: "Our elite consultant success team is here to help you get started quickly and successfully.",
      primaryAction: "Contact Onboarding Team",
      secondaryAction: "Join Live Q&A Session"
    }
  },
  
  seller: {
    title: "Sales Partner Portal",
    subtitle: "Commission-Based Partner",
    badgeText: "Sales Partner",
    statusText: "Commission Earnings Active",
    
    welcomeTitle: "Welcome, Sales Partner!",
    welcomeDescription: "You're now part of our sales network. Learn how to bring clients to our platform and earn generous commissions on every successful project.",
    highlightText: "💰 First Commission Bonus: Earn an extra 5% on your first successful project referral.",
    
    videoTitle: "Sales Partner Guide",
    videoDuration: "6 minutes",
    videoRequired: true,
    learningPoints: [
      "Sales process & best practices",
      "Commission structure details",
      "Client onboarding workflow",
      "Platform tools & resources"
    ],
    
    actions: [
      {
        id: "sales_materials",
        icon: "sales-kit",
        title: "Sales Materials",
        description: "Access pitch decks, brochures, and marketing assets",
        buttonText: "Get Materials",
        buttonColor: "bg-blue-600 hover:bg-blue-700"
      },
      {
        id: "commission_structure",
        icon: "commission",
        title: "Commission Structure",
        description: "Understand your earning potential and payment terms",
        buttonText: "View Details",
        buttonColor: "bg-amber-500 hover:bg-amber-600",
        requiredStep: "watch_video"
      },
      {
        id: "client_onboarding",
        icon: "client",
        title: "Client Onboarding",
        description: "Learn how to properly onboard new clients",
        buttonText: "Learn Process",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        requiredStep: "sales_materials"
      }
    ],
    
    steps: [
      {
        id: "watch_video",
        title: "Complete Sales Training",
        description: "Watch training videos and learn the sales process",
        duration: "6 min",
        required: true
      },
      {
        id: "review_agreement",
        title: "Review Commission Agreement",
        description: "Understand your earning potential and payment terms",
        duration: "10 min",
        required: true
      },
      {
        id: "access_materials",
        title: "Access Sales Materials",
        description: "Download pitch decks and marketing resources",
        duration: "5 min",
        required: true
      },
      {
        id: "submit_lead",
        title: "Submit First Client Lead",
        description: "Bring your first client to the platform",
        duration: "Varies",
        required: true
      }
    ],
    
    benefits: {
      title: "Your Earning Potential",
      items: [
        { value: "15%", label: "First Project Commission", description: "+5% bonus for first referral" },
        { value: "10%", label: "Recurring Projects", description: "For ongoing client work" },
        { value: "5%", label: "Network Referrals", description: "For referring other sellers" }
      ]
    },
    
    support: {
      title: "Need Sales Support?",
      description: "Our sales success team is here to help you close deals and maximize your commissions.",
      primaryAction: "Contact Sales Manager",
      secondaryAction: "Join Sales Training"
    }
  },
  
  client: {
    title: "AI Solutions Client Portal",
    subtitle: "Premium Client Access",
    badgeText: "Valued Client",
    statusText: "World-Class AI Expertise",
    
    welcomeTitle: "Welcome, Valued Client!",
    welcomeDescription: "You're about to access world-class AI expertise through our exclusive platform. Complete your setup to start transforming your ideas into successful AI projects.",
    highlightText: "✨ Quick Start: Most clients launch their first project in under 20 minutes with perfect expert matches.",
    
    videoTitle: "Platform Introduction Video",
    videoDuration: "5 minutes",
    videoRequired: false,
    learningPoints: [
      "How to create effective project briefs",
      "Finding and selecting the right AI experts",
      "Project management and communication tools",
      "Security and confidentiality protocols"
    ],
    
    actions: [
      {
        id: "start_project",
        icon: "project",
        title: "Start First Project",
        description: "Describe your AI needs and get matched with perfect experts",
        buttonText: "Create Project",
        buttonColor: "bg-blue-600 hover:bg-blue-700"
      },
      {
        id: "browse_experts",
        icon: "experts",
        title: "Browse Experts",
        description: "View our network of AI consultants and their specialties",
        buttonText: "Meet Experts",
        buttonColor: "bg-purple-600 hover:bg-purple-700",
        requiredStep: "watch_video"
      },
      {
        id: "security_policy",
        icon: "security",
        title: "Security & IP Protection",
        description: "Learn how we protect your data and intellectual property",
        buttonText: "View Policy",
        buttonColor: "bg-slate-700 hover:bg-slate-800",
        requiredStep: "watch_video"
      }
    ],
    
    steps: [
      {
        id: "watch_video",
        title: "Watch Introduction Video",
        description: "Learn about platform features and how to succeed",
        duration: "5 min",
        required: false
      },
      {
        id: "complete_brief",
        title: "Complete Project Brief",
        description: "Tell us about your AI needs and project goals",
        duration: "10 min",
        required: true
      },
      {
        id: "review_matches",
        title: "Review Expert Matches",
        description: "Browse AI consultants tailored to your project",
        duration: "5 min",
        required: true
      },
      {
        id: "launch_project",
        title: "Launch First Project",
        description: "Start collaborating with your chosen AI expert",
        duration: "Varies",
        required: true
      }
    ],
    
    benefits: {
      title: "Client Success Advantages",
      items: [
        { value: "95%", label: "Success Rate", description: "Project completion" },
        { value: "48h", label: "Expert Matching", description: "Average matching time" },
        { value: "24/7", label: "Support", description: "Client success team" },
        { value: "$0", label: "Setup Fee", description: "No hidden costs" }
      ]
    },
    
    support: {
      title: "Need Immediate Assistance?",
      description: "Our client success team is here to help you get started quickly and achieve your project goals.",
      primaryAction: "Contact Client Advisor",
      secondaryAction: "Schedule Demo Call"
    }
  }
};

export class InductionService {
  static async getInductionProgress(userId: string, userType: UserRole): Promise<UserInductionProgress> {
    // In real app, fetch from database
    const userData: InductionData = await this.getUserInductionData(userId, userType);
    const content = INDUCTION_CONTENT[userType];
    
    const completed = userData.completedSteps.length;
    const total = content.steps.filter(step => step.required).length;
    const percentage = Math.round((completed / total) * 100);
    
    return {
      userData,
      content,
      progress: { completed, total, percentage }
    };
  }
  
  static async completeStep(userId: string, stepId: string): Promise<void> {
    // Update database - mark step as completed
    // This would update the completedSteps array and currentStep
    console.log(`Marking step ${stepId} as completed for user ${userId}`);
    
    // Example implementation:
    // await db.inductionProgress.update({
    //   where: { userId },
    //   data: {
    //     completedSteps: { push: stepId },
    //     currentStep: { increment: 1 },
    //     lastActivityAt: new Date()
    //   }
    // });
  }
  
  static async startInduction(userId: string, userType: UserRole): Promise<InductionData> {
    // Create new induction record in database
    const inductionData: InductionData = {
      id: `induction_${userId}`,
      userId,
      userType: userType,
      currentStep: 1,
      completedSteps: [],
      status: 'in_progress',
      startedAt: new Date(),
      lastActivityAt: new Date()
    };
    
    // Save to database
    // await db.inductionProgress.create({ data: inductionData });
    
    return inductionData;
  }
  
  private static async getUserInductionData(userId: string, userType: UserRole): Promise<InductionData> {
    // In real app, fetch from database
    // const data = await db.inductionProgress.findUnique({ where: { userId } });
    
    // Mock data for demonstration
    return {
      id: `induction_${userId}`,
      userId,
      userType: userType,
      currentStep: 1,
      completedSteps: ['watch_video'], // Example: first step completed
      status: 'in_progress',
      startedAt: new Date(),
      lastActivityAt: new Date()
    };
  }
}