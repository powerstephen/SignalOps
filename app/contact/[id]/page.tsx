"use client";

import { useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { recoverLeads } from "@/lib/recover-leads";

function Pill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
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

type EmailStep = {
  id: number;
  label: string;
  subject: string;
  body: string;
};

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
      subject: `Worth reconnecting?`,
      body: `Hi ${firstName},

Noticed ${whyNow.toLowerCase()} and, given we previously ${interactionSummary.toLowerCase()}, thought it might be a good time to reconnect.

There looked to be real interest before, but it never turned into a clear next step.

Based on what we are seeing now, there may be a strong opportunity to pick this back up.

Open to a quick chat?`,
    },
    {
      id: 2,
      label: "Email 2",
      subject: `Quick follow up`,
      body: `Hi ${firstName},

Just following up on my note below.

Usually when we see signals like this from ${company}, it means the timing may be better now than when we first spoke.

Happy to share a few ideas if useful.`,
    },
    {
      id: 3,
      label: "Email 3",
      subject: `Close the loop`,
      body: `Hi ${firstName},

Last note from me.

Given the renewed activity we are seeing from ${company}, I thought it was worth one final follow up in case this is back on the agenda.

If not relevant, no problem at all.`,
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

  const activeEmail =
    emails.find((email) => email.id === activeEmailId) ?? emails[0];

  const isUnlocked = (emailId: number) => emailId <= approvedUpTo;

  function handleApprove() {
    setApprovedUpTo((current) => Math.min(current + 1, emails.length));
  }

  function handleRegenerate() {
    setActiveEmailId((current) => current);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-10 md:px-10">
      <div className="space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
          <div className="text-6xl font-semibold leading-none text-green-600">
            {lead.score}
          </div>

          <div>
            <div className="text-2xl font-semibold tracking-tight text-gray-950">
              {lead.name}
            </div>
            <div className="mt-1 text-gray-600">
              {lead.role} at {lead.company}
            </div>
          </div>

          <div className="md:ml-auto flex max-w-[520px] flex-wrap gap-2">
            <Pill label="Recent Engagement" />
            <Pill label="Dormant Opportunity" />
            <Pill label="High ICP Match" />
            <Pill label="Senior Persona" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-[0_0_0_1px_rgba(17,24,39,0.06)]">
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Signals
            </div>

            <p className="mt-5 text-base leading-7 text-gray-900">
              {lead.whyNow}
            </p>

            <ul className="mt-6 space-y-3 text-sm leading-7 text-gray-600">
              <li>• Prior interaction showed clear interest</li>
              <li>• Lead matches a strong ICP persona</li>
              <li>• Recent activity suggests renewed timing</li>
              <li>• Worth re-engaging with a fresh angle now</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-[0_0_0_1px_rgba(17,24,39,0.06)]">
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Activity
            </div>

            <div className="mt-5 space-y-6">
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

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="rounded-3xl bg-white p-8 shadow-[0_0_0_1px_rgba(17,24,39,0.06)] xl:col-span-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  {activeEmail.label}
                </div>
                <div className="mt-2 text-lg font-semibold text-gray-950">
                  {activeEmail.subject}
                </div>
              </div>

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
                  {approvedUpTo < emails.length ? "Approve" : "Approved"}
                </button>
              </div>
            </div>

            <div className="mt-8 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-gray-900">
              {activeEmail.body}
            </div>
          </div>

          {emails
            .filter((email) => email.id !== activeEmail.id)
            .map((email) => {
              const unlocked = isUnlocked(email.id);

              return (
                <button
                  key={email.id}
                  type="button"
                  onClick={() => unlocked && setActiveEmailId(email.id)}
                  className={`relative min-h-[320px] rounded-3xl p-6 text-left shadow-[0_0_0_1px_rgba(17,24,39,0.06)] transition xl:col-span-2 ${
                    unlocked
                      ? "bg-white hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(17,24,39,0.08)]"
                      : "cursor-not-allowed bg-gray-100"
                  }`}
                >
                  <div className="text-xs uppercase tracking-wide text-gray-400">
                    {email.label}
                  </div>

                  <div className="mt-20 text-center text-4xl font-semibold tracking-tight text-gray-950">
                    {email.id}
                  </div>

                  {!unlocked ? (
                    <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/80 px-3 py-2 text-center text-xs font-medium text-gray-500 backdrop-blur">
                      Unlock after {email.id - 1 === 1 ? "Email 1" : `Email ${email.id - 1}`}
                    </div>
                  ) : null}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
