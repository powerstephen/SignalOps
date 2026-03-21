"use client";

import { useMemo, useState } from "react";
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
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-green-600 text-white shadow-sm"
          : "bg-green-100 text-green-700 hover:bg-green-200"
      }`}
    >
      {label}
    </button>
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
          active
            ? "bg-green-100 text-green-900"
            : "bg-gray-100 text-gray-800"
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

  const activeEmail =
    emails.find((email) => email.id === activeEmailId) ?? emails[0];

  const activeIndex = emails.findIndex((email) => email.id === activeEmail.id);
  const prevEmail = activeIndex > 0 ? emails[activeIndex - 1] : null;
  const nextEmail =
    activeIndex < emails.length - 1 ? emails[activeIndex + 1] : null;

  function canOpen(emailId: number) {
    return emailId <= approvedUpTo;
  }

  function handleApprove() {
    const nextApproved = Math.min(approvedUpTo + 1, emails.length);
    setApprovedUpTo(nextApproved);

    if (activeEmailId < emails.length) {
      setActiveEmailId(activeEmailId + 1);
      setActiveSignalId(null);
    }
  }

  function handleRegenerate() {
    setActiveSignalId(null);
    setActiveEmailId((current) => current);
  }

  function handleSelectEmail(emailId: number) {
    if (!canOpen(emailId)) return;
    setActiveEmailId(emailId);
    setActiveSignalId(null);
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
                onClick={handleRegenerate}
                className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Regenerate
              </button>
              <button
                onClick={handleApprove}
                className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                {approvedUpTo < emails.length ? "Approve & continue" : "Approved"}
              </button>
            </div>
          </div>

          <div className="relative h-[460px] overflow-hidden">
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

            <div className="absolute left-1/2 top-0 z-10 h-[400px] w-[72%] -translate-x-1/2 rounded-3xl border border-gray-200 bg-white px-8 py-8 shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-400">
                    {activeEmail.label}
                  </div>
                  <div className="mt-2 text-xl font-semibold text-gray-950">
                    {activeEmail.subject}
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
                <p className="whitespace-pre-wrap">{activeEmail.intro}</p>

                {activeEmail.paragraphs.map((paragraph, index) => (
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
