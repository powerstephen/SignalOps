"use client";

import { useEffect, useState } from "react";

type State = "disconnected" | "analyzing" | "connected";

const steps = [
  "Normalising Source Data",
  "Mapping Accounts and Contacts",
  "Scoring ICP fit",
  "Identifying whitespace",
  "Generating Opportunities",
  "Generating Results",
];

export default function Page() {
  const [state, setState] = useState<State>("disconnected");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state !== "analyzing") return;

    setProgress(0);

    const stepDuration = 1700; // extended by ~1 second total
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep += 1;
      const next = Math.min((currentStep / steps.length) * 100, 100);
      setProgress(next);

      if (currentStep >= steps.length) {
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
        <div className="flex items-center justify-between rounded-2xl border bg-white p-4">
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

          <button className="rounded-xl border px-4 py-2 text-sm">
            Manage
          </button>
        </div>
      )}

      {state === "disconnected" && (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {["HubSpot", "Salesforce", "CSV", "Shopify"].map((s) => (
            <div key={s} className="rounded-2xl border bg-white p-5">
              <div className="font-semibold">{s}</div>
              <button
                onClick={() => setState("analyzing")}
                className="mt-4 rounded-xl border px-4 py-2 text-sm"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}

      {state === "analyzing" && (
        <div className="mx-auto max-w-3xl px-2 py-8">
          <div className="text-center">
            <h2 className="text-5xl font-semibold tracking-tight text-gray-950">
              Analyzing ...
            </h2>

            <div className="mx-auto mt-8 w-full max-w-[620px] rounded-full bg-gray-100">
              <div
                className="h-4 rounded-full bg-[#0b1f3a] transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-[720px] space-y-5">
            {steps.map((step, i) => {
              const stepProgress = ((i + 1) / steps.length) * 100;
              const isDone = progress > stepProgress - 0.1;
              const isActive =
                progress < stepProgress &&
                progress >= (i / steps.length) * 100;
              const showPending = !isDone && !isActive && i > 3;

              return (
                <div
                  key={step}
                  className="flex items-center gap-5 text-[30px] font-semibold leading-none tracking-tight text-gray-950"
                >
                  <div className="flex h-12 w-12 items-center justify-center">
                    {isDone ? (
                      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-white text-[28px] font-medium text-black">
                        ✓
                      </div>
                    ) : isActive ? (
                      <div className="text-[30px] font-semibold text-gray-950">
                        {step} .....
                      </div>
                    ) : showPending ? (
                      <div className="pl-[68px] text-[30px] font-semibold text-gray-950">
                        {step}
                      </div>
                    ) : (
                      <div className="h-11 w-11" />
                    )}
                  </div>

                  {!isActive && !showPending ? (
                    <div>{step}</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {state === "connected" && (
        <div className="space-y-10">
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
                items={["Head of Sales", "RevOps / Ops", "VP level"]}
              />
              <Insight
                title="Industry"
                items={["SaaS", "Commerce", "Logistics"]}
              />
            </Grid>
          </Section>

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
  return <div className="grid gap-4 md:grid-cols-3">{children}</div>;
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
    <div className="rounded-2xl border bg-white p-5">
      <div className="text-xs uppercase text-gray-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
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
    <div className="rounded-2xl border bg-white p-5">
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
    <div className="rounded-2xl border bg-white p-5">
      <div className="font-semibold">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-gray-600">{sub}</div>
      <button className="mt-4 rounded-xl bg-black px-4 py-2 text-sm text-white">
        {cta}
      </button>
    </div>
  );
}
