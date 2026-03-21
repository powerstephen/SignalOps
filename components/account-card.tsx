import Link from "next/link"
import type { Account } from "@/lib/accounts"

type AccountCardProps = {
  account: Account
}

export default function AccountCard({ account }: AccountCardProps) {
  return (
    <Link
      href={`/account/${account.id}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-950 group-hover:text-black">
            {account.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {account.status} • {account.lastTouched}
          </p>
        </div>

        <div className="shrink-0 text-sm font-semibold text-gray-900">
          {account.score}
          <span className="text-gray-400 font-medium">/100</span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-gray-100" />

      {/* Summary */}
      <p className="text-sm leading-6 text-gray-700">
        {account.summary}
      </p>

      {/* Signals */}
      <div className="mt-4 flex flex-wrap gap-2">
        {account.signals.slice(0, 3).map((signal) => (
          <span
            key={signal}
            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600"
          >
            {signal}
          </span>
        ))}
      </div>
    </Link>
  )
}
