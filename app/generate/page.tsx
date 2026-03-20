import Link from "next/link"
import { accounts } from "@/lib/accounts"

export default function GeneratePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Generate</h1>
        <p className="mt-1 text-sm text-gray-500">
          Signal-led accounts ready for review
        </p>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => (
          <Link
            key={account.id}
            href={`/account/${account.id}`}
            className="block rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold">{account.name}</h2>
                <p className="mt-1 text-sm text-gray-600">{account.summary}</p>
              </div>

              <div className="whitespace-nowrap text-sm font-medium text-gray-900">
                {account.score}/100
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {account.signals.slice(0, 3).map((signal) => (
                <span
                  key={signal}
                  className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                >
                  {signal}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
