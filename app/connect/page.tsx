type SourceTileProps = {
  title: string;
  description: string;
  brand: string;
  brandBg: string;
  buttonLabel: string;
  connected?: boolean;
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

function SourceTile({
  title,
  description,
  brand,
  brandBg,
  buttonLabel,
  connected = false,
}: SourceTileProps) {
  return (
    <div>
      <div
        className={`flex h-36 items-center justify-center rounded-2xl ${brandBg}`}
      >
        <span className="text-4xl font-semibold tracking-tight text-white">
          {brand}
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-950">{title}</h3>
          <p className="mt-2 max-w-[280px] text-sm leading-7 text-gray-600">
            {description}
          </p>
        </div>

        {connected ? <ConnectedBadge /> : null}
      </div>

      <div className="mt-5">
        <button className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-950 transition hover:bg-gray-50">
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10">
      <div className="mb-12 flex items-center gap-6">
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

      <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
        <SourceTile
          title="HubSpot"
          brand="HubSpot"
          brandBg="bg-[#ff7a59]"
          description="Pull companies, contacts, deals, site activity and engagement history from your CRM."
          connected={true}
          buttonLabel="Connect HubSpot"
        />

        <SourceTile
          title="Google Sheets"
          brand="Sheets"
          brandBg="bg-[#16a34a]"
          description="Import account, contact and signal data from a live sheet for pilots and demos."
          buttonLabel="Connect Google Sheet"
        />

        <SourceTile
          title="CSV Upload"
          brand="CSV"
          brandBg="bg-[#2563eb]"
          description="Upload a structured CSV with companies, contacts and recent activity."
          buttonLabel="Upload CSV"
        />

        <SourceTile
          title="Sample workspace"
          brand="Demo"
          brandBg="bg-[#312e81]"
          description="Load a realistic prebuilt workspace with accounts, contacts and signals."
          buttonLabel="Connect demo data"
        />
      </div>
    </div>
  );
}
