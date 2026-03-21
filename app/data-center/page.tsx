"use client";

import { useEffect, useMemo, useState } from "react";

type ConnectionState = "disconnected" | "analyzing" | "connected";

type SourceCard = {
  id: string;
  name: string;
  description: string;
  status: "available" | "connected";
};

type MetricCard = {
  label: string;
  value: string;
  change?: string;
};

type InsightCard = {
  title: string;
  summary: string;
  bullets: string[];
};

type SegmentCard = {
  label: string;
  fit: number;
  coverage: number;
  whitespace: number;
  note: string;
};

type ActionCard = {
  title: string;
  description: string;
  cta: string;
};

function SourceTile({
  source,
  onConnect,
}: {
  source: SourceCard;
  onConnect: () => void;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-gray-950">
            {source.name}
          </div>
          <div className="mt-2 max-w-xs text-sm leading-6 text-gray-600">
            {source.description}
          </div>
        </div>

        {source.status === "connected" ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Connected
          </span>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

function MetricTile({ card }: { card: MetricCard }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
      <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
        {card.label}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
        {card.value}
      </div>
      {card.change ? (
        <div className="mt-2 text-sm font-medium text-green-700">
          {card.change}
        </div>
      ) : null}
    </div>
  );
}

function HeroInsight({ card }: { card: InsightCard }) {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
        {card.title}
      </div>
      <p className="mt-4 text-base leading-7 text-gray-900">{card.summary}</p>

      <div className="mt-5 space-y-3">
        {card.bullets.map((item) => (
          <div key={item} className="flex gap-3">
            <div className="mt-2 h-2 w-2 rounded-full bg-green-600" />
            <div className="text-sm leading-6 text-gray-600">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SegmentInsight({ card }: { card: SegmentCard }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="text-base font-semibold text-gray-950">{card.label}</div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          AI scored
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-gray-50 p-3">
          <div className="text-[11px] uppercase tracking-[0.16em] text-gray-400">
            Fit
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-950">
            {card.fit}%
          </div>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3">
          <div className="text-[11px] uppercase tracking-[0.16em] text-gray-400">
            Coverage
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-950">
            {card.coverage}%
          </div>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3">
          <div className="text-[11px] uppercase tracking-[0.16em] text-gray-400">
            Whitespace
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-950">
            {card.whitespace}%
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-gray-600">{card.note}</p>
    </div>
  );
}

function ActionTile({ action }: { action: ActionCard }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
      <div className="text-base font-semibold text-gray-950">{action.title}</div>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        {action.description}
      </p>
      <button
        type="button"
        className="mt-5 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        {action.cta}
      </button>
    </div>
  );
}

function AnalysisPanel({ progress }: { progress: number }) {
  const steps = [
    "Normalizing source data",
    "Mapping account and contact structure",
    "Identifying matched ICP patterns",
    "Scoring whitespace and coverage gaps",
    "Generating recommended next actions",
  ];

  const activeStep = Math.min(
    steps.length - 1,
    Math.floor((progress / 100) * steps.length)
  );

  return (
    <div className="flex min-h-[560px] items-center justify-center rounded-[32px] border border-gray-200 bg-white shadow-[0_18px_40px_rgba(17,24,39,0.06)]">
      <div className="w-full max-w-2xl px-8 text-center">
        <div className="mx-auto mb-8 h-16 w-16 rounded-full border border-green-200 bg-green-50" />

        <div className="text-3xl font-semibold tracking-tight text-gray-950">
          AI analysis in progress
        </div>

        <div className="mt-3 text-base text-gray-600">
          SignalOps is clustering your data, identifying matched ICP patterns,
          and surfacing uncovered revenue opportunities.
        </div>

        <div className="mt-10 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-3 rounded-full bg-green-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 text-sm font-medium text-gray-700">
          Analyzing...
        </div>

        <div className="mt-10 grid gap-3 text-left sm:grid-cols-2">
          {steps.map((step, index) => {
            const isComplete = index < activeStep;
            const isActive = index === activeStep;

            return (
              <div
                key={step}
                className={`rounded-2xl border px-4 py-3 text-sm transition ${
                  isComplete
                    ? "border-green-200 bg-green-50 text-green-800"
                    : isActive
                      ? "border-gray-300 bg-gray-50 text-gray-800"
                      : "border-gray-200 bg-white text-gray-500"
                }`}
              >
                {step}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DataCenterPage() {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (connectionState !== "analyzing") return;

    setProgress(0);

    const interval = setInterval(() => {
      setProgress((current) => {
        const next = current + Math.floor(Math.random() * 16) + 8;

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setConnectionState("connected");
          }, 250);
          return 100;
        }

        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [connectionState]);

  const sources: SourceCard[] = useMemo(
    () => [
      {
        id: "hubspot",
        name: "HubSpot",
        description:
          "Sync accounts, contacts, lifecycle stages, owners, and historical engagement data.",
        status:
          connectionState === "disconnected" ? "available" : "connected",
      },
      {
        id: "salesforce",
        name: "Salesforce",
        description:
          "Map accounts, opportunities, titles, geography, and segment coverage across pipeline.",
        status: "available",
      },
      {
        id: "shopify",
        name: "Shopify",
        description:
          "Bring in AOV, order patterns, product mix, and customer quality signals.",
        status: "available",
      },
      {
        id: "csv",
        name: "CSV Upload",
        description:
          "Upload leads, accounts, and opportunity data to start modeling ICP and whitespace.",
        status: "available",
      },
    ],
    [connectionState]
  );

  const metrics: MetricCard[] = [
    { label: "Accounts analyzed", value: "12,480", change: "+8.4% coverage" },
    { label: "Contacts analyzed", value: "38,920", change: "+1,240 enriched" },
    { label: "Matched ICP accounts", value: "2,146", change: "17.2% of base" },
    { label: "Uncovered high-fit", value: "684", change: "Ready for Generate" },
    { label: "Dormant warm accounts", value: "291", change: "Ready for Recover" },
    { label: "Data quality score", value: "86", change: "+11 pts post-sync" },
  ];

  const heroInsights: InsightCard[] = [
    {
      title: "AI ICP Summary",
      summary:
        "SignalOps found that your strongest-fit accounts cluster around mid-market SaaS and commerce businesses with 50–500 employees, commercial or operations leadership titles, and above-average revenue density in the UK, Ireland, and North America.",
      bullets: [
        "Best-performing company size band is 50–500 employees",
        "Highest-fit personas are Heads of Sales, Revenue Ops, and Operations leaders",
        "Top-performing industry clusters are SaaS, commerce enablement, and logistics tech",
        "Higher-value opportunities correlate with accounts already showing pricing or product re-engagement",
      ],
    },
    {
      title: "AI Opportunity Map",
      summary:
        "Your highest-leverage whitespace sits in under-covered UK and North America segments where fit is high but sales coverage is low. SignalOps also identified a warm dormant cluster with previous engagement but no recent follow through.",
      bullets: [
        "684 high-fit uncovered accounts can be routed into Generate",
        "291 dormant warm accounts can be prioritized for Recover",
        "Coverage is weakest in UK mid-market and US operations leadership clusters",
        "Data enrichment gaps are suppressing targeting precision in several otherwise strong segments",
      ],
    },
  ];

  const segments: SegmentCard[] = [
    {
      label: "Company size",
      fit: 91,
      coverage: 64,
      whitespace: 27,
      note:
        "Mid-market accounts are your strongest fit, but current sales coverage is still uneven across the 50–500 employee band.",
    },
    {
      label: "Title / seniority",
      fit: 88,
      coverage: 58,
      whitespace: 30,
      note:
        "Commercial and operations leadership roles consistently outperform, especially when paired with prior engagement or active buying signals.",
    },
    {
      label: "Industry",
      fit: 84,
      coverage: 62,
      whitespace: 22,
      note:
        "SaaS, commerce infrastructure, and logistics tech remain the highest-fit verticals, with room to expand in adjacent operator-heavy categories.",
    },
    {
      label: "Geography",
      fit: 86,
      coverage: 49,
      whitespace: 37,
      note:
        "Geographic whitespace is most visible across the UK and North America, where strong ICP density is not yet matched by outreach coverage.",
    },
    {
      label: "AOV / value band",
      fit: 82,
      coverage: 56,
      whitespace: 26,
      note:
        "Higher-value deals cluster around segments with stronger operational complexity and multi-stakeholder buying groups.",
    },
    {
      label: "Data quality",
      fit: 79,
      coverage: 71,
      whitespace: 18,
      note:
        "Data quality is generally strong, but title completeness and stale owner assignments are reducing targeting quality in key segments.",
    },
  ];

  const actions: ActionCard[] = [
    {
      title: "Push dormant ICP-fit accounts into Recover",
      description:
        "Route 291 warm accounts with prior engagement and renewed timing signals into the Recover workflow.",
      cta: "Open Recover",
    },
    {
      title: "Send uncovered high-fit segment into Generate",
      description:
        "Activate 684 high-fit accounts with strong ICP overlap but low current coverage.",
      cta: "Open Generate",
    },
    {
      title: "Improve targeting quality",
      description:
        "Enrich incomplete titles, domains, and ownership gaps across your best-performing segments.",
      cta: "Review data quality",
    },
  ];

  const showCollapsedSourceBar =
    connectionState === "analyzing" || connectionState === "connected";

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-8 md:px-10">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm font-medium text-green-700">SignalOps</div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-950">
              Data Center
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
              Connect your customer and pipeline data to identify matched ICP
              patterns, uncovered segments, and the fastest path into Recover
              and Generate.
            </p>
          </div>

          {showCollapsedSourceBar ? (
            <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                    Connected source
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    HubSpot
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                    Last sync
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    2 mins ago
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Manage data
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Sync now
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {connectionState === "disconnected" ? (
          <div className="space-y-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {sources.map((source) => (
                <SourceTile
                  key={source.id}
                  source={source}
                  onConnect={() => setConnectionState("analyzing")}
                />
              ))}
            </div>

            <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[0_18px_40px_rgba(17,24,39,0.06)]">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                    What SignalOps will analyze
                  </div>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-gray-600">
                    <p>
                      Once connected, SignalOps identifies your matched ICP,
                      under-covered high-fit segments, data quality gaps, and the
                      best routes into Recover and Generate.
                    </p>
                    <p>
                      AI models company size, title, geography, industry, value
                      bands, pipeline coverage, and recent activity to surface
                      the highest-leverage revenue actions.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-gray-50 p-6">
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                    Expected outputs
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      "Matched ICP summary",
                      "Uncovered whitespace opportunities",
                      "Dormant warm account clusters",
                      "Data quality and enrichment gaps",
                      "Recommended actions into Recover and Generate",
                    ].map((item) => (
                      <div key={item} className="flex gap-3">
                        <div className="mt-2 h-2 w-2 rounded-full bg-green-600" />
                        <div className="text-sm leading-6 text-gray-700">
                          {item}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {connectionState === "analyzing" ? (
          <AnalysisPanel progress={progress} />
        ) : null}

        {connectionState === "connected" ? (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              {metrics.map((card) => (
                <MetricTile key={card.label} card={card} />
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {heroInsights.map((card) => (
                <HeroInsight key={card.title} card={card} />
              ))}
            </div>

            <div>
              <div className="mb-4 text-sm font-medium text-gray-400">
                Attribute analysis
              </div>
              <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {segments.map((card) => (
                  <SegmentInsight key={card.label} card={card} />
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                  Data quality and coverage
                </div>
                <div className="mt-4 space-y-4 text-sm leading-7 text-gray-600">
                  <p>
                    SignalOps found strong overall structure, but several gaps
                    are limiting coverage precision in your highest-fit segments.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      "412 contacts missing seniority or title normalization",
                      "189 stale owner assignments in high-fit accounts",
                      "143 duplicate or near-duplicate accounts",
                      "96 high-fit accounts missing domain or enrichment detail",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 text-sm font-medium text-gray-400">
                  Recommended actions
                </div>
                <div className="space-y-5">
                  {actions.map((action) => (
                    <ActionTile key={action.title} action={action} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
