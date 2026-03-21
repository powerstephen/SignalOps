import { notFound } from "next/navigation";
import PageContainer from "@/components/page-container";
import { recoverLeads } from "@/lib/recover-leads";

function Pill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
      {label}
    </span>
  );
}

function TimelineDot({ type }: { type: string }) {
  const colors =
    type === "email"
      ? "bg-blue-500"
      : type === "meeting"
        ? "bg-purple-500"
        : type === "activity"
          ? "bg-green-500"
          : "bg-gray-400";

  return <div className={`h-2.5 w-2.5 rounded-full ${colors}`} />;
}

type Props = {
  params: { id: string };
};

export default function ContactPage({ params }: Props) {
  const lead = recoverLeads.find((l) => l.id === params.id);

  if (!lead) {
    return notFound();
  }

  const firstName = lead.name.split(" ")[0];

  return (
    <PageContainer title="" subtitle="">
      <div className="space-y-12">
        <div className="flex items-center gap-6">
          <div className="text-5xl font-semibold text-green-600">
            {lead.score}
          </div>

          <div>
            <div className="text-2xl font-semibold text-gray-950">
              {lead.name}
            </div>
            <div className="text-gray-600">
              {lead.role} at {lead.company}
            </div>
          </div>

          <div className="ml-auto flex flex-wrap gap-2">
            <Pill label="High ICP Match" />
            <Pill label="Senior Persona" />
            <Pill label="Recent Engagement" />
            <Pill label="Dormant Opportunity" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(17,24,39,0.06)]">
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Signals
            </div>

            <p className="mt-4 text-sm leading-7 text-gray-900">
              {lead.whyNow}
            </p>

            <ul className="mt-5 space-y-3 text-sm text-gray-600">
              <li>• Prior interaction showed clear interest</li>
              <li>• Lead matches a strong ICP persona</li>
              <li>• Recent activity suggests renewed timing</li>
              <li>• Worth re-engaging with a fresh angle now</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(17,24,39,0.06)]">
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Activity
            </div>

            <div className="mt-4 space-y-5">
              {lead.timeline.map((item) => (
                <div key={item.id} class
