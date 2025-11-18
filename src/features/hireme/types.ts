export type ProjectType = "landing" | "dashboard" | "api" | "mvp";

export type ComplexityLevel = "simple" | "medium" | "complex";

export type TimelineChoice = "rush" | "standard" | "flexible" | "not-sure" | "extended";

export interface TimelineRange {
  min: number;
  max: number;
}

export interface ProjectTypeConfig {
  id: ProjectType;
  label: string;
  description: string;
  basePrice: number;
  baseTimeline: TimelineRange;
}

export interface FeatureDefinition {
  id: string;
  label: string;
  description?: string;
  price: number;
  isBase?: boolean;
  isAdvanced?: boolean;
}

export interface FeaturesByProjectType {
  base: FeatureDefinition[];
  optional: FeatureDefinition[];
}

export interface BudgetRangeDefinition {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export interface ContactDetails {
  name: string;
  email: string;
  company: string;
  additionalInfo: string;
  agreeToTerms: boolean;
}

export interface QuoteState {
  currentStep: number;
  maxVisitedStep: number;
  projectType: ProjectType | null;
  basePrice: number;
  baseTimeline: TimelineRange | null;
  selectedFeatures: FeatureDefinition[];
  featureAddOns: number;
  complexity: ComplexityLevel;
  complexityMultiplier: number;
  timeline: TimelineChoice;
  timelineMultiplier: number;
  estimatedWeeks: TimelineRange | null;
  estimatedDelivery: Date | null;
  budgetRange: BudgetRangeDefinition | null;
  budgetMismatch: boolean;
  contact: ContactDetails;
  finalPrice: number;
}

export interface QuotePayload {
  projectType: ProjectType | null;
  features: string[];
  complexity: ComplexityLevel;
  timeline: TimelineChoice;
  budgetRangeId: string | null;
  budgetMismatch: boolean;
  contact: ContactDetails;
  calculatedPrice: number;
  estimatedDelivery: string | null;
}
