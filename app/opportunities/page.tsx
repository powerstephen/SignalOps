"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { leads as demoLeads } from "@/lib/data";
import { signals, scoreSignal } from "@/lib/signals";
import { getLeadScore } from "@/lib/scoring";
import { estimatePipelineImpact } from "@/lib/pipeline";
import { Lead } from "@/lib/types";

type Opportunity = {
  id: string;
  type: "lead" | "signal";
  company: string;
  score: number;
  pipelineValue: number;
  reason: string;
};

function money(value: number) {
  return `€${value.toLocaleString()}`;
}

export default function OpportunitiesPage() {
  const [activeLeads, setActiveLeads] = useState<Lead[]>(demoLeads);

  useEffect(() => {
    const uploaded = localStorage.getItem("uploadedLeads");
    if (uploaded) {
      try {
        const parsed = JSON.parse(uploaded);
        if (Array.isArray(parsed) && parsed.length > 0) setActiveLeads(parsed);
      } catch {}
    }
  }, []);

  const opportunities: Opportunity[] = useMemo(() => {
    const leadOpps = activeLeads.map((lead) => {
      const score = getLeadScore(lead);
      const pipeline = estimatePipelineImpact(score);
      return { id: lead.id, type: "lead" as const, company: lead.company, score, pipelineValue: pipeline.pipelineValue, reason: "Existing pipeline opportunity" };
    });
    const signalOpps = signals.map((signal) => {
      const score = scoreSignal(signal);
      const pipeline = estimatePipelineImpact(score);
      return { id: signal.id, type: "signal" as const, company: signal.company, score, pipelineValue: pipeline.pipelineValue, reason: "New pipeline opportunity" };
    });
    return [...leadOpps, ...signalOpps].sort((a, b) => b.pipelineValue - a.pipelineValue);
  }, [activeLeads]);

  const totalPipeline = opportunities.reduce((sum, o) => sum + o.pipelineValue, 0);
  const leadPipeline = opportunities.filter((o) => o.type === "lead").reduce((sum, o) => sum + o.pipelineValue, 0);
  const signalPipeline = opportunities.filter((o) => o.type === "signal").reduce((sum, o) => sum + o.pipelineValue, 0);

  return (
    <main className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Revenue opportunities</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">One view of recoverable and net-new pipeline</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Total Pipeline</p><p className="mt-2 text-2xl font-semibold">{money(totalPipeline)}</p></div>
          <div className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Recoverable Pipeline</p><p className="mt-2 text-2xl font-semibold">{money(leadPipeline)}</p></div>
          <div className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">New Pipeline</p><p className="mt-2 text-2xl font-semibold">{money(signalPipeline)}</p></div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#e7e9f0] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#fafbff] text-left text-gray-500"><tr><th className="p-4">Type</th><th className="p-4">Company</th><th className="p-4">Score</th><th className="p-4">Pipeline Value</th><th className="p-4">Reason</th><th className="p-4"></th></tr></thead>
            <tbody className="divide-y divide-[#eef1f6]">
              {opportunities.map((op) => (
                <tr key={`${op.type}-${op.id}`}>
                  <td className="p-4 capitalize">{op.type}</td>
                  <td className="p-4 font-medium text-gray-900">{op.company}</td>
                  <td className="p-4">{op.score}</td>
                  <td className="p-4 font-medium">{money(op.pipelineValue)}</td>
                  <td className="p-4 text-gray-600">{op.reason}</td>
                  <td className="p-4">
                    <Link href={op.type === "lead" ? `/lead/${op.id}` : `/signals/${op.id}`} className="text-sm font-medium text-gray-900 underline">View</Link>
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
