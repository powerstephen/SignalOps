export default function AccountPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Account: {params.id}</h1>
      <p className="text-sm text-gray-600">
        This is the account detail page.
      </p>
    </div>
  )
}
