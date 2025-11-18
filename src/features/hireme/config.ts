import { BudgetRangeDefinition, ComplexityLevel, FeaturesByProjectType, ProjectType, ProjectTypeConfig, TimelineChoice } from "./types";

export const PROJECT_TYPES: ProjectTypeConfig[] = [
  {
    id: "landing",
    label: "Landing page",
    description: "Marketing site or landing page (1–6 pages).",
    basePrice: 1500,
    baseTimeline: { min: 1, max: 2 },
  },
  {
    id: "dashboard",
    label: "SaaS dashboard",
    description: "Product or admin dashboard with auth, CRUD and data viz.",
    basePrice: 4500,
    baseTimeline: { min: 3, max: 4 },
  },
  {
    id: "api",
    label: "API / backend",
    description: "Backend/API layer with auth, database and integrations.",
    basePrice: 3000,
    baseTimeline: { min: 2, max: 3 },
  },
  {
    id: "mvp",
    label: "Full MVP",
    description: "End-to-end MVP: frontend, backend, database, deployment.",
    basePrice: 12000,
    baseTimeline: { min: 6, max: 8 },
  },
];

export const FEATURES_BY_PROJECT_TYPE: Record<ProjectType, FeaturesByProjectType> = {
  landing: {
    base: [
      { id: "responsive-design", label: "Responsive design", description: "Mobile and desktop optimized.", price: 0, isBase: true },
      { id: "contact-form", label: "Contact form", description: "Form wired to your inbox.", price: 0, isBase: true },
      { id: "seo", label: "SEO basics", description: "Meta tags and sitemap.", price: 0, isBase: true },
    ],
    optional: [
      { id: "animations", label: "Custom animations", price: 300 },
      { id: "blog-cms", label: "Blog / CMS integration", price: 500 },
      { id: "multi-language", label: "Multi-language support", price: 400 },
      { id: "newsletter", label: "Email newsletter signup", price: 200 },
      { id: "analytics", label: "Analytics setup", price: 150 },
      { id: "extra-page", label: "Additional pages", description: "Per extra page.", price: 200 },
    ],
  },
  dashboard: {
    base: [
      { id: "auth", label: "User authentication", price: 0, isBase: true },
      { id: "crud", label: "CRUD operations", price: 0, isBase: true },
      { id: "tables", label: "Data tables", price: 0, isBase: true },
      { id: "charts", label: "Charts & data viz", price: 0, isBase: true },
    ],
    optional: [
      { id: "rbac", label: "Role-based permissions", price: 600, isAdvanced: true },
      { id: "stripe", label: "Stripe payments", price: 900 },
      { id: "email-notifications", label: "Email notifications", price: 400 },
      { id: "file-upload", label: "File upload & storage", price: 700 },
      { id: "third-party-apis", label: "3rd-party API integrations", price: 800, isAdvanced: true },
      { id: "realtime", label: "Real-time updates", price: 1000, isAdvanced: true },
      { id: "advanced-analytics", label: "Advanced analytics & reports", price: 600 },
      { id: "export", label: "Export data (CSV/PDF)", price: 400 },
      { id: "multi-tenant", label: "Multi-tenant architecture", price: 1500, isAdvanced: true },
    ],
  },
  api: {
    base: [
      { id: "rest", label: "REST API endpoints", price: 0, isBase: true },
      { id: "api-auth", label: "Authentication", price: 0, isBase: true },
      { id: "db-setup", label: "Database design & setup", price: 0, isBase: true },
      { id: "error-handling", label: "Error handling & logging", price: 0, isBase: true },
    ],
    optional: [
      { id: "graphql", label: "GraphQL API", price: 500 },
      { id: "stripe-api", label: "Stripe payments", price: 800 },
      { id: "file-storage", label: "File storage (S3/Cloudinary)", price: 600 },
      { id: "notifications", label: "Email/SMS notifications", price: 700 },
      { id: "webhooks", label: "Webhook handling", price: 400 },
      { id: "security", label: "Rate limiting & security", price: 500, isAdvanced: true },
      { id: "docs", label: "API documentation", price: 300 },
      { id: "background-jobs", label: "Background jobs", price: 600 },
      { id: "microservices", label: "Microservices architecture", price: 1200, isAdvanced: true },
    ],
  },
  mvp: {
    base: [
      { id: "frontend", label: "Complete frontend", price: 0, isBase: true },
      { id: "backend", label: "Complete backend", price: 0, isBase: true },
      { id: "db", label: "Database design & setup", price: 0, isBase: true },
      { id: "auth-mvp", label: "Auth & authorization", price: 0, isBase: true },
      { id: "core-features", label: "Core feature set", price: 0, isBase: true },
      { id: "deployment", label: "Deployment & CI/CD", price: 0, isBase: true },
    ],
    optional: [
      { id: "mobile", label: "Mobile app", price: 5000, isAdvanced: true },
      { id: "admin-dashboard", label: "Admin dashboard", price: 2500 },
      { id: "payments", label: "Payment processing", price: 1500 },
      { id: "realtime-mvp", label: "Real-time features", price: 2000, isAdvanced: true },
      { id: "integrations", label: "Advanced integrations", price: 1800, isAdvanced: true },
      { id: "ai-ml", label: "AI/ML features", price: 3000, isAdvanced: true },
      { id: "multi-language-mvp", label: "Multi-language support", price: 1000 },
      { id: "analytics-mvp", label: "Advanced analytics & reporting", price: 1500 },
    ],
  },
};

export const COMPLEXITY_MULTIPLIERS: Record<ComplexityLevel, number> = {
  simple: 0.8,
  medium: 1.0,
  complex: 1.4,
};

export const TIMELINE_MULTIPLIERS: Record<TimelineChoice, number> = {
  rush: 1.2,
  standard: 1.0,
  flexible: 0.9,
  "not-sure": 1.0,
  extended: 0.85,
};

export const BUDGET_RANGES: BudgetRangeDefinition[] = [
  { id: "1000-2000", label: "€1,000 – €2,000", min: 1000, max: 2000 },
  { id: "2000-5000", label: "€2,000 – €5,000", min: 2000, max: 5000 },
  { id: "5000-15000", label: "€5,000 – €15,000", min: 5000, max: 15000 },
  { id: "15000-30000", label: "€15,000 – €30,000", min: 15000, max: 30000 },
  { id: "30000-plus", label: "€30,000+", min: 30000, max: null },
];

export function getProjectTypeConfig(id: ProjectType): ProjectTypeConfig {
  const config = PROJECT_TYPES.find((item) => item.id === id);
  if (!config) {
    throw new Error(`Unknown project type: ${id}`);
  }
  return config;
}

export function getFeaturePriceTotal(features: readonly { price: number; isBase?: boolean }[]): number {
  return features
    .filter((feature) => !feature.isBase)
    .reduce((sum, feature) => sum + feature.price, 0);
}

export function getSuggestedComplexity(featureCount: number, hasAdvancedFeatures: boolean): ComplexityLevel {
  if (featureCount <= 2 && !hasAdvancedFeatures) {
    return "simple";
  }
  if (featureCount <= 5 && !hasAdvancedFeatures) {
    return "medium";
  }
  return "complex";
}

export function calculateStandardTimelineWeeks(projectType: ProjectType, complexity: ComplexityLevel, featureCount: number) {
  const base = getProjectTypeConfig(projectType).baseTimeline;

  const complexityTimelineMultiplier: Record<ComplexityLevel, number> = {
    simple: 0.75,
    medium: 1.0,
    complex: 1.5,
  };

  const featureAdjustment = Math.ceil(featureCount / 3);

  const min = Math.ceil(base.min * complexityTimelineMultiplier[complexity] + featureAdjustment);
  const max = Math.ceil(base.max * complexityTimelineMultiplier[complexity] + featureAdjustment);

  return { min, max };
}

export function addWeeksToDate(base: Date, weeks: number): Date {
  const result = new Date(base);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

export function formatDateIso(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString().slice(0, 10);
}
