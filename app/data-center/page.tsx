"use client";

import { useEffect, useMemo, useState } from "react";

type ConnectionState = "disconnected" | "analyzing" | "connected";

type Source = {
  id: string;
  name: string;
  description: string;
  accent: string;
  badge: string;
  icon: string;
};

type Metric = {
  label: string;
  value: string;
  subtext: string;
};

type Insight = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

type Segment = {
  title: string;
  fit: number;
  coverage: number;
  whitespace: number;
  note: string;
};

type Action = {
  title: string;
  description: string;
  cta: string;
};

function SourceTile({
  source,
  onConnect,
}: {
  source: Source;
  onConnect: () => void;
}) {
  return (
    <div className="group rounded-[30px] border border-gray-200 bg-white p-6 shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${source.accent}`}
            >
              {source.icon}
            </div>
            <div>
              <div className="text-base font-semibold text-gray-950">
                {source.name}
              </div>
              <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                {source.badge}
              </div>
            </div>
          </div>

          <p className="mt-5 max-w-xs text-sm leading-6 text-gray-600">
            {source.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onConnect}
          className="rounded-[24px] border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
        >
          Connect
        </button>
      </div>
    </div>
  );
}

function AnalysisPanel({ progress }: { progress: number }) {
  const steps = [
    "Normalizing source data",
    "Mapping account and contact structure",
    "Scoring matched ICP traits",
    "Identifying whitespace and dormant clusters",
    "Preparing recommended actions",
  ];

  const activeStep = Math.min(
    steps.length - 1,
    Math.floor((progress / 100) * steps.length)
  );

  return (
    <div className="rounded-[34px] border border-gray-200 bg-white px-8 py-14 shadow-[0_18px_40px_rgba(17,24,39,0.06)]">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-200 bg-green-50">
          <div className="h-10 w-10 rounded-full border-4 border-green-600 border-t-green-200 animate-spin" />
        </div>

        <h2 className="mt-8 text-3xl font-semibold tracking-tight text-gray-950">
          AI analysis in progress
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
          SignalOps is clustering your data, identifying matched ICP patterns,
          scoring uncovered whitespace, and preparing the fastest path into
          Recover and Generate.
        </p>

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

function MetricTile({ metric }: { metric: Metric }) {
  return (
    <div className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
        {metric.label}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
        {metric.value}
      </div>
      <div className="mt-2 text-sm text-gray-600">{metric.subtext}</div>
    </div>
  );
}

function HeroInsight({ insight }: { insight: Insight }) {
  return (
    <div className="rounded-[30px] border border-gray-200 bg-white p-7 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
        {insight.eyebrow}
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-gray-950">
        {insight.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-gray-600">
        {insight.description}
      </p>

      <div className="mt-6 space-y-3">
        {insight.bullets.map((item) => (
          <div key={item} className="flex gap-3">
            <div className="mt-2 h-2 w-2 rounded-full bg-green-600" />
            <div className="text-sm leading-6 text-gray-700">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SegmentCard({ segment }: { segment: Segment }) {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="text-base font-semibold text-gray-950">
          {segment.title}
        </div>
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
            {segment.fit}%
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <div className="text-[11px] uppercase tracking-[0.16em] text-gray-400">
            Coverage
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-950">
            {segment.coverage}%
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <div className="text-[11px] uppercase tracking-[0.16em] text-gray-400">
            Whitespace
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-950">
            {segment.whitespace}%
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-gray-600">{segment.note}</p>
    </div>
  );
}

function ActionTile({ action }: { action: Action }) {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
      <div className="text-base font-semibold text-gray-950">{action.title}</div>
      <p className="mt-3 text-sm leading-6 text-gray-600">
        {action.description}
      </p>
      <button
        type="button"
        className="mt-5 rounded-[22px] bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
      >
        {action.cta}
      </button>
    </div>
  );
}

export default function Page() {
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
          }, 300);
          return 100;
        }

        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [connectionState]);

  const sources = useMemo<Source[]>(
    () => [
      {
        id: "hubspot",
        name: "HubSpot",
        description:
          "Sync CRM data, lifecycle stages, owner history, and engagement signals.",
        accent: "bg-orange-50 text-orange-600",
        badge: "CRM source",
        icon: "◐",
      },
      {
        id: "salesforce",
        name: "Salesforce",
        description:
          "Map accounts, opportunities, pipeline coverage, and segment structure.",
        accent: "bg-blue-50 text-blue-600",
        badge: "Pipeline source",
        icon: "☁",
      },
      {
        id: "csv",
        name: "CSV Upload",
        description:
          "Upload leads, accounts, and revenue data to model whitespace and ICP fit.",
        accent: "bg-emerald-50 text-emerald-600",
        badge: "Manual source",
        icon: "↑",
      },
      {
        id: "shopify",
        name: "Shopify",
        description:
          "Import customer, order, and value-band data to strengthen commercial insights.",
        accent: "bg-green-50 text-green-700",
        badge: "Revenue source",
        icon: "S",
      },
    ],
    []
  );

  const metrics: Metric[] = [
    {
      label: "Accounts analyzed",
      value: "12,480",
      subtext: "+8.4% coverage improvement",
    },
    {
      label: "Contacts analyzed",
      value: "38,920",
      subtext: "1,240 newly enriched",
    },
    {
      label: "Matched ICP accounts",
      value: "2,146",
      subtext: "17.2% of total base",
    },
    {
      label: "Uncovered high-fit",
      value: "684",
      subtext: "Ready for Generate",
    },
    {
      label: "Dormant warm accounts",
      value: "291",
      subtext: "Ready for Recover",
    },
    {
      label: "Data quality score",
      value: "86",
      subtext: "+11 pts post-sync",
    },
  ];

  const insights: Insight[] = [
    {
      eyebrow: "AI ICP summary",
      title: "Your strongest-fit accounts cluster in clear operator-led segments",
      description:
        "SignalOps found that your highest-value accounts sit in mid-market SaaS and commerce businesses with strong commercial or operations ownership, above-average engagement density, and recurring overlap across UK, Ireland, and North America.",
      bullets: [
        "Best-performing company size band is 50–500 employees",
        "Highest-fit personas are Heads of Sales, RevOps, and Operations leaders",
        "Top vertical clusters are SaaS, commerce enablement, and logistics tech",
        "Pricing and product re-engagement correlate strongly with conversion potential",
      ],
    },
    {
      eyebrow: "AI opportunity map",
      title: "Your clearest whitespace sits where fit is high but coverage remains low",
      description:
        "SignalOps identified a high-fit uncovered segment that should route directly into Generate, alongside a warm dormant cluster with prior engagement that is better suited to Recover.",
      bullets: [
        "684 high-fit uncovered accounts can move into Generate",
        "291 warm dormant accounts can be prioritized in Recover",
        "Coverage is weakest in UK mid-market and North America operator-heavy segments",
        "Enrichment gaps are suppressing targeting precision in otherwise strong accounts",
      ],
    },
  ];

  const segments: Segment[] = [
    {
      title: "Company size",
      fit: 91,
      coverage: 64,
      whitespace: 27,
      note:
        "Mid-market accounts are your strongest fit, but coverage is still uneven across the 50–500 employee band.",
    },
    {
      title: "Title / seniority",
      fit: 88,
      coverage: 58,
      whitespace: 30,
      note:
        "Commercial and operations leadership roles consistently outperform, especially when paired with active engagement signals.",
    },
    {
      title: "Industry",
      fit: 84,
      coverage: 62,
      whitespace: 22,
      note:
        "SaaS, commerce infrastructure, and logistics tech remain highest-fit verticals with room to expand further.",
    },
    {
      title: "Geography",
      fit: 86,
      coverage: 49,
      whitespace: 37,
      note:
        "Whitespace is most visible across the UK and North America where strong ICP density is not yet matched by outreach coverage.",
    },
    {
      title: "AOV / value band",
      fit: 82,
      coverage: 56,
      whitespace: 26,
      note:
        "Higher-value deals cluster around businesses with stronger operational complexity and multi-stakeholder buying groups.",
    },
    {
      title: "Data quality",
      fit: 79,
      coverage: 71,
      whitespace: 18,
      note:
        "Data quality is generally solid, but title completeness and stale owner assignments are limiting targeting precision.",
    },
  ];

  const actions: Action[] = [
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

  const showConnectedBar =
    connectionState === "analyzing" || connectionState === "connected";

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10">
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="text-sm font-medium text-green-700">SignalOps</div>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight text-gray-950">
              Data Center
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              Connect your customer and pipeline data to uncover matched ICP,
              whitespace, and the next best revenue actions.
            </p>
          </div>

          <div className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
              AI uses your data to analyze
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Company size",
                "Title",
                "Industry",
                "Geography",
                "AOV",
                "Coverage",
                "Engagement",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              SignalOps turns connected data into ICP clarity, whitespace
              detection, and recommended routes into Recover and Generate.
            </p>
          </div>
        </div>

        {showConnectedBar ? (
          <div className="rounded-[28px] border border-gray-200 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-5">
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

                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                    Status
                  </div>
                  <div className="mt-1 text-sm font-medium text-green-700">
                    {connectionState === "analyzing" ? "Analyzing" : "Live"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-[22px] border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Manage data
                </button>
                <button
                  type="button"
                  className="rounded-[22px] bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Sync now
                </button>
              </div>
            </div>
          </div>
        ) : null}

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

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[30px] border border-gray-200 bg-white p-7 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                  What happens next
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-950">
                  SignalOps builds the intelligence layer behind Recover and Generate
                </h2>
                <div className="mt-5 space-y-4 text-sm leading-7 text-gray-600">
                  <p>
                    Once connected, SignalOps analyzes customer, account,
                    opportunity, and engagement data to identify your matched
                    ICP, under-covered whitespace, and dormant warm segments.
                  </p>
                  <p>
                    The result is a clear recommendation engine that tells you
                    where to reactivate, where to prospect, and where your data
                    quality is holding commercial performance back.
                  </p>
                </div>
              </div>

              <div className="rounded-[30px] border border-gray-200 bg-white p-7 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                  Expected outputs
                </div>
                <div className="mt-5 space-y-3">
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
        ) : null}

        {connectionState === "analyzing" ? (
          <AnalysisPanel progress={progress} />
        ) : null}

        {connectionState === "connected" ? (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              {metrics.map((metric) => (
                <MetricTile key={metric.label} metric={metric} />
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {insights.map((insight) => (
                <HeroInsight key={insight.title} insight={insight} />
              ))}
            </div>

            <div>
              <div className="mb-4 text-sm font-medium text-gray-400">
                Attribute analysis
              </div>
              <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {segments.map((segment) => (
                  <SegmentCard key={segment.title} segment={segment} />
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[30px] border border-gray-200 bg-white p-7 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                  Data quality and coverage
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-gray-950">
                  Strong overall structure, but key gaps are still suppressing targeting precision
                </h3>
                <p className="mt-4 text-sm leading-7 text-gray-600">
                  SignalOps found several data issues that are limiting precision
                  in your highest-fit segments and reducing the quality of
                  routing into Recover and Generate.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "412 contacts missing seniority or title normalization",
                    "189 stale owner assignments in high-fit accounts",
                    "143 duplicate or near-duplicate accounts",
                    "96 high-fit accounts missing domain or enrichment detail",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700"
                    >
                      {item}
                    </div>
                  ))}
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
