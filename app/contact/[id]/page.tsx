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

type Props = {
  params: { id: string };
};

export default function ContactPage({ params }: Props) {
  const lead = recoverLeads.find((l) => l.id === params.id);

  if (!lead) return notFound();

  const firstName = lead.name.split(" ")[0];

  return (
    <PageContainer>
      <div className="space-y-10">
        
        {/* TOP BAR */}
        <div className="flex items-center gap-6 border p-6">
          <div className="text-5xl font-semibold text-green-600">
            {lead.score}
          </div>

          <div>
            <div className="text-2xl font-semibold">{lead.name}</div>
            <div className="text-gray-600">{lead.role}</div>
          </div>

          <div className="ml-auto flex gap-2">
            <Pill label="High ICP Match" />
            <Pill label="Senior Persona" />
            <Pill label="Recent Engagement" />
            <Pill label="Dormant Opportunity" />
          </div>
        </div>

        {/* 3 COLUMN SECTION */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* SIGNALS */}
          <div className="border p-8 text-center">
            <div className="text-lg font-semibold">
              SIGNALS
            </div>
            <div className="mt-2 text-sm text-gray-600">
              (WHY THIS LEAD)
            </div>

            <div className="mt-6 text-sm leading-7">
              {lead.whyNow}
            </div>
          </div>

          {/* DRIVERS */}
          <div className="border p-8 text-center">
            <div className="text-lg font-semibold">DRIVERS</div>

            <div className="mt-6 text-sm leading-7">
              Strong prior engagement combined with renewed buying signals
              suggests high likelihood of conversion if re-engaged now.
            </div>
          </div>

          {/* LAST ACTIVITY */}
          <div className="border p-8 text-center">
            <div className="text-lg font-semibold">LAST ACTIVITY</div>

            <div className="mt-6 text-sm leading-7">
              {lead.interactionSummary}
              <br /><br />
              Last touch: {lead.lastInteraction}
            </div>
          </div>
        </div>

        {/* EMAIL 1 */}
        <div className="border p-10">
          <div className="text-2xl font-semibold text-center">
            EMAIL 1
          </div>

          <div className="mt-6 max-w-2xl mx-auto text-sm leading-7">
            <p>Hi {firstName},</p>

            <p className="mt-4">
              Noticed {lead.whyNow.toLowerCase()} and, given we previously{" "}
              {lead.interactionSummary.toLowerCase()}, thought it might be a good
              time to reconnect.
            </p>

            <p className="mt-4">
              There looked to be real interest before, but it never turned into a
              clear next step.
            </p>

            <p className="mt-4">
              Based on what we are seeing now, there may be a strong opportunity
              to pick this back up.
            </p>

            <p className="mt-4">Open to a quick chat?</p>
          </div>
        </div>

        {/* EMAIL 2 */}
        <div className="border p-8">
          <div className="text-lg font-semibold">
            EMAIL 2 (FOLLOW-UP)
          </div>

          <div className="mt-4 text-sm text-gray-600">
            This expands once Email 1 is sent or approved.
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
