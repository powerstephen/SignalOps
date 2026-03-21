import Link from "next/link";

type SourceCardProps = {
  title: string;
  description: string;
  brand: string;
  brandBg: string;
  brandText?: string;
  connected?: boolean;
  cta: string;
};

function ConnectedBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
      <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-green-500 bg-green-500 text-[11px] text-white">
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
  brandText = "text-white",
  connected = false,
  cta,
}: SourceCardProps) {
  return (
    <div className="group rounded-2xl bg-white p-4 shadow-[0_0_0_1px_rgba(17,24,39,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(17,24,39,0.08)]">
      <div className={`flex h-28 items-center justify-center rounded-2xl ${brandBg}`}>
        <span className={`text-3xl font-semibold tracking-tight ${brandText}`}>
          {brand}
        </span>
      </div>

      <div className="mt-4 flex min-h-[72px] items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
        </div>

        {connected ? <ConnectedBadge /> : null}
      </div>

      <div className="mt-5">
        <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50">
          {cta}
        </button>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10">
      <div className="mb-12 flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_0_0_1px_rgba(17,24,39,0.06)]">
            <span className="text-4xl leading-none text-[#214c8f]">↓</span>
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

        <Link
          href="/login"
          className="rounded-[32px] bg-black px-8 py-4 text-2xl font-semibold tracking-tight text-white transition hover:opacity-90"
        >
          log in
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <SourceCard
          title="HubSpot"
          brand="HubSpot"
          brandBg="bg-[#ff7a59]"
          description="Connect your CRM to pull companies, contacts, deals, site activity and engagement history."
          connected={true}
          cta="Connected"
        />

        <SourceCard
          title="Google Sheets"
          brand="Sheets"
          brandBg="bg-[#16a34a]"
          description="Import account, contact and signal data from a live sheet for pilots, demos or non-HubSpot teams."
          cta="Connect Google Sheet"
        />

        <SourceCard
          title="CSV Upload"
          brand="CSV"
          brandBg="bg-[#2563eb]"
          description="Upload a structured CSV file with companies, contacts and recent activity for one-off imports."
          cta="Upload CSV"
        />

        <SourceCard
          title="Sample workspace"
          brand="Demo"
          brandBg="bg-[#312e81]"
          description="Load a realistic prebuilt workspace with accounts, contacts and signals to test the platform end to end."
          cta="Load sample data"
        />
      </div>

      <div className="mt-14 rounded-3xl bg-white p-8 shadow-[0_0_0_1px_rgba(17,24,39,0.06)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-950">
              Current active source
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              HubSpot is currently connected and ready. You can continue into the
              workspace, or switch to Sheets, CSV or a sample workspace for demos.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ConnectedBadge />
            <Link
              href="/generate"
              className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Continue to workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
