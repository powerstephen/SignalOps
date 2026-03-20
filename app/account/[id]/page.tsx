import { notFound } from "next/navigation"
import { accounts } from "@/lib/accounts"

type AccountPageProps = {
  params: {
    id: string
  }
}

export default function AccountPage({ params }: AccountPageProps) {
  const account = accounts.find((item) => item.id === params.id)

  if (!account) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{account.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {account.status} • {account.lastTouched}
          </p>
        </div>

        <button className="rounded-lg bg-black px-4 py-2 text-sm text-white">
          Launch agent
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-2">
          <section>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Summary
            </p>
            <p className="mt-2 text-sm text-gray-900">{account.summary}</p>
          </section>

          <section>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Signals
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-900">
              {account.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </section>

          <section>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Angle
            </p>
            <p className="mt-2 text-sm text-gray-900">{account.angle}</p>
          </section>

          <section>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Email
            </p>
            <p className="mt-2 text-sm text-gray-900">{account.email}</p>
          </section>
        </div>

        <aside className="space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Score
            </p>
            <p className="mt-2 text-sm text-gray-900">{account.score}/100</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              ICP Fit
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
    </div>
  )
}
