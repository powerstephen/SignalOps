"use client";

import { useEffect, useMemo, useState } from "react";
import { leads as demoLeads } from "@/lib/data";
import { buildICP, calculateICPMatchScore } from "@/lib/icp";
import {
  getICPFit,
  getLeadScore,
  getLeadState,
  getPersona,
  getPriority,
} from "@/lib/scoring";
import { normalizeDeals, buildICPFromDeals } from "@/lib/deals";
import { signals, scoreSignal, getSignalReasons } from "@/lib/signals";
import { Lead } from "@/lib/types";
import Link from "next/link";

function getScoreStyles(score: number) {
  if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
  if (score >= 60) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

export default function HomePage() {
  const [mode, setMode] = useState<"recover" | "generate">("recover");
  const [activeLeads, setActiveLeads] = useState<Lead[]>(demoLeads);
  const [deals, setDeals] = useState<any[]>([]);
  const [dataMode, setDataMode] = useState("demo");

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
      } catch {
        setActiveLeads(demoLeads);
        setDataMode("demo");
      }
    }

    if (storedDeals) {
      try {
        const parsed = JSON.parse(storedDeals);
        if (Array.isArray(parsed)) {
          setDeals(parsed);
        }
      } catch {
        setDeals([]);
      }
    }
  }, []);

  const icp = useMemo(() => {
    if (deals.length > 0) {
      const built = buildICPFromDeals(normalizeDeals(deals));
      if (built) return built;
    }
    return buildICP(activeLeads);
  }, [activeLeads, deals]);

  const enrichedLeads = useMemo(
    () =>
      activeLeads
        .map((lead) => ({
          ...lead,
          icpFit: getICPFit(lead),
          persona: getPersona(lead.title),
          state: getLeadState(lead),
          priority: getPriority(lead),
          score: getLeadScore(lead),
          icpMatchScore: calculateICPMatchScore(lead, icp),
        }))
        .sort((a, b) => b.score - a.score),
    [activeLeads, icp]
  );

  const enrichedSignals = useMemo(
    () =>
      signals
        .map((signal) => ({
          ...signal,
          score: scoreSignal(signal),
          reasons: getSignalReasons(signal),
        }))
        .sort((a, b) => b.score - a.score),
    []
  );

  const pipelineMatches = enrichedLeads.filter(
    (lead) => lead.icpMatchScore >= 70
  ).length;

  const pipelineQuality =
    enrichedLeads.length > 0
      ? Math.round((pipelineMatches / enrichedLeads.length) * 100)
      : 0;

  const highValueDormant = enrichedLeads.filter(
    (lead) => lead.score >= 80 && lead.lastContactedDays > 60
  );

  const estimatedPipeline = highValueDormant.length * (icp.avgDealSize || 20000);

  const highPriorityCount = enrichedLeads.filter(
    (lead) => lead.priority === "High"
  ).length;

  const warmNeglectedCount = enrichedLeads.filter(
    (lead) => lead.state === "Warm but Neglected"
  ).length;

  const highICPCount = enrichedLeads.filter(
    (lead) => lead.icpMatchScore >= 80
  ).length;

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500">
            Revenue Intelligence Workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
            {mode === "recover" ? "Recover pipeline" : "Generate pipeline"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            {mode === "recover"
              ? "Identify neglected opportunities already sitting in your CRM and prioritise the ones most likely to convert."
              : "Surface new high-fit companies based on external signals and rank them against your revenue-backed ICP."}
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
            {dataMode === "sample"
              ? "Sample data loaded"
              : dataMode === "uploaded"
              ? "Uploaded data loaded"
              : "Demo mode"}
          </div>
        </div>

        {mode === "recover" && (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Missed opportunities</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {highValueDormant.length}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Leads not contacted in 60+ days
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Recoverable pipeline</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  €{estimatedPipeline.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Based on current ICP deal size
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Pipeline quality</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {pipelineQuality}%
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Matches your best-performing ICP
                </p>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  ICP Recommendation
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Industry
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {icp.industry}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Company size
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {icp.employeeBand}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Primary persona
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {icp.persona}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Avg deal size
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    €{icp.avgDealSize.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Win rate
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {icp.winRate}%
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {icp.notes.map((note, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-900"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">High priority leads</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {highPriorityCount}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Strong ICP matches</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {highICPCount}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Warm but neglected</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {warmNeglectedCount}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Existing pipeline
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-6 py-4 font-medium">Lead</th>
                      <th className="px-6 py-4 font-medium">Company</th>
                      <th className="px-6 py-4 font-medium">Score</th>
                      <th className="px-6 py-4 font-medium">ICP Match</th>
                      <th className="px-6 py-4 font-medium">Persona</th>
                      <th className="px-6 py-4 font-medium">State</th>
                      <th className="px-6 py-4 font-medium">Priority</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {enrichedLeads.map((lead) => (
                      <tr key={lead.id} className="text-sm text-gray-700">
                        <td className="px-6 py-4">
                          <Link
                            href={`/lead/${lead.id}`}
                            className="font-medium text-gray-900 hover:text-gray-600"
                          >
                            {lead.name}
                          </Link>
                          <p className="mt-1 text-xs text-gray-500">
                            {lead.title}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {lead.company}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {lead.companyData.signal}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex min-w-[52px] justify-center rounded-full border px-3 py-1 text-xs font-semibold ${getScoreStyles(
                              lead.score
                            )}`}
                          >
                            {lead.score}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex min-w-[52px] justify-center rounded-full border px-3 py-1 text-xs font-semibold ${getScoreStyles(
                              lead.icpMatchScore
                            )}`}
                          >
                            {lead.icpMatchScore}
                          </span>
                        </td>

                        <td className="px-6 py-4">{lead.persona}</td>
                        <td className="px-6 py-4">{lead.state}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              lead.priority === "High"
                                ? "bg-black text-white"
                                : lead.priority === "Medium"
                                ? "bg-gray-200 text-gray-900"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {mode === "generate" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                New opportunities detected
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                External signals that appear to match your ICP and may deserve outbound attention.
              </p>
            </div>

            <div className="space-y-4">
              {enrichedSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-base font-semibold text-gray-900">
                        {signal.company}
                      </p>
                      <span
                        className={`inline-flex min-w-[52px] justify-center rounded-full border px-3 py-1 text-xs font-semibold ${getScoreStyles(
                          signal.score
                        )}`}
                      >
                        {signal.score}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      {signal.persona} · {signal.industry} · {signal.employees}{" "}
                      employees · {signal.location}
                    </p>

                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {signal.signal}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {signal.reasons.map((reason, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/signals/${signal.id}`}
                      className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                    >
                      Generate outreach
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
