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
  children: React.ReactNode
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

export default function AccountPage({ params }: AccountPageProps) {
  const account = accounts.find((item) => item.id === params.id)

  if (!account) {
    notFound()
  }

  return (
    <PageContainer
      title={account.name}
      subtitle={`${account.status} • ${account.lastTouched}`}
      action={
        <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
          Launch agent
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-8">
          <Section label="Summary">
            <p>{account.summary}</p>
          </Section>

          <Section label="Signals">
            <ul className="space-y-2">
              {account.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </Section>

          <Section label="Angle">
            <p>{account.angle}</p>
          </Section>

          <Section label="Email">
            <p>{account.email}</p>
          </Section>
        </div>

        <aside className="space-y-6">
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
              ICP fit
            </p>
            <p className="mt-2 text-sm text-gray-900">{account.icpFit}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Last touched
            </p>
            <p className="mt-2 text-sm text-gray-900">{account.lastTouched}</p>
          </div>
        </aside>
      </div>
    </PageContainer>
  )
}
