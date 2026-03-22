"use client";

import { useState } from "react";

export default function Page() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-8 py-8 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-semibold">Data Center</h1>
        <p className="mt-2 text-gray-600">
          Understand your data, define your ICP, and identify your next revenue opportunities.
        </p>
      </div>

      {/* CONNECT STATE */}
      {!connected && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {["HubSpot", "Salesforce", "CSV", "Shopify"].map((s) => (
            <div key={s} className="border rounded-2xl p-5 bg-white">
              <div className="font-semibold">{s}</div>
              <button
                onClick={() => setConnected(true)}
                className="mt-4 px-4 py-2 border rounded-xl text-sm"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CONNECTED STATE */}
      {connected && (
        <div className="space-y-10">
          {/* DATA QUALITY */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold">Data Quality</h2>
              <p className="text-sm text-gray-500">
                Assess completeness and readiness for targeting
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <Card label="Quality Score" value="78%" sub="Moderate quality" />
              <Card label="Accounts needing enrichment" value="1,241" sub="Missing key fields" />
              <Card label="Missing titles" value="412" sub="Impacts targeting precision" />
              <Card label="Duplicates" value="143" sub="Affects reporting accuracy" />
            </div>
          </div>

          {/* ICP PROFILING */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold">ICP Profiling</h2>
              <p className="text-sm text-gray-500">
                Identify your highest-performing customer segments
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Insight
                title="Company Size"
                items={[
                  "50–200 employees (strongest)",
                  "200–500 employees",
                  "500+ (low conversion)",
                ]}
              />
              <Insight
                title="Titles"
                items={[
                  "Head of Sales",
                  "RevOps / Operations",
                  "VP level roles",
                ]}
              />
              <Insight
                title="Industries"
                items={[
                  "SaaS",
                  "Commerce",
                  "Logistics tech",
                ]}
              />
            </div>
          </div>

          {/* DEAL / PIPELINE INSIGHTS */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold">Deal Analysis</h2>
              <p className="text-sm text-gray-500">
                Understand what drives conversion and deal value
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card label="Avg deal size" value="$18K" sub="Mid-market focus" />
              <Card label="Sales cycle" value="42 days" sub="Faster in ICP segments" />
              <Card label="Win rate" value="28%" sub="Higher with engaged leads" />
            </div>
          </div>

          {/* OPPORTUNITY ENGINE */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold">Opportunity Engine</h2>
              <p className="text-sm text-gray-500">
                Where to focus next to drive revenue
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Action
                title="Uncovered ICP accounts"
                value="684"
                sub="High-fit but not being targeted"
                cta="Send to Generate"
              />
              <Action
                title="Dormant warm accounts"
                value="291"
                sub="Previously engaged but inactive"
                cta="Send to Recover"
              />
              <Action
                title="Coverage gaps"
                value="UK + US"
                sub="Strong ICP but low outreach"
                cta="View segments"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

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
