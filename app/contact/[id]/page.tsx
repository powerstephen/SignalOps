"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { recoverLeads } from "@/lib/recover-leads";

function Pill({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const classes = active
    ? "bg-green-600 text-white shadow-sm"
    : "bg-green-100 text-green-700 hover:bg-green-200";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`rounded-full px-3 py-1 text-xs font-medium transition ${classes}`}
      >
        {label}
      </button>
    );
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium transition ${classes}`}
    >
      {label}
    </span>
  );
}

function ReasonChip({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const classes = active
    ? "border-gray-900 bg-gray-900 text-white"
    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${classes}`}
      >
        {label}
      </button>
    );
  }

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${classes}`}
    >
      {label}
    </span>
  );
}

function TimelineDot({ type }: { type: string }) {
  const colors =
    type === "email"
      ? "bg-blue-500"
      : type === "meeting"
        ? "bg-purple-500"
        : type === "activity"
          ? "bg-green-500"
          : "bg-gray-400";

  return <div className={`mt-1 h-2.5 w-2.5 rounded-full ${colors}`} />;
}

type Props = {
  params: { id: string };
};

type EmailSignal = {
  id: string;
  label: string;
  phrase: string;
};

type EmailStep = {
  id: number;
  label: string;
  subject: string;
  intro: string;
  paragraphs: string[];
  signals: EmailSignal[];
};

type EmailDraft = {
  subject: string;
  intro: string;
  paragraphs: string[];
};

type DraftMode = "default" | "shorter" | "warmer" | "direct" | "stronger-cta";

function highlightPhrase(
  text: string,
  phrase: string,
  active: boolean
): React.ReactNode {
  if (!phrase || !text.toLowerCase().includes(phrase.toLowerCase())) {
    return text;
  }

  const index = text.toLowerCase().indexOf(phrase.toLowerCase());
  const before = text.slice(0, index);
  const match = text.slice(index, index + phrase.length);
  const after = text.slice(index + phrase.length);

  return (
    <>
      {before}
      <span
        className={`rounded-md px-1 py-0.5 transition ${
          active ? "bg-green-100 text-green-900" : "bg-gray-100 text-gray-800"
        }`}
      >
        {match}
      </span>
      {after}
    </>
  );
}

function renderParagraph(
  paragraph: string,
  signals: EmailSignal[],
  activeSignalId: string | null
) {
  let rendered: React.ReactNode = paragraph;

  for (const signal of signals) {
    if (typeof rendered === "string") {
      rendered = highlightPhrase(
        rendered,
        signal.phrase,
        activeSignalId === signal.id
      );
    }
  }

  return rendered;
}

function buildEmailSteps(
  firstName: string,
  company: string,
  whyNow: string,
  interactionSummary: string
): EmailStep[] {
  return [
    {
      id: 1,
      label: "Email 1",
      subject: "Worth reconnecting?",
      intro: `Hi ${firstName},`,
      paragraphs: [
        `Noticed revisited pricing and recent activity from ${company}, and given we previously had positive engagement, thought it might be a good time to reconnect.`,
        `There looked to be real interest before, but it never turned into a clear next step.`,
        `The latest signals suggest renewed timing, so it felt worth reaching out with a fresh angle.`,
        `Open to a quick chat?`,
      ],
      signals: [
        {
          id: "pricing",
          label: "Pricing revisit",
          phrase: "revisited pricing",
        },
        {
          id: "engagement",
          label: "Prior positive engagement",
          phrase: "positive engagement",
        },
        {
          id: "timing",
          label: "Renewed timing",
          phrase: "renewed timing",
        },
      ],
    },
    {
      id: 2,
      label: "Email 2",
      subject: "Quick follow up",
      intro: `Hi ${firstName},`,
      paragraphs: [
        `Just following up on my note below.`,
        `Usually when we see signals like renewed activity from ${company}, it means the timing may be better now than when we first spoke.`,
        `Happy to share a few ideas if useful.`,
      ],
      signals: [
        {
          id: "renewed-activity",
          label: "Renewed activity",
          phrase: "renewed activity",
        },
        {
          id: "better-timing",
          label: "Timing improved",
          phrase: "timing may be better now",
        },
      ],
    },
    {
      id: 3,
      label: "Email 3",
      subject: "Close the loop",
      intro: `Hi ${firstName},`,
      paragraphs: [
        `Last note from me.`,
        `Given the renewed activity we are seeing from ${company}, I thought it was worth one final follow up in case this is back on the agenda.`,
        `If not relevant, no problem at all.`,
      ],
      signals: [
        {
          id: "final-renewed",
          label: "Renewed activity",
          phrase: "renewed activity",
        },
        {
          id: "back-on-agenda",
          label: "Back on agenda",
          phrase: "back on the agenda",
        },
      ],
    },
  ];
}

function getReasoning(
  emailId: number,
  company: string,
  whyNow: string,
  interactionSummary: string
) {
  const base = {
    confidence: 92,
    whyNow:
      whyNow ||
      `Recent engagement and renewed activity from ${company} suggest the timing has improved.`,
    tone:
      "This email uses a warm and confident tone because the lead is not cold. There was prior interest, so the copy should feel like reactivation rather than prospecting.",
    cta:
      "The CTA is intentionally light. A quick chat is the lowest-friction next step and fits a lead that showed interest before but did not convert.",
    evidence: [
      "Renewed activity detected",
      "Strong ICP match",
      "Prior engagement exists",
      "No clear next step previously",
    ],
    personalization:
      interactionSummary ||
      `The draft references prior engagement and current activity to make the message feel timely and specific.`,
  };

  if (emailId === 1) {
    return {
      ...base,
      stepTitle: "Why Email 1",
      stepReason:
        "This is the opening reactivation email. Its job is to reconnect the thread, acknowledge fresh timing, and create an easy path back into conversation.",
    };
  }

  if (emailId === 2) {
    return {
      ...base,
      confidence: 88,
      stepTitle: "Why Email 2",
      stepReason:
        "This follow up keeps momentum without adding pressure. It assumes the first email was seen and reinforces that the timing may be better now.",
    };
  }

  return {
    ...base,
    confidence: 81,
    stepTitle: "Why Email 3",
    stepReason:
      "This close-the-loop message creates urgency without sounding aggressive. It gives the lead one final opportunity to respond while keeping the door open.",
  };
}

function buildDraftForMode(
  email: EmailStep,
  mode: DraftMode,
  firstName: string,
  company: string
): EmailDraft {
  if (mode === "default") {
    return {
      subject: email.subject,
      intro: email.intro,
      paragraphs: email.paragraphs,
    };
  }

  if (email.id === 1) {
    if (mode === "shorter") {
      return {
        subject: "Worth reconnecting?",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `Noticed renewed activity from ${company} and thought the timing might be better now.`,
          `Given the earlier interest, felt it was worth reaching out again.`,
          `Open to a quick chat?`,
        ],
      };
    }

    if (mode === "warmer") {
      return {
        subject: "Worth reconnecting?",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `Hope you are well. I noticed renewed activity from ${company} and it made me think this could be a good time to reconnect.`,
          `We had some positive engagement before, and it felt like there was real interest even if it did not turn into a next step at the time.`,
          `Happy to pick things back up if useful.`,
          `Would a quick chat next week suit?`,
        ],
      };
    }

    if (mode === "direct") {
      return {
        subject: "Reconnecting on timing",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `I noticed renewed activity from ${company} and wanted to reach out directly.`,
          `There was clear interest previously, but no defined next step.`,
          `The current signals suggest better timing now.`,
          `Are you open to a quick conversation this week?`,
        ],
      };
    }

    if (mode === "stronger-cta") {
      return {
        subject: "Worth reconnecting this week?",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `Noticed revisited pricing and recent activity from ${company}, and given our previous engagement, this looked like the right moment to reconnect.`,
          `There seemed to be genuine interest before, but it never converted into a clear next step.`,
          `The latest signals suggest this may be back on the agenda.`,
          `Would Tuesday or Wednesday suit for a 15 minute call?`,
        ],
      };
    }
  }

  if (email.id === 2) {
    if (mode === "shorter") {
      return {
        subject: "Quick follow up",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `Just following up on my earlier note.`,
          `The latest signals from ${company} suggest the timing may be better now.`,
          `Happy to share a few ideas if helpful.`,
        ],
      };
    }

    if (mode === "warmer") {
      return {
        subject: "Quick follow up",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `Just wanted to gently follow up on my note below.`,
          `We often see this kind of renewed activity from ${company} when priorities are shifting and timing improves.`,
          `Happy to share a few thoughts if that would be useful.`,
        ],
      };
    }

    if (mode === "direct") {
      return {
        subject: "Following up",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `Following up on my note below.`,
          `We are seeing renewed activity from ${company}, which usually points to better timing.`,
          `Is it worth reopening the conversation?`,
        ],
      };
    }

    if (mode === "stronger-cta") {
      return {
        subject: "Quick follow up on timing",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `Just following up on my note below.`,
          `Usually when we see signals like this from ${company}, it means the timing may be better now than when we first spoke.`,
          `Would it make sense to lock 15 minutes next week?`,
        ],
      };
    }
  }

  if (email.id === 3) {
    if (mode === "shorter") {
      return {
        subject: "Close the loop",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `Last note from me.`,
          `We are seeing renewed activity from ${company}, so I wanted to check if this is back on the agenda.`,
          `If not, no problem at all.`,
        ],
      };
    }

    if (mode === "warmer") {
      return {
        subject: "Close the loop",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `Last note from me and then I will leave it there.`,
          `I noticed renewed activity from ${company} and thought it was worth one final follow up in case this has become more relevant again.`,
          `If the timing is not right, no problem at all.`,
        ],
      };
    }

    if (mode === "direct") {
      return {
        subject: "Final follow up",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `Final follow up from me.`,
          `The current signals suggest this may be back on the agenda at ${company}.`,
          `Should I close this out, or is it worth a quick conversation?`,
        ],
      };
    }

    if (mode === "stronger-cta") {
      return {
        subject: "Final follow up",
        intro: `Hi ${firstName},`,
        paragraphs: [
          `Last note from me.`,
          `Given the renewed activity we are seeing from ${company}, I thought it was worth one final follow up in case this is back on the agenda.`,
          `If useful, I can hold 15 minutes on Thursday or Friday.`,
        ],
      };
    }
  }

  return {
    subject: email.subject,
    intro: email.intro,
    paragraphs: email.paragraphs,
  };
}

function getModeLabel(mode: DraftMode) {
  if (mode === "shorter") return "Shorter";
  if (mode === "warmer") return "Warmer";
  if (mode === "direct") return "More direct";
  if (mode === "stronger-cta") return "Stronger CTA";
  return "Original";
}

export default function ContactPage({ params }: Props) {
  const lead = recoverLeads.find((l) => l.id === params.id);

  if (!lead) {
    notFound();
  }

  const firstName = lead.name.split(" ")[0];

  const emails = useMemo(
    () =>
      buildEmailSteps(
        firstName,
        lead.company,
        lead.whyNow,
        lead.interactionSummary
      ),
    [firstName, lead.company, lead.whyNow, lead.interactionSummary]
  );

  const [activeEmailId, setActiveEmailId] = useState(1);
  const [approvedUpTo, setApprovedUpTo] = useState(1);
  const [activeSignalId, setActiveSignalId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draftMode, setDraftMode] = useState<DraftMode>("default");
  const [showUpdatedBadge, setShowUpdatedBadge] = useState(false);

  const activeEmail =
    emails.find((email) => email.id === activeEmailId) ?? emails[0];

  const activeIndex = emails.findIndex((email) => email.id === activeEmail.id);
  const prevEmail = activeIndex > 0 ? emails[activeIndex - 1] : null;
  const nextEmail =
    activeIndex < emails.length - 1 ? emails[activeIndex + 1] : null;

  const reasoning = useMemo(
    () =>
      getReasoning(
        activeEmail.id,
        lead.company,
        lead.whyNow,
        lead.interactionSummary
      ),
    [activeEmail.id, lead.company, lead.whyNow, lead.interactionSummary]
  );

  const activeDraft = useMemo(
    () => buildDraftForMode(activeEmail, draftMode, firstName, lead.company),
    [activeEmail, draftMode, firstName, lead.company]
  );

  useEffect(() => {
    if (draftMode === "default") {
      setShowUpdatedBadge(false);
      return;
    }

    setShowUpdatedBadge(true);
    const timeout = setTimeout(() => setShowUpdatedBadge(false), 2200);
    return () => clearTimeout(timeout);
  }, [draftMode, activeEmailId]);

  function canOpen(emailId: number) {
    return emailId <= approvedUpTo;
  }

  function handleApprove() {
    const nextApproved = Math.min(approvedUpTo + 1, emails.length);
    setApprovedUpTo(nextApproved);

    if (activeEmailId < emails.length) {
      setActiveEmailId(activeEmailId + 1);
      setActiveSignalId(null);
      setDraftMode("default");
    }
  }

  function handleRegenerate() {
    setActiveSignalId(null);
    setDraftMode("default");
  }

  function handleSelectEmail(emailId: number) {
    if (!canOpen(emailId)) return;
    setActiveEmailId(emailId);
    setActiveSignalId(null);
    setDraftMode("default");
  }

  function handleSignalClick(signalId: string) {
    setActiveSignalId((current) => (current === signalId ? null : signalId));
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-8 md:px-10">
      <div className="space-y-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="text-6xl font-semibold leading-none text-green-600">
                {lead.score}
              </div>

              <div className="min-w-0">
                <div className="text-2xl font-semibold tracking-tight text-gray-950">
                  {lead.name}
                </div>
                <div className="mt-1 text-gray-600">
                  {lead.role} at {lead.company}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Pill label="Recent Engagement" />
              <Pill label="Dormant Opportunity" />
              <Pill label="High ICP Match" />
              <Pill label="Senior Persona" />
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-gray-400">
                Signals
              </div>

              <p className="mt-4 text-base leading-7 text-gray-900">
                {lead.whyNow}
              </p>

              <ul className="mt-6 space-y-3 text-sm leading-7 text-gray-600">
                <li>• Prior interaction showed clear interest</li>
                <li>• Lead matches a strong ICP persona</li>
                <li>• Recent activity suggests renewed timing</li>
                <li>• Worth re-engaging with a fresh angle now</li>
              </ul>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Activity
            </div>

            <div className="mt-4 space-y-5">
              {lead.timeline.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <TimelineDot type={item.type} />

                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                    <div className="mt-1 text-sm leading-6 text-gray-600">
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-medium text-gray-400">Sequence</div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDrawerOpen((current) => !current)}
                className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                  drawerOpen
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {drawerOpen ? "Hide reasoning" : "Why this email?"}
              </button>

              <button
                onClick={handleRegenerate}
                className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Reset draft
              </button>

              <button
                onClick={handleApprove}
                className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                {approvedUpTo < emails.length ? "Approve & continue" : "Approved"}
              </button>
            </div>
          </div>

          <div
            className={`overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 transition-all duration-300 ${
              drawerOpen
                ? "mb-6 max-h-[520px] p-6 opacity-100"
                : "mb-0 max-h-0 px-6 py-0 opacity-0"
            }`}
          >
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                    AI confidence
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="text-3xl font-semibold tracking-tight text-gray-950">
                      {reasoning.confidence}
                    </div>
                    <div className="h-2 w-full max-w-[220px] overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-green-600 transition-all"
                        style={{ width: `${reasoning.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                    Why now
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {reasoning.whyNow}
                  </p>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                    {reasoning.stepTitle}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {reasoning.stepReason}
                  </p>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                    Personalization anchor
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {reasoning.personalization}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                    Why this tone
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {reasoning.tone}
                  </p>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                    Why this CTA
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {reasoning.cta}
                  </p>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                    Key evidence used
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {reasoning.evidence.map((item) => (
                      <ReasonChip key={item} label={item} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                    Quick AI actions
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ReasonChip
                      label="Shorter"
                      active={draftMode === "shorter"}
                      onClick={() => setDraftMode("shorter")}
                    />
                    <ReasonChip
                      label="Warmer"
                      active={draftMode === "warmer"}
                      onClick={() => setDraftMode("warmer")}
                    />
                    <ReasonChip
                      label="More direct"
                      active={draftMode === "direct"}
                      onClick={() => setDraftMode("direct")}
                    />
                    <ReasonChip
                      label="Stronger CTA"
                      active={draftMode === "stronger-cta"}
                      onClick={() => setDraftMode("stronger-cta")}
                    />
                    <ReasonChip
                      label="Original"
                      active={draftMode === "default"}
                      onClick={() => setDraftMode("default")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] overflow-hidden">
            {prevEmail ? (
              <button
                type="button"
                onClick={() => handleSelectEmail(prevEmail.id)}
                className={`absolute left-0 top-12 z-0 h-[320px] w-[18%] rounded-3xl border border-gray-200 bg-white px-4 py-6 text-left shadow-[0_0_0_1px_rgba(17,24,39,0.04)] transition ${
                  canOpen(prevEmail.id)
                    ? "hover:-translate-y-0.5"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <div className="mt-24 text-center text-5xl font-semibold tracking-tight text-gray-900">
                  {prevEmail.id}
                </div>
              </button>
            ) : null}

            <div className="absolute left-1/2 top-0 z-10 h-[440px] w-[72%] -translate-x-1/2 rounded-3xl border border-gray-200 bg-white px-8 py-8 shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs uppercase tracking-wide text-gray-400">
                      {activeEmail.label}
                    </div>

                    {draftMode !== "default" ? (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700">
                        {getModeLabel(draftMode)}
                      </span>
                    ) : null}

                    {showUpdatedBadge ? (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700">
                        AI updated draft
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 text-xl font-semibold text-gray-950">
                    {activeDraft.subject}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {emails.map((email) => (
                    <button
                      key={email.id}
                      type="button"
                      onClick={() => handleSelectEmail(email.id)}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        email.id === activeEmail.id
                          ? "bg-gray-900"
                          : canOpen(email.id)
                            ? "bg-gray-300 hover:bg-gray-400"
                            : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                  AI used these signals
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeEmail.signals.map((signal) => (
                    <Pill
                      key={signal.id}
                      label={signal.label}
                      active={activeSignalId === signal.id}
                      onClick={() => handleSignalClick(signal.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 max-w-3xl text-sm leading-7 text-gray-900">
                <p className="whitespace-pre-wrap">{activeDraft.intro}</p>

                {activeDraft.paragraphs.map((paragraph, index) => (
                  <p key={index} className="mt-6">
                    {renderParagraph(
                      paragraph,
                      activeEmail.signals,
                      activeSignalId
                    )}
                  </p>
                ))}
              </div>
            </div>

            {nextEmail ? (
              <button
                type="button"
                onClick={() => handleSelectEmail(nextEmail.id)}
                className={`absolute right-0 top-12 z-0 h-[320px] w-[18%] rounded-3xl border border-gray-200 bg-white px-4 py-6 text-left shadow-[0_0_0_1px_rgba(17,24,39,0.04)] transition ${
                  canOpen(nextEmail.id)
                    ? "hover:-translate-y-0.5"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <div className="mt-24 text-center text-5xl font-semibold tracking-tight text-gray-900">
                  {nextEmail.id}
                </div>

                {!canOpen(nextEmail.id) ? (
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-gray-50 px-3 py-2 text-center text-xs font-medium text-gray-500">
                    Locked
                  </div>
                ) : null}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
