// app/consultant/[id]/page.tsx
import ConsultantProfile from '@/components/consultant/ConsultantProfile';
import { ConsultantNewDTO as ConsultantDTO } from "@/types/dtos/ConsultantNew.dto"
import { Consultants as Consultant } from '@/services/generated';
interface ConsultantPageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ConsultantPage({ params }: ConsultantPageProps) {
  // Fetch consultant data
  const consultant = await fetchConsultantData(params.id);
  const useCases = await fetchUseCases(params.id);
  const caseStudies = await fetchCaseStudies(params.id);

  // Check if this is the consultant's own profile
  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser?.id === params.id;

  return (
    <ConsultantProfile
      consultant={consultant}
      useCases={useCases}
      caseStudies={caseStudies}
      isOwnProfile={isOwnProfile}
    />
  );
}

// Mock data functions - replace with your actual data fetching
async function fetchConsultantData(id: string): Promise<ConsultantDTO> {
  return {
    // Core identification
    user_id: "10",
    title: 'AI DevOps Engineer', // From first object
    name: 'Tom Becker', // From first object
    email: 'tom.becker@example.com', // From first object
    role: 'AI Consultant', // From first object
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400', // From first object
    country: 'Australia', // From first object
    created_at: '1/1/2000', // From first object
    
    // Professional information
    stage: null, // From first object
    bio_summary: 'Experienced AI DevOps Engineer with expertise in DevOps, MLOps, Automation.', // From first object
    expertise: ['DevOps', 'MLOps', 'Automation'], // From first object
    availability: 'Weekdays - 16 hours/week', // From first object
    work_experience: 6, // From first object
    skills: ['DevOps', 'MLOps', 'Automation'], // From first object
    linkedinUrl: null, // From first object
    publications: ['Publication 19', 'Publication 20'], // From first object
    projects_completed: 58, // From first object
    rating: 4.6, // From first object
    featured: false, // From first object
    
    // Business details (from second object, with some defaults)
    hourly_rate: 120, // Default value since not in first object
    min_project_size: 3000, // Default value
    preferred_engagement_type: ['Project-based', 'Hourly'], // Default value
    hours_per_week: 16, // Default value
    portfolio_url: 'https://portfolio.tombecker.com', // Default value
    certifications: ['AWS DevOps Engineer', 'Kubernetes Certified'], // Default value
    industries: ['Technology', 'Finance'], // Default value
  };
}

async function fetchUseCases(consultantId: string) {
  return [
    {
      id: '1',
      title: 'AI-Powered Customer Service',
      business_problem: 'High volume of customer inquiries leading to slow response times and increased operational costs.',
      solution: 'Implemented a sophisticated chatbot using NLP and machine learning to handle 80% of common inquiries automatically.',
      outcomes: 'Reduced response time from 24 hours to 2 minutes, decreased support costs by 60%, and improved customer satisfaction scores by 45%.',
      category: 'Customer Service'
    },
    {
      id: '2', 
      title: 'Predictive Maintenance System',
      business_problem: 'Unexpected equipment failures causing production downtime and maintenance cost overruns.',
      solution: 'Developed ML models analyzing sensor data to predict equipment failures 2-4 weeks in advance.',
      outcomes: 'Reduced unplanned downtime by 75%, cut maintenance costs by 30%, and increased overall equipment effectiveness by 25%.',
      category: 'Manufacturing'
    }
  ];
}

async function fetchCaseStudies(consultantId: string) {
  return [
    {
      id: '1',
      title: 'Enterprise AI Transformation',
      client: 'Global Financial Services Corp',
      challenge: 'Legacy systems and siloed data preventing effective AI adoption across business units.',
      solution: 'Designed and implemented a centralized AI platform with unified data pipelines and ML ops framework.',
      results: 'Enabled 15+ AI applications across the organization, generated $12M in annual savings, and reduced time-to-market for new AI features by 70%.',
      duration: '9 months',
      technologies: ['AWS SageMaker', 'Kubernetes', 'TensorFlow', 'Apache Airflow']
    }
  ];
}

async function getCurrentUser() {
  // Implement your auth logic here
  return { id: 'user_123' };
}