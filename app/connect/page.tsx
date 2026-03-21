"use client";

import { useRouter } from "next/navigation";
import {
  WORKSPACE_SOURCE_STORAGE_KEY,
  type WorkspaceSourceId,
} from "@/lib/workspace-source";

type SourceTileProps = {
  brand: string;
  brandBg: string;
  buttonLabel: string;
  connected?: boolean;
  sourceId: WorkspaceSourceId;
  onConnect: (sourceId: WorkspaceSourceId) => void;
};

function ConnectedBadge() {
  return (
    <div className="mt-4">
      <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-medium text-green-700">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
          ✓
        </span>
        Connected
      </span>
    </div>
  );
}

function SourceTile({
  brand,
  brandBg,
  buttonLabel,
  connected = false,
  sourceId,
  onConnect,
}: SourceTileProps) {
  return (
    <div className="w-full max-w-[248px]">
      <button
        type="button"
        onClick={() => onConnect(sourceId)}
        className={`flex h-[112px] w-full items-center justify-center rounded-[20px] ${brandBg}`}
      >
        <span className="text-[32px] font-semibold tracking-tight text-white">
          {brand}
        </span>
      </button>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => onConnect(sourceId)}
          className="inline-flex items-center gap-3 text-[16px] font-semibold text-gray-950 transition hover:opacity-70"
        >
          <span className="text-[24px] leading-none">→</span>
          <span>{buttonLabel}</span>
        </button>

        {connected ? <ConnectedBadge /> : null}
      </div>
    </div>
  );
}

export default function ConnectPage() {
  const router = useRouter();

  function handleConnect(sourceId: WorkspaceSourceId) {
    window.localStorage.setItem(WORKSPACE_SOURCE_STORAGE_KEY, sourceId);
    router.push("/generate");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-12 md:px-10">
      <div className="mb-12 flex items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white shadow-[0_0_0_1px_rgba(17,24,39,0.06)]">
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

      <div className="grid justify-between gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
        <SourceTile
          brand="HubSpot"
          brandBg="bg-[#ff5a0a]"
          buttonLabel="Connect HubSpot CRM"
          connected={true}
          sourceId="hubspot"
          onConnect={handleConnect}
        />

        <SourceTile
          brand="Sheets"
          brandBg="bg-[#16a34a]"
          buttonLabel="Connect Google Sheet"
          sourceId="google_sheets"
          onConnect={handleConnect}
        />

        <SourceTile
          brand="CSV"
          brandBg="bg-[#2563eb]"
          buttonLabel="Upload CSV"
          sourceId="csv"
          onConnect={handleConnect}
        />

        <SourceTile
          brand="Demo"
          brandBg="bg-[#312e81]"
          buttonLabel="Connect demo data"
          sourceId="sample"
          onConnect={handleConnect}
        />
      </div>
    </div>
  );
}
