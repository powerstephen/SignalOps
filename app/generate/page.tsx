"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Signal = {
  label: string;
  value: string;
};

type Contact = {
  id: string;
  name: string;
  title: string;
  score: "High Intent" | "Warm" | "Monitor";
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

function scoreBadgeClasses(score: Contact["score"]) {
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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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

    if (streamedContacts.length > 0 && !selectedContactId) {
      setSelectedContactId(streamedContacts[0].id);
    }
  }, [expandedAccount, streamedContacts, selectedContactId]);

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
              Select an account to activate the agent. Contacts are prioritised in real time and prepared
              for outreach based on fit, trigger strength and likely buying urgency.
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
                              <div className="lg:col-span-7">
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
                                            "opacity-100 translate-y-0",
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
                                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${scoreBadgeClasses(
                                                contact.score
                                              )}`}
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

                              <div className="lg:col-span-5">
                                <SequencePrepPanel
                                  account={expandedAccount}
                                  contact={
                                    streamedContacts.find((c) => c.id === selectedContactId) ?? null
                                  }
                                  ready={activity.length >= 4}
                                />
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

function SequencePrepPanel({
  account,
  contact,
  ready,
}: {
  account: Account;
  contact: Contact | null;
  ready: boolean;
}) {
  if (!contact) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Outreach</div>
        <div className="mt-1 text-lg font-semibold text-white">Sequence preparation</div>
        <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-400">
          Select a surfaced contact to prepare outreach.
        </div>
      </div>
    );
  }

  const angle =
    contact.score === "High Intent"
      ? "Urgent pipeline efficiency angle"
      : contact.score === "Warm"
      ? "Context-led relevance angle"
      : "Light-touch awareness angle";

  const approach =
    contact.title.toLowerCase().includes("revenue operations") ||
    contact.title.toLowerCase().includes("operations")
      ? "Operational ROI and workflow efficiency"
      : contact.title.toLowerCase().includes("sales")
      ? "Pipeline pressure and prioritisation support"
      : "Strategic relevance with supporting proof points";

  const tone =
    contact.score === "High Intent" ? "Direct and insight-led" : "Measured and relevant";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Outreach</div>
          <div className="mt-1 text-lg font-semibold text-white">SignalOps plan</div>
        </div>

        <div
          className={cx(
            "rounded-full px-3 py-1 text-xs font-medium border",
            ready
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-white/10 bg-white/[0.04] text-zinc-400"
          )}
        >
          {ready ? "Ready to prepare" : "Preparing"}
        </div>
      </div>

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
          Lead with a signal tied to current urgency, connect that signal to a likely revenue or workflow
          problem, then position SignalOps as the system that turns account-level intelligence into fast,
          relevant contact activation.
        </p>
      </div>

      <button
        className={cx(
          "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition",
          ready
            ? "bg-emerald-400 text-black hover:bg-emerald-300"
            : "cursor-not-allowed border border-white/10 bg-white/[0.04] text-zinc-500"
        )}
        disabled={!ready}
      >
        {ready ? (
          <>
            <WandIcon className="h-4 w-4" />
            Prepare outreach
          </>
        ) : (
          <>
            <SpinnerIcon className="h-4 w-4" />
            Agent still working
          </>
        )}
      </button>
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
  children: React.ReactNode;
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
