"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { leads } from "@/lib/data";
import { googleSheetUrlToCsvUrl, normalizeImportedRows } from "@/lib/import";

export default function ConnectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [error, setError] = useState("");

  const saveLeads = (data: unknown, mode: string) => {
    localStorage.setItem("uploadedLeads", JSON.stringify(data));
    localStorage.setItem("dataMode", mode);
  };

  const saveDeals = (data: unknown) => {
    localStorage.setItem("uploadedDeals", JSON.stringify(data));
  };

  const handleUseSample = () => {
    setLoading(true);
    setTimeout(() => {
      saveLeads(leads, "sample");
      router.push("/");
    }, 800);
  };

  const handleLeadsUpload = async (file: File) => {
    try {
      setLoading(true);
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      saveLeads(normalizeImportedRows(rows), "uploaded");
      router.push("/");
    } catch {
      setLoading(false);
      setError("Could not import leads file. Please use CSV or Excel.");
    }
  };

  const handleDealsUpload = async (file: File) => {
    try {
      setLoading(true);
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      saveDeals(rows);
      setLoading(false);
      alert("Deals uploaded successfully");
    } catch {
      setLoading(false);
      setError("Could not import deals file. Please use CSV or Excel.");
    }
  };

  const handleGoogleSheet = async () => {
    try {
      setLoading(true);
      const csvUrl = googleSheetUrlToCsvUrl(sheetUrl);
      const res = await fetch(csvUrl);
      if (!res.ok) throw new Error("Failed to fetch sheet");
      const text = await res.text();
      const workbook = XLSX.read(text, { type: "string" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      saveLeads(normalizeImportedRows(rows), "uploaded");
      router.push("/");
    } catch {
      setLoading(false);
      setError("Could not import that Google Sheet. Make sure it is public or published.");
    }
  };

  return (
    <main className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#e7e9f0] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Import your data</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">Bring in sample data, leads, deals, or a public Google Sheet. The workspace uses that data to rebuild ICP, score opportunities, and estimate pipeline value.</p>

        {!loading && (
          <div className="mt-8 space-y-4">
            <button onClick={handleUseSample} className="w-full rounded-xl border border-[#e7e9f0] p-4 text-left hover:bg-gray-50">
              <div className="font-medium text-gray-900">Use sample data</div>
              <div className="mt-1 text-sm text-gray-500">Load a clean demo dataset instantly</div>
            </button>

            <label className="block cursor-pointer rounded-xl border border-[#e7e9f0] p-4 hover:bg-gray-50">
              <div className="font-medium text-gray-900">Upload leads CSV or Excel</div>
              <div className="mt-1 text-sm text-gray-500">Import lead, contact, or pipeline data</div>
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => e.target.files?.[0] && handleLeadsUpload(e.target.files[0])} />
            </label>

            <label className="block cursor-pointer rounded-xl border border-[#e7e9f0] p-4 hover:bg-gray-50">
              <div className="font-medium text-gray-900">Upload deals CSV or Excel</div>
              <div className="mt-1 text-sm text-gray-500">Import won and lost deals to learn ICP from revenue</div>
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => e.target.files?.[0] && handleDealsUpload(e.target.files[0])} />
            </label>

            <div className="rounded-2xl border border-[#e7e9f0] bg-[#fafbff] p-5">
              <h2 className="text-base font-semibold text-gray-900">Import Google Sheet</h2>
              <p className="mt-2 text-sm text-gray-600">Paste a public Google Sheets URL. It will be converted to CSV and imported as leads.</p>
              <input value={sheetUrl} onChange={(e) => setSheetUrl(e.target.value)} placeholder="Paste Google Sheet URL" className="mt-4 w-full rounded-xl border border-[#e7e9f0] bg-white p-3 text-sm outline-none" />
              <button onClick={handleGoogleSheet} disabled={!sheetUrl} className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-400">Import Google Sheet</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-8 rounded-2xl border border-[#e7e9f0] bg-[#fafbff] p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900">Analyzing data</h2>
            <p className="mt-2 text-sm text-gray-600">Building ICP, scoring leads, and identifying opportunities...</p>
            <div className="mt-6 space-y-3"><div className="h-2 animate-pulse rounded bg-gray-200" /><div className="mx-auto h-2 w-3/4 animate-pulse rounded bg-gray-200" /></div>
          </div>
        )}

        {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      </div>
    </main>
  );
}
