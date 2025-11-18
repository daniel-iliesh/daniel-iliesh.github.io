# "Hire Me" Multi-Step Quote Builder - Complete Specification
## Conditional Logic & Dynamic Pricing System

**Document Version**: 1.0  
**Created**: November 18, 2025  
**Purpose**: Full UX flow with step-by-step conditional logic for quote builder

---

## System Overview

### Core Principle: **Context-Aware Progressive Disclosure**

Each step dynamically adjusts based on:
1. Previous selections (e.g., SaaS Dashboard shows different features than Landing Page)
2. Calculated complexity (e.g., more features = longer timeline options)
3. User behavior (e.g., skipping budget = different email template)

---

## Step-by-Step Flow with Conditional Logic

### **STEP 1: Project Type** (Required)

**Headline**: "What do you need built?"

**UI**: 4 large cards (single select, radio buttons)

**Options**:

| Card | Base Price | Base Timeline | Icon |
|------|-----------|---------------|------|
| Landing Page | €1,500 | 1-2 weeks | 🌐 |
| SaaS Dashboard | €4,500 | 3-4 weeks | 📊 |
| API/Backend | €3,000 | 2-3 weeks | 🔌 |
| Full MVP | €12,000 | 6-8 weeks | 🚀 |

**State saved**:
```

{
projectType: 'dashboard', // or 'landing', 'api', 'mvp'
basePrice: 4500,
baseTimeline: { min: 3, max: 4, unit: 'weeks' }
}

```

**Next button**: Disabled until selection → activates → "Continue to Features"

**Price display** (sticky footer):
```

Estimated: €4,500 | Standard timeline: 3-4 weeks

```

---

### **STEP 2: Features/Scope** (Required, Conditional on Step 1)

**Headline**: "What features do you need?"

**UI**: Checkbox list (multiple selections)

**Conditional Logic**: Feature list changes based on `projectType` selected in Step 1

---

#### **IF projectType = 'landing'** (Landing Page):

**Base Features** (pre-checked, cannot uncheck):
- ✓ Responsive design (mobile + desktop)
- ✓ Contact form integration
- ✓ SEO optimization (meta tags, sitemap)

**Optional Add-Ons**:
- □ Custom animations/transitions [+€300]
- □ Blog/CMS integration [+€500]
- □ Multi-language support [+€400]
- □ Email newsletter signup [+€200]
- □ Analytics setup (Google/Plausible) [+€150]
- □ Additional pages (per page) [+€200/page]

---

#### **IF projectType = 'dashboard'** (SaaS Dashboard):

**Base Features** (pre-checked, cannot uncheck):
- ✓ User authentication (login/register/password recovery)
- ✓ CRUD operations (Create, Read, Update, Delete)
- ✓ Data tables (search, filter, sort, pagination)
- ✓ Charts & data visualization (basic)

**Optional Add-Ons**:
- □ Role-based permissions (Admin/User/Editor) [+€600]
- □ Stripe payment integration [+€900]
- □ Email notifications (transactional) [+€400]
- □ File upload/management (S3/storage) [+€700]
- □ Third-party API integration (Twilio, SendGrid, etc.) [+€800]
- □ Real-time updates (WebSockets) [+€1,000]
- □ Advanced analytics/reports [+€600]
- □ Export data (CSV, PDF) [+€400]
- □ Multi-tenant architecture [+€1,500]

---

#### **IF projectType = 'api'** (API/Backend):

**Base Features** (pre-checked, cannot uncheck):
- ✓ RESTful API endpoints
- ✓ Authentication (JWT or OAuth)
- ✓ Database design & setup
- ✓ Error handling & logging

**Optional Add-Ons**:
- □ GraphQL API (instead of REST) [+€500]
- □ Stripe payment processing [+€800]
- □ File upload/storage (S3, Cloudinary) [+€600]
- □ Email/SMS notifications (SendGrid, Twilio) [+€700]
- □ Webhook handling [+€400]
- □ Rate limiting & security hardening [+€500]
- □ API documentation (Swagger/Postman) [+€300]
- □ Background jobs (queues, cron) [+€600]
- □ Microservices architecture [+€1,200]

---

#### **IF projectType = 'mvp'** (Full MVP):

**Base Features** (pre-checked, cannot uncheck):
- ✓ Complete frontend (Vue.js/React)
- ✓ Complete backend (Node.js/Go)
- ✓ Database design & setup
- ✓ User authentication & authorization
- ✓ Core feature set (as per brief)
- ✓ Deployment & CI/CD pipeline

**Optional Add-Ons**:
- □ Mobile app (React Native/Flutter) [+€5,000]
- □ Admin dashboard (separate interface) [+€2,500]
- □ Payment processing (Stripe/PayPal) [+€1,500]
- □ Real-time features (chat, notifications) [+€2,000]
- □ Advanced integrations (multiple APIs) [+€1,800]
- □ AI/ML features (recommendations, etc.) [+€3,000]
- □ Multi-language support [+€1,000]
- □ Advanced analytics & reporting [+€1,500]

---

**State saved after Step 2**:
```

{
projectType: 'dashboard',
basePrice: 4500,
selectedFeatures: ['role-permissions', 'stripe', 'email-notifications'],
featureAddOns: 600 + 900 + 400, // €1,900
subtotalBeforeComplexity: 4500 + 1900 // €6,400
}

```

**Price display** (updates live):
```

Base: €4,500
Add-ons: +€1,900
───────────────
Subtotal: €6,400

```

---

### **STEP 3: Project Complexity** (Required, Conditional on Features)

**Headline**: "How complex is your project?"

**UI**: 3 buttons (single select)

**Conditional Logic**: Complexity descriptions adapt based on `projectType` and number of `selectedFeatures`

---

#### **Dynamic Complexity Thresholds**

**Auto-suggestion logic** (pre-select based on features):

```

const featureCount = selectedFeatures.length
const hasAdvancedFeatures = selectedFeatures.some(f =>
['real-time', 'multi-tenant', 'ai-ml', 'microservices'].includes(f)
)

// Auto-select complexity:
if (featureCount <= 2 \&\& !hasAdvancedFeatures) {
suggestedComplexity = 'simple' // 0.8x
} else if (featureCount <= 5 \&\& !hasAdvancedFeatures) {
suggestedComplexity = 'medium' // 1.0x (DEFAULT)
} else {
suggestedComplexity = 'complex' // 1.4x
}

```

---

#### **Complexity Options** (Conditional Descriptions):

**IF projectType = 'landing'**:

○ **Simple** (0.8x multiplier)
- 1-3 pages, standard layout
- Pre-designed template customization
- Basic animations
- _Example: Single product landing page_

● **Medium** (1.0x multiplier) ← Auto-selected
- 4-6 pages, custom design
- Custom animations/interactions
- Multiple CTAs, A/B testing ready
- _Example: SaaS marketing site with blog_

○ **Complex** (1.4x multiplier)
- 7+ pages, fully custom design
- Advanced animations (GSAP, custom)
- Interactive elements, calculators
- _Example: Multi-product marketing site with CMS_

---

**IF projectType = 'dashboard'**:

○ **Simple** (0.8x multiplier)
- Single user role, basic CRUD
- 2-3 data tables, simple charts
- Standard auth flow
- _Example: Personal task manager_

● **Medium** (1.0x multiplier) ← Auto-selected (if ≤5 features)
- 2-3 user roles, moderate CRUD
- 5-7 data tables, interactive charts
- Custom workflows
- _Example: Team project management tool_

○ **Complex** (1.4x multiplier) ← Auto-selected (if >5 features OR advanced features)
- Multiple roles + permissions
- 10+ data tables, real-time updates
- Complex business logic
- _Example: Multi-tenant enterprise SaaS_

---

**IF projectType = 'api'**:

○ **Simple** (0.8x multiplier)
- 5-10 endpoints, basic CRUD
- Single database, no integrations
- Standard auth (JWT)
- _Example: Blog API_

● **Medium** (1.0x multiplier)
- 15-25 endpoints, moderate logic
- 1-2 external APIs, webhooks
- Advanced auth (OAuth, RBAC)
- _Example: E-commerce backend_

○ **Complex** (1.4x multiplier)
- 30+ endpoints, complex logic
- Multiple APIs, microservices
- Advanced security, rate limiting
- _Example: Fintech/payment processing API_

---

**IF projectType = 'mvp'**:

○ **Simple** (0.8x multiplier)
- MVP with 2-3 core features
- Standard tech stack
- Single user type
- _Example: Note-taking app_

● **Medium** (1.0x multiplier)
- MVP with 4-6 core features
- Some integrations (1-2 APIs)
- Multiple user types
- _Example: Freelance marketplace_

○ **Complex** (1.4x multiplier)
- MVP with 7+ features
- Multiple integrations, real-time
- Complex workflows, payments
- _Example: Social platform with payments_

---

**State saved after Step 3**:
```

{
// ... previous state
complexity: 'medium',
complexityMultiplier: 1.0,
priceAfterComplexity: 6400 * 1.0 // €6,400
}

```

**Price display**:
```

Subtotal: €6,400
Complexity: Medium (×1.0)
───────────────
Current estimate: €6,400

```

---

### **STEP 4: Timeline** (Optional, Conditional on Complexity)

**Headline**: "When do you need it delivered?"

**UI**: Dropdown or 3-4 buttons

**Conditional Logic**: Timeline options adjust based on `projectType`, `complexity`, and `featureCount`

---

#### **Dynamic Timeline Calculation**

```

// Base timeline from Step 1
const baseTimeline = {
'landing': { min: 1, max: 2 },
'dashboard': { min: 3, max: 4 },
'api': { min: 2, max: 3 },
'mvp': { min: 6, max: 8 }
}[projectType]

// Adjust for complexity
const complexityTimelineMultiplier = {
'simple': 0.75,
'medium': 1.0,
'complex': 1.5
}[complexity]

// Adjust for feature count
const featureAdjustment = Math.ceil(selectedFeatures.length / 3) // +1 week per 3 features

// Final timeline ranges
const standardTimeline = {
min: Math.ceil(baseTimeline.min * complexityTimelineMultiplier + featureAdjustment),
max: Math.ceil(baseTimeline.max * complexityTimelineMultiplier + featureAdjustment)
}

const rushTimeline = {
min: Math.max(1, Math.floor(standardTimeline.min * 0.6)),
max: Math.max(2, Math.floor(standardTimeline.max * 0.6))
}

const flexibleTimeline = {
min: standardTimeline.min + 2,
max: standardTimeline.max + 3
}

```

---

#### **Timeline Options** (Conditional):

**Example for Dashboard + Medium Complexity + 5 Features**:

○ **Rush** (1.2x price multiplier)
- Delivery: 2-3 weeks
- Premium fee: +20%
- Priority support
- _Available only if ≤ 4 weeks standard timeline_

● **Standard** (1.0x price multiplier) ← DEFAULT
- Delivery: 4-5 weeks
- No extra charge
- Regular check-ins (2/week)
- _Recommended for best quality_

○ **Flexible** (0.9x price multiplier)
- Delivery: 6-8 weeks
- 10% discount
- Lower priority, more time for revisions
- _Best for non-urgent projects_

○ **Not sure yet**
- I'll propose a timeline based on scope
- No price adjustment
- _We'll discuss in consultation_

---

**Conditional Display Rules**:

```

// Hide "Rush" option if standard timeline > 4 weeks
if (standardTimeline.max > 4) {
hideRushOption = true
showWarning = "Rush delivery not available for this project scope"
}

// Show "Extended" option only for MVP projects
if (projectType === 'mvp') {
showExtendedOption = true // 12-16 weeks, 0.85x multiplier
}

// Auto-calculate delivery date
const estimatedDeliveryDate = addWeeks(new Date(), standardTimeline.max)

```

---

**State saved after Step 4**:
```

{
// ... previous state
timeline: 'standard',
timelineMultiplier: 1.0,
estimatedWeeks: { min: 4, max: 5 },
estimatedDelivery: '2025-12-23',
priceAfterTimeline: 6400 * 1.0 // €6,400
}

```

**Price display**:
```

Current estimate: €6,400
Timeline: Standard (4-5 weeks)
Estimated delivery: Dec 23, 2025

```

---

### **STEP 5: Budget Range** (Optional)

**Headline**: "What's your budget range?"

**UI**: 5 buttons (single select) + "Skip this step" link

**Conditional Logic**: Auto-select range matching calculated price

```

const calculatedPrice = priceAfterTimeline // €6,400

const budgetRanges = [
{ label: '€1,000 - €2,000', min: 1000, max: 2000 },
{ label: '€2,000 - €5,000', min: 2000, max: 5000 },
{ label: '€5,000 - €15,000', min: 5000, max: 15000 },
{ label: '€15,000 - €30,000', min: 15000, max: 30000 },
{ label: '€30,000+', min: 30000, max: Infinity }
]

// Auto-select matching range
const suggestedRange = budgetRanges.find(r =>
calculatedPrice >= r.min \&\& calculatedPrice <= r.max
)

```

**Options**:

○ €1,000 - €2,000 ⚠️ _Below your estimate_
○ €2,000 - €5,000 ⚠️ _Below your estimate_
● €5,000 - €15,000 ← _Your estimate: €6,400_
○ €15,000 - €30,000
○ €30,000+
○ Not sure yet

**Warning display** (if selected budget < calculated price):
```

⚠️ Your selections would typically cost €6,400.
Let's discuss how to fit your budget — I may suggest:

- Fewer features (prioritize MVP)
- Simpler complexity
- Longer timeline (flexible)

```

**State saved**:
```

{
// ... previous state
budgetRange: '5000-15000',
budgetMismatch: false, // true if selected < calculated
finalPrice: 6400
}

```

---

### **STEP 6: Contact Information** (Required)

**Headline**: "Almost done! Where should I send your quote?"

**UI**: Simple form (4 fields)

**Conditional Logic**: Form submission triggers different email templates based on `budgetMismatch`

**Form Fields**:

```

Name *
[_____________________]

Email *
[_____________________]

Company name (optional)
[_____________________]

Tell me more about your project (optional)
[____________________________________________]
[____________________________________________]
[____________________________________________]

□ I agree to receive a quote via email (required)

[  Get My Free Quote  ]

```

**State saved**:
```

{
// ... previous state
contact: {
name: 'Sarah Thompson',
email: 'sarah@startup.com',
company: 'StartupXYZ',
additionalInfo: 'Healthcare product, need HIPAA compliance'
}
}

```

---

## Email Templates (Conditional on State)

### **Email to YOU** (Quote Request Notification):

**IF budgetMismatch = true** (Client's budget too low):

```

Subject: ⚠️ Quote Request: Budget Mismatch - SaaS Dashboard

Contact:

- Name: Sarah Thompson
- Email: sarah@startup.com
- Company: StartupXYZ

Project Details:

- Type: SaaS Dashboard
- Features: Auth, CRUD, Charts, Stripe, Email, Role Permissions (6 add-ons)
- Complexity: Medium
- Timeline: Standard (4-5 weeks)
- BUDGET: €2,000-€5,000 ⚠️
- ESTIMATED PRICE: €6,400 ⚠️
- MISMATCH: €1,400-€4,400 gap

Additional Info:
"Healthcare product, need HIPAA compliance"

───────────────────────────────────────────
ACTION REQUIRED:

1. Review scope vs. budget
2. Suggest:
    - Remove features (reduce to €5k)
    - Phased approach (MVP first)
    - Adjust timeline (flexible = -10%)

Respond within 24 hours: [Reply]
───────────────────────────────────────────

```

---

**IF budgetMismatch = false** (Budget aligns):

```

Subject: ✓ Quote Request: SaaS Dashboard - €6,400

Contact:

- Name: Sarah Thompson
- Email: sarah@startup.com
- Company: StartupXYZ

Project Details:

- Type: SaaS Dashboard
- Features: Auth, CRUD, Charts, Stripe, Email, Role Permissions
- Complexity: Medium
- Timeline: Standard (4-5 weeks)
- Budget: €5,000-€15,000 ✓
- Estimated Price: €6,400
- Estimated Delivery: Dec 23, 2025

Additional Info:
"Healthcare product, need HIPAA compliance"

───────────────────────────────────────────
ACTION:

1. Send detailed proposal within 24h
2. Include HIPAA compliance notes
3. Suggest 30-min discovery call

Respond: [Reply to sarah@startup.com]
───────────────────────────────────────────

```

---

### **Email to CLIENT** (Confirmation):

**Immediate auto-reply after form submission**:

```

Subject: Quote Request Received - I'll respond within 24 hours

Hi Sarah,

Thanks for your interest! I've received your quote request.

PROJECT SUMMARY:
─────────────────────────────────────────
Type: SaaS Dashboard
Estimated Cost: €6,400
Timeline: 4-5 weeks
Estimated Delivery: December 23, 2025

Selected Features:
✓ User authentication
✓ CRUD operations
✓ Data tables
✓ Charts \& visualization
✓ Role-based permissions
✓ Stripe integration
✓ Email notifications

─────────────────────────────────────────

NEXT STEPS:

1. I'll review your project in detail
2. You'll receive a comprehensive proposal within 24 hours
3. We can schedule a 30-min call to discuss specifics

Questions in the meantime? Just reply to this email.

Best,
Daniel Ilieș
Full-Stack Developer
Vue.js · Node.js · Go

📧 daniel@ilies.dev
💼 linkedin.com/in/daniel-ilies
🌐 danielilies.dev

```

---

## Complete Price Calculation Formula

```

// Step 1: Base price
const basePrice = {
'landing': 1500,
'dashboard': 4500,
'api': 3000,
'mvp': 12000
}[projectType]

// Step 2: Feature add-ons (sum of selected optional features)
const featureAddOns = selectedFeatures
.filter(f => !f.isBase)
.reduce((sum, f) => sum + f.price, 0)

// Step 3: Complexity multiplier
const complexityMultiplier = {
'simple': 0.8,
'medium': 1.0,
'complex': 1.4
}[complexity]

// Step 4: Timeline multiplier
const timelineMultiplier = {
'rush': 1.2,
'standard': 1.0,
'flexible': 0.9,
'not-sure': 1.0,
'extended': 0.85 // Only for MVP
}[timeline]

// Final calculation
const finalPrice = Math.round(
(basePrice + featureAddOns) * complexityMultiplier * timelineMultiplier
)

// Round to nearest €50
const roundedPrice = Math.round(finalPrice / 50) * 50

```

**Example walkthrough**:

```

// Inputs:
projectType = 'dashboard'
selectedFeatures = ['stripe', 'email', 'role-permissions'] // €900 + €400 + €600
complexity = 'medium'
timeline = 'standard'

// Calculation:
basePrice = 4500
featureAddOns = 900 + 400 + 600 = 1900
subtotal = 4500 + 1900 = 6400
complexityMultiplier = 1.0
timelineMultiplier = 1.0

finalPrice = 6400 * 1.0 * 1.0 = 6400
roundedPrice = Math.round(6400 / 50) * 50 = 6400

// Output: €6,400

```

---

## Validation Rules (Per Step)

### Step 1 Validation:
```

{
projectType: {
required: true,
errorMessage: "Please select a project type"
}
}

```

### Step 2 Validation:
```

{
features: {
required: true,
minSelected: 0, // Base features auto-selected
errorMessage: "Base features are included, select add-ons if needed"
}
}

```

### Step 3 Validation:
```

{
complexity: {
required: true,
errorMessage: "Please select project complexity"
}
}

```

### Step 4 Validation:
```

{
timeline: {
required: false, // Can skip
allowSkip: true,
defaultIfSkipped: 'standard'
}
}

```

### Step 5 Validation:
```

{
budget: {
required: false, // Can skip
allowSkip: true,
warningIfMismatch: true
}
}

```

### Step 6 Validation:
```

{
name: {
required: true,
minLength: 2,
errorMessage: "Please enter your name"
},
email: {
required: true,
pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+\$/,
errorMessage: "Please enter a valid email"
},
company: {
required: false
},
additionalInfo: {
required: false,
maxLength: 500
},
agreeToTerms: {
required: true,
errorMessage: "Please agree to receive a quote"
}
}

```

---

## State Management Structure (Vue.js/Pinia)

```

// store/quoteBuilder.js
import { defineStore } from 'pinia'

export const useQuoteStore = defineStore('quote', {
state: () => ({
currentStep: 1,

    // Step 1
    projectType: null,
    basePrice: 0,
    baseTimeline: { min: 0, max: 0 },
    
    // Step 2
    selectedFeatures: [],
    featureAddOns: 0,
    
    // Step 3
    complexity: 'medium',
    complexityMultiplier: 1.0,
    
    // Step 4
    timeline: 'standard',
    timelineMultiplier: 1.0,
    estimatedWeeks: { min: 0, max: 0 },
    estimatedDelivery: null,
    
    // Step 5
    budgetRange: null,
    budgetMismatch: false,
    
    // Step 6
    contact: {
      name: '',
      email: '',
      company: '',
      additionalInfo: ''
    },
    
    // Calculated
    finalPrice: 0
    }),

getters: {
subtotalBeforeComplexity: (state) => state.basePrice + state.featureAddOns,

    priceAfterComplexity: (state) => 
      (state.basePrice + state.featureAddOns) * state.complexityMultiplier,
    
    priceAfterTimeline: (state) =>
      (state.basePrice + state.featureAddOns) * 
      state.complexityMultiplier * 
      state.timelineMultiplier,
    
    roundedFinalPrice: (state) => 
      Math.round(state.finalPrice / 50) * 50
    },

actions: {
updateProjectType(type) {
this.projectType = type
this.basePrice = PROJECT_PRICES[type]
this.baseTimeline = BASE_TIMELINES[type]
this.selectedFeatures = [] // Reset features when project type changes
this.calculatePrice()
},

    toggleFeature(feature) {
      const index = this.selectedFeatures.findIndex(f => f.id === feature.id)
      if (index > -1) {
        this.selectedFeatures.splice(index, 1)
      } else {
        this.selectedFeatures.push(feature)
      }
      this.featureAddOns = this.selectedFeatures
        .filter(f => !f.isBase)
        .reduce((sum, f) => sum + f.price, 0)
      this.calculatePrice()
    },
    
    updateComplexity(complexity) {
      this.complexity = complexity
      this.complexityMultiplier = COMPLEXITY_MULTIPLIERS[complexity]
      this.updateTimeline() // Recalculate timeline options
      this.calculatePrice()
    },
    
    updateTimeline(timeline = 'standard') {
      this.timeline = timeline
      this.timelineMultiplier = TIMELINE_MULTIPLIERS[timeline]
      
      // Calculate estimated delivery
      const weeks = this.estimatedWeeks.max
      this.estimatedDelivery = addWeeks(new Date(), weeks)
      
      this.calculatePrice()
    },
    
    updateBudget(range) {
      this.budgetRange = range
      
      // Check for mismatch
      const [min, max] = range.split('-').map(Number)
      this.budgetMismatch = this.roundedFinalPrice > max
    },
    
    calculatePrice() {
      this.finalPrice = 
        (this.basePrice + this.featureAddOns) * 
        this.complexityMultiplier * 
        this.timelineMultiplier
    },
    
    nextStep() {
      if (this.currentStep < 6) this.currentStep++
    },
    
    prevStep() {
      if (this.currentStep > 1) this.currentStep--
    },
    
    async submitQuote() {
      // Send to backend/email service
      const payload = {
        projectType: this.projectType,
        features: this.selectedFeatures.map(f => f.id),
        complexity: this.complexity,
        timeline: this.timeline,
        budget: this.budgetRange,
        contact: this.contact,
        calculatedPrice: this.roundedFinalPrice,
        estimatedDelivery: this.estimatedDelivery
      }
      
      // POST to /api/quotes or send via EmailJS
      return await submitQuoteRequest(payload)
    }
    }
})

```

---

## Mobile Responsiveness Rules

### Breakpoints:
```

/* Mobile: < 640px */

- Single column layout
- Cards stack vertically
- Pricing display: sticky bottom bar
- Progress: simplified to "Step X of 6"

/* Tablet: 640px - 1024px */

- 2-column grid for feature checkboxes
- Pricing cards: 2 columns (Starter + Professional, then Enterprise below)

/* Desktop: > 1024px */

- 3-column grid for pricing cards
- Feature checkboxes: 3 columns
- Pricing display: sticky right sidebar

```

---

## Accessibility Checklist

- ✅ Keyboard navigation (Tab, Enter, Arrow keys)
- ✅ Screen reader labels (ARIA)
- ✅ Focus indicators (visible outlines)
- ✅ Error messages (clear, specific)
- ✅ Color contrast (WCAG AA minimum)
- ✅ Skip links ("Skip to Step 6")
- ✅ Form field labels (explicit association)

---

## Analytics Events to Track

```

// Track these events with Google Analytics / Plausible

// Step progression
trackEvent('quote_step_1_project_type', { type: 'dashboard' })
trackEvent('quote_step_2_features', { count: 3 })
trackEvent('quote_step_3_complexity', { level: 'medium' })
trackEvent('quote_step_4_timeline', { choice: 'standard' })
trackEvent('quote_step_5_budget', { range: '5000-15000', mismatch: false })
trackEvent('quote_step_6_submit', { finalPrice: 6400 })

// Abandonment
trackEvent('quote_abandoned', { step: 3, price: 6400 })

// Conversion
trackEvent('quote_completed', {
projectType: 'dashboard',
finalPrice: 6400,
timeline: 'standard'
})

```

---

## Testing Scenarios

### Scenario 1: Simple Landing Page
```

Step 1: Landing Page (€1,500)
Step 2: +Custom animations (€300)
Step 3: Simple (×0.8)
Step 4: Standard (×1.0)
Step 5: €1,000-€2,000 (matches)
Final: (1500 + 300) × 0.8 × 1.0 = €1,440

```

### Scenario 2: Complex SaaS Dashboard
```

Step 1: SaaS Dashboard (€4,500)
Step 2: +Stripe (€900) +Email (€400) +Real-time (€1,000) +Multi-tenant (€1,500)
Step 3: Complex (×1.4) [auto-selected due to multi-tenant]
Step 4: Rush (×1.2)
Step 5: €5,000-€15,000
Final: (4500 + 2800) × 1.4 × 1.2 = €12,264 → rounded to €12,250

```

### Scenario 3: Full MVP with Budget Mismatch
```

Step 1: Full MVP (€12,000)
Step 2: +Admin dashboard (€2,500) +Payments (€1,500)
Step 3: Medium (×1.0)
Step 4: Flexible (×0.9)
Step 5: €5,000-€15,000 ⚠️ Mismatch!
Final: (12000 + 4000) × 1.0 × 0.9 = €14,400
Mismatch: €14,400 > €15,000 (slightly over, suggest removing features)

```

---

## Success Metrics (Goals)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Completion rate** | >70% | Visitors who start → complete Step 6 |
| **Average time** | 3-5 minutes | Time from Step 1 → Submit |
| **Step 3 drop-off** | <15% | Most common abandonment point |
| **Budget alignment** | >60% | % of quotes where budget ≈ calculated price |
| **Quote → Client** | >20% | % of quotes that become paying clients |

---

## Implementation Priority

### Week 1 (MVP):
1. Steps 1, 3, 6 (project type, complexity, contact)
2. Static price display (no dynamic calculation)
3. Basic email submission

### Week 2 (Core Features):
4. Step 2 (conditional feature lists)
5. Dynamic price calculation
6. Step 4 (timeline with conditional options)

### Week 3 (Polish):
7. Step 5 (budget with mismatch detection)
8. Progress indicator
9. Abandonment recovery
10. Mobile optimization

### Week 4 (Advanced):
11. Email templates (conditional)
12. Analytics tracking
13. A/B testing setup
14. Performance optimization

---

**Document Complete**  
**Total Steps**: 6 (4 required, 2 optional)  
**Average Completion Time**: 3-5 minutes  
**Expected Conversion Rate**: 15-25% (visitor → quote submission)  

**Next Step**: Build Step 1 (Project Type) + basic state management → test → iterate