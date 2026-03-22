"use client";

import { useEffect, useState } from "react";

type State = "disconnected" | "analyzing" | "connected";

const steps = [
  "Normalizing source data",
  "Mapping accounts and contacts",
  "Scoring ICP fit",
  "Identifying whitespace",
  "Generating opportunities",
];

export default function Page() {
  const [state, setState] = useState<State>("disconnected");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state !== "analyzing") return;

    let current = 0;

    const interval = setInterval(() => {
      current += 20;
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setState("connected"), 600);
      }
    }, 900); // slower = better UX

    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="mx-auto max-w-7xl px-8 py-8 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-semibold">Data Center</h1>
        <p className="mt-2 text-gray-600">
          Understand your data, define your ICP, and identify revenue opportunities.
        </p>
      </div>

      {/* COLLAPSED BAR (after connect) */}
      {state !== "disconnected" && (
        <div className="border rounded-2xl bg-white p-4 flex justify-between items-center">
          <div className="flex gap-6 text-sm">
            <div>
              <div className="text-gray-400 text-xs">Source</div>
              <div className="font-medium">HubSpot</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Status</div>
              <div className="font-medium">
                {state === "analyzing" ? "Analyzing..." : "Live"}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Last Sync</div>
              <div className="font-medium">Just now</div>
            </div>
          </div>

          <button className="text-sm border px-4 py-2 rounded-xl">
            Manage
          </button>
        </div>
      )}

      {/* CONNECT STATE */}
      {state === "disconnected" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {["HubSpot", "Salesforce", "CSV", "Shopify"].map((s) => (
            <div key={s} className="border rounded-2xl p-5 bg-white">
              <div className="font-semibold">{s}</div>
              <button
                onClick={() => setState("analyzing")}
                className="mt-4 px-4 py-2 border rounded-xl text-sm"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ANALYZING STATE */}
      {state === "analyzing" && (
        <div className="border rounded-2xl bg-white p-10 text-center">
          <h2 className="text-2xl font-semibold">Analyzing your data</h2>

          {/* PROGRESS BAR */}
          <div className="mt-6 h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-3 bg-green-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-4 text-sm text-gray-500">Analyzing...</p>

          {/* STEPS */}
          <div className="mt-8 grid md:grid-cols-2 gap-3 text-left">
            {steps.map((step, i) => {
              const isDone = progress >= (i + 1) * 20;

              return (
                <div
                  key={step}
                  className={`p-3 rounded-xl border text-sm flex items-center gap-2 ${
                    isDone
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {isDone ? "✓" : "•"} {step}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONNECTED STATE */}
      {state === "connected" && (
        <div className="space-y-10">
          {/* DATA QUALITY */}
          <Section
            title="Data Quality"
            subtitle="Assess completeness and readiness"
          >
            <Grid>
              <Card
                label="Quality Score"
                value="78%"
                sub="Moderate quality"
              />
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

          {/* ICP */}
          <Section
            title="ICP Profiling"
            subtitle="Your highest-performing segments"
          >
            <Grid>
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
                items={[
                  "Head of Sales",
                  "RevOps / Ops",
                  "VP level",
                ]}
              />
              <Insight
                title="Industry"
                items={["SaaS", "Commerce", "Logistics"]}
              />
            </Grid>
          </Section>

          {/* OPPORTUNITY */}
          <Section
            title="Opportunity Engine"
            subtitle="Where to focus next"
          >
            <Grid>
              <Action
                title="Uncovered ICP"
                value="684"
                sub="High-fit not targeted"
                cta="Send to Generate"
              />
              <Action
                title="Dormant accounts"
                value="291"
                sub="Warm but inactive"
                cta="Send to Recover"
              />
              <Action
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

/* COMPONENTS */

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

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-3 gap-4">{children}</div>;
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
    <div className="border rounded-2xl p-5 bg-white">
      <div className="text-xs text-gray-400 uppercase">{label}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{sub}</div>
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
    <div className="border rounded-2xl p-5 bg-white">
      <div className="font-semibold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        {items.map((i) => (
          <li key={i}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}

function Action({
  title,
  value,
  sub,
  cta,
}: {
  title: string;
  value: string;
  sub: string;
  cta: string;
}) {
  return (
    <div className="border rounded-2xl p-5 bg-white">
      <div className="font-semibold">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{sub}</div>
      <button className="mt-4 bg-black text-white px-4 py-2 rounded-xl text-sm">
        {cta}
      </button>
    </div>
  );
}
