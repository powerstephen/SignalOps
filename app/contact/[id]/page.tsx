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
    notFound();
  }

  const firstName = lead.name.split(" ")[0];

  return (
    <PageContainer title="" subtitle="">
      <div className="space-y-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
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

          <div className="md:ml-auto flex flex-wrap gap-2">
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
                <div key={item.id} className="flex gap-3">
                  <div className="mt-1">
                    <TimelineDot type={item.type} />
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-400">Email 1</div>

          <div className="mt-4 max-w-2xl text-sm leading-7 text-gray-900">
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

        <div>
          <div className="text-sm font-medium text-gray-400">
            Email 2 (follow-up)
          </div>

          <div className="mt-3 text-sm text-gray-500">
            Expands once Email 1 is approved.
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
