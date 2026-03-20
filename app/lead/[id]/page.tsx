"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getLeadById, leads as demoLeads } from "@/lib/data";
import { analyzeLead } from "@/lib/openai";
import { buildICP } from "@/lib/icp";
import { getSignalCards } from "@/lib/scoring";
import { Lead } from "@/lib/types";

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

export default function LeadPage() {
  const params = useParams<{ id: string }>();
  const [activeLeads, setActiveLeads] = useState<Lead[]>(demoLeads);
  const [loaded, setLoaded] = useState(false);
  const [analysis, setAnalysis] = useState<Awaited<ReturnType<typeof analyzeLead>> | null>(null);
  const [followUpTiming, setFollowUpTiming] = useState("5 days");

  useEffect(() => {
    const uploaded = localStorage.getItem("uploadedLeads");
    if (uploaded) {
      try {
        const parsed = JSON.parse(uploaded) as Lead[];
        if (Array.isArray(parsed) && parsed.length > 0) setActiveLeads(parsed);
      } catch {}
    }
    setLoaded(true);
  }, []);

  const lead = useMemo(() => activeLeads.find((item) => item.id === params.id) || getLeadById(params.id), [activeLeads, params.id]);
  const icp = useMemo(() => buildICP(activeLeads), [activeLeads]);

  useEffect(() => {
    if (lead) analyzeLead(lead).then(setAnalysis);
  }, [lead]);

  if (!loaded) return <main className="px-6 py-8"><div className="mx-auto max-w-4xl rounded-2xl border border-[#e7e9f0] bg-white p-8 shadow-sm">Loading lead...</div></main>;
  if (!lead) notFound();
  if (!analysis) return <main className="px-6 py-8"><div className="mx-auto max-w-4xl rounded-2xl border border-[#e7e9f0] bg-white p-8 shadow-sm">Analyzing lead...</div></main>;

  const signals = getSignalCards(lead);

  return (
    <main className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Back</Link>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900">{lead.name}</h1>
          <p className="text-gray-600">{lead.title} at {lead.company}</p>
        </div>

        <div className="mb-8 rounded-[28px] border border-[#e7e9f0] bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-[320px_1fr] md:items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Lead Score</p>
              <div className="mt-3 flex items-end gap-4">
                <div className={`text-8xl font-bold leading-none ${getScoreColor(analysis.score)}`}>{analysis.score}</div>
                <div className="pb-3 text-2xl font-medium text-gray-700">{getPriorityLabel(analysis.score)}</div>
              </div>
              <div className="mt-6 rounded-2xl border border-[#e7e9f0] bg-[#fafbff] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Recommended action</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{analysis.recommendedActionLabel}</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">{analysis.recommendedActionReason}</p>
              </div>
              <div className="mt-4 rounded-2xl border border-[#e7e9f0] bg-[#fafbff] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">ICP Match Score</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{analysis.icpMatchScore}</p>
                <p className="mt-2 text-sm text-gray-600">Compared against your best-performing segment: {icp.industry}, {icp.employeeBand} employees, {icp.persona}.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {signals.map((signal, index) => (
                <div key={index} className={`rounded-2xl border px-4 py-4 text-sm font-medium ${signal.active ? "border-green-200 bg-green-50 text-green-800" : "border-[#e7e9f0] bg-[#fafbff] text-gray-400"}`}>{signal.label}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Why this lead now</h2>
            <div className="mt-4 rounded-2xl bg-[#fafbff] p-4"><p className="text-sm leading-6 text-gray-800">{analysis.reasoning}</p></div>
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Priority drivers</p>
              <ul className="mt-3 space-y-3">{analysis.whyNow.map((item, index) => <li key={index} className="rounded-xl bg-[#fafbff] px-4 py-3 text-sm text-gray-700">{item}</li>)}</ul>
            </div>
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">ICP alignment</p>
              <ul className="mt-3 space-y-3">{analysis.icpMatchReasons.map((item, index) => <li key={index} className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-900">{item}</li>)}</ul>
            </div>
          </section>
          <section className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
            <div className="mt-4 space-y-3">{lead.activities.map((activity, index) => (
              <div key={index} className="rounded-xl bg-[#fafbff] px-4 py-4">
                <div className="flex items-center justify-between gap-4"><p className="text-sm font-medium capitalize text-gray-900">{activity.type.replace(/_/g, " ")}</p><p className="text-sm text-gray-500">{activity.daysAgo}d ago</p></div>
                <p className="mt-2 text-sm leading-6 text-gray-700">{activity.note}</p>
              </div>
            ))}</div>
          </section>
        </div>

        <section className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div><h2 className="text-lg font-semibold text-gray-900">Outreach sequence</h2><p className="mt-1 text-sm text-gray-600">Short, timing-aware messaging based on fit, signal and prior activity.</p></div>
            <div className="flex gap-2">{["3 days", "5 days", "7 days"].map((delay) => <button key={delay} onClick={() => setFollowUpTiming(delay)} className={followUpTiming === delay ? "rounded-full bg-gray-900 px-3 py-1 text-xs text-white" : "rounded-full border border-[#e7e9f0] px-3 py-1 text-xs text-gray-700"}>{delay}</button>)}</div>
          </div>
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border border-[#e7e9f0] bg-[#fafbff] p-5"><div className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">Email 1 · Send now</div><div className="rounded-xl border border-[#e7e9f0] bg-white p-5"><div className="mb-4 text-xs text-gray-500">From: Stephen<br />To: {lead.email}</div><pre className="whitespace-pre-wrap text-sm leading-7 text-gray-800">{analysis.email}</pre></div></div>
            <div className="rounded-2xl border border-[#e7e9f0] bg-[#fafbff] p-5"><div className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">Email 2 · Follow-up ({followUpTiming})</div><div className="rounded-xl border border-[#e7e9f0] bg-white p-5"><div className="mb-4 text-xs text-gray-500">From: Stephen<br />To: {lead.email}</div><pre className="whitespace-pre-wrap text-sm leading-7 text-gray-800">{analysis.followUpEmail}</pre></div></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3"><button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">{analysis.recommendedActionLabel}</button><button className="rounded-lg border border-[#e7e9f0] px-4 py-2 text-sm text-gray-700">Edit emails</button><button className="rounded-lg border border-[#e7e9f0] px-4 py-2 text-sm text-gray-700">Push to nurture</button></div>
        </section>
      </div>
    </main>
  );
}
