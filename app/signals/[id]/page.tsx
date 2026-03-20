"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSignalById, scoreSignal, getSignalReasons, getSignalReasoning, generateSignalEmails, getSignalDrivers, getSignalRecommendedAction } from "@/lib/signals";
import { buildICPFromDeals, normalizeDeals } from "@/lib/deals";
import { estimatePipelineImpact } from "@/lib/pipeline";

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-500";
  return "text-gray-400";
}

function getPriorityLabel(score: number) {
  if (score >= 80) return "High Priority";
  if (score >= 60) return "Medium Priority";
  return "Low Priority";
}

function formatCurrency(value: number) {
  return `€${value.toLocaleString()}`;
}

export default function SignalPage() {
  const params = useParams<{ id: string }>();
  const signal = getSignalById(params.id);
  const [icp, setIcp] = useState<ReturnType<typeof buildICPFromDeals> | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("uploadedDeals");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return;
      setIcp(buildICPFromDeals(normalizeDeals(parsed)));
    } catch {}
  }, []);

  if (!signal) notFound();

  const score = scoreSignal(signal);
  const reasons = getSignalReasons(signal);
  const drivers = getSignalDrivers(signal);
  const reasoning = getSignalReasoning(signal);
  const emails = generateSignalEmails(signal);
  const recommendedAction = getSignalRecommendedAction(signal);
  const pipeline = estimatePipelineImpact(score);

  return (
    <main className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Back</Link>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900">{signal.company}</h1>
          <p className="text-gray-600">{signal.persona} · {signal.industry}</p>
        </div>

        <div className="mb-8 rounded-[28px] border border-[#e7e9f0] bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-[320px_1fr] md:items-center">
            <div>
              <p className="text-sm text-gray-500">Signal Score</p>
              <div className="mt-3 flex items-end gap-4"><div className={`text-8xl font-bold ${getScoreColor(score)}`}>{score}</div><div className="pb-3 text-2xl text-gray-700">{getPriorityLabel(score)}</div></div>
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4"><p className="text-xs uppercase text-green-700">Estimated pipeline impact</p><p className="mt-2 text-2xl font-semibold text-green-900">{formatCurrency(pipeline.pipelineValue)}</p><p className="mt-1 text-sm text-green-800">Based on your avg deal size and win rate</p></div>
              <div className="mt-4 rounded-2xl border border-[#e7e9f0] bg-[#fafbff] p-4"><p className="text-xs uppercase text-gray-500">Recommended action</p><p className="mt-2 text-lg font-semibold text-gray-900">{recommendedAction.label}</p><p className="mt-2 text-sm text-gray-600">{recommendedAction.reason}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{reasons.slice(0, 4).map((reason, i) => <div key={i} className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{reason}</div>)}</div>
          </div>
        </div>

        {icp && (
          <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6">
            <h2 className="text-lg font-semibold text-green-900">Based on your actual revenue data</h2>
            <p className="mt-2 text-sm text-green-800">Your best customers typically look like:</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-green-100 bg-white p-4"><p className="text-xs text-gray-500">Industry</p><p className="text-sm font-semibold text-gray-900">{icp.industry}</p></div>
              <div className="rounded-xl border border-green-100 bg-white p-4"><p className="text-xs text-gray-500">Company size</p><p className="text-sm font-semibold text-gray-900">{icp.employeeBand}</p></div>
              <div className="rounded-xl border border-green-100 bg-white p-4"><p className="text-xs text-gray-500">Buyer persona</p><p className="text-sm font-semibold text-gray-900">{icp.persona}</p></div>
            </div>
            <p className="mt-4 text-sm text-green-900">→ This company scores highly because it matches that pattern.</p>
          </div>
        )}

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Why this opportunity</h2>
            <div className="mt-4 rounded-xl bg-[#fafbff] p-4"><p className="text-sm">{reasoning}</p></div>
            <ul className="mt-4 space-y-2">{drivers.map((d, i) => <li key={i} className="text-sm text-gray-700">• {d}</li>)}</ul>
          </section>
          <section className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Trigger</h2>
            <p className="mt-4 text-sm text-gray-800">{signal.signal}</p>
          </section>
        </div>

        <section className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Outbound</h2>
          <div className="mt-6 space-y-6">
            <div className="rounded-xl bg-[#fafbff] p-5"><pre className="whitespace-pre-wrap text-sm">{emails.email}</pre></div>
            <div className="rounded-xl bg-[#fafbff] p-5"><pre className="whitespace-pre-wrap text-sm">{emails.followUpEmail}</pre></div>
          </div>
        </section>
      </div>
    </main>
  );
}
