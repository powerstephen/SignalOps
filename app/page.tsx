"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { leads as demoLeads } from "@/lib/data";
import { buildICP, calculateICPMatchScore } from "@/lib/icp";
import { getICPFit, getLeadScore, getLeadState, getPersona, getPriority } from "@/lib/scoring";
import { normalizeDeals, buildICPFromDeals } from "@/lib/deals";
import { signals, scoreSignal, getSignalReasons } from "@/lib/signals";
import { Lead } from "@/lib/types";

function badge(score: number) {
  if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
  if (score >= 60) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"recover" | "generate">("recover");
  const [activeLeads, setActiveLeads] = useState<Lead[]>(demoLeads);
  const [deals, setDeals] = useState<any[]>([]);
  const [dataMode, setDataMode] = useState("demo");

  useEffect(() => {
    if (searchParams.get("mode") === "generate") setMode("generate");
  }, [searchParams]);

  useEffect(() => {
    const storedLeads = localStorage.getItem("uploadedLeads");
    const storedDeals = localStorage.getItem("uploadedDeals");
    const storedMode = localStorage.getItem("dataMode");
    if (storedLeads) {
      try {
        const parsed = JSON.parse(storedLeads) as Lead[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveLeads(parsed);
          setDataMode(storedMode || "uploaded");
        }
      } catch {}
    }
    if (storedDeals) {
      try {
        const parsed = JSON.parse(storedDeals);
        if (Array.isArray(parsed)) setDeals(parsed);
      } catch {}
    }
  }, []);

  const icp = useMemo(() => {
    if (deals.length > 0) {
      const built = buildICPFromDeals(normalizeDeals(deals));
      if (built) return built;
    }
    return buildICP(activeLeads);
  }, [activeLeads, deals]);

  const enrichedLeads = useMemo(() => activeLeads.map((lead) => ({
    ...lead,
    icpFit: getICPFit(lead),
    persona: getPersona(lead.title),
    state: getLeadState(lead),
    priority: getPriority(lead),
    score: getLeadScore(lead),
    icpMatchScore: calculateICPMatchScore(lead, icp),
  })).sort((a, b) => b.score - a.score), [activeLeads, icp]);

  const enrichedSignals = useMemo(() => signals.map((signal) => ({
    ...signal,
    score: scoreSignal(signal),
    reasons: getSignalReasons(signal),
  })).sort((a, b) => b.score - a.score), []);

  const highValueDormant = enrichedLeads.filter((lead) => lead.score >= 80 && lead.lastContactedDays > 60);
  const estimatedPipeline = highValueDormant.length * (icp.avgDealSize || 20000);
  const pipelineMatches = enrichedLeads.filter((lead) => lead.icpMatchScore >= 70).length;
  const pipelineQuality = enrichedLeads.length > 0 ? Math.round((pipelineMatches / enrichedLeads.length) * 100) : 0;

  return (
    <main className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Revenue workspace</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">{mode === "recover" ? "Recover pipeline" : "Generate pipeline"}</h1>
              <p className="mt-3 max-w-3xl text-base text-gray-600">
                Surface the highest value existing and net-new revenue opportunities using CRM data, deals history and external triggers.
              </p>
            </div>
            <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {dataMode === "sample" ? "Sample data" : dataMode === "uploaded" ? "Imported data" : "Demo data"}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <button onClick={() => setMode("recover")} className={mode === "recover" ? "rounded-lg bg-gray-900 px-3 py-2 font-medium text-white" : "rounded-lg border border-[#e7e9f0] px-3 py-2 text-gray-700"}>Recover</button>
            <button onClick={() => setMode("generate")} className={mode === "generate" ? "rounded-lg bg-gray-900 px-3 py-2 font-medium text-white" : "rounded-lg border border-[#e7e9f0] px-3 py-2 text-gray-700"}>Generate</button>
            <Link href="/opportunities" className="rounded-lg border border-[#e7e9f0] px-3 py-2 text-gray-700">Opportunities</Link>
          </div>
        </section>

        {mode === "recover" && (
          <>
            <section className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-gray-900 p-5 text-white">
                  <p className="text-sm text-gray-300">Missed opportunity</p>
                  <p className="mt-2 text-2xl font-semibold">€{estimatedPipeline.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-gray-300">{highValueDormant.length} high-value leads not contacted in 60+ days</p>
                </div>
                <div className="rounded-2xl border border-[#e7e9f0] bg-[#fbfcfe] p-5">
                  <p className="text-sm text-gray-500">Revenue-backed ICP</p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">{icp.label}</p>
                  <p className="mt-2 text-sm text-gray-600">Avg deal €{icp.avgDealSize.toLocaleString()} · Win rate {icp.winRate}%</p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm text-amber-800">Pipeline quality</p>
                  <p className="mt-2 text-xl font-semibold text-amber-900">{pipelineQuality}% match</p>
                  <p className="mt-2 text-sm text-amber-800">Share of pipeline matching your best-performing ICP</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {icp.notes.map((note, index) => (
                  <div key={index} className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">{note}</div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#e7e9f0] bg-white shadow-sm">
              <div className="border-b border-[#e7e9f0] px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Existing pipeline</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#fafbff]">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-6 py-4 font-medium">Lead</th>
                      <th className="px-6 py-4 font-medium">Company</th>
                      <th className="px-6 py-4 font-medium">Score</th>
                      <th className="px-6 py-4 font-medium">ICP</th>
                      <th className="px-6 py-4 font-medium">State</th>
                      <th className="px-6 py-4 font-medium">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eef1f6]">
                    {enrichedLeads.map((lead) => (
                      <tr key={lead.id} className="text-sm text-gray-700">
                        <td className="px-6 py-4">
                          <Link href={`/lead/${lead.id}`} className="font-medium text-gray-900 hover:text-gray-600">{lead.name}</Link>
                          <p className="mt-1 text-xs text-gray-500">{lead.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{lead.company}</p>
                          <p className="mt-1 text-xs text-gray-500">{lead.companyData.signal}</p>
                        </td>
                        <td className="px-6 py-4"><span className={`inline-flex min-w-[52px] justify-center rounded-full border px-3 py-1 text-xs font-semibold ${badge(lead.score)}`}>{lead.score}</span></td>
                        <td className="px-6 py-4"><span className={`inline-flex min-w-[52px] justify-center rounded-full border px-3 py-1 text-xs font-semibold ${badge(lead.icpMatchScore)}`}>{lead.icpMatchScore}</span></td>
                        <td className="px-6 py-4">{lead.state}</td>
                        <td className="px-6 py-4"><span className={lead.priority === "High" ? "rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white" : lead.priority === "Medium" ? "rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-900" : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"}>{lead.priority}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {mode === "generate" && (
          <section className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">New opportunities detected</h2>
              <p className="mt-1 text-sm text-gray-600">External signals that appear to match your revenue-backed ICP.</p>
            </div>
            <div className="space-y-4">
              {enrichedSignals.map((signal) => (
                <div key={signal.id} className="flex flex-col gap-4 rounded-2xl border border-[#e7e9f0] p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-base font-semibold text-gray-900">{signal.company}</p>
                      <span className={`inline-flex min-w-[52px] justify-center rounded-full border px-3 py-1 text-xs font-semibold ${badge(signal.score)}`}>{signal.score}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{signal.persona} · {signal.industry} · {signal.employees} employees · {signal.location}</p>
                    <p className="mt-2 text-sm font-medium text-gray-900">{signal.signal}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {signal.reasons.map((reason, index) => (
                        <span key={index} className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800">{reason}</span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/signals/${signal.id}`} className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">Generate outreach</Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
