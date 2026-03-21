import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/page-container";
import WorkspaceSourceBanner from "@/components/workspace-source-banner";
import { recoverLeads, RecoverTimelineItem } from "@/lib/recover-leads";
import { accounts } from "@/lib/accounts";

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

function TimelineDot({ type }: { type: RecoverTimelineItem["type"] }) {
  const className =
    type === "email"
      ? "bg-blue-500"
      : type === "meeting"
        ? "bg-violet-500"
        : type === "activity"
          ? "bg-green-500"
          : "bg-gray-400";

  return <span className={`mt-1 inline-flex h-3 w-3 rounded-full ${className}`} />;
}

type ContactPageProps = {
  params: {
    id: string;
  };
};

export default function ContactPage({ params }: ContactPageProps) {
  const lead = recoverLeads.find((item) => item.id === params.id);

  if (!lead) {
    notFound();
  }

  const firstName = lead.name.split(" ")[0];
  const linkedAccount = accounts.find(
    (account) => account.name.toLowerCase() === lead.company.toLowerCase()
  );

  return (
    <PageContainer
      title={lead.name}
      subtitle={`${lead.role} at ${lead.company}`}
    >
      <WorkspaceSourceBanner />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Why now
            </div>
            <p className="mt-3 text-base leading-7 text-gray-900">
              {lead.whyNow}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Interaction timeline
            </div>

            <div className="mt-6 space-y-6">
              {lead.timeline.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <TimelineDot type={item.type} />
                    <span className="mt-2 h-full w-px bg-gray-200" />
                  </div>

                  <div className="pb-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-medium text-gray-950">
                        {item.title}
                      </p>
                      <span className="text-xs uppercase tracking-wide text-gray-400">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Suggested email
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-5 text-sm leading-7 text-gray-900">
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
                Based on what we are seeing now, there may be a good opportunity
                to pick this back up.
              </p>

              <p className="mt-4">Open to a quick chat?</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Suggested LinkedIn message
            </div>

            <p className="mt-4 text-sm leading-7 text-gray-900">
              Hi {firstName} — we spoke previously and I noticed {lead.whyNow.toLowerCase()}.
              Thought it might be worth reconnecting. Are you still the right
              person for this area?
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Contact
            </div>
            <div className="mt-3 text-lg font-medium text-gray-950">
              {lead.name}
            </div>
            <div className="mt-1 text-sm text-gray-600">{lead.role}</div>
            <div className="mt-1 text-sm text-gray-600">{lead.email}</div>
            <div className="mt-1 text-sm text-gray-600">{lead.company}</div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Score
            </div>
            <div className="mt-3 text-2xl font-semibold text-gray-950">
              {lead.score}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Next step
            </div>
            <div className="mt-3">
              <NextStepBadge nextStep={lead.nextStep} />
            </div>
          </div>

          {linkedAccount ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Account signals
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                View the broader account context, active signals and additional
                contacts at {lead.company}.
              </p>
              <Link
                href={`/account/${linkedAccount.id}`}
                className="mt-4 inline-flex rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-950 transition hover:bg-gray-50"
              >
                View account signals
              </Link>
            </div>
          ) : null}

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <button className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
              Save draft
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
