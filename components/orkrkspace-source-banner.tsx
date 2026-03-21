"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_WORKSPACE_SOURCE,
  WORKSPACE_SOURCE_STORAGE_KEY,
  getWorkspaceSourceLabel,
} from "@/lib/workspace-source";

export default function WorkspaceSourceBanner() {
  const [sourceLabel, setSourceLabel] = useState(
    getWorkspaceSourceLabel(DEFAULT_WORKSPACE_SOURCE)
  );

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(WORKSPACE_SOURCE_STORAGE_KEY)
        : null;

    setSourceLabel(getWorkspaceSourceLabel(stored));
  }, []);

  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
          ✓
        </span>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Active source
          </p>
          <p className="text-sm font-medium text-gray-950">{sourceLabel}</p>
        </div>
      </div>

      <Link
        href="/connect"
        className="text-sm font-medium text-gray-600 transition hover:text-gray-950"
      >
        Change source
      </Link>
    </div>
  );
}
