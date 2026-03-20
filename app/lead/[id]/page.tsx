"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { leads as demoLeads } from "@/lib/data";
import { analyzeLead } from "@/lib/openai";
import { Lead } from "@/lib/types";

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-gray-600";
}

export default function LeadPage() {
  const params = useParams<{ id: string }>();

  const [activeLeads, setActiveLeads] = useState<Lead[]>(demoLeads);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    const uploaded = localStorage.getItem("uploadedLeads");
    if (uploaded) {
      try {
        const parsed = JSON.parse(uploaded);
        if (Array.isArray(parsed)) setActiveLeads(parsed);
      } catch {}
    }
  }, []);

  const lead = useMemo(() => {
    return activeLeads.find((l) => l.id === params.id);
  }, [activeLeads, params.id]);

  useEffect(() => {
    if (lead) analyzeLead(lead).then(setAnalysis);
  }, [lead]);

  if (!lead) return notFound();
  if (!analysis) return <div className="p-8">Analyzing...</div>;

  const tags = analysis.tags || [];

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* Back */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-black">
            ← Back
          </Link>
        </div>

        {/* TOP BAR */}
        <div className="mb-6 flex items-center gap-6 rounded-xl border bg-white p-6">

          <div className={`text-5xl font-semibold ${getScoreColor(analysis.score)}`}>
            {analysis.score}
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">
              {lead.name}
            </h1>
            <p className="text-sm text-gray-600">
              {lead.title}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag: string, i: number) => (
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

        {/* 3 COLUMN GRID */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">

          {/* SIGNALS */}
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-sm font-medium text-gray-500">
              Signals
            </h2>

            <div className="mt-3 space-y-2 text-sm text-gray-800">
              {analysis.signals?.map((s: string, i: number) => (
                <div key={i}>• {s}</div>
              ))}
            </div>
          </div>

          {/* SUMMARY / DRIVERS */}
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-sm font-medium text-gray-500">
              Summary
            </h2>

            <p className="mt-3 text-sm text-gray-800 leading-6">
              {analysis.summary}
            </p>
          </div>

          {/* LAST ACTIVITY */}
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-sm font-medium text-gray-500">
              Last activity
            </h2>

            <div className="mt-3 space-y-2 text-sm text-gray-800">
              {lead.activities.map((a, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <span className="capitalize">
                      {a.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {a.daysAgo}d
                    </span>
                  </div>
                  <div className="text-gray-600 text-xs">
                    {a.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EMAIL 1 */}
        <div className="mb-6 rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Email 1
          </h2>

          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {analysis.email}
            </pre>
          </div>
        </div>

        {/* EMAIL 2 */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Follow-up
          </h2>

          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {analysis.followUpEmail}
            </pre>
          </div>
        </div>

      </div>
    </main>
  );
}
