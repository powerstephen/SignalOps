"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { leads as demoLeads } from "@/lib/data";
import { analyzeLead } from "@/lib/openai";
import { Lead } from "@/lib/types";

function getScoreStyles(score: number) {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-700";
}

export default function LeadPage() {
  const params = useParams<{ id: string }>();
  const [activeLeads, setActiveLeads] = useState<Lead[]>(demoLeads);
  const [loaded, setLoaded] = useState(false);
  const [analysis, setAnalysis] = useState<Awaited<ReturnType<typeof analyzeLead>> | null>(null);

  useEffect(() => {
    const uploaded = localStorage.getItem("uploadedLeads");

    if (uploaded) {
      try {
        const parsed = JSON.parse(uploaded) as Lead[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveLeads(parsed);
        }
      } catch {
        setActiveLeads(demoLeads);
      }
    }

    setLoaded(true);
  }, []);

  const lead = useMemo(() => {
    return activeLeads.find((item) => item.id === params.id);
  }, [activeLeads, params.id]);

  useEffect(() => {
    if (lead) {
      analyzeLead(lead).then(setAnalysis);
    }
  }, [lead]);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#f6f7fb]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">
            Loading lead...
          </div>
        </div>
      </main>
    );
  }

  if (!lead) {
    notFound();
  }

  if (!analysis) {
    return (
      <main className="min-h-screen bg-[#f6f7fb]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">
            Analyzing lead...
          </div>
        </div>
      </main>
    );
  }

  const topReasons = analysis.whyNow.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            ← Back to Recover
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">{lead.name}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {lead.title} at {lead.company}
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Lead score</p>
            <div className="mt-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getScoreStyles(
                  analysis.score
                )}`}
              >
                {analysis.score}
              </span>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Status</p>
            <p className="mt-3 text-base font-medium text-gray-900">
              {analysis.state}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Recommended action</p>
            <p className="mt-3 text-base font-medium text-gray-900">
              {analysis.recommendedActionLabel}
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Why this lead</h2>

            <div className="mt-4 grid gap-3">
              {topReasons.map((reason, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700"
                >
                  {reason}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Lead details</h2>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Company</p>
                <p className="mt-1 font-medium text-gray-900">{lead.company}</p>
              </div>

              <div>
                <p className="text-gray-500">Signal</p>
                <p className="mt-1 font-medium text-gray-900">
                  {lead.companyData?.signal || "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Last contacted</p>
                <p className="mt-1 font-medium text-gray-900">
                  {lead.lastContactedDays} days ago
                </p>
              </div>

              <div>
                <p className="text-gray-500">ICP match</p>
                <p className="mt-1 font-medium text-gray-900">
                  {analysis.icpMatchScore}/100
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Email 1</h2>
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-800">
                {analysis.email}
              </pre>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Follow-up</h2>
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-800">
                {analysis.followUpEmail}
              </pre>
            </div>
          </section>
        </div>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Activity</h2>

          <div className="mt-4 space-y-3">
            {lead.activities.map((activity, index) => (
              <div
                key={index}
                className="rounded-lg bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium capitalize text-gray-900">
                    {activity.type.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-gray-500">{activity.daysAgo}d ago</p>
                </div>
                <p className="mt-2 text-sm text-gray-700">{activity.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
