// enums/project.enums.ts

export enum ProjectMode {
  ONE_TIME = 'one-time',
  ONGOING = 'ongoing',
  CONSULTATION = 'consultation'
}

export enum ProjectStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  IN_REVIEW = 'in-review',
  SHORTLISTING = 'shortlisting',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  RATED = 'rated',
  CANCELLED = 'cancelled'
}

export enum ProjectRequestType {
  RFP = 'RFP',
  RFI = 'RFI',
  CASUAL_INQUIRY = 'Casual Inquiry'
}

export enum BudgetRange {
  LESS_THAN_5K = '<5k',
  FIVE_TO_10K = '5k-10k',
  TEN_TO_25K = '10k-25k',
  TWENTYFIVE_TO_50K = '25k-50k',
  FIFTY_TO_100K = '50k-100k',
  OVER_100K = '100k+'
}

export enum Timeline {
  URGENT = 'urgent',
  ONE_TO_TWO_WEEKS = '1-2 weeks',
  ONE_MONTH = '1 month',
  TWO_TO_THREE_MONTHS = '2-3 months',
  THREE_PLUS_MONTHS = '3+ months'
}

export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum LocationPreference {
  ANY = 'any',
  SAME_COUNTRY = 'same-country',
  SAME_TIMEZONE = 'same-timezone',
  SPECIFIC_REGION = 'specific-region'
}

export enum PreferredContactMethod {
  EMAIL = 'email',
  PHONE = 'phone',
  BOTH = 'both'
}