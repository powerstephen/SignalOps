"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

type GenerateSegment =
  | "uncovered_icp"
  | "coverage_gaps"
  | "default";

type Account = {
  id: string;
  company: string;
  contact: string;
  title: string;
  geography: string;
  industry: string;
  employees: string;
  fitScore: number;
  whyNow: string;
  signal: string;
};

const uncoveredIcpAccounts: Account[] = [
  {
    id: "1",
    company: "RevScale",
    contact: "Maya Collins",
    title: "Head of Revenue Operations",
    geography: "London, UK",
    industry: "B2B SaaS",
    employees: "120 employees",
    fitScore: 94,
    whyNow: "Strong ICP match with no active sequence and recent pricing page activity.",
    signal: "Uncovered ICP",
  },
  {
    id: "2",
    company: "Northbeam Commerce",
    contact: "Chris Patel",
    title: "VP Sales",
    geography: "Manchester, UK",
    industry: "Commerce Tech",
    employees: "210 employees",
    fitScore: 91,
    whyNow: "Operator-led buying team, healthy engagement density, not currently targeted.",
    signal: "Uncovered ICP",
  },
  {
    id: "3",
    company: "Portlane",
    contact: "Sophie Turner",
    title: "Head of Commercial Ops",
    geography: "Dublin, Ireland",
    industry: "Logistics Tech",
    employees: "84 employees",
    fitScore: 89,
    whyNow: "High-fit segment with no recent outreach and strong industry overlap.",
    signal: "Uncovered ICP",
  },
  {
    id: "4",
    company: "LedgerFox",
    contact: "Ben Harris",
    title: "Revenue Operations Manager",
    geography: "Austin, US",
    industry: "Fintech SaaS",
    employees: "160 employees",
    fitScore: 87,
    whyNow: "Fits target title and company size band with whitespace in current coverage.",
    signal: "Uncovered ICP",
  },
  {
    id: "5",
    company: "CargoPilot",
    contact: "Anna Reed",
    title: "Head of Sales",
    geography: "New York, US",
    industry: "Logistics Tech",
    employees: "260 employees",
    fitScore: 92,
    whyNow: "High-fit account in a strong vertical with no assigned outbound motion.",
    signal: "Uncovered ICP",
  },
  {
    id: "6",
    company: "ScaleGrid",
    contact: "Liam Walsh",
    title: "VP Revenue",
    geography: "Bristol, UK",
    industry: "SaaS",
    employees: "310 employees",
    fitScore: 90,
    whyNow: "Top-tier ICP profile with no active owner and clear whitespace in UK coverage.",
    signal: "Uncovered ICP",
  },
];

const coverageGapAccounts: Account[] = [
  {
    id: "7",
    company: "OperatorCloud",
    contact: "Nina Brooks",
    title: "Head of Operations",
    geography: "London, UK",
    industry: "SaaS",
    employees: "140 employees",
    fitScore: 90,
    whyNow: "Strong UK fit but limited outreach coverage in this persona cluster.",
    signal: "Coverage Gap",
  },
  {
    id: "8",
    company: "FulfillIQ",
    contact: "Jacob Smith",
    title: "VP Operations",
    geography: "Chicago, US",
    industry: "Commerce Infrastructure",
    employees: "230 employees",
    fitScore: 88,
    whyNow: "High-fit US operator segment with low pipeline penetration.",
    signal: "Coverage Gap",
  },
  {
    id: "9",
    company: "GridHarbor",
    contact: "Emily Green",
    title: "Director of Revenue Operations",
    geography: "Toronto, Canada",
    industry: "B2B SaaS",
    employees: "190 employees",
    fitScore: 86,
    whyNow: "Under-covered RevOps cluster aligned with ICP and historical wins.",
    signal: "Coverage Gap",
  },
];

const defaultAccounts = uncoveredIcpAccounts;

function getSegmentFromQuery(value: string | null): GenerateSegment {
  if (value === "uncovered_icp") return "uncovered_icp";
  if (value === "coverage_gaps") return "coverage_gaps";
  return "default";
}

function getPageContent(segment: GenerateSegment) {
  if (segment === "uncovered_icp") {
    return {
      eyebrow: "Generate",
      title: "Uncovered ICP accounts ready for outbound",
      subtitle:
        "These accounts match your strongest ICP profile but are not currently being targeted. SignalOps has prioritized the best-fit accounts to start generating pipeline.",
      stat1: "684",
      stat1Label: "Uncovered ICP accounts",
      stat2: "91%",
      stat2Label: "Average fit score",
      stat3: "UK + US",
      stat3Label: "Top whitespace markets",
      accounts: uncoveredIcpAccounts,
      banner:
        "Loaded from Data Center: Uncovered ICP segment",
    };
  }

  if (segment === "coverage_gaps") {
    return {
      eyebrow: "Generate",
      title: "Coverage gaps with strong commercial potential",
      subtitle:
        "These accounts sit inside under-covered segments where ICP fit is high but current sales and marketing coverage is low.",
      stat1: "237",
      stat1Label: "Accounts in gap clusters",
      stat2: "88%",
      stat2Label: "Average fit score",
      stat3: "3",
      stat3Label: "Priority segments",
      accounts: coverageGapAccounts,
      banner:
        "Loaded from Data Center: Coverage gap segment",
    };
  }

  return {
    eyebrow: "Generate",
    title: "Build pipeline from high-fit target accounts",
    subtitle:
      "Generate helps you prioritize net-new accounts based on ICP fit, whitespace, and buying signals so you can focus outreach where it is most likely to convert.",
    stat1: "684",
    stat1Label: "Suggested accounts",
    stat2: "91%",
    stat2Label: "Average fit score",
    stat3: "12",
    stat3Label: "Active segments",
    accounts: defaultAccounts,
    banner:
      "Showing default Generate view",
  };
}

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="text-3xl font-semibold tracking-tight text-gray-950">
        {value}
      </div>
      <div className="mt-2 text-sm text-gray-600">{label}</div>
    </div>
  );
}

function AccountRow({ account }: { account: Account }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-[0_8px_24px_rgba(17,24,39,0.06)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-lg font-semibold text-gray-950">
              {account.company}
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {account.signal}
            </span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Fit {account.fitScore}
            </span>
          </div>

          <div className="mt-2 text-sm text-gray-700">
            {account.contact} • {account.title}
          </div>

          <div className="mt-1 text-sm text-gray-500">
            {account.geography} • {account.industry} • {account.employees}
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
            {account.whyNow}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/contact/${account.id}`}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Review
          </Link>
          <button className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
            Generate sequence
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const segment = getSegmentFromQuery(searchParams.get("segment"));
  const content = useMemo(() => getPageContent(segment), [segment]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-8 py-8">
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
              Data handoff
            </div>
            <div className="mt-1 text-sm font-medium text-gray-900">
              {content.banner}
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

      <div>
        <div className="text-sm font-medium text-green-700">{content.eyebrow}</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-950">
          {content.title}
        </h1>
        <p className="mt-3 max-w-4xl text-base leading-7 text-gray-600">
          {content.subtitle}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard value={content.stat1} label={content.stat1Label} />
        <StatCard value={content.stat2} label={content.stat2Label} />
        <StatCard value={content.stat3} label={content.stat3Label} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-950">
              Priority account list
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Accounts are ranked by ICP fit, whitespace relevance, and commercial potential.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              Sort by fit
            </button>
            <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              Filter segment
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {content.accounts.map((account) => (
          <AccountRow key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
