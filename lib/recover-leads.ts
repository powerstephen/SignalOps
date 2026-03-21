export type RecoverLead = {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  lastInteraction: string;
  interactionSummary: string;
  whyNow: string;
  score: number;
  nextStep: string;
};

const leads: RecoverLead[] = [
  {
    id: "1",
    name: "Sarah Turner",
    company: "Attio",
    role: "Head of Sales",
    email: "sarah@attio.com",
    lastInteraction: "46 days ago",
    interactionSummary: "Replied to outbound, positive interest but no follow-up",
    whyNow: "Revisited pricing + prior positive engagement",
    score: 92,
    nextStep: "Re-engage",
  },
  {
    id: "2",
    name: "James Murphy",
    company: "Vanta",
    role: "RevOps Manager",
    email: "james@vanta.com",
    lastInteraction: "38 days ago",
    interactionSummary: "Booked demo, no-show",
    whyNow: "Hiring SDRs + prior demo interest",
    score: 88,
    nextStep: "Follow up",
  },
  {
    id: "3",
    name: "Emma Smith",
    company: "Paddle",
    role: "VP Marketing",
    email: "emma@paddle.com",
    lastInteraction: "52 days ago",
    interactionSummary: "Opened sequence multiple times, no reply",
    whyNow: "Recent funding + high engagement history",
    score: 84,
    nextStep: "Retry with new angle",
  },
  {
    id: "4",
    name: "Daniel Meyer",
    company: "PostHog",
    role: "Head of Growth",
    email: "daniel@posthog.com",
    lastInteraction: "61 days ago",
    interactionSummary: "Inbound lead, not prioritised",
    whyNow: "Repeat site visits + ICP match",
    score: 86,
    nextStep: "Re-qualify",
  },
  {
    id: "5",
    name: "Olivia Davis",
    company: "Aircall",
    role: "Sales Director",
    email: "olivia@aircall.com",
    lastInteraction: "73 days ago",
    interactionSummary: "Late stage deal stalled",
    whyNow: "New hiring + renewed activity",
    score: 90,
    nextStep: "Revive deal",
  },

  // you can easily extend this to 30–50 leads
];

export const recoverLeads = leads;
