import { Tier } from "./interfaces";

export const AuthProviders = {
  LINKEDIN: "linkedin" as const,
  GOOGLE: "google" as const,
  FACEBOOK: "facebook" as const,
  CREDENTIALS: "credentials" as const,
} as const;

export const UserStages = {
  NONE: "none" as const,
  BIO: "bio" as const,
  BIO_WIP: "bio-wip" as const,
  BIO_DONE: "bio-done" as const,
  INTV: "interview" as const,
  INTV_SCHEDULED: "interview-scheduled" as const,
  INTV_DONE: "interview-done" as const,
  INTV_DONE_ACCEPT: "interview-done-accept" as const,
  INTV_DONE_REJECT: "interview-done-reject" as const,
  PROBATION: "probation" as const,
  PROBATION_WIP: "probation-wip" as const,
  PROBATION_DONE: "probation-done" as const,
  PROFESSIONAL: "professional" as const,
} as const;

export const UserRoles = {
  ADMIN: "admin" as const,
  CLIENT: "client" as const,
  SELLER: "seller" as const,
  CONSULTANT: "consultant" as const,
  PUBLIC: "public" as const,
  OB_PARTNER: "ob_partner" as const,
  AC_PARTNER: "ac_partner" as const,
  ROLE_PENDING: "role_pending" as const,
} as const;

export const ClientSellerTypes = {
  INDIVIDUAL: "individual" as const,
  AGENCY: "agency" as const,
  ENTERPRISE: "enterprise" as const,
} as const;

export const UserStates = {
  ONBOARDING: "onboarding" as const,
  PENDING: "pending" as const,
  VERIFICATION_PENDING: "verification-pending" as const,
  VERIFICATION_APPROVED: "verification-approved" as const,
  ACTIVE: "active" as const,
  SUSPENDED: "suspended" as const,
  INACTIVE: "inactive" as const,
} as const;

export const ExpertiseOptions = [
  "GPT-4",
  "Claude AI",
  "Prompt Engineering",
  "React",
  "Next.js",
  "AI Integration",
  "PyTorch",
  "TensorFlow",
  "MLOps",
  "AI Strategy",
  "Enterprise Solutions",
  "Cloud AI",
  "NLP",
  "Text Analytics",
  "Chatbots",
  "Product Management",
  "AI Roadmaps",
  "Team Leadership",
  "Computer Vision",
  "Image Recognition",
  "Deep Learning",
  "AI Security",
  "Risk Assessment",
  "Compliance",
  "Data Science",
  "Predictive Analytics",
  "Big Data",
  "DevOps",
  "Automation",
];

export const AiSkills = [
  "Python",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Keras",
  "OpenCV",
  "NLTK",
  "spaCy",
  "Hugging Face",
  "LangChain",
  "AWS SageMaker",
  "Azure ML",
  "Google AI",
  "Docker",
  "Kubernetes",
];

export const Availabilities = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
];

export const UserTypes = {
  FOUNDER_CONSULTANT: "founder-consultant" as const,
  FOUNDER_SELEER: "founder-seller" as const,
  FOUNDER_CLIENT: "founder-client" as const,
  CONSULTANT: "consultant" as const,
  SELLER: "seller" as const,
  CLIENT: "client" as const,
} as const;

export type UserType = keyof typeof UserTypes;

export const Industries = [
  "Technology/SaaS",
  "Financial Services",
  "Healthcare",
  "E-commerce & Retail",
  "Manufacturing",
  "Energy & Utilities",
  "Telecommunications",
  "Media & Entertainment",
  "Education",
  "Government",
  "Startups & Venture Capital",
  "Consulting & Professional Services",
  "Other",
];

export const Projects_Types = [
  "Strategic Advisory",
  "Technical Implementation",
  "Team Building & Mentoring",
  "System Architecture",
  "Proof of Concept",
  "Production Deployment",
  "Technical Due Diligence",
  "AI Transformation",
  "Model Optimization",
  "Data Strategy",
];

export const Countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" },
  { code: "BT", name: "Bhutan" },
  { code: "BR", name: "Brazil" },
  { code: "BG", name: "Bulgaria" },
  { code: "CA", name: "Canada" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "CU", name: "Cuba" },
  { code: "DK", name: "Denmark" },
  { code: "EG", name: "Egypt" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HK", name: "Hong Kong" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KE", name: "Kenya" },
  { code: "KR", name: "Korea, Republic of" },
  { code: "KW", name: "Kuwait" },
  { code: "LK", name: "Sri Lanka" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "MM", name: "Myanmar" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "PK", name: "Pakistan" },
  { code: "PH", name: "Philippines" },
  { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SG", name: "Singapore" },
  { code: "ZA", name: "South Africa" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TH", name: "Thailand" },
  { code: "TR", name: "Turkey" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" },
];

export const EngagementTypes = {
  ADVISORY: "advisory" as const,
  IMPLEMENTATION: "implementation" as const,
  MENTORING: "mentoring" as const,
  ASSESSMENT: "assessment" as const,
} as const;

export const ENGAGEMENT_TYPES_DATA = [
  {
    value: "advisory",
    label: "Strategic Advisory",
    description:
      "High-level guidance, board-level consulting, strategy sessions",
  },
  {
    value: "implementation",
    label: "Hands-on Implementation",
    description: "Technical development, coding, system architecture",
  },
  {
    value: "assessment",
    label: "Technical Assessment",
    description: "Code reviews, architecture evaluation, due diligence",
  },
  {
    value: "mentoring",
    label: "Team Mentoring",
    description: "Training, coaching, team development",
  },
] as const;

export const ApprovalStatusTypes = {
  PENDING: "pending" as const,
  APPROVED: "approved" as const,
  REJECTED: "rejected" as const,
  HOLD: "hold" as const,
} as const;

export const NoticePeriodTypes = {
  IMMEDIATE: "immediately" as const,
  ONE_WEEK: "1 week" as const,
  TWO_WEEKS: "2 weeks" as const,
  ONE_MONTH: "1 month" as const,
  TWO_MONTHS: "2 months" as const,
  UNDEFINED: undefined,
};

export const OnboardingTierTypes = {
  FOUNDER_100: "founder_100" as const,
  REFERRED: "referred" as const,
  GENERAL: "general" as const,
  NA: "N/A" as const,
  UNDEFINED: undefined,
};

export const InterviewStatusTypes = {
  SCHEDULED: "scheduled" as const,
  COMPLETED: "completed" as const,
  CANCELLED: "cancelled" as const,
  RESCHEDULED: "rescheduled" as const,
  NOSHOW: "no_show" as const,
};

export const PartnershipStatusTypes = {
  ACTIVE: "active" as const,
  COMPLETED: "completed" as const,
  PAUSED: "paused" as const,
  TRANSFERRED: "transferred" as const,
  ENDED_EARLY: "ended_early" as const,
};

export enum TimeWindowEnum {
  SEVEN_DAYS= "7d",
  THIRTY_DAYS= "30d" ,
  NINETY_DAYS= "90d" ,
  YEAR_TO_DATE= "ytd" ,
}

export const TIME_WINDOW_CONFIG = {
  OPTIONS: [
    TimeWindowEnum.SEVEN_DAYS,
    TimeWindowEnum.THIRTY_DAYS,
    TimeWindowEnum.NINETY_DAYS,
    TimeWindowEnum.YEAR_TO_DATE
  ] as const,
  DEFAULT: TimeWindowEnum.THIRTY_DAYS,
  
  LABELS: {
    [TimeWindowEnum.SEVEN_DAYS]: 'Last 7 days',
    [TimeWindowEnum.THIRTY_DAYS]: 'Last 30 days',
    [TimeWindowEnum.NINETY_DAYS]: 'Last 90 days',
    [TimeWindowEnum.YEAR_TO_DATE]: 'Year to date',
  }
} as const;


export const OnboardingTierTypeData: Tier[] = [
  {
    id: "founder_100",
    name: "Founder 100 Elite",
    label: "Founder 100",
    available: true, // Would check if spots remaining
    description: "Join our exclusive founding cohort",
    benefits: [
      "Immediate paid project access",
      "No probation period",
      "Referral commission rights (10% forever)",
      "Platform advisory opportunities",
      "Equity consideration",
    ],
    requirements: [
      "Proven AI expertise",
      "Executive-level experience",
      "Commitment to platform growth",
    ],
  },
  {
    id: "referred",
    name: "Referred Expert",
    label: "Referred",
    available: false, // Default to false, will be set dynamically
    description: "Skip probation via Founder 100 referral",
    benefits: [
      "Immediate paid project access",
      "No probation period",
      "Fast-track approval",
    ],
    requirements: [
      "Referral from Founder 100 member",
      "Meet platform quality standards",
    ],
  },
  {
    id: "general",
    name: "Standard Application",
    label: "General",
    available: true,
    description: "Standard onboarding process",
    benefits: [
      "Access to premium AI projects",
      "Growing expert community",
      "Competitive earning potential",
    ],
    requirements: [
      "2 free consultation projects",
      "Quality and performance review",
      "Platform approval required",
    ],
  },
];

export const PAYMENT_METHODS = [
  "Bank Transfer",
  "PayPal",
  "Wise",
  "Stripe",
  "Direct Deposit",
];

// Realistic commission structure based on platform's 20% take rate
export const COMMISSION_TIERS = [
  {
    range: "Up to $25,000",
    commission: "5%",
    platform_fee: "15%",
    example: "$10,000 project → $500 to you, $1,500 to platform",
  },
  {
    range: "$25,001 - $75,000",
    commission: "7.5%",
    platform_fee: "12.5%",
    example: "$50,000 project → $3,750 to you, $6,250 to platform",
  },
  {
    range: "$75,001 - $150,000",
    commission: "10%",
    platform_fee: "10%",
    example: "$100,000 project → $10,000 to you, $10,000 to platform",
  },
  {
    range: "$150,001+",
    commission: "12.5%",
    platform_fee: "7.5%",
    example: "$200,000 project → $25,000 to you, $15,000 to platform",
  },
];

export const GEOGRAPHIC_FOCUS_OPTIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Middle East",
  "Latin America",
  "Africa",
  "Global",
];

export const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

export const PROJECT_BUDGETS: string[] = [
  "< $10,000",
  "$10,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $500,000",
  "> $500,000",
];

export const CONSULTANT_TRAITS: string[] = [
  "Deep Research Focus",
  "Fast Deployment Specialist",
  "Strategy & Governance Expert",
  "Startup Experience",
  "Enterprise Scale Experience",
  "Remote/Global",
  "Onsite Preferred",
];


