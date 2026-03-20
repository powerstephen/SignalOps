import AccountCard from "@/components/account-card"
import PageContainer from "@/components/page-container"
import { accounts } from "@/lib/accounts"

export default function GeneratePage() {
  return (
    <PageContainer
      title="Generate"
      subtitle="Signal-led accounts ready for review"
    >
      <div className="space-y-4">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </PageContainer>
  )
}
