export default function AccountPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold capitalize">{params.id}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Account page
          </p>
        </div>

        <button className="rounded-lg bg-black px-4 py-2 text-sm text-white">
          Launch agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div className="md:col-span-2 space-y-8">
          <section>
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Summary
            </p>
            <p className="text-sm text-gray-900 mt-2">
              This is where the generated account summary will go.
            </p>
          </section>

          <section>
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Signals
            </p>
            <p className="text-sm text-gray-900 mt-2">
              This is where your buying signals will go.
            </p>
          </section>

          <section>
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Angle
            </p>
            <p className="text-sm text-gray-900 mt-2">
              This is where the outreach angle will go.
            </p>
          </section>

          <section>
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Email
            </p>
            <p className="text-sm text-gray-900 mt-2">
              This is where the generated email draft will go.
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Score
            </p>
            <p className="text-sm text-gray-900 mt-2">91/100</p>
          </div>

          <div>
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Status
            </p>
            <p className="text-sm text-gray-900 mt-2">Warm but neglected</p>
          </div>

          <div>
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Last touched
            </p>
            <p className="text-sm text-gray-900 mt-2">72 days ago</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
