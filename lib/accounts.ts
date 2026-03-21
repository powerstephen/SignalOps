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

const firstNames = [
  "Sarah","Michael","James","Emma","Daniel","Olivia","Liam","Sophia","Noah","Isabella"
];

const lastNames = [
  "Turner","Murphy","Smith","Johnson","Brown","Garcia","Meyer","Davis","Wilson","Clark"
];

function randomName(i: number) {
  return `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
}

function generateContacts(company: string, index: number): Contact[] {
  return [
    {
      id: `${company}-1`,
      name: randomName(index),
      role: "Head of Sales",
      seniority: "high",
      email: `sales@${company}.com`,
      recommended: true,
    },
    {
      id: `${company}-2`,
      name: randomName(index + 1),
      role: "Revenue Operations Manager",
      seniority: "mid",
      email: `revops@${company}.com`,
      recommended: false,
    },
    {
      id: `${company}-3`,
      name: randomName(index + 2),
      role: "VP Marketing",
      seniority: "high",
      email: `marketing@${company}.com`,
      recommended: false,
    },
  ];
}

function generateAccount(i: number): Account {
  const name = `company${i + 1}`;
  const isExisting = i < 30;

  const visitCount = Math.floor(Math.random() * 5) + 1;

  const signals = [
    visitCount > 2
      ? `${visitCount} visits (pricing + integrations)`
      : "Recent website activity",
    Math.random() > 0.5 ? "Hiring SDRs" : "Recent funding",
    "Strong ICP match",
  ];

  return {
    id: name,
    name: `Company ${i + 1}`,
    type: isExisting ? "existing" : "new",
    score: Math.floor(Math.random() * 30) + 70,
    status:
      i % 3 === 0 ? "ready" : i % 3 === 1 ? "needs_contacts" : "review",
    lastTouched: isExisting
      ? `${Math.floor(Math.random() * 90) + 10} days ago`
      : undefined,
    summary: isExisting
      ? "Previously engaged account showing renewed buying signals and strong ICP alignment."
      : "High-fit new account showing intent signals and strong similarity to top customers.",
    whyNow:
      visitCount > 2
        ? `${visitCount} visits across pricing + integrations + recent signal`
        : "Recent activity + strong ICP fit",
    signals,
    recommendedPlay: isExisting ? "Reactivate" : "Prospect",
    contacts: isExisting ? generateContacts(name, i) : undefined,
  };
}

export const accounts: Account[] = Array.from({ length: 50 }).map((_, i) =>
  generateAccount(i)
);
