import Link from "next/link"
import type { Account } from "@/lib/accounts"

type AccountCardProps = {
  account: Account
}

export default function AccountCard({ account }: AccountCardProps) {
  return (
    <Link
      href={`/account/${account.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:bg-gray-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-950">
            {account.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {account.status} • {account.lastTouched}
          </p>
        </div>

        <div className="shrink-0 text-sm font-medium text-gray-900">
          {account.score}/100
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-700">{account.summary}</p>

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
  )
}
