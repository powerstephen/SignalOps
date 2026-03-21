import Link from "next/link";
import PageContainer from "@/components/page-container";
import WorkspaceSourceBanner from "@/components/workspace-source-banner";
import { accounts } from "@/lib/accounts";

function Badge({
  label,
  variant,
}: {
  label: string;
  variant: "default" | "green" | "blue" | "yellow";
}) {
  const styles = {
    default: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
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

const recoverAccounts = [...accounts]
  .filter((account) => account.type === "existing")
  .sort((a, b) => b.score - a.score);

export default function RecoverPage() {
  return (
    <PageContainer
      title="Recover"
      subtitle="Previously engaged accounts showing renewed signals and ready for reactivation"
    >
      <WorkspaceSourceBanner />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="w-[34%] px-6 py-4 font-medium">Company</th>
              <th className="w-[18%] px-6 py-4 font-medium">Last touch</th>
              <th className="w-[24%] px-6 py-4 font-medium">Why now</th>
              <th className="w-[8%] px-6 py-4 font-medium">Score</th>
              <th className="w-[10%] px-6 py-4 font-medium">Play</th>
              <th className="w-[12%] px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {recoverAccounts.map((account) => (
              <tr key={account.id} className="transition hover:bg-gray-50">
                <td className="px-6 py-6 align-top">
                  <Link href={`/account/${account.id}`} className="block">
                    <div className="text-xl font-medium text-gray-950 hover:underline">
                      {account.name}
                    </div>
                    <div className="mt-2 max-w-xl text-sm leading-7 text-gray-500">
                      {account.summary}
                    </div>
                  </Link>
                </td>

                <td className="px-6 py-6 align-top text-base text-gray-700">
                  {account.lastTouched ?? "—"}
                </td>

                <td className="px-6 py-6 align-top text-base leading-7 text-gray-700">
                  {account.whyNow}
                </td>

                <td className="px-6 py-6 align-top text-xl font-medium text-gray-950">
                  {account.score}
                  <span className="font-normal text-gray-400">/100</span>
                </td>

                <td className="px-6 py-6 align-top text-base text-gray-700">
                  {account.recommendedPlay}
                </td>

                <td className="px-6 py-6 align-top">
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
  );
}
