import Link from "next/link"
import PageContainer from "@/components/page-container"
import { accounts } from "@/lib/accounts"

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

export default function GeneratePage() {
  return (
    <PageContainer
      title="Generate"
      subtitle="Accounts prioritised by signal and ICP fit"
    >
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Why now</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Play</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {accounts.map((account) => (
              <tr
                key={account.id}
                className="group hover:bg-gray-50 transition"
              >
                <td className="px-4 py-4">
                  <Link
                    href={`/account/${account.id}`}
                    className="font-medium text-gray-900 group-hover:underline"
                  >
                    {account.name}
                  </Link>
                  <div className="text-xs text-gray-500 mt-1">
                    {account.summary}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <Badge
                    label={
                      account.type === "existing" ? "Existing" : "New"
                    }
                    variant={
                      account.type === "existing" ? "default" : "blue"
                    }
                  />
                </td>

                <td className="px-4 py-4 text-gray-700">
                  {account.whyNow}
                </td>

                <td className="px-4 py-4 font-medium text-gray-900">
                  {account.score}
                  <span className="text-gray-400">/100</span>
                </td>

                <td className="px-4 py-4 text-gray-700">
                  {account.recommendedPlay}
                </td>

                <td className="px-4 py-4">
                  {account.status === "ready" && (
                    <Badge label="Ready" variant="green" />
                  )}
                  {account.status === "needs_contacts" && (
                    <Badge label="Needs contacts" variant="yellow" />
                  )}
                  {account.status === "review" && (
                    <Badge label="Review" variant="default" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  )
}
