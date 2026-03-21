"use client";

import { useEffect, useMemo, useState } from "react";

type ConnectionState = "disconnected" | "analyzing" | "connected";

function SourceTile({
  name,
  description,
  onConnect,
}: {
  name: string;
  description: string;
  onConnect: () => void;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-gray-950">{name}</div>
          <div className="mt-2 text-sm text-gray-600">{description}</div>
        </div>
        <button
          onClick={onConnect}
          className="rounded-2xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Connect
        </button>
      </div>
    </div>
  );
}

function AnalysisPanel({ progress }: { progress: number }) {
  return (
    <div className="flex min-h-[500px] items-center justify-center rounded-3xl border bg-white">
      <div className="w-full max-w-xl text-center">
        <div className="text-2xl font-semibold text-gray-900">
          AI analysis in progress
        </div>

        <div className="mt-6 h-3 w-full rounded-full bg-gray-100">
          <div
            className="h-3 rounded-full bg-green-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 text-sm text-gray-600">Analyzing...</div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-xs text-gray-400 uppercase">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Insight({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="text-xs text-gray-400 uppercase">{title}</div>
      <p className="mt-4 text-sm text-gray-700">{text}</p>
    </div>
  );
}

export default function Page() {
  const [state, setState] = useState<ConnectionState>("disconnected");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state !== "analyzing") return;

    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 10;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setState("connected"), 400);
          return 100;
        }
        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [state]);

  const sources = useMemo(
    () => [
      {
        name: "HubSpot",
        description: "Sync CRM data, lifecycle stages, and engagement.",
      },
      {
        name: "Salesforce",
        description: "Map accounts, opportunities, and segments.",
      },
      {
        name: "CSV Upload",
        description: "Upload leads and accounts manually.",
      },
      {
        name: "Shopify",
        description: "Import customer and revenue data.",
      },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-7xl px-8 py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Data Center</h1>
        <p className="mt-2 text-gray-600">
          Connect your data to uncover ICP, whitespace, and next best actions.
        </p>
      </div>

      {state === "disconnected" && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {sources.map((s) => (
            <SourceTile
              key={s.name}
              name={s.name}
              description={s.description}
              onConnect={() => setState("analyzing")}
            />
          ))}
        </div>
      )}

      {state === "analyzing" && <AnalysisPanel progress={progress} />}

      {state === "connected" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <Metric label="Accounts" value="12,480" />
            <Metric label="Contacts" value="38,920" />
            <Metric label="ICP Match" value="2,146" />
            <Metric label="Whitespace" value="684" />
            <Metric label="Dormant" value="291" />
            <Metric label="Quality Score" value="86" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Insight
              title="ICP Summary"
              text="Your strongest ICP sits in mid-market SaaS companies with commercial leadership roles and high engagement signals."
            />
            <Insight
              title="Opportunity Map"
              text="High-fit accounts exist in under-covered segments across UK and US markets. Strong Recover and Generate potential."
            />
          </div>
        </div>
      )}
    </div>
  );
}
