import Link from "next/link"

const accounts = [
  {
    id: "revscale",
    name: "RevScale",
    score: 91,
    summary: "Warm but neglected. Strong ICP fit and recent sales hiring activity.",
    signals: ["Hiring growth", "No recent outreach", "Strong fit"],
  },
  {
    id: "acme-ai",
    name: "Acme AI",
    score: 84,
    summary: "Good fit with buying signals and no recent outreach.",
    signals: ["Website traffic up", "New funding", "Open opportunity"],
  },
]

export default function GeneratePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Generate</h1>
        <p className="text-sm text-gray-500 mt-1">
          Signal-led accounts ready for review
        </p>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => (
          <Link
            key={account.id}
            href={`/account/${account.id}`}
            className="block rounded-xl border border-gray-200 p-5 hover:bg-gray-50 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">{account.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{account.summary}</p>
              </div>
              <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                {account.score}/100
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {account.signals.map((signal) => (
                <span
                  key={signal}
                  className="text-xs text-gray-600 bg-gray-100 rounded-full px-2.5 py-1"
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
