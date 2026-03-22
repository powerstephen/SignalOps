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

type SequenceDraft = {
  subject: string;
  email1: string;
  followUp1: string;
  followUp2: string;
};

type SequenceGenerationStep = {
  id: string;
  label: string;
  status: "running" | "done";
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
    "Pulling and ranking relevant decision makers",
    "Scoring personas by urgency and operational fit",
    "Preparing outreach angles for best entry points",
  ],
  acc_2: [
    "Analyzing stale outreach and new trigger signals",
    "Detected recent product launch and renewed engagement",
    "Reviewing best reopening path by persona",
    "Ranking contacts by strategic vs tactical influence",
    "Preparing reactivation angle",
    "Drafting next best outreach path",
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
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Warm":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Monitor":
      return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
    default:
      return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
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

function buildSequence(account: Account, contact: Contact, tone: Tone): SequenceDraft {
  const firstName = contact.name.split(" ")[0];
  const angle = getAngle(contact);
  const approach = getApproach(contact);
  const signalA = account.signals[0]?.value ?? "recent signal activity";
  const signalB = account.signals[1]?.value ?? "engagement activity";

  const subjectByTone: Record<Tone, string> = {
    Direct: `${account.name}: signal-led outreach for ${contact.title}`,
    Consultative: `Thought on ${account.name}'s current GTM timing`,
    Executive: `${account.name} growth signals and likely revenue pressure`,
  };

  const openerByTone: Record<Tone, string> = {
    Direct: `Noticed ${account.name} is showing signals like ${signalA}. Usually that means more pressure on the team to prioritise the right accounts and contacts fast.`,
    Consultative: `I was looking at ${account.name} and noticed a few signals, including ${signalA}. That combination often creates a window where account selection and contact prioritisation become much more important.`,
    Executive: `I noticed ${account.name} is showing signals such as ${signalA}. In many teams, that is the point where execution quality across targeting, contact selection and timing starts to materially affect pipeline outcomes.`,
  };

  const valueByTone: Record<Tone, string> = {
    Direct: `SignalOps helps revenue teams turn account-level signals into immediate contact-level action, so reps are not guessing who to work, why now, or what angle to use.`,
    Consultative: `SignalOps is designed to convert account intelligence into clear contact prioritisation and usable outreach paths, so teams can move from signals to action without adding manual research overhead.`,
    Executive: `SignalOps turns account-level intelligence into a usable operating layer for teams, helping convert signals into prioritised contacts, outreach angles and next-best actions.`,
  };

  const closeByTone: Record<Tone, string> = {
    Direct: `Worth sharing a few examples for how this could support ${account.name}'s current motion?`,
    Consultative: `Happy to share a few examples if useful, especially around how teams are reducing manual research and improving contact activation.`,
    Executive: `If helpful, I can send a concise example of how teams are using this to improve execution speed and relevance.`,
  };

  const followUp1ByTone: Record<Tone, string> = {
    Direct: `Following up in case this is a current focus. Given ${signalB}, I would guess the challenge is not a lack of accounts but deciding which people inside those accounts are worth acting on first.`,
    Consultative: `Wanted to follow up, mainly because the timing looks interesting. When signals like ${signalB} show up alongside role growth or product activity, teams often need a faster way to go from account insight to contact action.`,
    Executive: `A quick follow-up. Where teams often lose time here is in the gap between account intelligence and contact execution. That delay tends to reduce relevance and response rates.`,
  };

  const followUp2ByTone: Record<Tone, string> = {
    Direct: `Last note from me. The reason I reached out is that SignalOps seems especially relevant when a team is trying to scale without letting prioritisation quality fall away.`,
    Consultative: `Final note. The reason I thought of ${account.name} is that your current signals suggest a useful moment to tighten how targeting and contact activation work together.`,
    Executive: `Final note. My sense is that ${account.name} is at the kind of inflection point where better signal orchestration can improve both speed and GTM precision.`,
  };

  const email1 = [
    `Hi ${firstName},`,
    ``,
    openerByTone[tone],
    ``,
    `From your side, the likely issue is ${approach.toLowerCase()}.`,
    ``,
    `${valueByTone[tone]} In practice, that means your team gets a clear view of which contacts to prioritise, what makes them relevant now, and how to approach them.`,
    ``,
    `For ${account.name}, the immediate angle I would test is: ${angle.toLowerCase()}.`,
    ``,
    closeByTone[tone],
    ``,
    `Best,`,
    `Stephen`,
  ].join("\n");

  const followUp1 = [
    `Hi ${firstName},`,
    ``,
    followUp1ByTone[tone],
    ``,
    `That is usually where we see the biggest value: less manual digging, faster prioritisation, and more confidence in why a specific contact should be worked now.`,
    ``,
    `Happy to send over a simple example if helpful.`,
    ``,
    `Best,`,
    `Stephen`,
  ].join("\n");

  const followUp2 = [
    `Hi ${firstName},`,
    ``,
    followUp2ByTone[tone],
    ``,
    `Even a small improvement in how account signals get translated into contact-level action can have a meaningful effect on conversion efficiency.`,
    ``,
    `If it is useful, I can send a short breakdown tailored to ${account.name}.`,
    ``,
    `Best,`,
    `Stephen`,
  ].join("\n");

  return {
    subject: subjectByTone[tone],
    email1,
    followUp1,
    followUp2,
  };
}

export default function GeneratePage() {
  const [accounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
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
    <div className="min-h-screen bg-[#0a0d12] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <SparklesIcon className="h-3.5 w-3.5" />
              Generate
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Target accounts and let SignalOps work them
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-zinc-400">
              Activate an account, surface the best entry points, then generate signal-led outreach
              directly from the same workspace.
            </p>
          </div>

          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 lg:block">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Mode</div>
            <div className="mt-1 flex items-center gap-2 text-sm text-zinc-200">
              <WandIcon className="h-4 w-4 text-emerald-300" />
              Agent-assisted targeting
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20">
          <div className="grid grid-cols-12 gap-0 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.16em] text-zinc-500">
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
                <div key={account.id} className="border-b border-white/10 last:border-b-0">
                  <button
                    onClick={() =>
                      setExpandedAccountId((prev) => (prev === account.id ? null : account.id))
                    }
                    className="grid w-full grid-cols-12 items-center gap-0 px-5 py-4 text-left transition hover:bg-white/[0.03]"
                  >
                    <div className="col-span-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                          <BuildingIcon className="h-5 w-5 text-zinc-300" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{account.name}</div>
                          <div className="mt-0.5 text-sm text-zinc-400">{account.whyNow}</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        {account.segment}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <div className="text-sm font-medium text-white">{account.fitScore}/100</div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-sm font-medium text-white">{account.triggerScore}/100</div>
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
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
                    <div className="border-t border-white/10 bg-[#0d1117]">
                      <div className="grid grid-cols-1 gap-6 p-5 xl:grid-cols-12">
                        <aside className="xl:col-span-4">
                          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                            <div className="mb-5 flex items-center justify-between">
                              <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                                  Account context
                                </div>
                                <div className="mt-1 text-lg font-semibold text-white">
                                  {expandedAccount.name}
                                </div>
                              </div>

                              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                                Live
                              </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                              <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                                Why now
                              </div>
                              <p className="mt-2 text-sm leading-6 text-zinc-300">
                                {expandedAccount.whyNow}
                              </p>
                            </div>

                            <div className="mt-4">
                              <div className="mb-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
                                Signals
                              </div>
                              <div className="grid gap-3">
                                {expandedAccount.signals.map((signal) => (
                                  <div
                                    key={`${expandedAccount.id}-${signal.label}`}
                                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                                  >
                                    <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                                      {signal.label}
                                    </div>
                                    <div className="mt-1 text-sm text-zinc-200">{signal.value}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </aside>

                        <section className="xl:col-span-8">
                          <div className="grid gap-6">
                            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                              <div className="mb-4 flex items-center justify-between">
                                <div>
                                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                                    Agent activity
                                  </div>
                                  <div className="mt-1 text-lg font-semibold text-white">
                                    SignalOps is working this account
                                  </div>
                                </div>

                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">
                                  <SpinnerIcon className="h-3.5 w-3.5 text-emerald-300" />
                                  Live analysis
                                </div>
                              </div>

                              <AgentActivityFeed activity={activity} />
                            </div>

                            <div className="grid gap-6 lg:grid-cols-12">
                              <div className="lg:col-span-5">
                                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                                  <div className="mb-4 flex items-center justify-between">
                                    <div>
                                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                                        Prioritised contacts
                                      </div>
                                      <div className="mt-1 text-lg font-semibold text-white">
                                        Best entry points
                                      </div>
                                    </div>

                                    <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
                                      <UsersIcon className="h-4 w-4" />
                                      {streamedContacts.length}/{expandedAccount.contacts.length} surfaced
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    {streamedContacts.map((contact, index) => {
                                      const isSelected = selectedContactId === contact.id;

                                      return (
                                        <button
                                          key={contact.id}
                                          onClick={() => setSelectedContactId(contact.id)}
                                          className={cx(
                                            "w-full rounded-2xl border p-4 text-left transition",
                                            isSelected
                                              ? "border-emerald-500/30 bg-emerald-500/10"
                                              : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                                          )}
                                          style={{
                                            transitionDelay: `${index * 60}ms`,
                                          }}
                                        >
                                          <div className="flex items-start justify-between gap-3">
                                            <div>
                                              <div className="font-medium text-white">{contact.name}</div>
                                              <div className="mt-0.5 text-sm text-zinc-400">{contact.title}</div>
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

                                          <p className="mt-3 text-sm leading-6 text-zinc-300">
                                            {contact.reason}
                                          </p>

                                          {contact.channelHint && (
                                            <div className="mt-3 inline-flex items-center gap-2 text-xs text-zinc-500">
                                              <ArrowRightIcon className="h-3.5 w-3.5" />
                                              {contact.channelHint}
                                            </div>
                                          )}
                                        </button>
                                      );
                                    })}

                                    {streamedContacts.length < expandedAccount.contacts.length && (
                                      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4">
                                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                                          <SpinnerIcon className="h-4 w-4 text-emerald-300" />
                                          Identifying high-probability contacts
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="lg:col-span-7">
                                <SequenceWorkspace account={expandedAccount} contact={selectedContact} />
                              </div>
                            </div>
                          </div>
                        </section>
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
    <div className="space-y-3">
      {activity.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
        >
          <div className="mt-0.5">
            {item.status === "done" ? (
              <CheckCircleIcon className="h-4 w-4 text-emerald-300" />
            ) : (
              <SpinnerIcon className="h-4 w-4 text-emerald-300" />
            )}
          </div>

          <div className="flex-1">
            <div className="text-sm text-zinc-200">{item.text}</div>
          </div>

          <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">
            {item.status === "done" ? "Done" : "Running"}
          </div>
        </div>
      ))}

      {activity.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-400">
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
  const [mode, setMode] = useState<"plan" | "generating" | "ready">("plan");
  const [generationSteps, setGenerationSteps] = useState<SequenceGenerationStep[]>([]);
  const [draft, setDraft] = useState<SequenceDraft | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const runIdRef = useRef(0);

  useEffect(() => {
    setMode("plan");
    setGenerationSteps([]);
    setDraft(null);
    setCopyState("idle");
  }, [account.id, contact?.id]);

  async function startGeneration() {
    if (!contact) return;

    const currentRunId = ++runIdRef.current;

    const steps: string[] = [
      "Analyzing contact context",
      "Selecting outreach angle",
      "Drafting opener",
      "Writing follow-up 1",
      "Writing follow-up 2",
      "Finalising sequence",
    ];

    setMode("generating");
    setGenerationSteps([]);
    setDraft(null);
    setCopyState("idle");

    for (let i = 0; i < steps.length; i++) {
      if (runIdRef.current !== currentRunId) return;

      const id = `seq_step_${i}`;
      setGenerationSteps((prev) => [...prev, { id, label: steps[i], status: "running" }]);

      await delay(550);

      if (runIdRef.current !== currentRunId) return;

      setGenerationSteps((prev) =>
        prev.map((step) => (step.id === id ? { ...step, status: "done" } : step))
      );

      await delay(180);
    }

    if (runIdRef.current !== currentRunId) return;

    setDraft(buildSequence(account, contact, tone));
    setMode("ready");
  }

  async function copyFullSequence() {
    if (!draft || !contact) return;

    const text = [
      `Target: ${contact.name}, ${contact.title}`,
      `Account: ${account.name}`,
      `Tone: ${tone}`,
      ``,
      `Subject`,
      draft.subject,
      ``,
      `Email 1`,
      draft.email1,
      ``,
      `Follow-up 1`,
      draft.followUp1,
      ``,
      `Follow-up 2`,
      draft.followUp2,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("idle");
    }
  }

  if (!contact) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Outreach</div>
        <div className="mt-1 text-lg font-semibold text-white">Sequence workspace</div>
        <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-zinc-400">
          Select a surfaced contact to prepare outreach.
        </div>
      </div>
    );
  }

  const angle = getAngle(contact);
  const approach = getApproach(contact);
  const readyToPrepare = true;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Outreach</div>
          <div className="mt-1 text-lg font-semibold text-white">Sequence workspace</div>
          <div className="mt-1 text-sm text-zinc-400">
            {contact.name} · {contact.title}
          </div>
        </div>

        <div
          className={cx(
            "rounded-full border px-3 py-1 text-xs font-medium",
            mode === "ready"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : mode === "generating"
              ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
              : "border-white/10 bg-white/[0.04] text-zinc-400"
          )}
        >
          {mode === "ready" ? "Sequence ready" : mode === "generating" ? "Generating" : "Plan"}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["Direct", "Consultative", "Executive"] as Tone[]).map((option) => (
          <button
            key={option}
            onClick={() => setTone(option)}
            className={cx(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              tone === option
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {mode === "plan" && (
        <>
          <div className="space-y-3">
            <PlanRow label="Target" value={`${contact.name}, ${contact.title}`} />
            <PlanRow label="Account" value={account.name} />
            <PlanRow label="Angle" value={angle} />
            <PlanRow label="Approach" value={approach} />
            <PlanRow label="Tone" value={tone} />
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">Draft direction</div>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Lead with a signal tied to current urgency, connect that signal to a likely revenue or
              workflow problem, then position SignalOps as the system that turns account-level
              intelligence into fast, relevant contact activation.
            </p>
          </div>

          <button
            className={cx(
              "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition",
              readyToPrepare
                ? "bg-emerald-400 text-black hover:bg-emerald-300"
                : "cursor-not-allowed border border-white/10 bg-white/[0.04] text-zinc-500"
            )}
            onClick={startGeneration}
            disabled={!readyToPrepare}
          >
            <WandIcon className="h-4 w-4" />
            Prepare outreach
          </button>
        </>
      )}

      {mode === "generating" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
              Generation status
            </div>
            <div className="space-y-3">
              {generationSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="mt-0.5">
                    {step.status === "done" ? (
                      <CheckCircleIcon className="h-4 w-4 text-emerald-300" />
                    ) : (
                      <SpinnerIcon className="h-4 w-4 text-amber-300" />
                    )}
                  </div>
                  <div className="flex-1 text-sm text-zinc-200">{step.label}</div>
                  <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                    {step.status === "done" ? "Done" : "Running"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-400">
            SignalOps is drafting a multi-step sequence based on account signals, persona fit and selected
            tone.
          </div>
        </div>
      )}

      {mode === "ready" && draft && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={startGeneration}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.08]"
            >
              <RefreshIcon className="h-4 w-4" />
              Regenerate
            </button>

            <button
              onClick={() => {
                setMode("plan");
                setGenerationSteps([]);
                setDraft(null);
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.08]"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to plan
            </button>

            <button
              onClick={copyFullSequence}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-3 py-2 text-sm font-medium text-black transition hover:bg-emerald-300"
            >
              <CopyIcon className="h-4 w-4" />
              {copyState === "copied" ? "Copied" : "Copy sequence"}
            </button>
          </div>

          <SequenceCard label="Subject line" content={draft.subject} compact />
          <SequenceCard label="Email 1" content={draft.email1} />
          <SequenceCard label="Follow-up 1" content={draft.followUp1} />
          <SequenceCard label="Follow-up 2" content={draft.followUp2} />
        </div>
      )}
    </div>
  );
}

function SequenceCard({
  label,
  content,
  compact = false,
}: {
  label: string;
  content: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-2 text-xs uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div
        className={cx(
          "whitespace-pre-wrap text-sm leading-6 text-zinc-200",
          compact ? "font-medium text-white" : ""
        )}
      >
        {content}
      </div>
    </div>
  );
}

function PlanRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</div>
      <div className="mt-1 text-sm text-zinc-200">{value}</div>
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

        await delay(650);

        if (cancelled || runIdRef.current !== currentRunId) return;

        setActivity((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, status: "done" } : item))
        );

        await delay(220);
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
        await delay(500);
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

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </BaseIcon>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M19 12H5" />
      <path d="M11 18l-6-6 6-6" />
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

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.2 2.2 4.8-5.2" />
    </BaseIcon>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M20 11a8 8 0 0 0-14.9-3" />
      <path d="M4 4v5h5" />
      <path d="M4 13a8 8 0 0 0 14.9 3" />
      <path d="M20 20v-5h-5" />
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
