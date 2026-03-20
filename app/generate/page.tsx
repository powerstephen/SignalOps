import Link from "next/link"

const accounts = [
  {
    id: "revscale",
    name: "RevScale",
    score: 91,
    summary: "Warm but neglected. Strong ICP fit and recent sales hiring activity.",
  },
  {
    id: "acme-ai",
    name: "Acme AI",
    score: 84,
    summary: "Good fit with buying signals and no recent outreach.",
  },
]

export default function GeneratePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Generate</h1>

      <div className="space-y-4">
        {accounts.map((account) => (
          <Link
            key={account.id}
            href={`/account/${account.id}`}
            className="block border rounded-xl p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{account.name}</h2>
              <span className="text-sm">{account.score}/100</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{account.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
