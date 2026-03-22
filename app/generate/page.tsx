"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type State = "disconnected" | "analyzing" | "connected";

const steps = [
  "Normalising source data",
  "Mapping accounts and contacts",
  "Scoring ICP fit",
  "Identifying whitespace",
  "Generating opportunities",
  "Generating results",
];

export default function Page() {
  const [state, setState] = useState<State>("disconnected");
  const [completedSteps, setCompletedSteps] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state !== "analyzing") return;

    setCompletedSteps(0);
    setProgress(0);

    let stepIndex = 0;
    const stepDuration = 1800;

    const interval = setInterval(() => {
      stepIndex += 1;
      setCompletedSteps(stepIndex);
      setProgress((stepIndex / steps.length) * 100);

      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setTimeout(() => setState("connected"), 1000);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-8 py-8">
      <div>
        <h1 className="text-4xl font-semibold">Data Center</h1>
        <p className="mt-2 text-gray-600">
          Understand your data, define your ICP, and identify revenue opportunities.
        </p>
      </div>

      {state !== "disconnected" && (
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex gap-6 text-sm">
            <div>
              <div className="text-xs text-gray-400">Source</div>
              <div className="font-medium">HubSpot</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Status</div>
              <div className="font-medium">
                {state === "analyzing" ? "Analyzing..." : "Live"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Last Sync</div>
              <div className="font-medium">Just now</div>
            </div>
          </div>

          <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm">
            Manage
          </button>
        </div>
      )}

      {state === "disconnected" && (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {["HubSpot", "Salesforce", "CSV", "Shopify"].map((s) => (
            <div key={s} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="font-semibold">{s}</div>
              <button
                onClick={() => setState("analyzing")}
                className="mt-4 rounded-xl border border-gray-200 px-4 py-2 text-sm"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}

      {state === "analyzing" && (
        <div className="mx-auto max-w-3xl px-2 py-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-950">
            Analyzing...
          </h2>

          <div className="mx-auto mt-5 w-full max-w-[260px] rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-[#0b1f3a] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-[320px] space-y-3">
              {steps.map((step, index) => {
                const isDone = index < completedSteps;
                const isActive =
                  index === completedSteps && completedSteps < steps.length;

                return (
                  <div
                    key={step}
                    className="grid grid-cols-[24px_1fr] items-center gap-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white text-sm text-gray-900">
                      {isDone ? "✓" : ""}
                    </div>

                    {/* 👇 ONLY CHANGE HERE (text size increased) */}
                    <div
                      className={`text-left text-base leading-6 ${
                        isDone
                          ? "font-medium text-gray-900"
                          : isActive
                          ? "font-medium text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step}
                      {isActive ? " ....." : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {state === "connected" && (
        <div className="space-y-10">
          <Section
            title="Data Quality"
            subtitle="Assess completeness and readiness"
          >
            <Grid cols="4">
              <Card label="Quality Score" value="78%" sub="Moderate quality" />
              <Card
                label="Accounts needing enrichment"
                value="1,241"
                sub="Missing key fields"
              />
              <Card
                label="Missing titles"
                value="412"
                sub="Impacts targeting"
              />
              <Card
                label="Duplicates"
                value="143"
                sub="Affects reporting"
              />
            </Grid>
          </Section>

          <Section
            title="ICP Profiling"
            subtitle="Your highest-performing segments"
          >
            <Grid cols="3">
              <Insight
                title="Company Size"
                items={[
                  "50–200 employees (best)",
                  "200–500 employees",
                  "500+ low conversion",
                ]}
              />
              <Insight
                title="Titles"
                items={["Head of Sales", "RevOps / Ops", "VP level"]}
              />
              <Insight
                title="Industry"
                items={["SaaS", "Commerce", "Logistics"]}
              />
            </Grid>
          </Section>

          <Section
            title="Deal Analysis"
            subtitle="What drives conversion and value"
          >
            <Grid cols="3">
              <Card
                label="Average deal size"
                value="$18K"
                sub="Mid-market weighted"
              />
              <Card
                label="Sales cycle"
                value="42 days"
                sub="Faster in core ICP"
              />
              <Card
                label="Win rate"
                value="28%"
                sub="Higher with engaged leads"
              />
            </Grid>
          </Section>

          <Section
            title="Opportunity Engine"
            subtitle="Where to focus next"
          >
            <Grid cols="3">
              <ActionLink
                href="/generate?segment=uncovered_icp"
                title="Uncovered ICP"
                value="684"
                sub="High-fit not targeted"
                cta="Send to Generate"
              />
              <ActionLink
                href="/recover?segment=dormant_accounts"
                title="Dormant accounts"
                value="291"
                sub="Warm but inactive"
                cta="Send to Recover"
              />
              <ActionLink
                href="/generate?segment=coverage_gaps"
                title="Coverage gaps"
                value="UK + US"
                sub="Low outreach areas"
                cta="View segments"
              />
            </Grid>
          </Section>
        </div>
      )}
    </div>
  );
}

/* COMPONENTS (unchanged) */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-500">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Grid({
  children,
  cols,
}: {
  children: React.ReactNode;
  cols: "3" | "4";
}) {
  return (
    <div
      className={
        cols === "4"
          ? "grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          : "grid gap-4 md:grid-cols-3"
      }
    >
      {children}
    </div>
  );
}

function Card({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="text-xs uppercase text-gray-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-950">{value}</div>
      <div className="mt-1 text-sm text-gray-600">{sub}</div>
    </div>
  );
}

function Insight({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="font-semibold text-gray-950">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        {items.map((i) => (
          <li key={i}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}

function ActionLink({
  href,
  title,
  value,
  sub,
  cta,
}: {
  href: string;
  title: string;
  value: string;
  sub: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="font-semibold text-gray-950">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-950">{value}</div>
      <div className="mt-1 text-sm text-gray-600">{sub}</div>
      <Link
        href={href}
        className="mt-4 inline-flex rounded-xl bg-black px-4 py-2 text-sm text-white"
      >
        {cta}
      </Link>
    </div>
  );
}
