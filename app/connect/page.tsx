type SourceTileProps = {
  title: string;
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
  brand,
  brandBg,
  buttonLabel,
  connected = false,
}: SourceTileProps) {
  return (
    <div className="w-full max-w-[360px]">
      <div
        className={`flex h-[152px] w-full items-center justify-center rounded-[28px] ${brandBg}`}
      >
        <span className="text-4xl font-semibold tracking-tight text-white">
          {brand}
        </span>
      </div>

      <div className="mt-5 flex min-h-[28px] items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold text-gray-950">{title}</h3>
        {connected ? <ConnectedBadge /> : null}
      </div>

      <div className="mt-5">
        <button className="inline-flex items-center gap-3 text-[20px] font-semibold text-gray-950 transition hover:opacity-70">
          <span className="text-[32px] leading-none">→</span>
          <span>{buttonLabel}</span>
        </button>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10">
      <div className="mb-14 flex items-center gap-6">
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

      <div className="grid justify-between gap-x-10 gap-y-16 sm:grid-cols-2 xl:grid-cols-4">
        <SourceTile
          title="HubSpot"
          brand="HubSpot"
          brandBg="bg-[#ff5a0a]"
          connected={true}
          buttonLabel="Connect HubSpot CRM"
        />

        <SourceTile
          title="Google Sheets"
          brand="Sheets"
          brandBg="bg-[#16a34a]"
          buttonLabel="Connect Google Sheet"
        />

        <SourceTile
          title="CSV Upload"
          brand="CSV"
          brandBg="bg-[#2563eb]"
          buttonLabel="Upload CSV"
        />

        <SourceTile
          title="Sample workspace"
          brand="Demo"
          brandBg="bg-[#312e81]"
          buttonLabel="Connect demo data"
        />
      </div>
    </div>
  );
}
