export type RecoverTimelineItem = {
  id: string;
  type: "email" | "meeting" | "activity" | "note";
  title: string;
  detail: string;
  time: string;
};

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
  timeline: RecoverTimelineItem[];
};

export const recoverLeads: RecoverLead[] = [
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
    timeline: [
      {
        id: "1-1",
        type: "email",
        title: "Positive reply to outbound",
        detail: "Sarah replied with interest and asked for more detail on use case fit.",
        time: "46 days ago",
      },
      {
        id: "1-2",
        type: "meeting",
        title: "Discovery call proposed",
        detail: "Suggested times were shared but no meeting was booked.",
        time: "43 days ago",
      },
      {
        id: "1-3",
        type: "activity",
        title: "Pricing page revisit",
        detail: "Multiple recent visits across pricing and integrations pages.",
        time: "2 days ago",
      },
      {
        id: "1-4",
        type: "note",
        title: "SignalOps recommendation",
        detail: "Re-engage with a light, context-aware note tied to current activity.",
        time: "Now",
      },
    ],
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
    timeline: [
      {
        id: "2-1",
        type: "email",
        title: "Demo booked",
        detail: "James booked a demo after engaging with outbound messaging.",
        time: "38 days ago",
      },
      {
        id: "2-2",
        type: "meeting",
        title: "Demo no-show",
        detail: "Meeting was missed and no reschedule happened.",
        time: "36 days ago",
      },
      {
        id: "2-3",
        type: "activity",
        title: "Hiring signal detected",
        detail: "Company is hiring SDRs and expanding the GTM team.",
        time: "5 days ago",
      },
      {
        id: "2-4",
        type: "note",
        title: "SignalOps recommendation",
        detail: "Follow up with a more direct message tied to pipeline pressure and hiring.",
        time: "Now",
      },
    ],
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
    timeline: [
      {
        id: "3-1",
        type: "email",
        title: "Sequence engagement",
        detail: "Emma opened the prior sequence several times but never replied.",
        time: "52 days ago",
      },
      {
        id: "3-2",
        type: "note",
        title: "Prior objection",
        detail: "No clear objection surfaced, but timing appeared to be the blocker.",
        time: "49 days ago",
      },
      {
        id: "3-3",
        type: "activity",
        title: "Funding signal",
        detail: "Recent funding suggests new budget and growth momentum.",
        time: "6 days ago",
      },
      {
        id: "3-4",
        type: "note",
        title: "SignalOps recommendation",
        detail: "Retry with a fresh angle tied to growth stage and pipeline efficiency.",
        time: "Now",
      },
    ],
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
    timeline: [
      {
        id: "4-1",
        type: "activity",
        title: "Inbound conversion",
        detail: "Daniel came in through inbound but did not progress to a qualified stage.",
        time: "61 days ago",
      },
      {
        id: "4-2",
        type: "note",
        title: "Lead deprioritised",
        detail: "Team focus shifted and the lead was not worked further.",
        time: "58 days ago",
      },
      {
        id: "4-3",
        type: "activity",
        title: "Repeat visits",
        detail: "Recent repeat visits suggest renewed evaluation activity.",
        time: "3 days ago",
      },
      {
        id: "4-4",
        type: "note",
        title: "SignalOps recommendation",
        detail: "Re-qualify and confirm whether current ownership still sits with Daniel.",
        time: "Now",
      },
    ],
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
    timeline: [
      {
        id: "5-1",
        type: "meeting",
        title: "Late-stage conversation",
        detail: "Deal reached a serious evaluation phase before losing momentum.",
        time: "73 days ago",
      },
      {
        id: "5-2",
        type: "note",
        title: "Stall reason",
        detail: "Internal timing and resourcing slowed decision making.",
        time: "68 days ago",
      },
      {
        id: "5-3",
        type: "activity",
        title: "Renewed company activity",
        detail: "New hiring and fresh visits suggest pipeline initiatives are live again.",
        time: "4 days ago",
      },
      {
        id: "5-4",
        type: "note",
        title: "SignalOps recommendation",
        detail: "Revive the deal with direct reference to previous evaluation context.",
        time: "Now",
      },
    ],
  },
];
