export type Contact = {
  id: string;
  name: string;
  role: string;
  seniority: "high" | "mid" | "low";
  email: string;
  recommended: boolean;
};

export type Account = {
  id: string;
  name: string;
  type: "existing" | "new";
  score: number;
  status: "ready" | "needs_contacts" | "review";
  lastTouched?: string;
  summary: string;
  whyNow: string;
  signals: string[];
  recommendedPlay: string;
  contacts?: Contact[];
};

const companies = [
  "Attio",
  "Vanta",
  "PostHog",
  "Paddle",
  "Linear",
  "Sentry",
  "Aircall",
  "Cognism",
  "Pleo",
  "Remote",
  "Deel",
  "Oyster",
  "Pigment",
  "Amplitude",
  "Webflow",
  "Intercom",
  "Front",
  "Apollo",
  "Clay",
  "Mutiny",
  "Chili Piper",
  "Gong",
  "Outreach",
  "Salesloft",
  "Lusha",
  "Clearbit",
  "Mixpanel",
  "Heap",
  "Typeform",
  "Segment",
  "Algolia",
  "G2",
  "Drift",
  "HubSpot",
  "Stripe",
  "Checkout",
  "Brex",
  "Ramp",
  "Rippling",
  "Carta",
  "Notion",
  "Miro",
  "Figma",
  "Zapier",
  "Calendly",
  "ClickUp",
  "Monday",
  "Asana",
  "LinearB",
  "Supabase",
  "Railway",
  "Render",
  "Fly.io",
  "Vercel",
  "Netlify",
  "PlanetScale",
  "Replit",
  "Retool",
  "Coda",
  "Airtable",
  "PandaDoc",
  "DocuSign",
  "Chargebee",
  "Recurly",
  "Zuora",
  "Freshworks",
  "Zoho",
  "Klaviyo",
  "Customer.io",
  "FullStory",
];

const firstNames = [
  "Sarah",
  "James",
  "Emma",
  "Daniel",
  "Olivia",
  "Liam",
  "Sophia",
  "Noah",
  "Michael",
  "Isla",
  "Ethan",
  "Chloe",
];

const lastNames = [
  "Turner",
  "Murphy",
  "Smith",
  "Meyer",
  "Davis",
  "Wilson",
  "Clark",
  "Hall",
  "Bennett",
  "Carter",
  "Evans",
  "Reed",
];

function fullName(i: number) {
  return `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
}

function firstNameOnly(i: number) {
  return firstNames[i % firstNames.length].toLowerCase();
}

function slugifyCompany(company: string) {
  return company.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function contacts(domain: string, i: number): Contact[] {
  return [
    {
      id: `${domain}-1`,
      name: fullName(i),
      role: "Head of Sales",
      seniority: "high",
      email: `${firstNameOnly(i)}@${domain}.com`,
      recommended: true,
    },
    {
      id: `${domain}-2`,
      name: fullName(i + 1),
      role: "RevOps Manager",
      seniority: "mid",
      email: `${firstNameOnly(i + 1)}@${domain}.com`,
      recommended: false,
    },
    {
      id: `${domain}-3`,
      name: fullName(i + 2),
      role: "VP Marketing",
      seniority: "high",
      email: `${firstNameOnly(i + 2)}@${domain}.com`,
      recommended: false,
    },
  ];
}

function generateAccount(company: string, i: number): Account {
  const domain = slugifyCompany(company);
  const isExisting = i < 45;

  const visitCount = (i % 4) + 1;
  const hasHiring = i % 2 === 0;
  const hasFunding = i % 3 === 0;

  const signals = [
    visitCount > 2
      ? `${visitCount} visits (pricing + integrations)`
      : "Recent website activity",
    hasHiring ? "Hiring SDRs" : "Expanding GTM team",
    hasFunding ? "Recent funding" : "Strong ICP match",
  ];

  return {
    id: domain,
    name: company,
    type: isExisting ? "existing" : "new",
    score: 70 + (i % 30),
    status: i % 3 === 0 ? "ready" : i % 3 === 1 ? "needs_contacts" : "review",
    lastTouched: isExisting ? `${30 + (i % 60)} days ago` : undefined,
    summary: isExisting
      ? "Previously engaged account showing renewed buying signals."
      : "High-fit new account showing strong ICP alignment and intent signals.",
    whyNow:
      visitCount > 2
        ? `${visitCount} visits across pricing + integrations + hiring signal`
        : "Recent activity + strong ICP fit",
    signals,
    recommendedPlay: isExisting ? "Reactivate" : "Prospect",
    contacts: isExisting ? contacts(domain, i) : undefined,
  };
}

export const accounts: Account[] = companies.map((company, i) =>
  generateAccount(company, i)
);
