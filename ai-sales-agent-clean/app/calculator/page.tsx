"use client";

import { useMemo, useState } from "react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

export default function CalculatorPage() {
  const [totalLeads, setTotalLeads] = useState(2500);
  const [dormantPercent, setDormantPercent] = useState(35);
  const [avgDealSize, setAvgDealSize] = useState(12000);
  const [recoveryRate, setRecoveryRate] = useState(25);
  const [closeRate, setCloseRate] = useState(12);

  const results = useMemo(() => {
    const dormantLeads = Math.round(totalLeads * (dormantPercent / 100));
    const recoverableLeads = Math.round(dormantLeads * (recoveryRate / 100));
    const estimatedRecoveredPipeline = recoverableLeads * avgDealSize;
    const estimatedClosedRevenue = estimatedRecoveredPipeline * (closeRate / 100);
    return { dormantLeads, recoverableLeads, estimatedRecoveredPipeline, estimatedClosedRevenue };
  }, [totalLeads, dormantPercent, avgDealSize, recoveryRate, closeRate]);

  return (
    <main className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">Pipeline recovery calculator</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Estimate missed pipeline in your CRM</h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600">Use a few operating assumptions to estimate how much revenue may be sitting in dormant or under-worked leads.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Inputs</h2>
            <div className="mt-6 space-y-6">
              {[
                ["Total leads in CRM", totalLeads, setTotalLeads],
                ["% of leads dormant or untouched", dormantPercent, setDormantPercent],
                ["Average deal size (€)", avgDealSize, setAvgDealSize],
                ["% of dormant leads you could realistically recover", recoveryRate, setRecoveryRate],
                ["Close rate on recovered leads (%)", closeRate, setCloseRate],
              ].map(([label, value, setter], idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700">{label as string}</label>
                  <input type="number" value={value as number} onChange={(e) => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[#e7e9f0] px-4 py-3 text-sm outline-none" />
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-[#e7e9f0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Estimated opportunity</h2>
            <div className="mt-6 rounded-2xl bg-gray-900 p-6 text-white">
              <p className="text-sm text-gray-300">Estimated recovered pipeline</p>
              <p className="mt-2 text-4xl font-semibold">{formatCurrency(results.estimatedRecoveredPipeline)}</p>
              <p className="mt-3 text-sm text-gray-300">Based on {results.recoverableLeads.toLocaleString()} recoverable dormant leads</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e7e9f0] bg-[#fafbff] p-5"><p className="text-sm text-gray-500">Dormant leads</p><p className="mt-2 text-2xl font-semibold text-gray-900">{results.dormantLeads.toLocaleString()}</p></div>
              <div className="rounded-2xl border border-[#e7e9f0] bg-[#fafbff] p-5"><p className="text-sm text-gray-500">Recoverable leads</p><p className="mt-2 text-2xl font-semibold text-gray-900">{results.recoverableLeads.toLocaleString()}</p></div>
              <div className="rounded-2xl border border-[#e7e9f0] bg-[#fafbff] p-5 md:col-span-2"><p className="text-sm text-gray-500">Estimated closed revenue</p><p className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(results.estimatedClosedRevenue)}</p></div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
