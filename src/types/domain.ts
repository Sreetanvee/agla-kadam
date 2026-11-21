export type LanguageCode = 'en' | 'te' | 'hi';

export type ExplanationDepth = 'beginner' | 'intermediate' | 'advanced';

export type StudentStage =
  | 'school'
  | 'after-10'
  | 'class-11-12'
  | 'diploma'
  | 'undergraduate'
  | 'postgraduate'
  | 'research'
  | 'graduate-jobseeker'
  | 'early-career'
  | 'entrepreneurship'
  | 'international';

export interface Category {
  id: string;
  number: string;
  name: string;
  shortName: string;
  description: string;
  topicCount: number;
}

export interface OfficialResource {
  label: string;
  url: string;
  authority: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface TopicIndexEntry {
  slug: string;
  title: string;
  categoryId: string;
  stages: StudentStage[];
  summary: string;
  keywords: string[];
  status: 'complete' | 'scheduled';
  batchNumber: number;
  lastVerifiedDate?: string;
}

export interface CompleteGuide extends TopicIndexEntry {
  status: 'complete';
  lastVerifiedDate: string;
  readingTimeMinutes: number;
  beginnerSummary: string;
  intermediateSummary: string;
  advancedSummary: string;
  whatItIs: string;
  whyItExists: string;
  whoNeedsIt: string;
  howItWorks: string;
  typesAndPathways: { title: string; detail: string }[];
  eligibility: string[];
  documentsAndRequirements: string[];
  stepByStepProcedure: { step: number; title: string; detail: string }[];
  whatHappensNext: string;
  opportunitiesAndBenefits: string[];
  limitationsCostsRisks: string[];
  commonMistakes: string[];
  faqs: GuideFaq[];
  relatedGuideSlugs: string[];
  officialResources: OfficialResource[];
}

export interface LearningJourneyStage {
  stageNumber: number;
  title: string;
  timeframe: string;
  prerequisites: string[];
  keyDecisions: string[];
  documents: string[];
  nextActions: string[];
  linkedGuideSlugs: string[];
}

export interface LearningJourney {
  id: string;
  title: string;
  subtitle: string;
  targetAudience: string;
  estimatedHorizon: string;
  overview: string;
  stages: LearningJourneyStage[];
  officialReferences: OfficialResource[];
  lastVerifiedDate: string;
}

export interface PossibilityBranch {
  id: string;
  title: string;
  trackType: 'academic' | 'competitive' | 'vocational' | 'research' | 'career' | 'entrepreneurship' | 'international';
  duration: string;
  eligibility: string;
  entranceExams: string[];
  approximateCostNote: string;
  institutions: string[];
  scholarships: string[];
  careerOutcomes: string[];
  alternatives: string[];
  realityNote: string;
  relatedGuideSlug?: string;
}

export interface PossibilityRoot {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  branches: PossibilityBranch[];
}

export type OpportunityCategory =
  | 'scholarship'
  | 'internship'
  | 'research'
  | 'fellowship'
  | 'hackathon'
  | 'competition'
  | 'conference'
  | 'workshop'
  | 'exchange'
  | 'entrance-exam'
  | 'government-recruitment'
  | 'startup-programme'
  | 'volunteering'
  | 'international';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  stages: StudentStage[];
  location: string;
  eligibilitySummary: string;
  benefitSummary: string;
  cycleWindow: string;
  sampleDeadlineDate: string;
  dataOrigin: 'verified_portal' | 'demonstration';
  sourceName: string;
  officialUrl: string;
  lastVerifiedDate: string;
  lesserKnown?: boolean;
  whatNobodyTellsYou?: string;
}

export type InstitutionType =
  | 'IIT'
  | 'NIT'
  | 'IIIT'
  | 'IISER'
  | 'Central University'
  | 'State University'
  | 'Private University'
  | 'Deemed University'
  | 'NIFT'
  | 'NID'
  | 'NLU'
  | 'International';

export interface University {
  id: string;
  name: string;
  shortName: string;
  type: InstitutionType;
  location: string;
  country: string;
  established: string;
  notableCourses: string[];
  eligibilitySummary: string;
  admissionProcess: string;
  entranceExams: string[];
  feeNote: string;
  scholarshipNote: string;
  officialUrl: string;
  lastVerifiedDate: string;
}

export interface RoadmapPathway {
  id: string;
  title: string;
  trackLabel: string;
  whyItFits: string;
  immediateActions: string[];
  shortTermMilestones: string[];
  longTermMilestones: string[];
  requiredQualifications: string[];
  examinations: string[];
  skills: string[];
  estimatedCostNote: string;
  possibleInstitutions: string[];
  opportunities: string[];
  risksAndAlternatives: string[];
  recommendedGuideSlugs: string[];
}

export interface GeneratedRoadmap {
  title: string;
  educationStage: string;
  summary: string;
  verifiedContextNote: string;
  pathways: RoadmapPathway[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citedGuides?: { slug: string; title: string }[];
  isAiSuggestion?: boolean;
  timestamp: string;
}

export interface DecodedDocumentResult {
  documentType: string;
  plainSummary: string;
  eligibilityHighlights: string[];
  importantDates: { label: string; value: string }[];
  requiredDocuments: string[];
  feesOrFinancialTerms: string[];
  stepByStepNextActions: string[];
  risksAndRedFlags: string[];
  verificationReminder: string;
}

export interface ParentBriefReport {
  pathwayTitle: string;
  executiveSummary: string;
  whatThisPathInvolves: string;
  durationAndTimeline: string;
  eligibilityAndExams: string[];
  realisticCostEstimate: string;
  careerAndIncomeOutlook: string;
  risksAndBackupPlan: string[];
  howParentsCanSupport: string[];
  verifiedDisclaimer: string;
}

export interface StudentProfileData {
  educationLevel: string;
  stream: string;
  location: string;
  preferredLocation: string;
  budgetRange: string;
  interests: string[];
  strengths: string[];
  goals: string[];
  trackPreferences: string[];
}

export interface BookmarkRecord {
  id: string;
  userId: string;
  itemType: 'guide' | 'opportunity' | 'university' | 'journey';
  itemId: string;
  title: string;
  category?: string;
  notes?: string;
  createdAt?: unknown;
}

export interface DeadlineRecord {
  id: string;
  userId: string;
  title: string;
  category?: string;
  dueDate: string;
  status: 'watching' | 'in_progress' | 'submitted';
  officialUrl?: string;
  notes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AchievementRecord {
  id: string;
  userId: string;
  title: string;
  category:
    | 'academic'
    | 'examination'
    | 'research'
    | 'internship'
    | 'scholarship'
    | 'certification'
    | 'competition'
    | 'startup'
    | 'volunteering';
  issuer: string;
  dateEarned: string;
  verificationUrl?: string;
  reflection?: string;
  skills?: string[];
  createdAt?: unknown;
}

export interface SavedRoadmapRecord {
  id: string;
  userId: string;
  title: string;
  educationStage: string;
  summary?: string;
  pathways: RoadmapPathway[];
  selectedPathwayId?: string;
  completedMilestones?: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SavedConversationRecord {
  id: string;
  userId: string;
  title: string;
  language: LanguageCode;
  noStupidMode?: boolean;
  messages: ChatMessage[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface LearningProgressRecord {
  id: string;
  userId: string;
  itemType: 'guide' | 'journey';
  itemId: string;
  title: string;
  completedSteps?: string[];
  percentComplete: number;
  updatedAt?: unknown;
}
