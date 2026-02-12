import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Layers,
  ArrowUpDown,
  X,
  ExternalLink,
  FileText,
  Tag,
  LayoutGrid,
  ChevronLeft,
  ClipboardList,
  Clock,
  DollarSign,
  Shapes,
  Award,
  CheckCircle2,
  CircleDashed,
  GraduationCap,
} from "lucide-react";

/**
 * Category-first portfolio site (single file)
 * - Home shows ONLY category tiles (10 categories)
 * - Clicking a category opens the projects inside it (search/sort/tag filter)
 * - Project tile opens a detail modal with outcomes and tech and suggested artifacts
 * - Responsibilities section (Scope / Time / Cost / Agile & SAFe) with drill-down
 * - Featured case study tile (PTT dashboard)
 * - Light aqua theme
 */

const OWNER = {
  name: "Shubhangi Nikam",
  title: "Technical Program / Product Delivery | Data, Cloud, Modernization",
  location: "Jersey City, NJ / New York, NY",
  email: "nikamshubhangi101@gmail.com",
  linkedin: "https://www.linkedin.com/in/shubhangi-nikam/",
  // If you don't want to host your resume (since you customize it per role), leave this as null.
  resumeUrl: null,
};

const EDUCATION = [
  {
    key: "mscs",
    degree: "M.S. in Computer Science",
    school: "SUNY Binghamton",
    status: "Graduated",
    highlights: ["Coursework: AI, Data Mining, Databases"],
  },
  {
    key: "be_ce",
    degree: "B.E. in Computer Engineering",
    school: "Savitribai Phule Pune University",
    status: "Completed",
    highlights: [],
  },
];

const CERTIFICATIONS = [
  {
    key: "csm",
    name: "Certified ScrumMaster (CSM)",
    status: "Active",
    issuer: "Scrum Alliance",
    icon: CheckCircle2,
  },
  {
    key: "safe",
    name: "SAFe® Agilist 5.1",
    status: "Active",
    issuer: "Scaled Agile, Inc.",
    icon: CheckCircle2,
  },
  {
    key: "az900",
    name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    status: "Active",
    issuer: "Microsoft",
    icon: CheckCircle2,
  },
  {
    key: "pmp",
    name: "PMP®",
    status: "In progress",
    issuer: "PMI",
    icon: CircleDashed,
  },
];


// ## 1) Define the categories & counts (sum to 70) ##
const CATEGORY_COUNTS = [
  { key: "cloud_mig", label: "Cloud Migration", count: 9 },
  { key: "ai", label: "AI Projects", count: 5 },
  { key: "lead_prog", label: "Modernization Program (Lead PM)", count: 1 },
  { key: "fin_dwh", label: "Financial Data Warehouse", count: 5 },
  { key: "ent_dwh", label: "Enterprise Data Warehousing", count: 5 },
  { key: "app_mod", label: "Application Modernization", count: 7 },
  { key: "testing", label: "Testing-only Efforts", count: 20 },
  { key: "easy_dev_dwh", label: "DWH Dev Apps (Quick Wins)", count: 12 },
  { key: "data_sep", label: "Data Separation", count: 3 },
  { key: "transform", label: "Transformation", count: 5 },
];

// ## 2) Default tags per category (edit freely) ##
const CATEGORY_TAGS = {
  fin_dwh: ["data", "dwh", "etl", "governance"],
  data_sep: ["data", "migration", "risk"],
  cloud_mig: ["cloud", "cutover", "dependencies"],
  ent_dwh: ["dwh", "stakeholders", "release"],
  app_mod: ["modernization", "architecture", "delivery"],
  transform: ["transformation", "process", "operating model"],
  ai: ["ai", "ml", "product"],
  testing: ["qa", "uat", "release"],
  lead_prog: ["program", "portfolio", "leadership"],
  easy_dev_dwh: ["data", "enhancement", "delivery"],
};

// --- Color system (professional + memorable) ---
// Principles:
// 1) Calm base (slate + white) for readability
// 2) One strong accent per category for fast scanning + recall
// 3) Soft background tints for depth without looking "loud"
const CATEGORY_STYLES = {
  cloud_mig: {
    name: "Cloud",
    accentGradient: "from-sky-600 to-cyan-600",
    border: "border-sky-200",
    softBg: "bg-sky-50",
    chip: "bg-sky-600 text-white",
    chipSoft: "bg-sky-50 text-sky-900 border-sky-200",
    headerGrad: "from-sky-50 to-white",
    dot: "bg-sky-600",
  },
  ai: {
    name: "AI",
    accentGradient: "from-violet-600 to-fuchsia-600",
    border: "border-violet-200",
    softBg: "bg-violet-50",
    chip: "bg-violet-600 text-white",
    chipSoft: "bg-violet-50 text-violet-900 border-violet-200",
    headerGrad: "from-violet-50 to-white",
    dot: "bg-violet-600",
  },
  lead_prog: {
    name: "Program",
    accentGradient: "from-amber-600 to-orange-600",
    border: "border-amber-200",
    softBg: "bg-amber-50",
    chip: "bg-amber-600 text-white",
    chipSoft: "bg-amber-50 text-amber-900 border-amber-200",
    headerGrad: "from-amber-50 to-white",
    dot: "bg-amber-600",
  },
  fin_dwh: {
    name: "Finance DWH",
    accentGradient: "from-emerald-600 to-teal-600",
    border: "border-emerald-200",
    softBg: "bg-emerald-50",
    chip: "bg-emerald-600 text-white",
    chipSoft: "bg-emerald-50 text-emerald-900 border-emerald-200",
    headerGrad: "from-emerald-50 to-white",
    dot: "bg-emerald-600",
  },
  ent_dwh: {
    name: "Enterprise DWH",
    accentGradient: "from-indigo-600 to-sky-600",
    border: "border-indigo-200",
    softBg: "bg-indigo-50",
    chip: "bg-indigo-600 text-white",
    chipSoft: "bg-indigo-50 text-indigo-900 border-indigo-200",
    headerGrad: "from-indigo-50 to-white",
    dot: "bg-indigo-600",
  },
  app_mod: {
    name: "App Mod",
    accentGradient: "from-rose-600 to-pink-600",
    border: "border-rose-200",
    softBg: "bg-rose-50",
    chip: "bg-rose-600 text-white",
    chipSoft: "bg-rose-50 text-rose-900 border-rose-200",
    headerGrad: "from-rose-50 to-white",
    dot: "bg-rose-600",
  },
  testing: {
    name: "Testing",
    accentGradient: "from-slate-700 to-zinc-700",
    border: "border-slate-200",
    softBg: "bg-slate-50",
    chip: "bg-slate-700 text-white",
    chipSoft: "bg-slate-50 text-slate-900 border-slate-200",
    headerGrad: "from-slate-50 to-white",
    dot: "bg-slate-700",
  },
  easy_dev_dwh: {
    name: "Quick Wins",
    accentGradient: "from-lime-600 to-emerald-600",
    border: "border-lime-200",
    softBg: "bg-lime-50",
    chip: "bg-lime-700 text-white",
    chipSoft: "bg-lime-50 text-lime-900 border-lime-200",
    headerGrad: "from-lime-50 to-white",
    dot: "bg-lime-700",
  },
  data_sep: {
    name: "Data Separation",
    accentGradient: "from-teal-600 to-cyan-600",
    border: "border-teal-200",
    softBg: "bg-teal-50",
    chip: "bg-teal-700 text-white",
    chipSoft: "bg-teal-50 text-teal-900 border-teal-200",
    headerGrad: "from-teal-50 to-white",
    dot: "bg-teal-700",
  },
  transform: {
    name: "Transformation",
    accentGradient: "from-orange-600 to-amber-600",
    border: "border-orange-200",
    softBg: "bg-orange-50",
    chip: "bg-orange-600 text-white",
    chipSoft: "bg-orange-50 text-orange-900 border-orange-200",
    headerGrad: "from-orange-50 to-white",
    dot: "bg-orange-600",
  },
};

function styleForCategory(categoryKey) {
  return CATEGORY_STYLES[categoryKey] ?? {
    accentGradient: "from-cyan-600 to-teal-600",
    border: "border-cyan-200",
    softBg: "bg-zinc-50",
    chip: "bg-zinc-900 text-white",
    chipSoft: "bg-cyan-50 text-zinc-900 border-cyan-200",
    headerGrad: "from-cyan-50 to-white",
    dot: "bg-zinc-700",
  };
}

// --- Small, memorable color coding for certifications & responsibilities ---
const CERT_STYLES = {
  csm: {
    accentGradient: "from-sky-600 to-cyan-600",
    border: "border-sky-200",
    softBg: "bg-sky-50",
    chip: "bg-sky-600 text-white",
  },
  safe: {
    accentGradient: "from-violet-600 to-fuchsia-600",
    border: "border-violet-200",
    softBg: "bg-violet-50",
    chip: "bg-violet-600 text-white",
  },
  az900: {
    accentGradient: "from-cyan-700 to-teal-600",
    border: "border-cyan-200",
    softBg: "bg-cyan-50",
    chip: "bg-cyan-700 text-white",
  },
  pmp: {
    accentGradient: "from-amber-600 to-orange-600",
    border: "border-amber-200",
    softBg: "bg-amber-50",
    chip: "bg-amber-600 text-white",
  },
};

function styleForCert(certKey) {
  return CERT_STYLES[certKey] ?? {
    accentGradient: "from-zinc-800 to-slate-700",
    border: "border-zinc-200",
    softBg: "bg-zinc-50",
    chip: "bg-zinc-900 text-white",
  };
}

const RESPONSIBILITY_STYLES = {
  scope: {
    accentGradient: "from-rose-500 to-pink-500",
    border: "border-rose-200",
    softBg: "bg-rose-50",
    chip: "bg-rose-700 text-white",
  },
  time: {
    accentGradient: "from-sky-500 to-cyan-500",
    border: "border-sky-200",
    softBg: "bg-sky-50",
    chip: "bg-sky-700 text-white",
  },
  cost: {
    accentGradient: "from-emerald-500 to-teal-500",
    border: "border-emerald-200",
    softBg: "bg-emerald-50",
    chip: "bg-emerald-700 text-white",
  },
  agile_safe: {
    accentGradient: "from-violet-500 to-fuchsia-500",
    border: "border-violet-200",
    softBg: "bg-violet-50",
    chip: "bg-violet-700 text-white",
  },
};


function styleForResponsibility(key) {
  return RESPONSIBILITY_STYLES[key] ?? {
    accentGradient: "from-zinc-800 to-slate-700",
    border: "border-zinc-200",
    softBg: "bg-zinc-50",
    chip: "bg-zinc-900 text-white",
  };
}

const CASE_STYLES = {
  ptt: {
    accentGradient: "from-sky-600 to-cyan-600",
    border: "border-sky-200",
    softBg: "bg-sky-50",
    chip: "bg-sky-600 text-white",
    chipSoft: "bg-sky-50 text-sky-900 border-sky-200",
    headerGrad: "from-sky-50 to-white",
    dot: "bg-sky-600",
  },
  pfm: {
    accentGradient: "from-violet-600 to-fuchsia-600",
    border: "border-violet-200",
    softBg: "bg-violet-50",
    chip: "bg-violet-600 text-white",
    chipSoft: "bg-violet-50 text-violet-900 border-violet-200",
    headerGrad: "from-violet-50 to-white",
    dot: "bg-violet-600",
  },
  stt: {
    accentGradient: "from-teal-600 to-cyan-600",
    border: "border-teal-200",
    softBg: "bg-teal-50",
    chip: "bg-teal-700 text-white",
    chipSoft: "bg-teal-50 text-teal-900 border-teal-200",
    headerGrad: "from-teal-50 to-white",
    dot: "bg-teal-700",
  },
  mom: {
    accentGradient: "from-emerald-600 to-teal-600",
    border: "border-emerald-200",
    softBg: "bg-emerald-50",
    chip: "bg-emerald-600 text-white",
    chipSoft: "bg-emerald-50 text-emerald-900 border-emerald-200",
    headerGrad: "from-emerald-50 to-white",
    dot: "bg-emerald-600",
  },
  franchise: {
    accentGradient: "from-amber-600 to-orange-600",
    border: "border-amber-200",
    softBg: "bg-amber-50",
    chip: "bg-amber-600 text-white",
    chipSoft: "bg-amber-50 text-amber-900 border-amber-200",
    headerGrad: "from-amber-50 to-white",
    dot: "bg-amber-600",
  },
};

function styleForCaseStudy(key) {
  return CASE_STYLES[key] ?? {
    accentGradient: "from-zinc-800 to-slate-700",
    border: "border-zinc-200",
    softBg: "bg-zinc-50",
    chip: "bg-zinc-900 text-white",
    chipSoft: "bg-zinc-50 text-zinc-900 border-zinc-200",
    headerGrad: "from-zinc-50 to-white",
    dot: "bg-zinc-700",
  };
}

// ## 2b) Curated cloud migration mini-case tiles (anonymized) ##
// 9 total: 5 Medium–Large, 4 Small–Medium (all with different timelines and distinct impact)
const CLOUD_MIG_PROJECTS = [
  {
    title: "Cloud Migration • Cutover Readiness (Wave 1)",
    size: "Medium–Large",
    duration: "14–18 weeks",
    summary:
      "Delivered a phased cutover plan for a migrated workload, aligning dependencies, change windows, and readiness gates across teams.",
    functions: [
      "Built dependency map and critical path for wave sequencing",
      "Owned cutover runbook, rollback plan, and go/no-go approvals",
      "Ran release readiness and coordination across Dev/QA/Ops",
      "Led hypercare schedule and stabilization triage post-cutover",
      "Standardized checklists to reduce execution variability",
    ],
    tech: ["AWS/Azure", "Cutover Plan", "CAB/Change", "Monitoring"],
    tags: ["cloud", "cutover", "runbook", "hypercare"],
    outcome:
      "Improved cutover predictability by standardizing go/no-go criteria and rollback runbooks.",
  },
  {
    title: "Cloud Migration • Data Pipeline Replatform",
    size: "Medium–Large",
    duration: "16–20 weeks",
    summary:
      "Replatformed a data pipeline to cloud services with validation gates to ensure data accuracy and stable downstream reporting.",
    functions: [
      "Coordinated pipeline redesign with engineering and data stakeholders",
      "Defined validation and reconciliation checks for accuracy",
      "Sequenced releases to reduce downstream reporting disruption",
      "Managed RAID and escalations and removed cross-team blockers",
      "Led post-migration monitoring and issue triage",
    ],
    tech: ["ETL", "Data Validation", "CI/CD", "Monitoring"],
    tags: ["cloud", "data", "validation", "dependencies"],
    outcome:
      "Improved integration testing effectiveness by adding reconciliation checkpoints and test-data readiness gates.",
  },
  {
    title: "Cloud Migration • Observability & Monitoring Rollout",
    size: "Small–Medium",
    duration: "6–8 weeks",
    summary:
      "Rolled out monitoring and alerting standards for migrated services to improve visibility and reduce mean-time-to-detect issues.",
    functions: [
      "Defined monitoring KPIs, alert thresholds, and dashboard views",
      "Coordinated rollout across services with minimal deployment risk",
      "Established incident response playbooks and on-call handoff",
      "Ran readiness reviews and validated alerts in pre-prod",
      "Captured retro learnings and updated runbooks",
    ],
    tech: ["Monitoring", "Dashboards", "Runbooks", "SLOs"],
    tags: ["cloud", "observability", "sla", "runbook"],
    outcome:
      "Reduced time-to-detect production issues by standardizing alerts and dashboards for migrated services.",
  },
  {
    title: "Cloud Migration • Performance Tuning & Latency Reduction",
    size: "Small–Medium",
    duration: "7–9 weeks",
    summary:
      "Post-migration performance hardening effort focused on latency, throughput, and stability under peak loads.",
    functions: [
      "Set performance success criteria and baseline measurements",
      "Coordinated load testing and bottleneck analysis",
      "Prioritized fixes and validated improvements with regression tests",
      "Aligned rollout plan and monitored post-release impact",
      "Documented tuning decisions for repeatability",
    ],
    tech: ["Performance Testing", "Monitoring", "Capacity", "Release Plan"],
    tags: ["cloud", "performance", "latency", "testing"],
    outcome:
      "Reduced latency by implementing performance gates and prioritizing high-impact tuning changes post-migration.",
  },
  {
    title: "Cloud Migration • IAM / Security Alignment",
    size: "Small–Medium",
    duration: "5–7 weeks",
    summary:
      "Aligned access controls and security approvals for a migrated workload, ensuring least-privilege access and audit-ready documentation.",
    functions: [
      "Mapped roles/permissions and aligned least-privilege access",
      "Coordinated security reviews and approval checkpoints",
      "Created audit-friendly artifacts (controls, evidence, decision log)",
      "Sequenced deployment changes to avoid downtime",
      "Validated access and monitored post-change stability",
    ],
    tech: ["Access Controls", "Security Reviews", "Audit Evidence", "Change Mgmt"],
    tags: ["cloud", "security", "audit", "approvals"],
    outcome:
      "Improved audit readiness by standardizing security evidence and access-control sign-offs for cloud releases.",
  },
  {
    title: "Cloud Migration • DR / Resilience Setup",
    size: "Medium–Large",
    duration: "12–16 weeks",
    summary:
      "Designed and executed a disaster recovery and resilience plan for cloud-hosted services with testing and operational handoff.",
    functions: [
      "Defined RTO/RPO targets and resilience requirements",
      "Coordinated DR design reviews and implementation sequencing",
      "Planned and executed DR test events with stakeholder sign-offs",
      "Created runbooks and handoff plan for operations",
      "Closed gaps through retros and corrective actions",
    ],
    tech: ["DR/BCP", "Runbooks", "Monitoring", "Change Mgmt"],
    tags: ["cloud", "dr", "resilience", "cutover"],
    outcome:
      "Improved resiliency by establishing DR runbooks and successfully validating recovery procedures in testing.",
  },
  {
    title: "Cloud Migration • Legacy Decommissioning",
    size: "Medium–Large",
    duration: "10–13 weeks",
    summary:
      "Decommissioned legacy components after migration by verifying dependencies, finalizing cutover proof, and coordinating clean shutdown.",
    functions: [
      "Confirmed dependency removal and validated migrated equivalents",
      "Coordinated final cutover verification and stakeholder approvals",
      "Executed decommission plan with rollback safeguards",
      "Updated documentation and operational references",
      "Tracked risks/issues and ensured clean closure",
    ],
    tech: ["Dependency Map", "Cutover Plan", "Validation", "Ops Handoff"],
    tags: ["cloud", "dependencies", "decommission", "validation"],
    outcome:
      "Reduced operational overhead by retiring legacy components after confirming dependency and cutover validation.",
  },
  {
    title: "Cloud Migration • Release Governance & CAB Acceleration",
    size: "Small–Medium",
    duration: "4–6 weeks",
    summary:
      "Streamlined release governance for cloud changes with clearer readiness criteria and faster approvals.",
    functions: [
      "Defined release readiness checklist and approval criteria",
      "Standardized CAB inputs (risk, rollback, validation evidence)",
      "Aligned stakeholders on go/no-go gates and escalation paths",
      "Reduced status churn via decision-oriented reporting",
      "Implemented retro actions to remove recurring bottlenecks",
    ],
    tech: ["CAB/Change", "Go/No-Go", "RAID", "Checklists"],
    tags: ["cloud", "approvals", "governance", "cutover"],
    outcome:
      "Improved migration time by reducing approval cycle time through a standardized CAB-ready release package.",
  },
  {
    title: "Cloud Migration • Post-Migration Stabilization (Hypercare)",
    size: "Medium–Large",
    duration: "8–11 weeks",
    summary:
      "Owned post-migration stabilization with structured hypercare, incident triage, and operational handoff for cloud-hosted services.",
    functions: [
      "Set hypercare plan, triage cadence, and severity criteria",
      "Coordinated incident response and root-cause follow-ups",
      "Prioritized fixes and tracked burn-down to closure",
      "Strengthened monitoring and updated runbooks",
      "Completed handoff with support/ops teams",
    ],
    tech: ["Monitoring", "Incident Triage", "Runbooks", "SLOs"],
    tags: ["cloud", "hypercare", "stability", "ops"],
    outcome:
      "Reduced repeat incidents by tightening hypercare triage rhythms and updating runbooks for operational handoff.",
  },
];

// ## 2c) Curated AI project mini-case tiles (anonymized) ##
// 5 total (matches AI Projects count)
const AI_PROJECTS = [
  {
    title: "AI Personal Finance Manager",
    size: "Medium–Large",
    duration: "10–14 weeks",
    summary:
      "Built a privacy-first finance insights app that categorizes transactions, visualizes trends, and generates summaries and forecasts.",
    functions: [
      "Designed transaction and category data model and ETL validation checks",
      "Implemented categorization logic and trend dashboards",
      "Added time-series forecasting for budgeting planning",
      "Generated NLP-style summaries explaining key drivers and changes",
      "Defined KPI views (variance-to-plan, savings insights) and iterated based on feedback",
    ],
    tech: ["Python", "SQLite", "ETL", "Time Series", "NLP"],
    tags: ["ai", "data", "etl", "forecasting"],
    outcome:
      "Improved budgeting accuracy by combining forecasts with variance-to-plan insights.",
  },
  {
    title: "Franchise Locator Application",
    size: "Small–Medium",
    duration: "5–7 weeks",
    summary:
      "Built a location search experience with map/list views and filters to help users find the right nearby location faster.",
    functions: [
      "Defined user flows: search → results → location details",
      "Implemented filtering (services, hours, open-now) and distance sorting",
      "Integrated location dataset and validation rules for accuracy",
      "Instrumented conversion events (call/directions/submit) for funnel visibility",
      "Optimized UX for faster completion (quick filters, clear cards)",
    ],
    tech: ["Search", "Maps", "UX", "Analytics"],
    tags: ["search", "filters", "integration", "ux"],
    outcome:
      "Improved user findability by reducing steps to reach the correct location using filters and open-now cues.",
  },
  {
    title: "Text Summarization Utility",
    size: "Small–Medium",
    duration: "4–6 weeks",
    summary:
      "Built a summarization tool that converts long text into concise bullet summaries with key themes and action points.",
    functions: [
      "Defined summary formats (exec summary, bullets, key takeaways)",
      "Added grounding checks to keep summaries aligned to source",
      "Implemented quality evaluation with representative sample inputs",
      "Created reusable templates for different audiences",
      "Added export formats for docs/email workflows",
    ],
    tech: ["NLP", "Prompting", "Templates", "Evaluation"],
    tags: ["summarization", "nlp", "templates", "quality"],
    outcome:
      "Reduced reading time by generating consistent executive summaries from long documents.",
  },
  {
    title: "Translation Model Prototype",
    size: "Medium–Large",
    duration: "8–12 weeks",
    summary:
      "Built a translation prototype with quality checks, terminology consistency, and evaluation to reduce translation errors.",
    functions: [
      "Defined target languages, use cases, and quality requirements",
      "Added terminology/phrase consistency rules for domain terms",
      "Created evaluation set and spot-check workflow for accuracy",
      "Iterated on outputs using feedback loops and error categorization",
      "Packaged results into exportable formats for downstream use",
    ],
    tech: ["NLP", "Evaluation", "Quality", "Workflow"],
    tags: ["translation", "nlp", "evaluation", "quality"],
    outcome:
      "Improved translation consistency by enforcing terminology rules and evaluation-driven iteration.",
  },
  {
    title: "Minutes of Meeting (MoM) Generator",
    size: "Small–Medium",
    duration: "5–8 weeks",
    summary:
      "Built a MoM generator that turns meeting text into structured notes with decisions, action items, owners, and due dates.",
    functions: [
      "Designed a MoM schema (topics, decisions, actions, owners, due dates)",
      "Implemented action-item extraction with a human-review step",
      "Added source-grounding checks to reduce hallucinations",
      "Built templates for standard and exec-summary outputs",
      "Enabled export to doc/email style formats",
    ],
    tech: ["NLP", "Templates", "Workflow", "Quality"],
    tags: ["summarization", "action items", "workflow", "templates"],
    outcome:
      "Improved meeting follow-through by standardizing action items and ownership in a consistent format.",
  },
];
// ## 2d) Modernization Program (Lead PM) • single program tile ##
const LEAD_PROGRAM = {
  title: "Application Modernization Program (Lead PM)",
  size: "Large",
  duration: "9–18 months",
  summary:
    "Owned an end-to-end application modernization program spanning 3 projects: driving roadmap, estimates, and release execution across 3 delivery teams while managing scope, time, and budget.",
  functions: [
    "Led a 3-project program and coordinated 3 cross-functional delivery teams end-to-end",
    "Managed and coached 3 application PMs; set operating rhythms, templates, and reporting standards",
    "Owned program scope, schedule, and budget; built forecasts, tracked variance, and drove approvals",
    "Created the program roadmap and integrated plan (milestones, dependencies, critical path)",
    "Led estimations (T-shirt sizing, bucket estimates), capacity planning, and release sequencing",
    "Owned release planning: cutover readiness, go/no-go gates, and post-release hypercare",
    "Ran governance: RAID, decision logs, exec readouts, and escalation paths to remove blockers",
  ],
  tech: ["Program Roadmap", "Jira", "SAFe / PI Planning", "Release Governance", "Budget Forecasting"],
  tags: ["program", "roadmap", "release", "budget"],
  outcome:
    "Delivered a 3-project modernization program with disciplined governance, predictable releases, and controlled budget/scope/time management.",
};

// ## 2e) Financial Data Warehouse • curated mini-case tiles (Amdocs and AT&T context) ##
// 5 total: mix of Medium–Large and Small–Medium, all with different timelines and distinct impact
const FIN_DWH_PROJECTS = [
  {
    title: "AT&T Finance DWH • Billing-to-GL Reconciliation Controls",
    size: "Medium–Large",
    duration: "12–16 weeks",
    summary:
      "For AT&T programs at Amdocs, delivered reconciliation controls between billing feeds and GL reporting layers to strengthen close confidence and reduce manual exception tracking.",
    functions: [
      "Partnered with finance stakeholders to define reconciliation rules (totals, variances, tolerances)",
      "Mapped source billing feeds to DWH/GL reporting structures and documented logic",
      "Coordinated ETL changes and dependency sequencing across upstream data providers",
      "Built exception views and sign-off workflow for controlled remediation",
      "Led UAT planning and defect triage through closure; packaged release evidence for audit readiness",
    ],
    tech: ["SQL", "ETL", "Reconciliation", "Data Quality", "Release Governance"],
    tags: ["att", "amdocs", "finance", "dwh", "recon"],
    outcome:
      "Improved month-end close readiness by increasing reconciliation traceability and exception visibility across billing → GL pipelines.",
  },
  {
    title: "AT&T Finance DWH • Revenue Assurance & Adjustments Mart",
    size: "Medium–Large",
    duration: "14–18 weeks",
    summary:
      "Built a governed finance mart to support revenue assurance use cases (adjustments, reversals, write-offs) with standardized definitions and validation gates.",
    functions: [
      "Aligned KPI definitions and calculation logic with business owners and documented data lineage",
      "Designed dimensional structures (facts/dims) to enable consistent reporting across segments",
      "Implemented ETL orchestration with dependency mapping for predictable refresh windows",
      "Added validation checkpoints (completeness, referential integrity, balance checks) before publish",
      "Coordinated release readiness, cutover checklist, and post-release monitoring with ops",
    ],
    tech: ["Dimensional Modeling", "SQL", "ETL", "Data Validation", "BI/Reporting"],
    tags: ["att", "amdocs", "revenue", "governance", "validation"],
    outcome:
      "Improved reporting consistency by standardizing revenue-related definitions and enforcing validation gates before downstream consumption.",
  },
  {
    title: "AT&T Finance DWH • A/R Aging & Collections Analytics Dataset",
    size: "Small–Medium",
    duration: "7–9 weeks",
    summary:
      "Delivered an A/R analytics dataset enabling faster aging, delinquency, and recovery trend reporting with optimized refresh and stakeholder-ready KPI slices.",
    functions: [
      "Defined KPI set (aging buckets, roll-rates, recoveries) and slicing dimensions with stakeholders",
      "Created curated tables/views optimized for dashboards and ad-hoc analysis",
      "Implemented incremental loads to reduce refresh time and improve reliability",
      "Validated edge cases and ensured sign-offs through structured UAT",
      "Published change notes and usage guidance to accelerate analyst adoption",
    ],
    tech: ["SQL", "ETL", "Data Modeling", "Performance Tuning"],
    tags: ["att", "amdocs", "ar", "collections", "analytics"],
    outcome:
      "Improved time-to-insight by reducing dataset refresh time and enabling consistent aging/collections KPI views.",
  },
  {
    title: "AT&T Finance DWH • Regulatory / Fees & Taxes Reporting Layer",
    size: "Small–Medium",
    duration: "5–7 weeks",
    summary:
      "Implemented a controlled reporting layer for fees/taxes style outputs with evidence artifacts to improve audit readiness and reduce recurring reporting defects.",
    functions: [
      "Defined business rules and validation checks aligned to reporting requirements",
      "Built exception reporting and ownership workflow for timely remediation",
      "Created runbooks, checklists, and control evidence templates for repeatable releases",
      "Ran defect triage with engineering and tracked remediation to closure",
      "Added monitoring thresholds for high-risk failures and regression scenarios",
    ],
    tech: ["Data Quality", "SQL", "Controls", "Monitoring", "Runbooks"],
    tags: ["att", "amdocs", "regulatory", "dq", "audit"],
    outcome:
      "Improved audit readiness by standardizing control evidence and introducing proactive data-quality monitoring for regulated outputs.",
  },
  {
    title: "AT&T Finance DWH • High-Volume ETL Stability & Runtime Optimization",
    size: "Medium–Large",
    duration: "9–12 weeks",
    summary:
      "Optimized high-volume ETL jobs supporting finance reporting windows by reducing bottlenecks, stabilizing failures, and improving run predictability.",
    functions: [
      "Baselined job runtimes/failure patterns and identified top bottlenecks",
      "Resequenced dependencies and introduced parallelization where safe",
      "Implemented performance fixes (partitioning, indexing, query tuning) and validated output parity",
      "Coordinated regression testing and rollout plan with clear go/no-go criteria",
      "Monitored post-release performance and captured retro actions for sustained stability",
    ],
    tech: ["ETL", "SQL", "Partitioning", "Query Tuning", "Release Plan"],
    tags: ["att", "amdocs", "etl", "optimization", "stability"],
    outcome:
      "Improved ETL predictability by reducing bottlenecks and stabilizing high-impact jobs supporting finance reporting windows.",
  },
];

// ## 2f) Enterprise Data Warehousing • curated mini-case tiles (Amdocs and AT&T context) ##
// 5 total: mix of Medium–Large and Small–Medium, all with different timelines and distinct impact
// 5 total: mix of Medium–Large and Small–Medium, all with different timelines and distinct impact
const ENT_DWH_PROJECTS = [
  {
    title: "AT&T Enterprise DWH • Customer 360 Dimensional Model",
    size: "Medium–Large",
    duration: "14–18 weeks",
    summary:
      "For AT&T programs at Amdocs, delivered an enterprise Customer 360 layer by aligning domain definitions and building governed dimensions for consistent analytics across teams.",
    functions: [
      "Aligned stakeholder definitions for customer/account identifiers and hierarchy rules",
      "Designed dimensional model (customer/account/product/service) to support reusable reporting",
      "Coordinated upstream feed mapping and change impacts across dependent consumers",
      "Defined data quality gates (uniqueness, validity, referential integrity) and reconciliation checks",
      "Led release readiness, UAT sign-offs, and post-release stabilization with clear runbooks",
    ],
    tech: ["Dimensional Modeling", "SQL", "ETL", "Data Governance", "DQ Gates"],
    tags: ["att", "amdocs", "enterprise", "dwh", "customer360"],
    outcome:
      "Improved cross-team reporting consistency by standardizing Customer 360 definitions and governed dimensions.",
  },
  {
    title: "AT&T Enterprise DWH • Master Data & Reference Harmonization",
    size: "Small–Medium",
    duration: "6–8 weeks",
    summary:
      "Harmonized reference/master data (codes, statuses, hierarchies) to reduce downstream mismatches and improve analytics reliability.",
    functions: [
      "Identified high-variance reference fields causing reporting conflicts",
      "Defined canonical mappings and stewardship workflow for changes",
      "Implemented validation checks and exception reporting for mismatched values",
      "Coordinated consumer updates and managed rollout sequencing to avoid breakages",
      "Documented lineage and change log and trained users on new standards",
    ],
    tech: ["SQL", "ETL", "Reference Data", "Validation", "Change Mgmt"],
    tags: ["att", "amdocs", "mdm", "reference", "governance"],
    outcome:
      "Reduced recurring reporting discrepancies by introducing canonical reference mappings and stewardship controls.",
  },
  {
    title: "AT&T Enterprise DWH • Enterprise ETL Orchestration & Dependency Map",
    size: "Medium–Large",
    duration: "10–13 weeks",
    summary:
      "Improved enterprise refresh predictability by mapping dependencies, sequencing jobs, and introducing readiness gates for critical datasets.",
    functions: [
      "Built an end-to-end dependency map across upstream feeds and downstream marts",
      "Resequenced ETL orchestration for critical path stability and predictable SLAs",
      "Introduced data readiness gates and publish criteria for high-impact tables",
      "Coordinated regression testing and aligned go/no-go approvals for releases",
      "Implemented monitoring thresholds and on-call handoff notes for operations",
    ],
    tech: ["ETL", "Orchestration", "Dependency Mgmt", "Monitoring", "Runbooks"],
    tags: ["att", "amdocs", "etl", "dependencies", "sla"],
    outcome:
      "Improved refresh reliability by sequencing enterprise ETL dependencies and enforcing publish readiness gates.",
  },
  {
    title: "AT&T Enterprise DWH • Data Access Segmentation & Controls",
    size: "Small–Medium",
    duration: "5–7 weeks",
    summary:
      "Implemented access segmentation and control evidence for sensitive datasets to strengthen compliance and simplify audit responses.",
    functions: [
      "Partnered with security/compliance to define access tiers and approval workflow",
      "Mapped datasets to role-based access rules and least-privilege principles",
      "Created audit evidence artifacts (access matrix, approvals, decision log)",
      "Validated access changes with UAT and coordinated rollout to minimize disruption",
      "Defined operational runbooks for access requests and periodic reviews",
    ],
    tech: ["Access Controls", "RBAC", "Audit Evidence", "Change Mgmt", "Runbooks"],
    tags: ["att", "amdocs", "security", "compliance", "access"],
    outcome:
      "Improved audit readiness by standardizing access controls and maintaining evidence for sensitive datasets.",
  },
  {
    title: "AT&T Enterprise DWH • Performance Hardening for High-Usage Dashboards",
    size: "Medium–Large",
    duration: "8–11 weeks",
    summary:
      "Optimized enterprise datasets to improve dashboard performance and reduce peak-time query bottlenecks without changing business logic.",
    functions: [
      "Baselined query patterns and identified top high-cost tables/views",
      "Applied performance improvements (partitioning, indexing, query tuning) with output parity checks",
      "Coordinated regression tests with analytics users and validated critical dashboards",
      "Sequenced releases and monitored post-deploy performance for sustained improvements",
      "Captured retro learnings and updated standards for future dataset design",
    ],
    tech: ["SQL", "Query Tuning", "Partitioning", "Indexing", "Regression Testing"],
    tags: ["att", "amdocs", "performance", "dashboards", "optimization"],
    outcome:
      "Improved dashboard responsiveness by tuning enterprise datasets and removing peak-time bottlenecks.",
  },
];

// ## 2g) Application Modernization • curated mini-case tiles (Telecom and Data and Cloud context) ##
// 7 total: telecom/enterprise apps, legacy modernization, data and cloud patterns; mix sizes and distinct timelines and distinct impact
const APP_MOD_PROJECTS = [
  {
    title: "AT&T App Modernization • Legacy Billing Adapter to API Layer",
    size: "Medium–Large",
    duration: "12–16 weeks",
    summary:
      "Modernized a legacy billing integration by introducing a governed API layer, improving reliability and simplifying downstream consumption for telecom workflows.",
    functions: [
      "Defined target interfaces and success metrics with business and engineering stakeholders",
      "Converted legacy integration patterns into versioned APIs with clear contracts",
      "Coordinated backwards compatibility and phased rollout to reduce cutover risk",
      "Ran integration/UAT readiness gates and defect triage through closure",
      "Published runbooks and support handoff notes for steady-state operations",
    ],
    tech: ["APIs", "Integration", "SDLC", "UAT", "Runbooks"],
    tags: ["att", "amdocs", "modernization", "api", "billing"],
    outcome:
      "Improved integration reliability by standardizing interfaces and enabling safer, phased cutovers.",
  },
  {
    title: "AT&T App Modernization • Order-to-Activation Workflow Refactor",
    size: "Medium–Large",
    duration: "14–18 weeks",
    summary:
      "Refactored a legacy order-to-activation workflow to reduce manual touchpoints and improve traceability across telecom provisioning steps.",
    functions: [
      "Mapped end-to-end workflow and identified high-friction steps and failure points",
      "Defined phased modernization plan with dependencies and release sequencing",
      "Coordinated engineering/QA workstreams and ensured acceptance criteria for each phase",
      "Introduced operational dashboards/checkpoints for workflow visibility",
      "Led go/no-go approvals and post-release stabilization with hypercare triage",
    ],
    tech: ["Workflow", "Backlog", "Observability", "Release Governance", "Hypercare"],
    tags: ["att", "amdocs", "modernization", "workflow", "provisioning"],
    outcome:
      "Improved operational traceability by adding workflow checkpoints and clearer failure triage paths.",
  },
  {
    title: "AT&T App Modernization • Legacy Batch Jobs to Incremental Processing",
    size: "Small–Medium",
    duration: "7–9 weeks",
    summary:
      "Modernized legacy batch-style processing into incremental runs to reduce processing windows and improve downstream freshness for telecom reporting.",
    functions: [
      "Identified processing bottlenecks and defined incremental load strategy",
      "Sequenced data dependencies and set publish readiness criteria",
      "Coordinated regression testing to ensure output parity",
      "Implemented monitoring thresholds and alerting runbooks",
      "Documented rollback plan and validated post-release stability",
    ],
    tech: ["Data Pipelines", "Monitoring", "Validation", "Runbooks"],
    tags: ["att", "amdocs", "modernization", "data", "batch"],
    outcome:
      "Improved data freshness by reducing processing windows via incremental execution and readiness gates.",
  },
  {
    title: "AT&T App Modernization • On-Prem Service to Cloud-Ready Deployment",
    size: "Medium–Large",
    duration: "10–14 weeks",
    summary:
      "Modernized a legacy on-prem service to be cloud-ready by improving deployability, configuration management, and release governance.",
    functions: [
      "Defined cloud-readiness checklist (config externalization, logging, health checks)",
      "Coordinated refactor work with engineering and validated deploy pipelines",
      "Established environment promotion steps and release readiness criteria",
      "Ran integration testing and ensured operational handoff with runbooks",
      "Led cutover planning and monitored post-deploy stability",
    ],
    tech: ["Cloud Readiness", "CI/CD", "Observability", "Release Plan"],
    tags: ["att", "amdocs", "modernization", "cloud", "release"],
    outcome:
      "Improved deployment predictability by standardizing release readiness and operational handoff for a cloud-ready service.",
  },
  {
    title: "AT&T App Modernization • Legacy UI Modernization for Ops Portal",
    size: "Small–Medium",
    duration: "6–8 weeks",
    summary:
      "Modernized an operations-facing portal experience by improving usability and adding role-based views for faster issue resolution.",
    functions: [
      "Gathered user feedback and defined UX improvements aligned to operational needs",
      "Coordinated UI changes and API dependencies with engineering",
      "Implemented role-based views and streamlined navigation",
      "Planned UAT and validated critical flows with ops users",
      "Published release notes and trained users on changes",
    ],
    tech: ["UX", "APIs", "UAT", "Release Notes"],
    tags: ["att", "amdocs", "modernization", "ops", "ui"],
    outcome:
      "Improved operational efficiency by reducing clicks and enabling role-based views for common tasks.",
  },
  {
    title: "AT&T App Modernization • Event/Message Integration Hardening",
    size: "Small–Medium",
    duration: "5–7 weeks",
    summary:
      "Hardened legacy message-based integrations by improving schema discipline, retry handling, and monitoring for telecom event flows.",
    functions: [
      "Defined event contract standards and validation checks",
      "Coordinated retry/error handling improvements and replay procedures",
      "Introduced monitoring dashboards and alert thresholds for critical topics",
      "Created incident playbooks and ownership paths for faster recovery",
      "Validated improvements through simulated failure scenarios",
    ],
    tech: ["Integration", "Monitoring", "Runbooks", "Validation"],
    tags: ["att", "amdocs", "modernization", "events", "reliability"],
    outcome:
      "Reduced repeat integration issues by standardizing event contracts and adding proactive monitoring/playbooks.",
  },
  {
    title: "AT&T App Modernization • Legacy Data Access Layer Re-architecture",
    size: "Medium–Large",
    duration: "8–12 weeks",
    summary:
      "Modernized a legacy data access layer to improve performance, stability, and change safety for high-usage telecom application flows.",
    functions: [
      "Baselined performance hotspots and identified high-impact query patterns",
      "Coordinated refactor plan with engineering while maintaining output parity",
      "Introduced migration-safe patterns (feature flags, phased rollout, rollback plan)",
      "Ran regression and performance validation gates before production rollout",
      "Monitored post-release performance and captured retro actions",
    ],
    tech: ["SQL", "Performance", "Feature Flags", "Regression Testing"],
    tags: ["att", "amdocs", "modernization", "data", "performance"],
    outcome:
      "Improved application stability by reducing performance hotspots and adding migration-safe rollout patterns.",
  },
];

// ## 2h) Data Separation • curated mini-case tiles (Amdocs and AT&T context) ##
// 3 total: anonymized, focused on boundary definition, quality controls, and dependency-safe reporting
const DATA_SEP_PROJECTS = [
  {
    title: "Data Separation • Enterprise Data Warehousing Boundary Split",
    size: "Medium–Large",
    duration: "10–14 weeks",
    summary:
      "Defined and executed a separation approach for enterprise data warehouse domains by clarifying ownership boundaries, sequencing migrations, and validating downstream continuity.",
    functions: [
      "Defined target-state boundaries and ownership model for separated datasets and consumers",
      "Built a sequencing plan with dependency map and publish readiness gates for each cutover",
      "Coordinated backfill approach and reconciliation checks to confirm parity and completeness",
      "Aligned access controls and approvals for the new data domains and consumers",
      "Led UAT sign-offs and stabilization plan to ensure reporting continuity after separation",
    ],
    tech: ["Data Migration", "Dependency Mgmt", "Reconciliation", "Access Controls"],
    tags: ["data", "migration", "governance", "validation"],
    outcome:
      "Improved data domain clarity and reduced cross-team ambiguity by separating ownership boundaries with controlled cutovers and validation gates.",
  },
  {
    title: "Data Separation • Quality Data Management Controls",
    size: "Small–Medium",
    duration: "6–8 weeks",
    summary:
      "Introduced data quality management for separated datasets by defining validation rules, exception workflows, and release evidence to improve trust in downstream analytics.",
    functions: [
      "Defined DQ rules (completeness, uniqueness, referential integrity) aligned to business consumption",
      "Implemented exception reporting and ownership workflow for remediation and sign-offs",
      "Created release evidence artifacts (checklists, decision log, validation results) for audit-ready delivery",
      "Coordinated regression and UAT validation to confirm no breakage in downstream consumers",
      "Monitored post-release stability and prioritized corrective actions through hypercare",
    ],
    tech: ["Data Quality", "Validation", "Monitoring", "Release Governance"],
    tags: ["quality", "data", "controls", "release"],
    outcome:
      "Improved analytics reliability by enforcing repeatable data quality gates and structured exception ownership.",
  },
  {
    title: "Data Separation • Reporting Layer with 13 Upstream Dependencies",
    size: "Medium–Large",
    duration: "12–16 weeks",
    summary:
      "Delivered a dependency-safe reporting layer that required coordination across 13 upstream application feeds, ensuring stable refresh windows and consistent KPI definitions after separation.",
    functions: [
      "Mapped 13 upstream feeds, refresh windows, and failure modes into a single dependency plan",
      "Defined publish readiness criteria and fallback handling for late or incomplete upstream deliveries",
      "Coordinated integration testing and reconciliation checks across feeds before publish",
      "Standardized KPI definitions and documentation to reduce interpretation drift across consumers",
      "Led go/no-go approvals, cutover communications, and post-release stabilization triage",
    ],
    tech: ["Dependency Mgmt", "Integration Testing", "Reconciliation", "Reporting"],
    tags: ["reporting", "dependencies", "integration", "validation"],
    outcome:
      "Improved reporting stability by sequencing 13 upstream dependencies and enforcing publish readiness gates to prevent incomplete refreshes.",
  },
];

// ## 2i) Transformation • curated mini-case tiles (Amdocs and AT&T context) ##
// 5 total: transformation efforts that pull from modernization and data separation workstreams, each with a distinct timeline and one clear impact.
const TRANSFORM_PROJECTS = [
  {
    title: "Transformation • Modernization Delivery Operating Model",
    size: "Medium–Large",
    duration: "10–14 weeks",
    summary:
      "Introduced a repeatable delivery operating model used across application modernization waves to improve execution predictability and reduce status churn.",
    functions: [
      "Standardized governance artifacts (RAID, decision log, dependency tracker) across modernization teams",
      "Defined delivery cadences (weekly exec updates, risk reviews, readiness gates) and ownership paths",
      "Aligned success metrics for delivery health (schedule confidence, risk burn-down, blocker aging)",
      "Created a release readiness checklist and go/no-go criteria to reduce last-minute surprises",
      "Trained PMs and team leads on the operating rhythm and documentation standards",
    ],
    tech: ["Governance", "RAID", "Dependency Mgmt", "Release Readiness"],
    tags: ["transformation", "modernization", "governance", "operating model"],
    outcome:
      "Improved delivery predictability by introducing standardized governance and readiness gates across modernization releases.",
  },
  {
    title: "Transformation • Data Separation Execution Playbook",
    size: "Small–Medium",
    duration: "6–8 weeks",
    summary:
      "Created a separation execution playbook to support multiple separation cutovers with consistent sequencing, validation, and approval workflows.",
    functions: [
      "Defined a separation checklist: boundary confirmation, access approvals, validation gates, and rollback readiness",
      "Built a dependency mapping and publish readiness template for upstream and downstream alignment",
      "Implemented a defect and exception triage approach for separation-related issues during hypercare",
      "Aligned stakeholders on communications plan and cutover decision checkpoints",
      "Captured retro actions and updated the playbook for reuse in future cutovers",
    ],
    tech: ["Playbook", "Validation", "Approvals", "Hypercare"],
    tags: ["transformation", "data", "separation", "execution"],
    outcome:
      "Reduced cutover variability by standardizing separation sequencing, validation, and approval workflows.",
  },
  {
    title: "Transformation • Release Governance and Approval Acceleration",
    size: "Small–Medium",
    duration: "5–7 weeks",
    summary:
      "Streamlined release governance for telecom data and application changes by clarifying inputs, evidence requirements, and decision ownership.",
    functions: [
      "Defined a release package template: risks, rollback, validation evidence, and stakeholder sign-offs",
      "Aligned teams on decision ownership and escalation paths to reduce rework",
      "Introduced a readiness review cadence to surface gaps earlier",
      "Partnered with QA and ops for pre-release checks and post-release handoff notes",
      "Implemented retro-driven improvements to remove recurring approval bottlenecks",
    ],
    tech: ["Go/No-Go", "Approvals", "Release Package", "Change Mgmt"],
    tags: ["transformation", "release", "approvals", "governance"],
    outcome:
      "Improved cycle time for approvals by using a standardized release package and clear decision ownership.",
  },
  {
    title: "Transformation • Quality Gates for Modernized Integrations",
    size: "Medium–Large",
    duration: "8–11 weeks",
    summary:
      "Implemented quality gates and validation checkpoints for modernized integrations and reporting layers to reduce defects and stabilize releases.",
    functions: [
      "Defined integration quality gates: contract validation, regression coverage, and reconciliation checks",
      "Coordinated test data readiness and environment alignment across dependent systems",
      "Established defect triage criteria and a closure workflow tied to release readiness",
      "Introduced monitoring thresholds and runbook updates for production support",
      "Ran retrospectives and folded learnings into updated testing and readiness templates",
    ],
    tech: ["Integration Testing", "Validation", "Defect Triage", "Monitoring"],
    tags: ["transformation", "quality", "modernization", "testing"],
    outcome:
      "Reduced release risk by enforcing repeatable quality gates and validation checkpoints for modernized integrations.",
  },
  {
    title: "Transformation • KPI and Reporting Standardization",
    size: "Medium–Large",
    duration: "9–12 weeks",
    summary:
      "Standardized KPI definitions and reporting documentation across enterprise data warehousing and separation consumers to improve consistency and reduce interpretation drift.",
    functions: [
      "Aligned KPI definitions, calculation logic, and slicing dimensions with stakeholders",
      "Created a documentation standard for lineage, refresh rules, and ownership",
      "Implemented sign-off checkpoints for KPI changes and downstream impacts",
      "Coordinated rollout and communication plan to analysts and consuming teams",
      "Established a feedback loop to triage issues and prioritize refinements",
    ],
    tech: ["KPI Governance", "Documentation", "Data Lineage", "Stakeholder Mgmt"],
    tags: ["transformation", "kpi", "reporting", "governance"],
    outcome:
      "Improved reporting consistency by standardizing KPI definitions and enforcing controlled change sign-offs.",
  },
];

// ## 3) Responsibilities (Scope / Time / Cost / Agile & SAFe) ## (Scope / Time / Cost / Agile & SAFe) ##
const RESPONSIBILITIES = {
  scope: {
    title: "Scope",
    icon: Shapes,
    subtitle: "Charters, requirements, artifacts, delivery ownership",
    bullets: [
      "Handled end-to-end delivery from project charter → planning → execution → release → post-deployment support/hypercare.",
      "Defined scope, goals, success metrics, and acceptance criteria with business and engineering stakeholders.",
      "Owned requirements lifecycle: intake → clarification → prioritization → backlog/user stories → sign-offs.",
      "Created project charters, RACI, RAID logs, decision logs, and governance artifacts to improve execution clarity.",
      "Built and maintained milestone plans, dependency maps, and change control (scope change assessments and approvals).",
      "Managed cross-functional alignment across Product, Engineering, QA, Data, Security, and Operations.",
      "Drove risk identification, mitigation plans, and escalation paths with crisp communication.",
      "Produced process-improvement artifacts (SOPs, runbooks, checklists) and standardized templates across teams.",
      "Led stakeholder communications: weekly updates, steering committee readouts, and executive summaries.",
      "Trained team members and junior PMs on execution rhythms, documentation standards, and delivery best practices.",
    ],
  },
  time: {
    title: "Time",
    icon: Clock,
    subtitle: "Timeline planning, approvals, release planning",
    bullets: [
      "Built end-to-end timelines with milestones, critical path, and dependency sequencing (incl. external teams/vendors).",
      "Owned schedule approvals and managed timeline trade-offs across scope, resourcing, and risk constraints.",
      "Created release plans (cutover plans where applicable), calendar alignment, and readiness checklists.",
      "Coordinated change windows, freeze periods, CAB/change approvals, and go/no-go decision checkpoints.",
      "Led day-to-day execution: standups, blockers removal, burn-down tracking, and delivery predictability.",
      "Maintained integrated plans across multiple workstreams and ensured alignment to program/portfolio milestones.",
      "Ran post-release hypercare schedules and incident triage collaboration for stabilization.",
      "Defined service level expectations and operational handoff timelines with support/ops teams.",
    ],
  },
  cost: {
    title: "Cost",
    icon: DollarSign,
    subtitle: "Estimates, forecasts, sizing, approvals",
    bullets: [
      "Owned effort estimates and delivery forecasts using T-shirt sizing, bucket estimates, and sprint capacity planning.",
      "Created cost/effort projections and supported approvals for funding, resourcing, or vendor engagements.",
      "Tracked delivery costs vs. plan; surfaced variances early and proposed corrective actions.",
      "Aligned scope and delivery approach to budget constraints (phased delivery, MVP slicing, de-scoping).",
      "Partnered with engineering leads to translate estimates into delivery plans and release sequencing.",
      "Maintained vendor coordination inputs for timelines/costs (where applicable) and ensured accountability to commitments.",
    ],
  },
  agile_safe: {
    title: "Agile & SAFe",
    icon: ClipboardList,
    subtitle: "PI planning, sprints, ceremonies, continuous improvement",
    bullets: [
      "Led Agile delivery: sprint planning, daily standups, backlog refinement, demos, and retrospectives.",
      "Supported SAFe execution: PI planning prep, dependency alignment, ART/Program-level coordination, and PI objectives tracking.",
      "Partnered with Product Owners and engineering managers to prioritize backlogs and sequence work for maximum value.",
      "Established team operating rhythms and improved throughput by removing blockers and clarifying dependencies.",
      "Tracked delivery health using Jira/Confluence (or equivalent): burndown, velocity trends, and risk/issue logs.",
      "Drove continuous improvement: post-mortems, retro action items, and process updates to prevent repeat issues.",
    ],
  },
};

// ## 3b) Featured case study tile (PTT) ##
const FEATURED_CASE_STUDIES = [
  {
    key: "ptt",
    typeLabel: "Product / Dashboard",
    badge: "PTT",
    title: "Project Tracking Tool (PTT)",
    subtitle: "Project Management Dashboard for AT&T programs (Amdocs)",
    tags: ["Product vision", "Roadmap", "Jira", "Figma", "Compliance", "Agile"],
    bullets: [
      "At Amdocs, I owned the product vision for a Project Management Dashboard built for AT&T programs. The goal was to reduce manual reporting, improve audit readiness, and give 40+ program managers real-time project visibility.",
      "Aligned the vision with business needs through interviews, feedback sessions, and competitive analysis, surfacing key themes like reporting accuracy, risk visibility, and efficiency.",
      "Created a phased roadmap, prioritizing features by business value and compliance need, and broke them into actionable user stories in Jira with supporting wireframes in Figma.",
      "Worked cross-functionally with engineering, legal, and compliance teams, running Agile ceremonies and managing dependencies through weekly check-ins and go/no-go approvals.",
      "The result was a dashboard that saved 500+ hours annually, gave leadership clear graphical visibility into project health, and passed compliance audits with zero findings•reinforcing my belief that strong delivery comes from structured prioritization, user empathy, and cross-team collaboration.",
    ],
    impact: [
      "500+ hours saved annually",
      "Real-time visibility for 40+ program managers",
      "Passed compliance audits with zero findings",
    ],
    artifacts: [
      "Phased roadmap (redacted)",
      "Jira epics and user stories (redacted)",
      "Figma wireframes (redacted)",
      "Dashboard KPI views (redacted)",
      "Audit readiness checklist",
    ],
    confidentiality: "Client and internal details are anonymized/redacted.",
  },
  {
    key: "pfm",
    typeLabel: "AI / Data Product",
    badge: "AI",
    title: "AI Personal Finance Manager",
    subtitle: "Privacy-first budgeting, insights, and forecasting (personal project)",
    tags: ["Python", "Time series", "Prophet/arima", "Etl", "NLP summaries", "dashboards"],
    bullets: [
      "Built a privacy-first personal finance manager to categorize spending, visualize trends, and generate weekly/monthly insights from transaction history.",
      "Designed a clean data model (accounts, merchants, categories, transactions) with validation/ETL checks (missing values, out-of-range, timestamp normalization).",
      "Implemented forecasting for spend and cashflow using time-series approaches (e.g., Prophet/ARIMA-style models) to support budgeting and savings planning.",
      "Added optional goal tracking and budget rules (alerts, variance vs plan) to turn insights into actions.",
      "Generated natural-language summaries (NLP) that explain “what changed”, key drivers, and suggested next steps•without exposing sensitive data.",
    ],
    impact: [
      "Reduced manual effort to understand monthly spend patterns",
      "Enabled budgeting with forecasts and variance-to-plan views",
      "Designed to keep data local/private by default",
    ],
    artifacts: [
      "Data schema (ERD) and sample dataset (redacted)",
      "ETL validation checklist",
      "Forecasting notebook/report",
      "Dashboard screenshots (spend by category, trends)",
      "Sample NLP-generated monthly summary (redacted)",
    ],
    confidentiality: "Uses personal data patterns; any examples should be synthetic/redacted.",
  },
  {
    key: "stt",
    typeLabel: "AI / Speech",
    badge: "STT",
    title: "Speech-to-Text Converter",
    subtitle: "Audio transcription with timestamps, speaker cues, and exportable outputs",
    tags: ["Speech", "Transcription", "Python", "API integration", "QA", "Privacy"],
    bullets: [
      "Built a speech-to-text converter to transcribe audio into readable, searchable text with timestamps.",
      "Designed an ingestion flow for common audio formats with validation and basic noise/quality checks.",
      "Added lightweight post-processing to improve readability (punctuation, paragraphing) and support optional speaker cues.",
      "Created export formats (TXT/JSON) to enable downstream use in notes, search, and analytics.",
      "Defined evaluation checks (WER-style spot checks, edge cases) and a feedback loop to improve transcription quality.",
    ],
    impact: [
      "Reduced manual note-taking time by converting audio to structured text",
      "Improved reusability via timestamped, export-friendly transcripts",
      "Designed with privacy in mind (redacted/synthetic demo data)",
    ],
    artifacts: [
      "Flow diagram (ingest → transcribe → post-process → export)",
      "Sample timestamped transcript (synthetic)",
      "Quality checklist and edge-case test set",
      "Export schema (JSON)",
      "UI mock (optional)",
    ],
    confidentiality: "Audio content should be synthetic or permissioned; transcripts shared as redacted samples.",
  },
  {
    key: "mom",
    typeLabel: "Productivity / AI",
    badge: "MoM",
    title: "Minutes of Meeting (MoM) Generator",
    subtitle: "Turns transcripts into structured MoM with action items, owners, and due dates",
    tags: ["Summarization", "Action items", "NLP", "Templates", "Workflow", "Collaboration"],
    bullets: [
      "Built an application that converts meeting transcripts into structured Minutes of Meeting (MoM): agenda, decisions, risks, and action items.",
      "Designed a consistent MoM schema (topics, decisions, actions, owners, due dates) for easy sharing and search.",
      "Added rules/heuristics to extract action items and highlight risks/blocks, with a human-review step for accuracy.",
      "Implemented export-ready formats to publish MoM to email/Confluence/Docs-style templates (redacted demos).",
      "Created quality checks to reduce hallucinations and ensure MoM aligns tightly to the source transcript.",
    ],
    impact: [
      "Improved meeting follow-through by standardizing action items and ownership",
      "Reduced time spent writing MoM and chasing updates",
      "Made meetings more searchable and auditable via structured outputs",
    ],
    artifacts: [
      "MoM template (standard and executive summary)",
      "Schema for decisions/actions/owners",
      "Sample transcript → MoM example (synthetic)",
      "Quality checklist (grounding to source)",
      "Workflow diagram",
    ],
    confidentiality: "Meeting content should be synthetic/redacted; outputs shown as anonymized examples.",
  },
  {
    key: "franchise",
    typeLabel: "Web / Locator",
    badge: "LOC",
    title: "Franchise Locator Application",
    subtitle: "Find nearby franchise locations with filters, map/list views, and lead routing",
    tags: ["Search", "Maps", "Filters", "Integration", "UX", "Analytics"],
    bullets: [
      "Built a franchise locator experience to help users find the right nearby location and improve lead conversion.",
      "Designed core flows: location search (ZIP/city), map and list view, distance-based sorting, and filtering by services/hours.",
      "Integrated location data feeds (store attributes, geocodes) and implemented validation to ensure accuracy and freshness.",
      "Added UX details that improve completion: quick filters, “open now”, click-to-call/directions, and clear location cards.",
      "Instrumented analytics to measure search-to-click actions (call/directions/form submit) and identify drop-off points.",
    ],
    impact: [
      "Improved discoverability of nearby locations via fast search and filters",
      "Reduced friction with map/list UX and “open now” cues",
      "Enabled measurement of conversion funnel with event tracking",
    ],
    artifacts: [
      "User flow (search → results → location detail)",
      "Wireframes for map/list and filter panel",
      "Location data schema (attributes and validation rules)",
      "Analytics event taxonomy",
      "Sample redacted screenshots",
    ],
    confidentiality: "Brand/client details should be anonymized; demos should use synthetic location data.",
  },
];

// ## 4) Generate the projects ##
function generateProjects() {
  const projects = [];
  let id = 1;

  for (const cat of CATEGORY_COUNTS) {
    // Special case: Testing-only efforts • show ONE summary tile instead of 20 individual tiles
    if (cat.key === "testing") {
      const testCfg = {
        title: "Testing Governance (PM-Led)",
        size: "Small–Medium",
        duration: "2–6 weeks",
        summary:
          "Owned testing governance across delivery efforts•approving test strategy, planning coverage, estimating effort, and enforcing quality gates before release.",
        functions: [
          "Approved end-to-end test strategy and test plans aligned to scope, risks, and release milestones",
          "Planned test case coverage (happy paths, edge cases, regression) with QA and engineering",
          "Estimated testing effort (T-shirt sizing / buckets) and aligned timelines and resourcing",
          "Coordinated integration testing across dependent systems and environments",
          "Led validation testing (data correctness, reconciliation checks, defect triage)",
          "Drove UAT readiness with business stakeholders, sign-offs, and go/no-go gates",
          "Tracked defects, prioritized fixes, and ensured closure before release readiness approvals",
        ],
        tech: ["Test Strategy", "Test Planning", "Integration Testing", "UAT", "Defect Triage"],
        tags: ["qa", "uat", "release", "governance"],
        outcome:
          "Improved release readiness by enforcing structured test planning, coverage, and stakeholder sign-offs.",
      };

      projects.push({
        id: id++,
        indexInCategory: 1,
        title: testCfg.title,
        categoryKey: cat.key,
        categoryLabel: cat.label,
        tags: testCfg.tags,
        role: "Technical Project / Program Manager",
        size: testCfg.size,
        duration: testCfg.duration,
        tech: testCfg.tech,
        outcome: testCfg.outcome,
        functions: testCfg.functions,
        summary: testCfg.summary,
        artifacts: [
          "Test strategy / master test plan",
          "UAT tracker and sign-off log",
          "Defect triage notes and severity rubric",
          "Release readiness checklist",
        ],
        confidentialNote:
          "Details are anonymized/redacted. This section summarizes testing governance across 20 testing-only delivery efforts.",
      });

      continue;
    }

    // Special case: DWH Dev Apps (Quick Wins) • summarize 12 enhancements into ONE lifecycle tile
    if (cat.key === "easy_dev_dwh") {
      const quickCfg = {
        title: "DWH Quick Wins • End-to-End Delivery (12 Enhancements)",
        size: "Small–Medium",
        duration: "3–8 weeks",
        summary:
          "Delivered fast-turnaround data warehouse enhancements across the full lifecycle•intake through deployment and hypercare•improving quality, performance, and usability for analytics consumers.",
        functions: [
          "Initiation: captured enhancement requests, clarified objectives, defined scope boundaries, and aligned key stakeholders",
          "Initiation: performed feasibility checks (data availability, upstream dependencies, constraints) and right-sized effort",
          "Planning: translated requirements into acceptance criteria, user stories, and a lightweight delivery plan",
          "Planning: mapped source-to-target fields, documented data logic/lineage, and defined validation checkpoints",
          "Implementation: coordinated Dev and QA execution in sprints, tracked blockers/RAID, and drove dependency closure",
          "Implementation: ensured peer reviews and quality gates (data checks, regression coverage) before promotion",
          "Deployment: prepared release package (change notes, risk/rollback plan, readiness checklist) and drove approvals",
          "Deployment: coordinated cutover window, deployment steps, smoke tests, and go/no-go decision gate",
          "Maintenance: ran post-deploy hypercare, triaged defects, prioritized fixes, and stabilized outputs",
          "Maintenance: updated documentation/runbooks, trained users/support, and queued follow-up improvements into backlog",
        ],
        tech: ["SQL", "ETL", "Data Validation", "UAT", "Release Governance"],
        tags: ["data", "enhancement", "delivery", "quality", "release"],
        outcome:
          "Improved delivery speed and reliability by using a repeatable lifecycle playbook for quick-win DWH enhancements.",
      };

      projects.push({
        id: id++,
        indexInCategory: 1,
        title: quickCfg.title,
        categoryKey: cat.key,
        categoryLabel: cat.label,
        tags: quickCfg.tags,
        role: "Technical Project / Program Manager",
        size: quickCfg.size,
        duration: quickCfg.duration,
        tech: quickCfg.tech,
        outcome: quickCfg.outcome,
        functions: quickCfg.functions,
        summary: quickCfg.summary,
        artifacts: [
          "Enhancement intake and prioritization notes",
          "Lightweight charter (goal, scope, success criteria)",
          "User stories and acceptance criteria (Jira)",
          "Source-to-target mapping and validation checklist",
          "Test plan and UAT sign-off tracker",
          "Release notes and rollback plan",
          "Runbook / SOP and hypercare tracker",
        ],
        confidentialNote:
          "Details are anonymized/redacted. This section summarizes 12 quick-win DWH development efforts into one lifecycle delivery view.",
      });

      continue;
    }

    for (let i = 1; i <= cat.count; i += 1) {
      // ## Curated tiles ##
      const cloudCfg = cat.key === "cloud_mig" ? CLOUD_MIG_PROJECTS[i - 1] : null;
      const aiCfg = cat.key === "ai" ? AI_PROJECTS[i - 1] : null;
      const leadCfg = cat.key === "lead_prog" ? LEAD_PROGRAM : null;
      const finCfg = cat.key === "fin_dwh" ? FIN_DWH_PROJECTS[i - 1] : null;
      const entCfg = cat.key === "ent_dwh" ? ENT_DWH_PROJECTS[i - 1] : null;
      const appCfg = cat.key === "app_mod" ? APP_MOD_PROJECTS[i - 1] : null;
      const dataCfg = cat.key === "data_sep" ? DATA_SEP_PROJECTS[i - 1] : null;
      const transformCfg = cat.key === "transform" ? TRANSFORM_PROJECTS[i - 1] : null;

      const title = cloudCfg
        ? cloudCfg.title
        : aiCfg
        ? aiCfg.title
        : leadCfg
        ? leadCfg.title
        : finCfg
        ? finCfg.title
        : entCfg
        ? entCfg.title
        : appCfg
        ? appCfg.title
        : dataCfg
        ? dataCfg.title
        : transformCfg
        ? transformCfg.title
        : `${cat.label} • Initiative ${i.toString().padStart(2, "0")}`;

      const size = cloudCfg
        ? cloudCfg.size
        : aiCfg
        ? aiCfg.size
        : leadCfg
        ? leadCfg.size
        : finCfg
        ? finCfg.size
        : entCfg
        ? entCfg.size
        : appCfg
        ? appCfg.size
        : dataCfg
        ? dataCfg.size
        : transformCfg
        ? transformCfg.size
        : cat.key === "easy_dev_dwh"
        ? "Small–Medium"
        : cat.key === "lead_prog"
        ? "Large"
        : "Medium–Large";

      const duration = cloudCfg
        ? cloudCfg.duration
        : aiCfg
        ? aiCfg.duration
        : leadCfg
        ? leadCfg.duration
        : finCfg
        ? finCfg.duration
        : entCfg
        ? entCfg.duration
        : appCfg
        ? appCfg.duration
        : dataCfg
        ? dataCfg.duration
        : transformCfg
        ? transformCfg.duration
        : cat.key === "easy_dev_dwh"
        ? "4–10 weeks"
        : cat.key === "lead_prog"
        ? "9–18 months"
        : "8–20 weeks";

      projects.push({
        id: id++,
        indexInCategory: i,
        title,
        categoryKey: cat.key,
        categoryLabel: cat.label,
        tags: cloudCfg
          ? cloudCfg.tags
          : aiCfg
          ? aiCfg.tags
          : leadCfg
          ? leadCfg.tags
          : finCfg
          ? finCfg.tags
          : entCfg
          ? entCfg.tags
          : appCfg
          ? appCfg.tags
          : dataCfg
          ? dataCfg.tags
          : transformCfg
          ? transformCfg.tags
          : CATEGORY_TAGS[cat.key] ?? [],
        role:
          cat.key === "lead_prog"
            ? "Lead Project Manager"
            : "Technical Project / Program Manager",
        size,
        duration,
        tech: cloudCfg
          ? cloudCfg.tech
          : aiCfg
          ? aiCfg.tech
          : leadCfg
          ? leadCfg.tech
          : finCfg
          ? finCfg.tech
          : entCfg
          ? entCfg.tech
          : appCfg
          ? appCfg.tech
          : dataCfg
          ? dataCfg.tech
          : transformCfg
          ? transformCfg.tech
          : defaultTechFor(cat.key),
        outcome: cloudCfg
          ? cloudCfg.outcome
          : aiCfg
          ? aiCfg.outcome
          : leadCfg
          ? leadCfg.outcome
          : finCfg
          ? finCfg.outcome
          : entCfg
          ? entCfg.outcome
          : appCfg
          ? appCfg.outcome
          : dataCfg
          ? dataCfg.outcome
          : transformCfg
          ? transformCfg.outcome
          : defaultOutcomeFor(cat.key),
        functions: cloudCfg
          ? cloudCfg.functions
          : aiCfg
          ? aiCfg.functions
          : leadCfg
          ? leadCfg.functions
          : finCfg
          ? finCfg.functions
          : entCfg
          ? entCfg.functions
          : appCfg
          ? appCfg.functions
          : dataCfg
          ? dataCfg.functions
          : transformCfg
          ? transformCfg.functions
          : defaultFunctionsFor(cat.key),
        summary: cloudCfg
          ? cloudCfg.summary
          : aiCfg
          ? aiCfg.summary
          : leadCfg
          ? leadCfg.summary
          : finCfg
          ? finCfg.summary
          : entCfg
          ? entCfg.summary
          : appCfg
          ? appCfg.summary
          : dataCfg
          ? dataCfg.summary
          : transformCfg
          ? transformCfg.summary
          : defaultSummaryFor(cat.key),
        artifacts: defaultArtifactsFor(cat.key),
        confidentialNote:
          "Details are anonymized/redacted. Impacts focus on improvements, delivery approach, and execution outcomes.",
      });
    }
  }

  return projects;
}

function defaultTechFor(categoryKey) {
  switch (categoryKey) {
    case "cloud_mig":
      return ["AWS/Azure", "CI/CD", "Monitoring", "Cutover Plan"];
    case "ai":
      return ["Python", "NLP/ML", "Data Pipelines", "Evaluation"];
    case "fin_dwh":
    case "ent_dwh":
    case "easy_dev_dwh":
      return ["SQL", "ETL", "Data Modeling", "BI/Reporting"];
    case "testing":
      return ["Test Strategy", "UAT", "Defect Triage", "Release Readiness"];
    case "app_mod":
      return ["APIs", "SDLC", "Observability", "Backlog Delivery"];
    case "data_sep":
      return ["Data Migration", "Access Controls", "Validation", "Backfill"];
    case "transform":
      return ["Operating Model", "KPIs", "Process Design", "Governance"];
    case "lead_prog":
      return ["Roadmaps", "Dependency Mgmt", "Executive Comms", "Governance"];
    default:
      return ["Stakeholder Mgmt", "Agile", "Jira", "Confluence"];
  }
}

function defaultOutcomeFor(categoryKey) {
  switch (categoryKey) {
    case "cloud_mig":
      return "Delivered migration with controlled cutover and post-launch stabilization.";
    case "ai":
      return "Implemented AI capability with measurable performance improvement and adoption plan.";
    case "testing":
      return "Improved release confidence via UAT coordination, triage, and quality gates.";
    case "lead_prog":
      return "Led program sequencing and governance across multiple modernization workstreams.";
    default:
      return "Delivered scope with clear governance, risk management, and stakeholder alignment.";
  }
}

function defaultFunctionsFor(categoryKey) {
  switch (categoryKey) {
    case "fin_dwh":
    case "ent_dwh":
      return [
        "Requirements to data model mapping",
        "ETL planning and dependency mapping",
        "Data quality checks and reconciliation",
        "Release coordination (Dev/QA/Prod)",
        "Stakeholder updates and RAID management",
      ];
    case "easy_dev_dwh":
      return [
        "Enhancement intake and sizing",
        "Backlog prioritization",
        "ETL/reporting changes",
        "UAT coordination",
        "Go-live checklist and hypercare",
      ];
    case "cloud_mig":
      return [
        "Discovery and inventory and dependency map",
        "Cutover plan and runbooks",
        "Risk tracking and mitigation",
        "Post-migration validation",
        "Stabilization and handoff",
      ];
    case "data_sep":
      return [
        "Data boundary definition",
        "Access controls / permissions alignment",
        "Migration sequencing and backfill",
        "Validation and rollback planning",
        "Stakeholder comms",
      ];
    case "app_mod":
      return [
        "Charter and success metrics",
        "Backlog/user stories and grooming",
        "Cross-team dependency mgmt",
        "Release readiness and change management",
        "Operational handoff",
      ];
    case "transform":
      return [
        "Operating rhythm design (cadences, KPIs)",
        "Process redesign",
        "Governance templates (RAID, decision log)",
        "Stakeholder alignment",
        "Continuous improvement iterations",
      ];
    case "ai":
      return [
        "Problem framing and success metrics",
        "Data readiness and pipeline coordination",
        "Model evaluation and QA",
        "Rollout and adoption enablement",
        "Monitoring and iteration",
      ];
    case "testing":
      return [
        "Test plan and UAT tracker",
        "Defect triage and prioritization",
        "Regression coordination",
        "Release readiness sign-offs",
        "Post-release validation",
      ];
    case "lead_prog":
      return [
        "Portfolio roadmap and sequencing",
        "Cross-workstream dependency mgmt",
        "Executive reporting",
        "Risk governance and escalation",
        "Delivery predictability improvements",
      ];
    default:
      return ["Planning", "Execution", "Risk management", "Stakeholder communication"];
  }
}

function defaultSummaryFor(categoryKey) {
  switch (categoryKey) {
    case "fin_dwh":
      return "Finance-focused data warehouse enhancements, reporting readiness, and reconciliations.";
    case "ent_dwh":
      return "Enterprise data warehousing initiatives: modeling, ETL pipelines, and governance.";
    case "data_sep":
      return "Data separation initiative: boundaries, migration sequencing, validation, and rollback planning.";
    case "cloud_mig":
      return "Cloud migration initiative with dependency mapping, cutover planning, and stability monitoring.";
    case "app_mod":
      return "Application modernization effort: delivery planning, technical alignment, and coordinated releases.";
    case "transform":
      return "Transformation initiative improving operating rhythms, KPIs, and execution predictability.";
    case "ai":
      return "AI initiative from discovery to implementation, evaluation, and adoption enablement.";
    case "testing":
      return "Testing-only delivery: UAT coordination, defect triage, and release readiness.";
    case "lead_prog":
      return "Program leadership across modernization workstreams: sequencing, governance, and exec comms.";
    case "easy_dev_dwh":
      return "Quick-win data warehouse application enhancements improving quality, performance, or usability.";
    default:
      return "Cross-functional initiative delivered with predictable execution and crisp communication.";
  }
}

function defaultArtifactsFor(categoryKey) {
  switch (categoryKey) {
    case "testing":
      return ["Test plan", "UAT tracker", "Defect triage notes", "Release readiness checklist"];
    case "cloud_mig":
      return ["Migration plan", "Dependency map", "Cutover runbook", "Stabilization checklist"];
    case "fin_dwh":
    case "ent_dwh":
    case "easy_dev_dwh":
      return ["Data model snapshot", "ETL job map", "Dashboard mock", "Go-live checklist"];
    case "ai":
      return ["Problem statement", "Evaluation metrics", "Architecture sketch", "Rollout plan"];
    case "lead_prog":
      return ["Program roadmap", "RAID log", "Executive weekly update", "Decision log"];
    default:
      return ["Roadmap", "RAID log", "Status update", "Delivery checklist"];
  }
}

const ALL_PROJECTS = generateProjects();

const SORTS = [
  { key: "id_desc", label: "Newest first" },
  { key: "id_asc", label: "Oldest first" },
  { key: "title_asc", label: "Title A→Z" },
  { key: "title_desc", label: "Title Z→A" },
];

function classNames(...arr) {
  return arr.filter(Boolean).join(" ");
}

function displayLabel(raw) {
  if (!raw) return "";
  const s = String(raw).trim();

  const ACRONYMS = new Set([
    "ai",
    "ml",
    "nlp",
    "safe",
    "pmp",
    "csm",
    "sql",
    "etl",
    "uat",
    "aws",
    "azure",
    "api",
    "sdlc",
    "kpi",
    "pi",
  ]);

  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => {
      const cleaned = w.replace(/[^a-zA-Z0-9]/g, "");
      if (ACRONYMS.has(cleaned.toLowerCase())) return cleaned.toUpperCase();
      const lower = w.toLowerCase();
      return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
    })
    .join(" ");
}

function Pill({ active, children, onClick, accentClass = "bg-zinc-900 text-white border-zinc-900" }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "px-3 py-1.5 rounded-full text-sm border transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-200",
        active
          ? accentClass
          : "bg-white/80 text-zinc-700 border-zinc-200 hover:border-zinc-300"
      )}
    >
      {children}
    </button>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur p-4 shadow-sm">
      <div className="flex items-center gap-2 text-zinc-600 text-sm">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

function CertificationCard({ cert }) {
  const Icon = cert.icon ?? Award;
  const isActive = cert.status.toLowerCase() === "active";
  const s = styleForCert(cert.key);

  return (
    <div
      className={classNames(
        "rounded-3xl border bg-white/80 backdrop-blur p-5 shadow-sm overflow-hidden",
        s.border
      )}
    >
      <div className={classNames("h-1.5 w-full rounded-full bg-gradient-to-r", s.accentGradient)} />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-700">Certification</div>
          <div className="mt-1 text-lg font-semibold text-zinc-900">{cert.name}</div>
          <div className="mt-2 text-sm text-zinc-800">{cert.issuer}</div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={classNames(
              "text-xs rounded-full px-3 py-1 border",
              isActive
                ? "bg-emerald-50 text-zinc-900 border-emerald-200"
                : "bg-amber-50 text-zinc-900 border-amber-200"
            )}
          >
            {cert.status}
          </span>

          <div className={classNames("h-9 w-9 rounded-2xl grid place-items-center", s.softBg, s.border, "border")}
          >
            <Icon className="h-5 w-5 text-zinc-700" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={classNames("inline-flex rounded-full px-3 py-1 text-xs", s.chip)}>
          {cert.key.toUpperCase()}
        </span>
        <span className="text-xs text-zinc-700">Credential</span>
      </div>
    </div>
  );
}

function EducationCard({ edu }) {
  const isActive = String(edu.status || "").toLowerCase() === "active";
  const s = {
    accentGradient: "from-cyan-700 to-teal-600",
    border: "border-cyan-200",
    softBg: "bg-cyan-50",
    chip: "bg-cyan-700 text-white",
  };

  return (
    <div
      className={classNames(
        "rounded-3xl border bg-white/80 backdrop-blur p-5 shadow-sm overflow-hidden",
        s.border
      )}
    >
      <div className={classNames("h-1.5 w-full rounded-full bg-gradient-to-r", s.accentGradient)} />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-700">Education</div>
          <div className="mt-1 text-lg font-semibold text-zinc-900">{edu.degree}</div>
          <div className="mt-2 text-sm text-zinc-800">{edu.school}</div>
          {(edu.highlights ?? []).length ? (
            <ul className="mt-3 space-y-1">
              {edu.highlights.slice(0, 2).map((h) => (
                <li key={h} className="text-xs text-zinc-800 flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-600" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={classNames(
              "text-xs rounded-full px-3 py-1 border",
              isActive
                ? "bg-emerald-50 text-zinc-900 border-emerald-200"
                : "bg-amber-50 text-zinc-900 border-amber-200"
            )}
          >
            {edu.status}
          </span>

          <div className={classNames("h-9 w-9 rounded-2xl grid place-items-center", s.softBg, s.border, "border")}
          >
            <GraduationCap className="h-5 w-5 text-zinc-700" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={classNames("inline-flex rounded-full px-3 py-1 text-xs", s.chip)}>
          {String(edu.key || "edu").toUpperCase()}
        </span>
        <span className="text-xs text-zinc-700">Academic</span>
      </div>
    </div>
  );
}

function ProjectModal({ open, onClose, project }) {
  const s = styleForCategory(project?.categoryKey);
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-white/45" onClick={onClose} />
          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            className={classNames(
              "relative w-full max-w-3xl rounded-3xl bg-white shadow-xl border overflow-hidden",
              s.border
            )}
          >
            <div className={classNames("p-6 border-b border-zinc-100 bg-gradient-to-r", s.headerGrad)}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs text-zinc-600">
                    {project?.categoryLabel} • #{project?.indexInCategory}
                  </div>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-950 break-words">
                    {project?.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-700">
                    <span className="inline-flex items-center gap-2">
                      <span className={classNames("h-2 w-2 rounded-full", s.dot)} />
                      {project?.categoryLabel}
                    </span>
                    <span className="text-zinc-300">•</span>
                    <span>{project?.role}</span>
                    <span className="text-zinc-300">•</span>
                    <span>{project?.size}</span>
                    <span className="text-zinc-300">•</span>
                    <span>{project?.duration}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={classNames(
                    "rounded-full p-2 border hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2",
                    s.border,
                    "hover:border-zinc-300 focus:ring-cyan-200"
                  )}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className={classNames("mt-5 h-1 w-full rounded-full bg-gradient-to-r", s.accentGradient)} />
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-5">
                <div>
                  <div className="text-sm font-medium text-zinc-950">Summary</div>
                  <p className="mt-1 text-sm text-zinc-800 leading-relaxed">
                    {project?.summary}
                  </p>
                </div>

                <div>
                  <div className="text-sm font-medium text-zinc-950">Outcome</div>
                  <p className="mt-1 text-sm text-zinc-800 leading-relaxed">
                    {project?.outcome}
                  </p>
                </div>

                <div>
                  <div className="text-sm font-medium text-zinc-950">Functions (what I did)</div>
                  <ul className="mt-2 space-y-1">
                    {(project?.functions ?? []).map((f) => (
                      <li key={f} className="text-sm text-zinc-800 flex items-start gap-2">
                        <span className={classNames("mt-1 h-1.5 w-1.5 rounded-full", s.dot)} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-medium text-zinc-950">Suggested artifacts (redacted)</div>
                  <ul className="mt-2 space-y-1">
                    {(project?.artifacts ?? []).map((a) => (
                      <li key={a} className="text-sm text-zinc-800 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-zinc-500" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={classNames("rounded-2xl border p-4", s.softBg, s.border)}>
                  <div className="text-sm font-medium text-zinc-950">Confidentiality</div>
                  <p className="mt-1 text-sm text-zinc-800">{project?.confidentialNote}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className={classNames("rounded-2xl border bg-white p-4", s.border)}>
                  <div className="text-sm font-medium text-zinc-950">Tech / methods</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(project?.tech ?? []).map((t) => (
                      <span
                        key={t}
                        className={classNames(
                          "inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs",
                          s.border,
                          "text-zinc-800"
                        )}
                      >
                        <Tag className="h-3.5 w-3.5 text-zinc-500" />
                        {displayLabel(t)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={classNames("rounded-2xl border bg-white p-4", s.border)}>
                  <div className="text-sm font-medium text-zinc-950">Tags</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(project?.tags ?? []).map((t) => (
                      <span key={t} className={classNames("inline-flex rounded-full px-3 py-1 text-xs", s.chip)}>
                        {displayLabel(t)}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={"#"}
                  className={classNames(
                    "block rounded-2xl border bg-white p-4 hover:bg-zinc-50 transition",
                    s.border
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-zinc-950">Add a case-study page</div>
                      <div className="text-xs text-zinc-600">Link to a detailed write-up later</div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-zinc-500" />
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ResponsibilitiesModal({ open, onClose, item }) {
  const s = styleForResponsibility(item?.key);
  const Icon = item?.icon ?? ClipboardList;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-white/40" onClick={onClose} />

          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            className={classNames(
              "relative w-full max-w-3xl rounded-3xl bg-white shadow-xl border overflow-hidden",
              s.border
            )}
          >
            <div className={classNames("p-6 border-b border-zinc-100 bg-gradient-to-r", s.softBg)}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-zinc-600">Responsibilities</div>

                  <div className={classNames("mt-5 h-1 w-full rounded-full bg-gradient-to-r", s.accentGradient)} />

                  <h3 className="mt-1 text-xl font-semibold text-zinc-900 flex items-center gap-2">
                    <Icon className="h-5 w-5 text-zinc-700" />
                    {item?.title}
                  </h3>

                  <div className="mt-2 text-sm text-zinc-700">{item?.subtitle}</div>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-full p-2 border border-zinc-200 hover:border-zinc-300 hover:bg-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <ul className="space-y-2">
                {(item?.bullets ?? []).map((b) => (
                  <li key={b} className="text-sm text-zinc-900 flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function CaseStudyModal({ open, onClose, cs }) {
  // Pick a consistent style for this modal (or map per case study if you want)
  const s = styleForCategory("lead_prog");

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-white/40" onClick={onClose} />

          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            className={classNames(
              "relative w-full max-w-3xl rounded-3xl bg-white shadow-xl border overflow-hidden",
              s.border
            )}
          >
            <div className={classNames("p-6 border-b border-zinc-100 bg-gradient-to-r", s.softBg)}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-zinc-600">Featured case study</div>

                  <div className={classNames("mt-4 h-1 w-full rounded-full bg-gradient-to-r", s.accentGradient)} />

                  <h3 className="mt-3 text-xl font-semibold text-zinc-900">{cs?.title}</h3>
                  <div className="mt-2 text-sm text-zinc-700">{cs?.subtitle}</div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(cs?.tags ?? []).map((t) => (
                      <span key={t} className={classNames("inline-flex rounded-full px-3 py-1 text-xs", s.chip)}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className={classNames("rounded-full p-2 border hover:bg-white", s.border)}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-5">
                <div>
                  <div className="text-sm font-medium text-zinc-900">What I delivered</div>
                  <ul className="mt-2 space-y-2">
                    {(cs?.bullets ?? []).map((b) => (
                      <li key={b} className="text-sm text-zinc-900 flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-600" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-medium text-zinc-900">Impact</div>
                  <ul className="mt-2 space-y-2">
                    {(cs?.impact ?? []).map((i) => (
                      <li key={i} className="text-sm text-zinc-900 flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-600" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-cyan-50 border border-zinc-200 p-4">
                  <div className="text-sm font-medium text-zinc-900">Confidentiality</div>
                  <p className="mt-1 text-sm text-zinc-800">{cs?.confidentiality}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-sm font-medium text-zinc-900">Suggested artifacts (redacted)</div>
                  <ul className="mt-2 space-y-1">
                    {(cs?.artifacts ?? []).map((a) => (
                      <li key={a} className="text-sm text-zinc-800 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-zinc-500" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Header({ totalCount }) {
  const certBadges = CERTIFICATIONS.map((c) => ({
    key: c.key,
    label:
      c.key === "pmp"
        ? "PMP (In progress)"
        : c.key === "safe"
        ? "SAFe Agilist 5.1"
        : c.key === "az900"
        ? "Azure Fundamentals (AZ-900)"
        : "CSM",
    status: c.status,
  }));

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-700">Portfolio</div>

          <div className="mt-2 inline-flex items-center gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-zinc-950">
                {OWNER.name}
              </h1>
              <div className="mt-1 text-sm text-zinc-700">{OWNER.location}</div>
            </div>
          </div>

          <div className="mt-3 text-zinc-800 max-w-2xl">{OWNER.title}</div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {certBadges.map((b) => (
              <span
                key={b.key}
                className={classNames(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                  b.status.toLowerCase() === "active"
                    ? "bg-emerald-50 text-emerald-950 border-emerald-200"
                    : "bg-amber-50 text-amber-950 border-amber-200"
                )}
              >
                <Award className="h-3.5 w-3.5 text-zinc-700" />
                {b.label}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-800">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-zinc-200 px-3 py-1 hover:border-zinc-300"
              href={`mailto:${OWNER.email}`}
            >
              {OWNER.email}
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-zinc-200 px-3 py-1 hover:border-zinc-300"
              href={OWNER.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>

          <div className="mt-5 h-1.5 w-full max-w-lg rounded-full bg-gradient-to-r from-sky-600 via-violet-600 to-emerald-600" />
        </div>

        <div className="grid grid-cols-1 gap-3 w-full md:w-[360px]">
          <Stat icon={LayoutGrid} label="Total projects" value={totalCount} />
          <Stat icon={Layers} label="Categories" value={CATEGORY_COUNTS.length} />
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category, onOpen }) {
  const s = styleForCategory(category.key);
  return (
    <motion.button
      layout
      onClick={() => onOpen(category.key)}
      className={classNames(
        "group text-left rounded-3xl border bg-white/80 backdrop-blur p-6 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2",
        s.border,
        "hover:border-zinc-300 focus:ring-cyan-200"
      )}
    >
      {/* Accent bar: visual memory hook */}
      <div className={classNames("h-1.5 w-full rounded-full bg-gradient-to-r", s.accentGradient)} />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-600">Category</div>
          <h3 className="mt-1 text-lg font-semibold text-zinc-950">
            {category.label}
          </h3>
        </div>
        <span className={classNames("text-xs rounded-full px-3 py-1", s.chip)}>
          {category.count}
        </span>
      </div>

      <div className="mt-3 text-sm text-zinc-800">{categoryBlurb(category.key)}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(CATEGORY_TAGS[category.key] ?? []).slice(0, 4).map((t) => (
          <span
            key={t}
            className={classNames(
              "inline-flex rounded-full border px-3 py-1 text-xs",
              s.chipSoft
            )}
          >
            {displayLabel(t)}
          </span>
        ))}
      </div>

      <div className="mt-5 text-xs text-zinc-600">
        Click to view {category.count} projects
      </div>
    </motion.button>
  );
}

function ProjectCard({ project, onOpen }) {
  const s = styleForCategory(project.categoryKey);
  return (
    <motion.button
      layout
      onClick={() => onOpen(project)}
      className={classNames(
        "group text-left rounded-3xl border bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2",
        s.border,
        "hover:border-zinc-300 focus:ring-cyan-200"
      )}
    >
      <div className={classNames("h-1 w-full rounded-full bg-gradient-to-r", s.accentGradient)} />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-600">
            {project.categoryLabel} • #{project.indexInCategory}
          </div>
          <h3 className="mt-1 font-semibold text-zinc-950 leading-snug">
            {project.title}
          </h3>
        </div>
        <span className={classNames("text-xs rounded-full px-2.5 py-1", s.chip)}>
          {project.size}
        </span>
      </div>

      <div className="mt-3 text-sm text-zinc-800 line-clamp-3">{project.summary}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-800">
          {project.duration}
        </span>
        {project.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className={classNames(
              "inline-flex rounded-full border px-3 py-1 text-xs",
              s.chipSoft
            )}
          >
            {displayLabel(t)}
          </span>
        ))}
      </div>
    </motion.button>
  );
}

function ResponsibilityCard({ item, onOpen }) {
  const Icon = item.icon;
  const normalizedKey = String(item.key || "").toLowerCase().replace(/[-\s]/g, "_");
  const s = styleForResponsibility(normalizedKey);
  const keyLetter = String(item.title || "R").trim().charAt(0).toUpperCase();

  return (
    <button
      onClick={onOpen}
      className={classNames(
        "text-left rounded-3xl border backdrop-blur p-5 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden",
        s.softBg,
        s.border,
        "hover:border-zinc-300 focus:ring-cyan-200"
      )}
    >
      <div className={classNames("h-1.5 w-full rounded-full bg-gradient-to-r", s.accentGradient)} />

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-zinc-700">Responsibilities</div>
          <div className="mt-1 text-lg font-semibold text-zinc-900 flex items-center gap-2">
            <Icon className="h-5 w-5 text-zinc-700" />
            {item.title}
          </div>
          <div className="mt-2 text-sm text-zinc-800">{item.subtitle}</div>
        </div>

        <div className="flex flex-col items-end gap-2">

          <span className={classNames("text-xs rounded-full px-3 py-1", s.chip)}>
            {item.bullets.length}
          </span>
        </div>
      </div>

      <div className="mt-4 text-xs text-zinc-700">Click to view responsibilities</div>
    </button>
  );
}

function categoryBlurb(key) {
  switch (key) {
    case "fin_dwh":
      return "Finance reporting and reconciliations: delivering DWH enhancements with strong governance.";
    case "ent_dwh":
      return "Enterprise DWH initiatives across modeling, ETL pipelines, and release execution.";
    case "data_sep":
      return "Separating datasets/systems with careful sequencing, validation, and access boundaries.";
    case "cloud_mig":
      return "Cloud migrations with dependency mapping, cutover planning, and stabilization.";
    case "app_mod":
      return "Modernizing applications through structured delivery, alignment, and releases.";
    case "transform":
      return "Transformation work improving operating rhythms, KPIs, and execution predictability.";
    case "ai":
      return "AI projects from problem framing to delivery and adoption enablement.";
    case "testing":
      return "Testing-only efforts focused on UAT, triage, regression coordination, and sign-offs.";
    case "lead_prog":
      return "A dedicated modernization program led as Lead PM across multiple workstreams.";
    case "easy_dev_dwh":
      return "Quick-win DWH application enhancements delivered end-to-end (intake → deploy → hypercare), summarized into a lifecycle view.";
    default:
      return "Delivery work across cross-functional teams with predictable execution.";
  }
}

export default function PortfolioSite() {
  const [activeCategoryKey, setActiveCategoryKey] = useState(null); // null => category view
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [sortKey, setSortKey] = useState("id_desc");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRespKey, setSelectedRespKey] = useState(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  // Keep the headline count aligned to your true volume (including summarized categories)
  const totalCount = useMemo(
    () => CATEGORY_COUNTS.reduce((acc, c) => acc + c.count, 0),
    []
  );

  const categoryProjects = useMemo(() => {
    if (!activeCategoryKey) return [];
    return ALL_PROJECTS.filter((p) => p.categoryKey === activeCategoryKey);
  }, [activeCategoryKey]);

  const allTagsForCategory = useMemo(() => {
    const s = new Set();
    for (const p of categoryProjects) for (const t of p.tags) s.add(t);
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [categoryProjects]);

  const filteredProjects = useMemo(() => {
    if (!activeCategoryKey) return [];

    const q = query.trim().toLowerCase();
    let list = categoryProjects.filter((p) => {
      const matchesQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));

      const matchesTag = activeTag === "all" || p.tags.includes(activeTag);

      return matchesQ && matchesTag;
    });

    list = sortProjects(list, sortKey);
    return list;
  }, [activeCategoryKey, categoryProjects, query, activeTag, sortKey]);

  const activeCategory = useMemo(
    () => CATEGORY_COUNTS.find((c) => c.key === activeCategoryKey) ?? null,
    [activeCategoryKey]
  );

  const responsibilitiesList = useMemo(
    () => [
      { key: "scope", ...RESPONSIBILITIES.scope },
      { key: "time", ...RESPONSIBILITIES.time },
      { key: "cost", ...RESPONSIBILITIES.cost },
      { key: "agile_safe", ...RESPONSIBILITIES.agile_safe },
    ],
    []
  );

  const selectedRespItem = useMemo(() => {
    if (!selectedRespKey) return null;
    const item = responsibilitiesList.find((r) => r.key === selectedRespKey);
    return item ?? null;
  }, [selectedRespKey, responsibilitiesList]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 overflow-hidden">
      {/* Subtle background: soft color + faint grid for depth (professional, not distracting) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Faint grid texture */}
        <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Color "ink" blobs for memorability */}
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute top-28 -right-28 h-[28rem] w-[28rem] rounded-full bg-teal-200/45 blur-3xl" />
        <div className="absolute -top-10 left-1/3 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[30rem] w-[30rem] rounded-full bg-emerald-200/25 blur-3xl" />
        <div className="absolute bottom-16 -right-24 h-80 w-80 rounded-full bg-violet-200/28 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <Header totalCount={totalCount} />

        {/* Certifications */}
        {!activeCategoryKey ? (
          <div className="rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Certifications</div>
                <div className="mt-1 text-sm text-zinc-800">
                  Agile delivery and program execution credentials.
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CERTIFICATIONS.map((c) => (
                <CertificationCard key={c.key} cert={c} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Education */}
        {!activeCategoryKey ? (
          <div className="rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Education</div>
                <div className="mt-1 text-sm text-zinc-800">

                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EDUCATION.map((e) => (
                <EducationCard key={e.key} edu={e} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Responsibilities section */}
        <div className="rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm font-semibold text-zinc-950">Core PM responsibilities</div>
              <div className="mt-1 text-sm text-zinc-800">
                Click into Scope, Time, Cost, and Agile/SAFe to see the full set of responsibilities.
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-800">
              <span className="inline-flex items-center gap-2 rounded-full bg-zinc/70 border border-zinc-200 px-3 py-1">
                <ClipboardList className="h-4 w-4 text-zinc-500" />
                {responsibilitiesList.reduce((acc, r) => acc + r.bullets.length, 0)} items
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {responsibilitiesList.map((r) => (
              <ResponsibilityCard
                key={r.key}
                item={r}
                onOpen={() => setSelectedRespKey(r.key)}
              />
            ))}
          </div>
        </div>

        {/* Featured case study (homepage) */}
        {!activeCategoryKey ? (
          <div className="rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Featured case study</div>
                <div className="mt-1 text-sm text-zinc-800">
                  A real product delivery example (vision → roadmap → execution → measurable outcomes).
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURED_CASE_STUDIES.map((cs) => {
                const s = styleForCategory("lead_prog"); // or pick a specific style
                return (
                  <button
                    key={cs.key}
                    onClick={() => setSelectedCaseStudy(cs)}
                    className={classNames(
                      "text-left rounded-3xl border bg-white/75 backdrop-blur p-6 shadow-sm hover:shadow-md transition",
                      s.border,
                      "hover:border-zinc-300"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-zinc-700">{cs.typeLabel ?? "Featured"}</div>
                        <h3 className="mt-1 text-lg font-semibold text-zinc-900">{cs.title}</h3>
                        <div className="mt-2 text-sm text-zinc-800">{cs.subtitle}</div>
                      </div>
                      <span className={classNames("text-xs rounded-full px-3 py-1", s.chip)}>
                        {cs.badge ?? "Case"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(cs.tags ?? []).slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="inline-flex rounded-full bg-cyan-50 text-zinc-800 border border-zinc-200 px-3 py-1 text-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 text-xs text-zinc-700">Click to view impact and approach</div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
        {/* VIEW 1: Categories */}
        {/* VIEW 1: Categories */}
        {!activeCategoryKey ? (
          <>
            <div className="rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">Project categories</div>
                  <div className="mt-1 text-sm text-zinc-800">
                    Click a category to drill down into project tiles, outcomes, and functions.
                  </div>
                </div>

                <div className="text-sm text-zinc-800">
                  Total: <span className="font-semibold text-zinc-900">{totalCount}</span>
                </div>
              </div>
            </div>

            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORY_COUNTS.map((c) => (
                <CategoryCard key={c.key} category={c} onOpen={(k) => setActiveCategoryKey(k)} />
              ))}
            </motion.div>
          </>
        ) : null}

        {/* VIEW 2: Category drill-down */}
        {activeCategoryKey ? (
          <>
            <div className="rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => {
                      setActiveCategoryKey(null);
                      setQuery("");
                      setActiveTag("all");
                      setSortKey("id_desc");
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-zinc-200 px-4 py-2 text-sm hover:border-zinc-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to categories
                  </button>

                  <div>
                    <div className="text-xs text-zinc-600">Category</div>
                    <div className="mt-1 text-lg font-semibold text-zinc-950">
                      {activeCategory?.label}
                    </div>
                    <div className="mt-1 text-sm text-zinc-700">
                      Showing <span className="font-semibold text-zinc-900">{filteredProjects.length}</span>{" "}
                      of <span className="font-semibold text-zinc-900">{categoryProjects.length}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search title, summary, tags..."
                      className="w-full rounded-2xl border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                  </div>

                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                    className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  >
                    {SORTS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tag pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Pill active={activeTag === "all"} onClick={() => setActiveTag("all")}>
                  All
                </Pill>

                {allTagsForCategory.map((t) => {
                  const s = styleForCategory(activeCategoryKey);
                  return (
                    <Pill
                      key={t}
                      active={activeTag === t}
                      onClick={() => setActiveTag(t)}
                      accentClass={s.chip}
                    >
                      {displayLabel(t)}
                    </Pill>
                  );
                })}
              </div>
            </div>

            {/* Projects grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((p) => (
                <ProjectCard key={p.id} project={p} onOpen={(proj) => setSelectedProject(proj)} />
              ))}
            </motion.div>

            <button
              onClick={() => setActiveCategoryKey(null)}
              className="inline-flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to categories
            </button>

            {/* Empty state */}
            {filteredProjects.length === 0 ? (
              <div className="rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur p-6 shadow-sm text-sm text-zinc-700">
                No projects match your filters. Try clearing the tag or search.
              </div>
            ) : null}
          </>
        ) : null}


        <div className="py-8 text-center text-xs text-zinc-600">
          Built as a category-first portfolio. Client and internal details are anonymized/redacted.
        </div>
      </div>

      <ProjectModal
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />

      <ResponsibilitiesModal
        open={Boolean(selectedRespItem)}
        onClose={() => setSelectedRespKey(null)}
        item={selectedRespItem}
      />

      <CaseStudyModal
        open={Boolean(selectedCaseStudy)}
        onClose={() => setSelectedCaseStudy(null)}
        cs={selectedCaseStudy}
      />
    </div>
  );
}

function sortProjects(list, sortKey) {
  const arr = [...list];
  switch (sortKey) {
    case "id_asc":
      return arr.sort((a, b) => a.id - b.id);
    case "id_desc":
      return arr.sort((a, b) => b.id - a.id);
    case "title_asc":
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case "title_desc":
      return arr.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return arr;
  }
}