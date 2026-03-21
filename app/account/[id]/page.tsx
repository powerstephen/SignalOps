import { ReactNode } from "react"
import { notFound } from "next/navigation"
import PageContainer from "@/components/page-container"
import { accounts } from "@/lib/accounts"

type AccountPageProps = {
  params: {
    id: string
  }
}

function Section({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <section>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <div className="mt-2 text-sm leading-6 text-gray-900">{children}</div>
    </section>
  )
}

function Badge({
  label,
  variant,
}: {
  label: string
  variant: "default" | "green" | "blue" | "yellow"
}) {
  const styles = {
    default: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[variant]}`}
    >
      {label}
    </span>
  )
}

export default function AccountPage({ params }: AccountPageProps) {
  const account = accounts.find((item) => item.id === params.id)

  if (!account) {
    notFound()
  }

  return (
    <PageContainer
      title={account.name}
      subtitle={account.whyNow}
      action={
        <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
          Generate contacts
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-8">
          <Section label="Summary">
            <p>{account.summary}</p>
          </Section>

          <Section label="Why now">
            <p>{account.whyNow}</p>
          </Section>

          <Section label="Signals">
            <ul className="space-y-2">
              {account.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </Section>

          <Section label="Recommended play">
            <p>{account.recommendedPlay}</p>
          </Section>

          <Section label="Next step">
            <p>
              Generate the best-fit contacts at this account, enrich work emails,
              and prepare tailored outreach based on the signals above.
            </p>
          </Section>
        </div>

        <aside className="space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Type
            </p>
            <div className="mt-2">
              <Badge
                label={account.type === "existing" ? "Existing" : "New"}
                variant={account.type === "existing" ? "default" : "blue"}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Score
            </p>
            <p className="mt-2 text-sm font-medium text-gray-900">
              {account.score}/100
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Status
            </p>
            <div className="mt-2">
              {account.status === "ready" && (
                <Badge label="Ready" variant="green" />
              )}
              {account.status === "needs_contacts" && (
                <Badge label="Needs contacts" variant="yellow" />
              )}
              {account.status === "review" && (
                <Badge label="Review" variant="default" />
              )}
            </div>
          </div>

          {account.lastTouched ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Last touched
              </p>
              <p className="mt-2 text-sm text-gray-900">{account.lastTouched}</p>
            </div>
          ) : null}
        </aside>
      </div>
    </PageContainer>
  )
}
