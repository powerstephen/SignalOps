"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useMemo } from "react";
import {
  getSignalById,
  scoreSignal,
  getSignalTags,
  getSignalReasons,
  getSignalSummary,
  getSignalAngle,
  generateSignalEmails,
} from "@/lib/signals";

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-gray-600";
}

export default function SignalPage() {
  const params = useParams<{ id: string }>();

  const signal = useMemo(() => getSignalById(params.id), [params.id]);

  if (!signal) return notFound();

  const score = scoreSignal(signal);
  const tags = getSignalTags(signal);
  const reasons = getSignalReasons(signal);
  const summary = getSignalSummary(signal);
  const angle = getSignalAngle(signal);
  const emails = generateSignalEmails(signal);

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <Link href="/generate" className="text-sm text-gray-500 hover:text-black">
            ← Back
          </Link>
        </div>

        <div className="mb-6 flex items-center gap-6 rounded-xl border bg-white p-6">
          <div className={`text-5xl font-semibold ${getScoreColor(score)}`}>
            {score}
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">
              {signal.company}
            </h1>
            <p className="text-sm text-gray-600">{signal.persona}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-sm font-medium text-gray-500">Signals</h2>

            <div className="mt-3 space-y-2 text-sm text-gray-800">
              {reasons.length > 0 ? (
                reasons.map((reason, i) => <div key={i}>• {reason}</div>)
              ) : (
                <div className="text-gray-500">No strong signals detected</div>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-sm font-medium text-gray-500">Summary</h2>
            <p className="mt-3 text-sm leading-6 text-gray-800">{summary}</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-sm font-medium text-gray-500">Recommended angle</h2>

            <div className="mt-3 space-y-3 text-sm text-gray-800">
              <div>
                <div className="font-medium text-gray-900">Trigger</div>
                <div className="text-gray-600">{signal.signal}</div>
              </div>

              <div>
                <div className="font-medium text-gray-900">Context</div>
                <div className="text-gray-600">
                  {signal.industry} · {signal.employees} employees · {signal.location}
                </div>
              </div>

              <div>
                <div className="font-medium text-gray-900">Best angle</div>
                <div className="text-gray-600">{angle}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Email 1</h2>

          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-800">
              {emails.email}
            </pre>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Follow-up</h2>

          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-800">
              {emails.followUpEmail}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
