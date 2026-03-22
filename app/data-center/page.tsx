"use client";

import { useEffect, useState } from "react";

type State = "disconnected" | "analyzing" | "connected";

const steps = [
  "Normalising source data",
  "Mapping accounts and contacts",
  "Scoring ICP fit",
  "Identifying whitespace",
  "Generating opportunities",
  "Generating results",
];

export default function Page() {
  const [state, setState] = useState<State>("disconnected");
  const [completedSteps, setCompletedSteps] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state !== "analyzing") return;

    setCompletedSteps(0);
    setProgress(0);

    let stepIndex = 0;
    const stepDuration = 1800;

    const interval = setInterval(() => {
      stepIndex += 1;
      setCompletedSteps(stepIndex);
      setProgress((stepIndex / steps.length) * 100);

      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setTimeout(() => setState("connected"), 1000);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-8 py-8">
      <div>
        <h1 className="text-4xl font-semibold">Data Center</h1>
        <p className="mt-2 text-gray-600">
          Understand your data, define your ICP, and identify revenue opportunities.
        </p>
      </div>

      {state !== "disconnected" && (
        <div className="flex items-center justify-between rounded-2xl border bg-white p-4">
          <div className="flex gap-6 text-sm">
            <div>
              <div className="text-xs text-gray-400">Source</div>
              <div className="font-medium">HubSpot</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Status</div>
              <div className="font-medium">
                {state === "analyzing" ? "Analyzing..." : "Live"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Last Sync</div>
              <div className="font-medium">Just now</div>
            </div>
          </div>

          <button className="rounded-xl border px-4 py-2 text-sm">
            Manage
          </button>
        </div>
      )}

      {state === "disconnected" && (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {["HubSpot", "Salesforce", "CSV", "Shopify"].map((s) => (
            <div key={s} className="rounded-2xl border bg-white p-5">
              <div className="font-semibold">{s}</div>
              <button
                onClick={() => setState("analyzing")}
                className="mt-4 rounded-xl border px-4 py-2 text-sm"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}

      {state === "analyzing" && (
        <div className="mx-auto max-w-2xl px-2 py-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-950">
            Analyzing...
          </h2>

          {/* PROGRESS BAR */}
          <div className="mx-auto mt-5 w-full max-w-[260px] rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-[#0b1f3a] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* CENTERED LIST */}
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-[420px] space-y-3 text-left">
              {steps.map((step, index) => {
                const isDone = index < completedSteps;
                const isActive =
                  index === completedSteps && completedSteps < steps.length;

                return (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-xl px-1 py-1"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-sm">
                      {isDone ? "✓" : ""}
                    </div>

                    <div
                      className={`text-sm leading-6 ${
                        isDone
                          ? "font-medium text-gray-900"
                          : isActive
                          ? "font-medium text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step}
                      {isActive ? " ....." : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {state === "connected" && (
        <div className="space-y-10">
          {/* unchanged below */}
        </div>
      )}
    </div>
  );
}
