"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { leads as demoLeads } from "@/lib/data";
import { analyzeLead } from "@/lib/openai";
import { Lead } from "@/lib/types";
import { calculateICPMatchScore, buildICP } from "@/lib/icp";
import { getLeadScore, getPersona } from "@/lib/scoring";

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-gray-600";
}

function buildTags(lead: Lead, score: number, icpMatch: number): string[] {
  const tags: string[] = [];
  const persona = getPersona(lead.title);

  if (icpMatch >= 80) tags.push("High ICP Match");
  if (persona === "Sales Leader" || persona === "RevOps" || persona === "Founder") {
    tags.push("Senior Persona");
  }

  const hasRecentEngagement = lead.activities.some((a) => a.daysAgo <= 30);
  if (hasRecentEngagement) tags.push("Recent Engagement");

  if (lead.lastContactedDays > 60) {
    tags.push("Dormant Opportunity");
  } else if (lead.lastContactedDays > 30) {
    tags.push("Warm but Neglected");
  }

  if (
    lead.companyData?.signal &&
    lead.companyData.signal.toLowerCase().includes("hiring") &&
    tags.length < 4
  ) {
    tags.push("Hiring Signal");
  }

  if (score >= 85 && tags.length < 4) {
    tags.push("High Priority");
  }

  return tags.slice(0, 4);
}

function buildSignals(lead: Lead, icpMatch: number): string[] {
  const items: string[] = [];

  if (lead.companyData?.signal) {
    items.push(lead.companyData.signal);
  }

  const recentOpen = lead.activities.find(
    (a) => a.type === "email_open" && a.daysAgo <= 30
  );
  if (recentOpen) {
    items.push(`Opened a prior email ${recentOpen.daysAgo} days ago`);
  }

  const recentClick = lead.activities.find(
    (a) => a.type === "email_click" && a.daysAgo <= 30
  );
  if (recentClick) {
    items.push(`Clicked prior content ${recentClick.daysAgo} days ago`);
  }

  const meeting = lead.activities.find((a) => a.type === "meeting");
  if (meeting) {
    items.push("Previous qualified conversation");
  }

  const noteText = lead.activities.map((a) => a.note.toLowerCase()).join(" ");
  if (noteText.includes("stretched")) items.push("Team capacity looks stretched");
  if (noteText.includes("coverage")) items.push("Pipeline coverage was mentioned");
  if (noteText.includes("timing")) items.push("Earlier objection looked like timing rather than fit");

  if (icpMatch >= 80) {
    items.push("Strong match against current ICP");
  }

  return [...new Set(items)].slice(0, 4);
}

function buildSummary(lead: Lead, score: number, icpMatch: number): string {
  const persona = getPersona(lead.title);
  const personaLine =
    persona === "Sales Leader"
      ? "This is a senior commercial buyer."
      : persona === "RevOps"
      ? "This is a strong operational buyer."
      : persona === "Founder"
      ? "This is a senior decision-maker."
      : persona === "Marketing Leader"
      ? "This is a relevant growth-focused stakeholder."
      : "This is still a commercially relevant contact.";

  const fitLine =
    icpMatch >= 80
      ? "The lead is a strong match against your current revenue-backed ICP."
      : icpMatch >= 60
      ? "The lead is a reasonable fit against your current ICP."
      : "The fit is weaker, but there are still some useful signals.";

  const dormantLine =
    lead.lastContactedDays > 60
      ? `It has been ${lead.lastContactedDays} days since the last contact, so this now looks like dormant revenue rather than an active opportunity.`
      : `The account has gone quiet enough to justify targeted reactivation.`;

  const signalLine = lead.companyData?.signal
    ? `${lead.companyData.signal} suggests there may be a timely reason to re-open the conversation.`
    : "";

  const noteText = lead.activities.map((a) => a.note.toLowerCase()).join(" ");
  const needLine = noteText.includes("stretched")
    ? "Previous notes suggest team capacity is stretched, which gives the outreach a specific angle."
    : noteText.includes("coverage")
    ? "Previous notes suggest pipeline coverage is a concern, which gives the outreach a clear angle."
    : "";

  const scoreLine =
    score >= 85
      ? "Overall this is a high-priority reactivation candidate."
      : score >= 70
      ? "Overall this is worth working now with a short sequence."
      : "Overall this is worth monitoring, but not the strongest reactivation candidate.";

  return `${fitLine} ${personaLine} ${dormantLine} ${signalLine} ${needLine} ${scoreLine}`
    .replace(/\s+/g, " ")
    .trim();
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

  const icp = useMemo(() => buildICP(activeLeads), [activeLeads]);

  const score = useMemo(() => (lead ? getLeadScore(lead) : 0), [lead]);
  const icpMatch = useMemo(
    () => (lead ? calculateICPMatchScore(lead, icp) : 0),
    [lead, icp]
  );

  const tags = useMemo(() => (lead ? buildTags(lead, score, icpMatch) : []), [lead, score, icpMatch]);
  const signals = useMemo(() => (lead ? buildSignals(lead, icpMatch) : []), [lead, icpMatch]);
  const summary = useMemo(() => (lead ? buildSummary(lead, score, icpMatch) : ""), [lead, score, icpMatch]);

  useEffect(() => {
    if (lead) analyzeLead(lead).then(setAnalysis);
  }, [lead]);

  if (!lead) return notFound();

  if (!analysis) {
    return (
      <main className="min-h-screen bg-[#f6f7fb]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">
            Analyzing...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-black">
            ← Back
          </Link>
        </div>

        <div className="mb-6 flex items-center gap-6 rounded-xl border bg-white p-6">
          <div className={`text-5xl font-semibold ${getScoreColor(score)}`}>
            {score}
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">{lead.name}</h1>
            <p className="text-sm text-gray-600">{lead.title}</p>

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
              {signals.length > 0 ? (
                signals.map((s, i) => <div key={i}>• {s}</div>)
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
            <h2 className="text-sm font-medium text-gray-500">Last activity</h2>

            <div className="mt-3 space-y-3 text-sm text-gray-800">
              {lead.activities.map((a, i) => (
                <div key={i}>
                  <div className="flex justify-between gap-4">
                    <span className="capitalize font-medium">
                      {a.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-gray-500">{a.daysAgo}d</span>
                  </div>
                  <div className="text-gray-600">{a.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Email 1</h2>

          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-800">
              {analysis.email}
            </pre>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Follow-up</h2>

          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <pre className="whitespace-pre-wrap text-sm leading-7 text-gray-800">
              {analysis.followUpEmail}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
