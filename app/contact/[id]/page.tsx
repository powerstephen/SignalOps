import { notFound } from "next/navigation";
import PageContainer from "@/components/page-container";
import WorkspaceSourceBanner from "@/components/workspace-source-banner";
import { recoverLeads } from "@/lib/recover-leads";

function Pill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
      {label}
    </span>
  );
}

type Props = {
  params: { id: string };
};

export default function ContactPage({ params }: Props) {
  const lead = recoverLeads.find((l) => l.id === params.id);

  if (!lead) {
    notFound();
  }

  const firstName = lead.name.split(" ")[0];

  return (
    <PageContainer
      title={lead.name}
      subtitle={`${lead.role} at ${lead.company}`}
    >
      <WorkspaceSourceBanner />

      <div className="space-y-10">
        <div className="flex items-center gap-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="text-5xl font-semibold text-green-600">
            {lead.score}
          </div>

          <div>
            <div className="text-2xl font-semibold text-gray-950">
              {lead.name}
            </div>
            <div className="text-gray-600">{lead.role}</div>
          </div>

          <div className="ml-auto flex flex-wrap gap-2">
            <Pill label="High ICP Match" />
            <Pill label="Senior Persona" />
            <Pill label="Recent Engagement" />
            <Pill label="Dormant Opportunity" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <div className="text-lg font-semibold text-gray-950">SIGNALS</div>
            <div className="mt-2 text-sm text-gray-500">(WHY THIS LEAD)</div>

            <div className="mt-6 text-sm leading-7 text-gray-700">
              {lead.whyNow}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <div className="text-lg font-semibold text-gray-950">DRIVERS</div>

            <div className="mt-6 text-sm leading-7 text-gray-700">
              Strong prior engagement combined with renewed buying signals
              suggests a high likelihood of conversion if re-engaged now.
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <div className="text-lg font-semibold text-gray-950">
              LAST ACTIVITY
            </div>

            <div className="mt-6 text-sm leading-7 text-gray-700">
              {lead.interactionSummary}
              <br />
              <br />
              Last touch: {lead.lastInteraction}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-10">
          <div className="text-center text-2xl font-semibold text-gray-950">
            EMAIL 1
          </div>

          <div className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-900">
            <p>Hi {firstName},</p>

            <p className="mt-4">
              Noticed {lead.whyNow.toLowerCase()} and, given we previously{" "}
              {lead.interactionSummary.toLowerCase()}, thought it might be a
              good time to reconnect.
            </p>

            <p className="mt-4">
              There looked to be real interest before, but it never turned into
              a clear next step.
            </p>

            <p className="mt-4">
              Based on what we are seeing now, there may be a strong
              opportunity to pick this back up.
            </p>

            <p className="mt-4">Open to a quick chat?</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <div className="text-lg font-semibold text-gray-950">
            EMAIL 2 (FOLLOW-UP)
          </div>

          <div className="mt-4 text-sm text-gray-600">
            This can expand once Email 1 is approved or sent.
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
