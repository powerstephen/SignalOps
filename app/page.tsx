"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { leads as demoLeads } from "@/lib/data";
import { buildICP } from "@/lib/icp";
import {
  getLeadScore,
  getLeadState,
  getPriority,
} from "@/lib/scoring";
import { normalizeDeals } from "@/lib/deals";
import { Lead } from "@/lib/types";

function getScoreStyles(score: number) {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-700";
}

export default function RecoverPage() {
  const [activeLeads, setActiveLeads] = useState<Lead[]>(demoLeads);
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    const storedLeads = localStorage.getItem("uploadedLeads");
    const storedDeals = localStorage.getItem("uploadedDeals");

    if (storedLeads) {
      try {
        const parsed = JSON.parse(storedLeads);
        if (Array.isArray(parsed)) setActiveLeads(parsed);
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
    return buildICP(activeLeads);
  }, [activeLeads]);

  const enrichedLeads = useMemo(() => {
    return activeLeads
      .map((lead) => {
        const score = getLeadScore(lead);
        const state = getLeadState(lead);
        const priority = getPriority(lead);

        return {
          ...lead,
          score,
          state,
          priority,
        };
      })
      .filter((lead) => lead.lastContactedDays > 30) // ONLY dormant
      .sort((a, b) => b.score - a.score);
  }, [activeLeads]);

  const dormantCount = enrichedLeads.length;

  const highPotential = enrichedLeads.filter((l) => l.score >= 70);
  const highPotentialCount = highPotential.length;

  const potentialValue =
    highPotentialCount * (icp.avgDealSize || 20000);

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Recover pipeline
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            High-fit leads in your CRM that have gone cold and should be re-engaged now.
          </p>
        </div>

        {/* Metrics */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="bg-white p-5 rounded-xl border">
            <p className="text-sm text-gray-500">Dormant leads</p>
            <p className="text-2xl font-semibold mt-2">{dormantCount}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border">
            <p className="text-sm text-gray-500">High potential</p>
            <p className="text-2xl font-semibold mt-2">
              {highPotentialCount}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border">
            <p className="text-sm text-gray-500">Potential value</p>
            <p className="text-2xl font-semibold mt-2">
              €{potentialValue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">Lead</th>
                <th className="px-6 py-4 text-left">Company</th>
                <th className="px-6 py-4 text-left">Score</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Signal</th>
                <th className="px-6 py-4 text-left">Priority</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {enrichedLeads.map((lead) => (
                <tr key={lead.id} className="text-sm">
                  <td className="px-6 py-4">
                    <Link
                      href={`/lead/${lead.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {lead.title}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium">{lead.company}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreStyles(
                        lead.score
                      )}`}
                    >
                      {lead.score}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {lead.state}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {lead.companyData?.signal || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        lead.priority === "High"
                          ? "bg-black text-white"
                          : "bg-gray-200"
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
    </main>
  );
}
