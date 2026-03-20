import { scoreSignalWithRevenueICP } from "@/lib/revenueModel";

export type Signal = {
  id: string;
  company: string;
  industry: string;
  employees: number;
  signal: string;
  persona: string;
  location: string;
};

export const signals: Signal[] = [
  {
    id: "sig_001",
    company: "PipelineIQ",
    industry: "B2B SaaS",
    employees: 110,
    signal: "Hiring 4 SDRs and 1 Sales Manager",
    persona: "Head of Sales",
    location: "London, UK",
  },
  {
    id: "sig_002",
    company: "RevLayer",
    industry: "B2B SaaS",
    employees: 75,
    signal: "Raised Series A (€12M)",
    persona: "Founder",
    location: "Berlin, Germany",
  },
  {
    id: "sig_003",
    company: "DemandForge",
    industry: "Marketing Software",
    employees: 220,
    signal: "Launching new outbound motion",
    persona: "VP Marketing",
    location: "Dublin, Ireland",
  },
  {
    id: "sig_004",
    company: "OpsPilot",
    industry: "Operations SaaS",
    employees: 160,
    signal: "Expanding into US market",
    persona: "Head of Sales",
    location: "Amsterdam, Netherlands",
  },
  {
    id: "sig_005",
    company: "FlowMetrics",
    industry: "B2B SaaS",
    employees: 95,
    signal: "Hiring RevOps Manager",
    persona: "RevOps",
    location: "Paris, France",
  },
];

export function getSignalById(id: string) {
  return signals.find((signal) => signal.id === id);
}

function getEmployeeBand(size: number): string {
  if (size < 50) return "1-49";
  if (size <= 200) return "50-200";
  if (size <= 500) return "201-500";
  return "500+";
}

export function scoreSignal(signal: Signal) {
  return scoreSignalWithRevenueICP(signal);
}

export function getSignalReasons(signal: Signal) {
  const reasons: string[] = [];

  if (signal.industry.toLowerCase().includes("saas")) {
    reasons.push("Strong industry match");
  } else if (
    signal.industry.toLowerCase().includes("software") ||
    signal.industry.toLowerCase().includes("marketing") ||
    signal.industry.toLowerCase().includes("operations")
  ) {
    reasons.push("Close to strong-performing software segment");
  }

  const band = getEmployeeBand(signal.employees);
  if (band === "50-200") {
    reasons.push("Ideal company size band");
  } else if (band === "201-500") {
    reasons.push("Close to ideal company size");
  }

  if (signal.persona.toLowerCase().includes("sales")) {
    reasons.push("Senior commercial buyer");
  }

  if (signal.persona.toLowerCase().includes("revops")) {
    reasons.push("Strong RevOps buyer");
  }

  if (signal.persona.toLowerCase().includes("founder")) {
    reasons.push("Founder-level stakeholder");
  }

  if (signal.signal.toLowerCase().includes("hiring")) {
    reasons.push("Live hiring signal");
  }

  if (signal.signal.toLowerCase().includes("funding")) {
    reasons.push("Recent funding signal");
  }

  if (signal.signal.toLowerCase().includes("expanding")) {
    reasons.push("Expansion signal");
  }

  return [...new Set(reasons)].slice(0, 4);
}

export function getSignalTags(signal: Signal) {
  const tags: string[] = [];
  const score = scoreSignal(signal);

  if (score >= 80) tags.push("High ICP Match");

  if (
    signal.persona.toLowerCase().includes("sales") ||
    signal.persona.toLowerCase().includes("revops") ||
    signal.persona.toLowerCase().includes("founder")
  ) {
    tags.push("Senior Buyer");
  }

  if (signal.signal.toLowerCase().includes("hiring")) {
    tags.push("Hiring Signal");
  } else if (signal.signal.toLowerCase().includes("funding")) {
    tags.push("Funding Signal");
  } else if (signal.signal.toLowerCase().includes("expanding")) {
    tags.push("Expansion Signal");
  }

  tags.push("New Pipeline Opportunity");

  return [...new Set(tags)].slice(0, 4);
}

export function getSignalDrivers(signal: Signal) {
  const drivers: string[] = [];

  if (signal.signal.toLowerCase().includes("hiring")) {
    drivers.push("Hiring usually creates pressure to build pipeline faster");
  }

  if (signal.signal.toLowerCase().includes("funding")) {
    drivers.push("New funding usually increases pressure to show commercial momentum");
  }

  if (signal.signal.toLowerCase().includes("expanding")) {
    drivers.push("Expansion often creates a need for better prioritisation and coverage");
  }

  if (signal.persona.toLowerCase().includes("sales")) {
    drivers.push("Sales leadership is likely focused on pipeline quality and rep output");
  }

  if (signal.persona.toLowerCase().includes("revops")) {
    drivers.push("RevOps is likely focused on process consistency and conversion efficiency");
  }

  if (signal.persona.toLowerCase().includes("founder")) {
    drivers.push("A founder is likely to care about commercial leverage and growth");
  }

  return [...new Set(drivers)].slice(0, 4);
}

export function getSignalSummary(signal: Signal) {
  const score = scoreSignal(signal);
  const band = getEmployeeBand(signal.employees);

  const fitLine =
    score >= 80
      ? "This is a strong match against your current revenue-backed ICP."
      : score >= 60
      ? "This is a reasonable match against your current ICP."
      : "The fit is weaker, but the trigger still makes it worth monitoring.";

  const sizeLine =
    band === "50-200"
      ? "The company sits in the ideal size band."
      : `The company is in the ${band} employee band, which is still commercially relevant.`;

  const triggerLine = `${signal.signal} suggests there is a live commercial reason to start a conversation now.`;

  const personaLine = signal.persona.toLowerCase().includes("sales")
    ? "The likely buyer is close to the core commercial persona."
    : signal.persona.toLowerCase().includes("revops")
    ? "The likely buyer is close to the operational buying centre."
    : signal.persona.toLowerCase().includes("founder")
    ? "The likely buyer is a senior decision-maker."
    : "The likely buyer is commercially relevant.";

  return `${fitLine} ${sizeLine} ${triggerLine} ${personaLine}`
    .replace(/\s+/g, " ")
    .trim();
}

export function getSignalAngle(signal: Signal) {
  if (signal.persona.toLowerCase().includes("sales")) {
    return "Angle: improving pipeline coverage and making sure good-fit accounts get worked properly.";
  }

  if (signal.persona.toLowerCase().includes("revops")) {
    return "Angle: improving process consistency, prioritisation and conversion efficiency.";
  }

  if (signal.persona.toLowerCase().includes("founder")) {
    return "Angle: creating more commercial leverage without adding unnecessary complexity.";
  }

  if (signal.persona.toLowerCase().includes("marketing")) {
    return "Angle: turning demand into qualified pipeline more efficiently.";
  }

  return "Angle: improving pipeline execution and follow-up quality.";
}

export function getSignalRecommendedAction(signal: Signal) {
  const score = scoreSignal(signal);

  if (score >= 85) {
    return {
      label: "Launch outbound now",
      reason: "Strong ICP match plus a live trigger makes this worth immediate outreach.",
    };
  }

  if (score >= 70) {
    return {
      label: "Test short sequence",
      reason: "Strong enough to work now, but best handled with a tight two-step sequence.",
    };
  }

  return {
    label: "Monitor",
    reason: "Interesting account, but timing or fit is not strong enough for priority outreach.",
  };
}

export function generateSignalEmails(signal: Signal) {
  const introName = "there";

  const roleContext =
    signal.persona.toLowerCase().includes("revops")
      ? "keeping pipeline coverage and process consistency strong"
      : signal.persona.toLowerCase().includes("sales")
      ? "making sure good-fit pipeline is being worked properly"
      : signal.persona.toLowerCase().includes("founder")
      ? "getting more commercial leverage without adding complexity"
      : signal.persona.toLowerCase().includes("marketing")
      ? "making sure demand turns into qualified pipeline"
      : "working pipeline more effectively";

  const email = `Hi ${introName},

I noticed ${signal.company} is ${signal.signal.toLowerCase()}.

That usually makes ${roleContext} more important, especially when new demand, expansion or team growth creates more accounts than people have time to work properly.

We’ve been helping teams identify where good-fit pipeline is being missed and generate more targeted follow-up based on fit and timing.

Worth a quick look?

Stephen`;

  const followUpEmail = `Hi ${introName},

Just following up on this.

When companies hit this stage, the issue is often not a lack of opportunity. It is prioritisation, timing and making sure the right accounts actually get worked.

Happy to send a quick example if useful.

Stephen`;

  return {
    email,
    followUpEmail,
  };
}
