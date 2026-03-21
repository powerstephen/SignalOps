import Link from "next/link";
import PageContainer from "@/components/page-container";
import WorkspaceSourceBanner from "@/components/workspace-source-banner";
import { recoverLeads } from "@/lib/recover-leads";

function Badge({
  label,
  variant,
}: {
  label: string;
  variant: "default" | "green" | "yellow";
}) {
  const styles = {
    default: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

function NextStepBadge({ nextStep }: { nextStep: string }) {
  if (nextStep === "Re-engage") {
    return <Badge label="Re-engage" variant="green" />;
  }

  if (nextStep === "Follow up") {
    return <Badge label="Follow up" variant="yellow" />;
  }

  if (nextStep === "Retry with new angle") {
    return <Badge label="Retry" variant="default" />;
  }

  if (nextStep === "Revive deal") {
    return <Badge label="Revive" variant="green" />;
  }

  return <Badge label="Re-qualify" variant="default" />;
}

export default function RecoverPage() {
  return (
    <PageContainer
      title="Recover"
      subtitle="Warm leads and past interactions most likely to convert into pipeline"
    >
      <WorkspaceSourceBanner />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Last interaction</th>
              <th className="px-6 py-4">Context</th>
              <th className="px-6 py-4">Why now</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Next step</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {recoverLeads.map((lead) => (
              <tr key={lead.id} className="transition hover:bg-gray-50">
                <td className="px-6 py-5">
                  <Link href={`/contact/${lead.id}`} className="block">
                    <div className="font-medium text-gray-950 hover:underline">
                      {lead.name}
                    </div>
                    <div className="text-sm text-gray-500">{lead.role}</div>
                  </Link>
                </td>

                <td className="px-6 py-5 text-gray-700">{lead.company}</td>

                <td className="px-6 py-5 text-gray-700">
                  {lead.lastInteraction}
                </td>

                <td className="px-6 py-5 max-w-[260px] text-gray-600">
                  {lead.interactionSummary}
                </td>

                <td className="px-6 py-5 max-w-[260px] text-gray-700">
                  {lead.whyNow}
                </td>

                <td className="px-6 py-5 text-lg font-medium text-gray-950">
                  {lead.score}
                </td>

                <td className="px-6 py-5">
                  <NextStepBadge nextStep={lead.nextStep} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
