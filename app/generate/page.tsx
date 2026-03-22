"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type Signal = {
  label: string;
  value: string;
};

type ContactScore = "High Intent" | "Warm" | "Monitor";
type Tone = "Direct" | "Consultative" | "Executive";

type Contact = {
  id: string;
  name: string;
  title: string;
  score: ContactScore;
  reason: string;
  channelHint?: string;
};

type Account = {
  id: string;
  name: string;
  segment: string;
  fitScore: number;
  triggerScore: number;
  whyNow: string;
  signals: Signal[];
  contacts: Contact[];
};

type ActivityItem = {
  id: string;
  text: string;
  status: "running" | "done";
};

type SequenceStep = {
  id: string;
  stepNumber: number;
  label: string;
  sendLabel: string;
  subject: string;
  body: string;
};

type SequenceBundle = {
  steps: SequenceStep[];
};

const MOCK_ACCOUNTS: Account[] = [
  {
    id: "acc_1",
    name: "RevScale",
    segment: "Pipeline Expansion",
    fitScore: 94,
    triggerScore: 91,
    whyNow:
      "Hiring across revenue roles suggests active pipeline build and pressure to improve conversion efficiency.",
    signals: [
      { label: "Hiring", value: "5 SDRs + 2 AEs" },
      { label: "Intent", value: "Visited pricing pages" },
      { label: "Funding", value: "Series A in last 8 months" },
      { label: "Tech", value: "HubSpot + Salesforce" },
    ],
    contacts: [
      {
        id: "c_1",
        name: "Sarah Chen",
        title: "Head of Sales",
        score: "High Intent",
        reason: "Revenue hiring suggests immediate pipeline management pressure.",
        channelHint: "Best for direct value-led outreach",
      },
      {
        id: "c_2",
        name: "Marcus Lee",
        title: "VP Revenue Operations",
        score: "High Intent",
        reason: "Likely owner of process efficiency, tooling and signal orchestration.",
        channelHint: "Good for operational ROI angle",
      },
      {
        id: "c_3",
        name: "Elena Park",
        title: "Director of Growth",
        score: "Warm",
        reason: "Could be involved in campaign coordination and outbound programs.",
        channelHint: "Good secondary entry point",
      },
    ],
  },
  {
    id: "acc_2",
    name: "SignalForge",
    segment: "Reactivation Opportunity",
    fitScore: 89,
    triggerScore: 83,
    whyNow:
      "Strong ICP fit, recent product launch and stale outreach history create a good reopening window.",
    signals: [
      { label: "Product", value: "New AI workflow launch" },
      { label: "Engagement", value: "Site return visits" },
      { label: "Last Touch", value: "74 days ago" },
      { label: "Region", value: "EMEA expansion" },
    ],
    contacts: [
      {
        id: "c_4",
        name: "Nina Patel",
        title: "Chief Revenue Officer",
        score: "High Intent",
        reason: "Likely owns top-line urgency around new launch performance.",
        channelHint: "Best for strategic narrative",
      },
      {
        id: "c_5",
        name: "Tom Alvarez",
        title: "Director of Sales Development",
        score: "Warm",
        reason: "May care about list quality and prioritisation efficiency.",
        channelHint: "Good tactical opener",
      },
      {
        id: "c_6",
        name: "Holly Reed",
        title: "VP Marketing",
        score: "Monitor",
        reason: "Useful stakeholder but less direct operational owner for this motion.",
        channelHint: "Better as supporting path",
      },
    ],
  },
  {
    id: "acc_3",
    name: "NorthBeam AI",
    segment: "Expansion Signal",
    fitScore: 91,
    triggerScore: 87,
    whyNow:
      "Scaling motion appears underway and buying committee likely forming around growth execution and sales efficiency.",
    signals: [
      { label: "Hiring", value: "Growth + Sales roles open" },
      { label: "News", value: "New market entry" },
      { label: "Intent", value: "High content engagement" },
      { label: "Stack", value: "Apollo + HubSpot" },
    ],
    contacts: [
      {
        id: "c_7",
        name: "James Walker",
        title: "VP Growth",
        score: "High Intent",
        reason: "Likely under pressure to turn expansion activity into pipeline quickly.",
        channelHint: "Strong messaging candidate",
      },
      {
        id: "c_8",
        name: "Priya Nair",
        title: "Head of Revenue Operations",
        score: "Warm",
        reason: "Important if outreach angle leans into efficiency and workflow orchestration.",
        channelHint: "Good second sequence",
      },
      {
        id: "c_9",
        name: "Adam Brooks",
        title: "CEO",
        score: "Monitor",
        reason: "Can work for escalation later but not ideal as first touch.",
        channelHint: "Hold for later step",
      },
    ],
  },
];

const AGENT_STEPS: Record<string, string[]> = {
  acc_1: [
    "Analyzing RevScale signals",
    "Detected revenue hiring surge across SDR and AE roles",
    "Mapping likely pipeline pressure across team structure",
    "Pulling relevant decision makers",
    "Scoring personas by urgency and fit",
    "Preparing best entry points",
  ],
  acc_2: [
    "Analyzing stale outreach and new trigger signals",
    "Detected recent product launch and renewed engagement",
    "Reviewing best reopening path by persona",
    "Ranking contacts by strategic relevance",
    "Preparing reactivation angle",
    "Finalising contact recommendations",
  ],
  acc_3: [
    "Analyzing expansion signals",
    "Detected new market activity and role growth",
    "Estimating likely GTM coordination pain points",
    "Identifying buying committee entry points",
    "Scoring contacts by responsiveness potential",
    "Preparing outreach routes",
  ],
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function scoreBadgeClasses(score: ContactScore) {
  switch (score) {
    case "High Intent":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Warm":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Monitor":
      return "border-slate-200 bg-slate-50 text-slate-600";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getAngle(contact: Contact) {
  if (contact.score === "High Intent") return "Urgent pipeline efficiency angle";
  if (contact.score === "Warm") return "Context-led relevance angle";
  return "Light-touch awareness angle";
}

function getApproach(contact: Contact) {
  const title = contact.title.toLowerCase();

  if (title.includes("revenue operations") || title.includes("operations")) {
    return "Operational ROI and workflow efficiency";
  }
  if (title.includes("sales")) {
    return "Pipeline pressure and prioritisation support";
  }
  if (title.includes("revenue")) {
    return "Top-line urgency and GTM coordination";
  }
  if (title.includes("growth")) {
    return "Signal-led activation and conversion efficiency";
  }

  return "Strategic relevance with supporting proof points";
}

function buildSequence(account: Account, contact: Contact, tone: Tone): SequenceBundle {
  const firstName = contact.name.split(" ")[0];
  const angle = getAngle(contact);
  const approach = getApproach(contact);
  const signalA = account.signals[0]?.value ?? "recent trigger event";
  const signalB = account.signals[1]?.value ?? "new engagement activity";

  const subject1 =
    tone === "Direct"
      ? `Quick question about ${account.name}'s growth plans`
      : tone === "Consultative"
      ? `Thought on ${account.name}'s current GTM timing`
      : `${account.name} growth signals and likely revenue pressure`;

  const body1 =
    tone === "Direct"
      ? [
          `Hi ${firstName},`,
          ``,
          `Noticed ${account.name} is showing signals like ${signalA}. Usually that means more pressure on the team to prioritise the right accounts and contacts fast.`,
          ``,
          `We help revenue teams turn account-level signals into immediate contact-level action, so reps are not guessing who to work, why now, or what angle to use.`,
          ``,
          `For ${account.name}, the immediate angle I would test is ${angle.toLowerCase()}.`,
          ``,
          `Would it make sense to connect for 15 minutes this week?`,
          ``,
          `Best,`,
          `Stephen`,
        ].join("\n")
      : tone === "Consultative"
      ? [
          `Hi ${firstName},`,
          ``,
          `I was looking at ${account.name} and noticed a few signals, including ${signalA}. That combination often creates a window where account selection and contact prioritisation become much more important.`,
          ``,
          `SignalOps is designed to convert account intelligence into clear contact prioritisation and usable outreach paths, without adding manual research overhead.`,
          ``,
          `Given your role, my guess is the challenge is ${approach.toLowerCase()}.`,
          ``,
          `Happy to share a few examples if useful.`,
          ``,
          `Best,`,
          `Stephen`,
        ].join("\n")
      : [
          `Hi ${firstName},`,
          ``,
          `I noticed ${account.name} is showing signals such as ${signalA}. In many teams, that is the point where execution quality across targeting, contact selection and timing starts to materially affect pipeline outcomes.`,
          ``,
          `SignalOps turns account-level intelligence into a usable operating layer for teams, helping convert signals into prioritised contacts, outreach angles and next-best actions.`,
          ``,
          `From your side, the likely focus is ${approach.toLowerCase()}.`,
          ``,
          `If helpful, I can send a concise example of how teams are using this to improve execution speed and relevance.`,
          ``,
          `Best,`,
          `Stephen`,
        ].join("\n");

  const body2 =
    tone === "Direct"
      ? [
          `Hi ${firstName},`,
          ``,
          `Following up in case this is a current focus.`,
          ``,
          `Given signals like ${signalB}, I would guess the challenge is not a lack of accounts but deciding which people inside those accounts are worth acting on first.`,
          ``,
          `That is usually where we see the biggest value: less manual digging, faster prioritisation, and more confidence in why a specific contact should be worked now.`,
          ``,
          `Happy to send a simple example if useful.`,
          ``,
          `Best,`,
          `Stephen`,
        ].join("\n")
      : tone === "Consultative"
      ? [
          `Hi ${firstName},`,
          ``,
          `Wanted to follow up, mainly because the timing looks interesting.`,
          ``,
          `When signals like ${signalB} show up alongside role growth or product activity, teams often need a faster way to go from account insight to contact action.`,
          ``,
          `I can send over a short example of how others have handled this if that would be useful.`,
          ``,
          `Cheers,`,
          `Stephen`,
        ].join("\n")
      : [
          `Hi ${firstName},`,
          ``,
          `A quick follow-up.`,
          ``,
          `Where teams often lose time here is in the gap between account intelligence and contact execution. That delay tends to reduce relevance and response rates.`,
          ``,
          `SignalOps is built to reduce that gap and make prioritisation more usable for reps and GTM leaders.`,
          ``,
          `Happy to send a concise overview if helpful.`,
          ``,
          `Best,`,
          `Stephen`,
        ].join("\n");

  const body3 =
    tone === "Direct"
      ? [
          `Hi ${firstName},`,
          ``,
          `I do not want to be the person who keeps following up, so I will keep this short.`,
          ``,
          `If improving outbound efficiency is on the radar for ${account.name} this quarter, I would love to help. If not, no worries at all and I will step aside.`,
          ``,
          `Either way, wishing you a strong quarter.`,
          ``,
          `Stephen`,
        ].join("\n")
      : tone === "Consultative"
      ? [
          `Hi ${firstName},`,
          ``,
          `Final note from me.`,
          ``,
          `The reason I reached out is that ${account.name}'s current signals suggest a useful moment to tighten how targeting and contact activation work together.`,
          ``,
          `If that is not a priority right now, no problem at all.`,
          ``,
          `Wishing you a great quarter.`,
          ``,
          `Stephen`,
        ].join("\n")
      : [
          `Hi ${firstName},`,
          ``,
          `Closing the loop from my side.`,
          ``,
          `My sense is that ${account.name} is at the kind of inflection point where better signal orchestration can improve both speed and GTM precision.`,
          ``,
          `If that is relevant this quarter, happy to share more. If not, no issue at all.`,
          ``,
          `Regards,`,
          `Stephen`,
        ].join("\n");

  return {
    steps: [
      {
        id: "step_1",
        stepNumber: 1,
        label: "Initial Outreach",
        sendLabel: "Send Day 0",
        subject: subject1,
        body: body1,
      },
      {
        id: "step_2",
        stepNumber: 2,
        label: "Value Add Follow-up",
        sendLabel: "Send Day 3",
        subject: `Re: ${account.name}'s outbound — a thought`,
        body: body2,
      },
      {
        id: "step_3",
        stepNumber: 3,
        label: "Breakup Email",
        sendLabel: "Send Day 7",
        subject: "Closing the loop",
        body: body3,
      },
    ],
  };
}

export default function GeneratePage() {
  const [accounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>("acc_1");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const expandedAccount = useMemo(
    () => accounts.find((a) => a.id === expandedAccountId) ?? null,
    [accounts, expandedAccountId]
  );

  const streamedContacts = useStreamedContacts(expandedAccount);
  const activity = useAgentActivity(expandedAccount);

  useEffect(() => {
    if (!expandedAccount) {
      setSelectedContactId(null);
      return;
    }

    if (streamedContacts.length > 0) {
      const stillExists = streamedContacts.some((c) => c.id === selectedContactId);
      if (!stillExists) {
        setSelectedContactId(streamedContacts[0].id);
      }
    }
  }, [expandedAccount, streamedContacts, selectedContactId]);

  const selectedContact =
    streamedContacts.find((contact) => contact.id === selectedContactId) ?? null;

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#dbe3ff] bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#3157e0]">
            <SparklesIcon className="h-3.5 w-3.5" />
            Generate
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Target accounts and move directly into outreach
          </h1>
          <p className="mt-2 max-w-4xl text-sm text-slate-500">
            One agent moment at the account layer, then a clean, wide sequence workspace.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-12 gap-0 border-b border-slate-200 px-5 py-4 text-xs uppercase tracking-[0.16em] text-slate-500">
            <div className="col-span-4">Account</div>
            <div className="col-span-2">Segment</div>
            <div className="col-span-2">Fit</div>
            <div className="col-span-2">Trigger</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          <div>
            {accounts.map((account) => {
              const isExpanded = expandedAccountId === account.id;

              return (
                <div key={account.id} className="border-b border-slate-200 last:border-b-0">
                  <button
                    onClick={() =>
                      setExpandedAccountId((prev) => (prev === account.id ? null : account.id))
                    }
                    className="grid w-full grid-cols-12 items-center gap-0 px-5 py-4 text-left transition hover:bg-slate-50"
                  >
                    <div className="col-span-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                          <BuildingIcon className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{account.name}</div>
                          <div className="mt-0.5 text-sm text-slate-500">{account.whyNow}</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                        {account.segment}
                      </span>
                    </div>

                    <div className="col-span-2 text-sm font-medium text-slate-900">
                      {account.fitScore}/100
                    </div>

                    <div className="col-span-2 text-sm font-medium text-slate-900">
                      {account.triggerScore}/100
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe3ff] bg-[#eef2ff] px-3 py-1.5 text-xs font-medium text-[#3157e0]">
                        {isExpanded ? "Collapse" : "Activate account"}
                        {isExpanded ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  </button>

                  {isExpanded && expandedAccount && (
                    <div className="border-t border-slate-200 bg-[#fcfcfd] p-5">
                      <div className="grid gap-5">
                        <div className="grid gap-5 xl:grid-cols-12">
                          <div className="xl:col-span-4">
                            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                              <div className="mb-4 flex items-center justify-between">
                                <div>
                                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                    Account context
                                  </div>
                                  <div className="mt-1 text-lg font-semibold text-slate-900">
                                    {expandedAccount.name}
                                  </div>
                                </div>
                                <div className="rounded-full border border-[#dbe3ff] bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#3157e0]">
                                  Live
                                </div>
                              </div>

                              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
                                  Why now
                                </div>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                  {expandedAccount.whyNow}
                                </p>
                              </div>

                              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {expandedAccount.signals.map((signal) => (
                                  <div
                                    key={`${expandedAccount.id}-${signal.label}`}
                                    className="rounded-2xl border border-slate-200 bg-white p-4"
                                  >
                                    <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                                      {signal.label}
                                    </div>
                                    <div className="mt-1 text-sm text-slate-700">{signal.value}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="xl:col-span-4">
                            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                              <div className="mb-4">
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                  Agent activity
                                </div>
                                <div className="mt-1 text-lg font-semibold text-slate-900">
                                  SignalOps is working this account
                                </div>
                              </div>

                              <AgentActivityFeed activity={activity} />
                            </div>
                          </div>

                          <div className="xl:col-span-4">
                            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                              <div className="mb-4 flex items-center justify-between">
                                <div>
                                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                    Prioritised contacts
                                  </div>
                                  <div className="mt-1 text-lg font-semibold text-slate-900">
                                    Best entry points
                                  </div>
                                </div>

                                <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                                  <UsersIcon className="h-4 w-4" />
                                  {streamedContacts.length}/{expandedAccount.contacts.length}
                                </div>
                              </div>

                              <div className="space-y-3">
                                {streamedContacts.map((contact) => {
                                  const isSelected = selectedContactId === contact.id;

                                  return (
                                    <button
                                      key={contact.id}
                                      onClick={() => setSelectedContactId(contact.id)}
                                      className={cx(
                                        "w-full rounded-2xl border p-4 text-left transition",
                                        isSelected
                                          ? "border-[#bfd0ff] bg-[#f5f8ff]"
                                          : "border-slate-200 bg-white hover:bg-slate-50"
                                      )}
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div>
                                          <div className="font-medium text-slate-900">{contact.name}</div>
                                          <div className="mt-0.5 text-sm text-slate-500">
                                            {contact.title}
                                          </div>
                                        </div>

                                        <span
                                          className={cx(
                                            "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
                                            scoreBadgeClasses(contact.score)
                                          )}
                                        >
                                          {contact.score}
                                        </span>
                                      </div>

                                      <p className="mt-3 text-sm leading-6 text-slate-600">
                                        {contact.reason}
                                      </p>

                                      {contact.channelHint && (
                                        <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-400">
                                          <ArrowRightIcon className="h-3.5 w-3.5" />
                                          {contact.channelHint}
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}

                                {streamedContacts.length < expandedAccount.contacts.length && (
                                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                      <SpinnerIcon className="h-4 w-4 text-[#3157e0]" />
                                      Identifying high-probability contacts
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <SequenceWorkspace account={expandedAccount} contact={selectedContact} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentActivityFeed({ activity }: { activity: ActivityItem[] }) {
  return (
    <div className="space-y-2.5">
      {activity.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <div className="mt-0.5">
            {item.status === "done" ? (
              <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
            ) : (
              <SpinnerIcon className="h-4 w-4 text-[#3157e0]" />
            )}
          </div>

          <div className="text-sm text-slate-700">{item.text}</div>
        </div>
      ))}

      {activity.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Starting account analysis
        </div>
      )}
    </div>
  );
}

function SequenceWorkspace({
  account,
  contact,
}: {
  account: Account;
  contact: Contact | null;
}) {
  const [tone, setTone] = useState<Tone>("Direct");
  const [sequence, setSequence] = useState<SequenceBundle | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    setSequence(null);
    setActiveStepIndex(0);
    setCopyState("idle");
  }, [account.id, contact?.id]);

  useEffect(() => {
    if (!contact) return;
    setSequence(buildSequence(account, contact, tone));
    setActiveStepIndex(0);
    setCopyState("idle");
  }, [account, contact, tone]);

  async function copyFullSequence() {
    if (!sequence || !contact) return;

    const text = sequence.steps
      .map((step) =>
        [
          `${step.label} (${step.sendLabel})`,
          `Subject: ${step.subject}`,
          ``,
          step.body,
        ].join("\n")
      )
      .join("\n\n--------------------\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("idle");
    }
  }

  function prevStep() {
    if (!sequence) return;
    setActiveStepIndex((prev) => (prev === 0 ? sequence.steps.length - 1 : prev - 1));
  }

  function nextStep() {
    if (!sequence) return;
    setActiveStepIndex((prev) => (prev === sequence.steps.length - 1 ? 0 : prev + 1));
  }

  if (!contact) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Outreach</div>
        <div className="mt-1 text-lg font-semibold text-slate-900">Sequence workspace</div>
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
          Select a surfaced contact to open the outreach sequence.
        </div>
      </div>
    );
  }

  if (!sequence) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Outreach</div>
        <div className="mt-1 text-lg font-semibold text-slate-900">Sequence workspace</div>
      </div>
    );
  }

  const activeStep = sequence.steps[activeStepIndex];

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Outreach</div>
          <div className="mt-1 text-lg font-semibold text-slate-900">Sequence workspace</div>
          <div className="mt-1 text-sm text-slate-500">
            {contact.name} · {contact.title}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["Direct", "Consultative", "Executive"] as Tone[]).map((option) => (
            <button
              key={option}
              onClick={() => setTone(option)}
              className={cx(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                tone === option
                  ? "border-[#bfd0ff] bg-[#eef2ff] text-[#3157e0]"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {option}
            </button>
          ))}

          <button
            onClick={copyFullSequence}
            className="inline-flex items-center gap-2 rounded-full bg-[#3157e0] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#2949bd]"
          >
            <CopyIcon className="h-3.5 w-3.5" />
            {copyState === "copied" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <MetaPill label="Target" value={`${contact.name}, ${contact.title}`} />
        <MetaPill label="Angle" value={getAngle(contact)} />
        <MetaPill label="Approach" value={getApproach(contact)} />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        {sequence.steps.map((step, index) => {
          const active = index === activeStepIndex;

          return (
            <div key={step.id} className="flex items-center gap-3">
              <button
                onClick={() => setActiveStepIndex(index)}
                className="group inline-flex items-center gap-3 text-left"
              >
                <span
                  className={cx(
                    "flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition",
                    active ? "bg-[#3157e0] text-white shadow-sm" : "bg-[#dfe5ff] text-[#3157e0]"
                  )}
                >
                  {step.stepNumber}
                </span>

                <span
                  className={cx(
                    "text-base font-medium transition",
                    active ? "text-slate-900" : "text-slate-500"
                  )}
                >
                  {step.label}
                </span>
              </button>

              {index < sequence.steps.length - 1 && (
                <ArrowRightIcon className="h-4 w-4 text-slate-300" />
              )}
            </div>
          );
        })}
      </div>

      <div className="relative">
        <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between rounded-t-[28px] border-b border-slate-200 px-7 py-4">
            <div className="flex items-center gap-3">
              <span className="h-3.5 w-3.5 rounded-full bg-[#ec8d86]" />
              <span className="h-3.5 w-3.5 rounded-full bg-[#8bd2b6]" />
              <div className="ml-3 text-[15px] font-semibold text-slate-500">
                Step {activeStep.stepNumber} · Day{" "}
                {activeStep.stepNumber === 1 ? "0" : activeStep.stepNumber === 2 ? "3" : "7"}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[15px] font-medium text-slate-500">
              <ClockIcon className="h-4 w-4" />
              {activeStep.sendLabel}
            </div>
          </div>

          <div className="border-b border-slate-200 px-7 py-5">
            <div className="mb-4 flex items-center gap-3 text-[15px] text-slate-500">
              <UserIcon className="h-4 w-4" />
              <span>
                To: <span className="font-semibold text-slate-900">{contact.name}</span>{" "}
                <span className="text-slate-400">&lt;email&gt;</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-[15px] font-semibold text-slate-900">
              <MailIcon className="h-5 w-5 text-[#3157e0]" />
              {activeStep.subject}
            </div>
          </div>

          <div className="px-7 py-8">
            <div className="whitespace-pre-wrap text-[17px] leading-[1.9] text-slate-700">
              {activeStep.body}
            </div>
          </div>
        </div>

        <button
          onClick={prevStep}
          className="absolute left-0 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-lg transition hover:scale-[1.03]"
          aria-label="Previous step"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          onClick={nextStep}
          className="absolute right-0 top-1/2 z-10 flex h-14 w-14 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-lg transition hover:scale-[1.03]"
          aria-label="Next step"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-5 text-center text-sm text-slate-400">
        Use the arrows to navigate the sequence
      </div>
    </div>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-1 text-sm text-slate-700">{value}</div>
    </div>
  );
}

function useAgentActivity(account: Account | null) {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const runIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const currentRunId = ++runIdRef.current;

    async function run() {
      if (!account) {
        setActivity([]);
        return;
      }

      setActivity([]);
      const steps = AGENT_STEPS[account.id] ?? [
        "Analyzing account",
        "Pulling contacts",
        "Scoring personas",
        "Preparing outreach",
      ];

      for (let i = 0; i < steps.length; i++) {
        if (cancelled || runIdRef.current !== currentRunId) return;

        const itemId = `${account.id}_${i}`;
        setActivity((prev) => [...prev, { id: itemId, text: steps[i], status: "running" }]);

        await delay(450);

        if (cancelled || runIdRef.current !== currentRunId) return;

        setActivity((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, status: "done" } : item))
        );

        await delay(100);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [account]);

  return activity;
}

function useStreamedContacts(account: Account | null) {
  const [visibleContacts, setVisibleContacts] = useState<Contact[]>([]);
  const runIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const currentRunId = ++runIdRef.current;

    async function stream() {
      if (!account) {
        setVisibleContacts([]);
        return;
      }

      setVisibleContacts([]);

      for (let i = 0; i < account.contacts.length; i++) {
        if (cancelled || runIdRef.current !== currentRunId) return;
        await delay(320);
        if (cancelled || runIdRef.current !== currentRunId) return;

        setVisibleContacts((prev) => [...prev, account.contacts[i]]);
      }
    }

    stream();

    return () => {
      cancelled = true;
    };
  }, [account]);

  return visibleContacts;
}

function BaseIcon({
  className,
  children,
  viewBox = "0 0 24 24",
}: {
  className?: string;
  children: ReactNode;
  viewBox?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M12 3l1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3L7.5 7.5l3.3-1.2L12 3z" />
      <path d="M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
      <path d="M5.5 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" />
    </BaseIcon>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h.01" />
      <path d="M12 7h.01" />
      <path d="M16 7h.01" />
      <path d="M8 11h.01" />
      <path d="M12 11h.01" />
      <path d="M16 11h.01" />
      <path d="M10 21v-4h4v4" />
    </BaseIcon>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3.5" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 4.13A3.5 3.5 0 0 1 16 9.87" />
    </BaseIcon>
  );
}

function WandIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M4 20L20 4" />
      <path d="M14 4l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
      <path d="M18 10l.7-1.4L20 8l-1.3-.6L18 6l-.7 1.4L16 8l1.3.6L18 10z" />
      <path d="M7 17l-3 3" />
    </BaseIcon>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M6 9l6 6 6-6" />
    </BaseIcon>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M18 15l-6-6-6 6" />
    </BaseIcon>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M15 18l-6-6 6-6" />
    </BaseIcon>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M9 18l6-6-6-6" />
    </BaseIcon>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </BaseIcon>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.2 2.2 4.8-5.2" />
    </BaseIcon>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </BaseIcon>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </BaseIcon>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </BaseIcon>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M6 19c1.4-3 4-4.5 6-4.5s4.6 1.5 6 4.5" />
    </BaseIcon>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cx("animate-spin", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
