"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

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
  sent?: Contact[];
};

type SequenceStep = {
  id: string;
  stepNumber: number;
  label: string;
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
    whyNow: "Hiring across revenue roles suggests pipeline pressure.",
    signals: [
      { label: "Hiring", value: "5 SDRs + 2 AEs" },
      { label: "Intent", value: "Pricing pages" },
      { label: "Funding", value: "Series A" },
      { label: "Tech", value: "HubSpot + SF" },
    ],
    contacts: [
      { id: "c1", name: "Sarah Chen", title: "Head of Sales", score: "High Intent" },
      { id: "c2", name: "Marcus Lee", title: "VP RevOps", score: "High Intent" },
      { id: "c3", name: "Elena Park", title: "Director Growth", score: "Warm" },
    ],
    sent: [],
  },
  {
    id: "acc_2",
    name: "SignalForge",
    segment: "Reactivation Opportunity",
    fitScore: 89,
    triggerScore: 83,
    whyNow: "New workflow launch and stale outreach suggest a reopening opportunity.",
    signals: [
      { label: "Product", value: "New AI workflow" },
      { label: "Engagement", value: "Site return visits" },
      { label: "Last Touch", value: "74 days ago" },
      { label: "Region", value: "EMEA expansion" },
    ],
    contacts: [
      { id: "c4", name: "Nina Patel", title: "Chief Revenue Officer", score: "High Intent" },
      { id: "c5", name: "Tom Alvarez", title: "Director Sales Development", score: "Warm" },
      { id: "c6", name: "Holly Reed", title: "VP Marketing", score: "Monitor" },
    ],
    sent: [],
  },
  {
    id: "acc_3",
    name: "NorthBeam AI",
    segment: "Expansion Signal",
    fitScore: 91,
    triggerScore: 87,
    whyNow: "New market activity and role growth suggest expansion pressure.",
    signals: [
      { label: "Hiring", value: "Growth + Sales" },
      { label: "News", value: "New market entry" },
      { label: "Intent", value: "High engagement" },
      { label: "Stack", value: "Apollo + HubSpot" },
    ],
    contacts: [
      { id: "c7", name: "James Walker", title: "VP Growth", score: "High Intent" },
      { id: "c8", name: "Priya Nair", title: "Head of Revenue Operations", score: "Warm" },
      { id: "c9", name: "Adam Brooks", title: "CEO", score: "Monitor" },
    ],
    sent: [],
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function scoreStyle(score: ContactScore) {
  if (score === "High Intent") return "bg-[#3157e0] text-white border-[#3157e0]";
  if (score === "Warm") return "bg-[#fff6df] text-[#c97700] border-[#f6d28b]";
  return "bg-slate-100 text-slate-500 border-slate-200";
}

function buildSequence(account: Account, contact: Contact, tone: Tone): SequenceBundle {
  const firstName = contact.name.split(" ")[0];
  const signalA = account.signals[0]?.value ?? "recent trigger event";

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
            `SignalOps helps convert account intelligence into clearer contact prioritisation and usable outreach paths, without adding manual research overhead.`,
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
          `Usually the challenge is not a lack of accounts but deciding which people inside those accounts are worth acting on first.`,
          ``,
          `That is where we typically see the biggest value: less manual digging, faster prioritisation, and more confidence in why a specific contact should be worked now.`,
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
            `Teams often need a faster way to go from account insight to contact action, especially when growth or buying signals start to cluster.`,
            ``,
            `I can send over a short example if that would be useful.`,
            ``,
            `Cheers,`,
            `Stephen`,
          ].join("\n")
        : [
            `Hi ${firstName},`,
            ``,
            `A quick follow-up.`,
            ``,
            `Where teams often lose time is in the gap between account intelligence and contact execution. That delay tends to reduce relevance and response rates.`,
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
      { id: "1", stepNumber: 1, label: "Initial", subject: subject1, body: body1 },
      { id: "2", stepNumber: 2, label: "Follow-up", subject: `Re: ${account.name}'s outbound`, body: body2 },
      { id: "3", stepNumber: 3, label: "Breakup", subject: "Closing the loop", body: body3 },
    ],
  };
}

export default function GeneratePage() {
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>("acc_1");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const expandedAccount = useMemo(
    () => accounts.find((a) => a.id === expandedAccountId) ?? null,
    [accounts, expandedAccountId]
  );

  useEffect(() => {
    if (!expandedAccount) {
      setSelectedContactId(null);
      return;
    }

    const hasSelected = expandedAccount.contacts.some((c) => c.id === selectedContactId);
    if (!hasSelected) {
      setSelectedContactId(expandedAccount.contacts[0]?.id ?? null);
    }
  }, [expandedAccount, selectedContactId]);

  const selectedContact =
    expandedAccount?.contacts.find((contact) => contact.id === selectedContactId) ?? null;

  function handleSendSequence(contact: Contact) {
    if (!expandedAccount) return;

    setAccounts((prev) =>
      prev.map((account) =>
        account.id === expandedAccount.id
          ? {
              ...account,
              contacts: account.contacts.filter((c) => c.id !== contact.id),
              sent: [...(account.sent ?? []), contact],
            }
          : account
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-4">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#dbe3ff] bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#3157e0]">
            <SparklesIcon className="h-3.5 w-3.5" />
            Generate
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight">
            Target accounts and move directly into outreach
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Compact company context, clean contact selection, practical sequence view.
          </p>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
          <div className="grid grid-cols-12 border-b border-slate-200 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">
            <div className="col-span-5">Account</div>
            <div className="col-span-2">Segment</div>
            <div className="col-span-2">Fit</div>
            <div className="col-span-2">Trigger</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {accounts.map((account) => {
            const isExpanded = expandedAccountId === account.id;

            return (
              <div key={account.id} className="border-b border-slate-200 last:border-b-0">
                <button
                  onClick={() =>
                    setExpandedAccountId((prev) => (prev === account.id ? null : account.id))
                  }
                  className="grid w-full grid-cols-12 items-center px-5 py-3 text-left transition hover:bg-slate-50"
                >
                  <div className="col-span-5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                        <BuildingIcon className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[15px] font-medium text-slate-900">
                          {account.name}
                        </div>
                        <div className="truncate text-[13px] text-slate-500">{account.whyNow}</div>
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

                  <div className="col-span-1 flex justify-end">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe3ff] bg-[#eef2ff] px-3 py-1.5 text-xs font-medium text-[#3157e0]">
                      {isExpanded ? "Hide" : "Open"}
                      {isExpanded ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </button>

                {isExpanded && expandedAccount?.id === account.id && (
                  <div className="border-t border-slate-200 bg-[#fcfcfd] p-4">
                    <div className="grid gap-4">
                      <div className="grid gap-4 lg:grid-cols-12">
                        <div className="lg:col-span-4">
                          <div className="rounded-[18px] border border-slate-200 bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                              Signals
                            </div>

                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                              {expandedAccount.signals.map((signal) => (
                                <div
                                  key={`${expandedAccount.id}-${signal.label}`}
                                  className="rounded-[14px] bg-slate-50 px-4 py-3"
                                >
                                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                                    {signal.label}
                                  </div>
                                  <div className="mt-1 text-[15px] font-medium leading-6 text-slate-900">
                                    {signal.value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-8">
                          <div className="rounded-[18px] border border-slate-200 bg-white p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                Best entry points
                              </div>
                              <div className="text-sm font-medium text-slate-500">
                                {expandedAccount.contacts.length}/{expandedAccount.contacts.length}
                              </div>
                            </div>

                            {expandedAccount.contacts.length === 0 ? (
                              <div className="py-6 text-sm text-slate-500">
                                No contacts remaining for this account.
                              </div>
                            ) : (
                              <div className="divide-y divide-slate-200">
                                {expandedAccount.contacts.map((contact) => {
                                  const isSelected = selectedContactId === contact.id;

                                  return (
                                    <button
                                      key={contact.id}
                                      onClick={() => setSelectedContactId(contact.id)}
                                      className={cx(
                                        "grid w-full grid-cols-12 items-center gap-3 py-3 text-left transition",
                                        isSelected ? "bg-[#f5f8ff]" : "bg-white"
                                      )}
                                    >
                                      <div className="col-span-4 min-w-0 pl-1">
                                        <div
                                          className={cx(
                                            "truncate text-[15px] font-semibold",
                                            isSelected ? "text-[#3157e0]" : "text-slate-900"
                                          )}
                                        >
                                          {contact.name}
                                        </div>
                                      </div>

                                      <div className="col-span-4 min-w-0">
                                        <div className="truncate text-[15px] text-slate-600">
                                          {contact.title}
                                        </div>
                                      </div>

                                      <div className="col-span-3 flex justify-end">
                                        <span
                                          className={cx(
                                            "inline-flex rounded-full border px-3 py-1 text-[11px] font-medium",
                                            scoreStyle(contact.score)
                                          )}
                                        >
                                          {contact.score}
                                        </span>
                                      </div>

                                      <div className="col-span-1 flex justify-end pr-1">
                                        <ArrowRightIcon
                                          className={cx(
                                            "h-4 w-4",
                                            isSelected ? "text-[#3157e0]" : "text-slate-300"
                                          )}
                                        />
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {(expandedAccount.sent?.length ?? 0) > 0 && (
                              <div className="mt-4 border-t border-slate-200 pt-4">
                                <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                  Sent
                                </div>
                                <div className="space-y-2">
                                  {expandedAccount.sent?.map((contact) => (
                                    <div
                                      key={contact.id}
                                      className="flex items-center justify-between rounded-[12px] bg-slate-50 px-3 py-2"
                                    >
                                      <div className="text-[14px] text-slate-700">
                                        {contact.name}
                                      </div>
                                      <div className="text-[12px] text-slate-400">Sent</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <SequenceWorkspace
                        account={expandedAccount}
                        contact={selectedContact}
                        onSendSequence={handleSendSequence}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SequenceWorkspace({
  account,
  contact,
  onSendSequence,
}: {
  account: Account;
  contact: Contact | null;
  onSendSequence: (contact: Contact) => void;
}) {
  const [tone, setTone] = useState<Tone>("Direct");
  const [sequence, setSequence] = useState<SequenceBundle | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    setSequence(null);
    setActiveStepIndex(0);
    setStatus("idle");
  }, [account.id, contact?.id]);

  useEffect(() => {
    if (!contact) return;
    setSequence(buildSequence(account, contact, tone));
    setActiveStepIndex(0);
    setStatus("idle");
  }, [account, contact, tone]);

  function prevStep() {
    if (!sequence) return;
    setActiveStepIndex((prev) => (prev === 0 ? sequence.steps.length - 1 : prev - 1));
  }

  function nextStep() {
    if (!sequence) return;
    setActiveStepIndex((prev) => (prev === sequence.steps.length - 1 ? 0 : prev + 1));
  }

  function handleSend() {
    if (!contact || status !== "idle") return;

    const currentContact = contact;
    setStatus("sending");

    window.setTimeout(() => {
      setStatus("sent");
      onSendSequence(currentContact);
    }, 800);
  }

  if (!contact) {
    return (
      <div className="rounded-[18px] border border-slate-200 bg-white p-4">
        <div className="text-[18px] font-semibold text-slate-900">Sequence workspace</div>
        <div className="mt-3 rounded-[16px] border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          No contact selected. Choose the next entry point above.
        </div>
      </div>
    );
  }

  if (!sequence) {
    return (
      <div className="rounded-[18px] border border-slate-200 bg-white p-4">
        <div className="text-[18px] font-semibold text-slate-900">Sequence workspace</div>
      </div>
    );
  }

  const activeStep = sequence.steps[activeStepIndex];

  return (
    <div className="rounded-[18px] border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[18px] font-semibold text-slate-900">Sequence workspace</div>

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
            onClick={handleSend}
            disabled={status !== "idle"}
            className={cx(
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              status === "idle" && "bg-[#3157e0] text-white hover:bg-[#2949bd]",
              status === "sending" && "bg-slate-200 text-slate-600",
              status === "sent" && "bg-emerald-500 text-white"
            )}
          >
            {status === "idle" && "Send sequence"}
            {status === "sending" && "Sending..."}
            {status === "sent" && "Sent ✓"}
          </button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {sequence.steps.map((step, index) => {
            const active = index === activeStepIndex;

            return (
              <div key={step.id} className="flex items-center gap-3">
                <button
                  onClick={() => setActiveStepIndex(index)}
                  className="inline-flex items-center gap-3 text-left"
                >
                  <span
                    className={cx(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition",
                      active ? "bg-[#3157e0] text-white" : "bg-[#dfe5ff] text-[#3157e0]"
                    )}
                  >
                    {step.stepNumber}
                  </span>

                  <span
                    className={cx(
                      "text-[14px] font-medium",
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

        <div className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">
          Schedule
        </div>
      </div>

      <div className="relative">
        <div className="rounded-[18px] border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3 text-[14px] font-semibold text-slate-900">
              <MailIcon className="h-4 w-4 text-[#3157e0]" />
              {activeStep.subject}
            </div>
          </div>

          <div className="px-4 py-4">
            <div className="whitespace-pre-wrap text-[14px] leading-[1.8] text-slate-700">
              {activeStep.body}
            </div>
          </div>
        </div>

        <button
          onClick={prevStep}
          className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:scale-[1.02]"
          aria-label="Previous step"
        >
          <ChevronLeftIcon className="h-4.5 w-4.5" />
        </button>

        <button
          onClick={nextStep}
          className="absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:scale-[1.02]"
          aria-label="Next step"
        >
          <ChevronRightIcon className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
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
