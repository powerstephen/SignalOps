"use client";

import Link from "next/link";

type RecoverLead = {
  id: string;
  name: string;
  role: string;
  company: string;
  score: number;
  whyNow: string;
  stage: string;
  lastTouch: string;
};

const defaultRecoverLeads: RecoverLead[] = [
  {
    id: "1",
    name: "Sarah Turner",
    role: "Head of Sales",
    company: "Attio",
    score: 92,
    whyNow: "Revisited pricing and prior positive engagement",
    stage: "Dormant opportunity",
    lastTouch: "46 days ago",
  },
  {
    id: "2",
    name: "James Miller",
    role: "VP Revenue Operations",
    company: "RevScale",
    score: 88,
    whyNow: "Strong ICP fit with prior discovery activity",
    stage: "Stalled after interest",
    lastTouch: "31 days ago",
  },
  {
    id: "3",
    name: "Olivia Brooks",
    role: "Head of Commercial Ops",
    company: "Portlane",
    score: 84,
    whyNow: "Recent site revisit and no follow up sequence",
    stage: "Warm but inactive",
    lastTouch: "18 days ago",
  },
];

function RecoverLeadCard({ lead }: { lead: RecoverLead }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-[0_8px_24px_rgba(17,24,39,0.06)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-lg font-semibold text-gray-950">
              {lead.name}
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Score {lead.score}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {lead.stage}
            </span>
          </div>

          <div className="mt-2 text-sm text-gray-700">
            {lead.role} at {lead.company}
          </div>

          <div className="mt-1 text-sm text-gray-500">
            Last touch: {lead.lastTouch}
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-600">{lead.whyNow}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/contact/${lead.id}`}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Review
          </Link>
          <button className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
            Open sequence
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecoverPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-8">
      <div>
        <div className="text-sm font-medium text-green-700">Recover</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-950">
          Re-engage warm leads and revive stalled pipeline
        </h1>
        <p className="mt-3 max-w-4xl text-base leading-7 text-gray-600">
          Recover prioritizes leads with prior interest, recent timing signals,
          and clear ICP overlap so your team can restart valuable conversations
          faster.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
              Current view
            </div>
            <div className="mt-1 text-sm font-medium text-gray-900">
              Default Recover list
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/data-center"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Back to Data Center
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-3xl font-semibold tracking-tight text-gray-950">
            291
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Warm dormant accounts
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-3xl font-semibold tracking-tight text-gray-950">
            87
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Average recovery score
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-3xl font-semibold tracking-tight text-gray-950">
            46 days
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Average time since last touch
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-950">
              Priority recovery list
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Leads are ranked by prior engagement, timing signals, and ICP fit.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              Sort by score
            </button>
            <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              Filter stage
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {defaultRecoverLeads.map((lead) => (
          <RecoverLeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
