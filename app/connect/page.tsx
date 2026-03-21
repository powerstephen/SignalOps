type SourceCardProps = {
  title: string;
  description: string;
  brand: string;
  brandBg: string;
  connected?: boolean;
  cta: string;
};

function ConnectedBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[11px] text-white">
        ✓
      </span>
      Connected
    </div>
  );
}

function SourceCard({
  title,
  description,
  brand,
  brandBg,
  connected = false,
  cta,
}: SourceCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_0_0_1px_rgba(17,24,39,0.06)]">
      <div className={`flex h-28 items-center justify-center rounded-2xl ${brandBg}`}>
        <span className="text-3xl font-semibold tracking-tight text-white">
          {brand}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-gray-950">{title}</h3>
          {connected ? <ConnectedBadge /> : null}
        </div>

        <p className="mt-3 text-sm leading-7 text-gray-600">{description}</p>

        <button className="mt-5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-950 transition hover:bg-gray-50">
          {cta}
        </button>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10">
      <div className="mb-10 flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-[0_0_0_1px_rgba(17,24,39,0.06)]">
          <span className="text-5xl leading-none text-[#214c8f]">↓</span>
        </div>

        <div>
          <h1 className="text-5xl font-semibold tracking-tight text-gray-950">
            import data
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Connect a source or load a sample workspace to explore SignalOps.
          </p>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <SourceCard
          title="HubSpot"
          brand="HubSpot"
          brandBg="bg-[#ff7a59]"
          description="Pull companies, contacts, deals, site activity and engagement history from your CRM."
          connected={true}
          cta="Connected"
        />

        <SourceCard
          title="Google Sheets"
          brand="Sheets"
          brandBg="bg-[#16a34a]"
          description="Import account, contact and signal data from a live sheet for pilots and demos."
          cta="Connect Google Sheet"
        />

        <SourceCard
          title="CSV Upload"
          brand="CSV"
          brandBg="bg-[#2563eb]"
          description="Upload a structured CSV with companies, contacts and recent activity."
          cta="Upload CSV"
        />

        <SourceCard
          title="Sample workspace"
          brand="Demo"
          brandBg="bg-[#312e81]"
          description="Load a realistic prebuilt workspace with accounts, contacts and signals."
          cta="Load sample data"
        />
      </div>
    </div>
  );
}
