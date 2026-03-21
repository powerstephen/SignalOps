export type Account = {
  id: string
  name: string
  type: "existing" | "new"
  score: number
  status: "ready" | "needs_contacts" | "review"
  lastTouched?: string
  summary: string
  whyNow: string
  signals: string[]
  recommendedPlay: string
}

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
]
