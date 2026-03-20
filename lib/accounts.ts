export type Account = {
  id: string
  name: string
  score: number
  status: string
  lastTouched: string
  icpFit: string
  summary: string
  signals: string[]
  angle: string
  email: string
}

export const accounts: Account[] = [
  {
    id: "revscale",
    name: "RevScale",
    score: 91,
    status: "Warm but neglected",
    lastTouched: "72 days ago",
    icpFit: "Strong",
    summary:
      "Warm but neglected account with strong ICP fit and recent sales hiring activity indicating renewed urgency.",
    signals: [
      "Hiring multiple SDRs and AEs",
      "No contact in last 72 days",
      "Strong historical engagement",
    ],
    angle:
      "Re-engage with an efficiency and pipeline acceleration narrative tied to current sales hiring.",
    email:
      "Hi [Name], noticed you are expanding the sales team. We typically help teams in this phase increase pipeline without increasing SDR workload. Worth a quick look?",
  },
  {
    id: "acme-ai",
    name: "Acme AI",
    score: 84,
    status: "Active signal",
    lastTouched: "41 days ago",
    icpFit: "Good",
    summary:
      "Good-fit account showing active buying signals and a clear opening for a new conversation.",
    signals: [
      "Website traffic up",
      "Recent funding event",
      "Opportunity reopened",
    ],
    angle:
      "Lead with momentum and timing. Position SignalOps as a way to convert new demand without extra manual prospecting.",
    email:
      "Hi [Name], saw a few signs that this could be the right moment to revisit outbound efficiency. We help teams turn intent and CRM data into qualified pipeline with less manual work. Open to a quick chat?",
  },
]
