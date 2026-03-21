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

export const accounts: Account[] = [
  {
    id: "revscale",
    name: "RevScale",
    type: "existing",
    score: 91,
    status: "ready",
    lastTouched: "72 days ago",
    summary:
      "Previously active account with strong ICP fit and new sales hiring activity.",
    whyNow: "Hiring 5 SDRs + no contact in 72 days",
    signals: [
      "Hiring SDRs",
      "No recent outreach",
      "Strong past engagement",
    ],
    recommendedPlay: "Reactivate",
    contacts: [
      {
        id: "1",
        name: "Barry O'Sullivan",
        role: "Head of Sales",
        seniority: "high",
        email: "barry@revscale.com",
        recommended: true,
      },
      {
        id: "2",
        name: "Anna Meyer",
        role: "VP Revenue Operations",
        seniority: "high",
        email: "anna@revscale.com",
        recommended: false,
      },
    ],
  },
  {
    id: "acme-ai",
    name: "Acme AI",
    type: "new",
    score: 84,
    status: "needs_contacts",
    summary:
      "High-fit new account showing buying signals and strong similarity to closed-won customers.",
    whyNow: "Recent funding + traffic spike",
    signals: ["Funding event", "Traffic growth", "ICP match"],
    recommendedPlay: "Prospect",
  },
];
