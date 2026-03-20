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
  { id: "sig_001", company: "PipelineIQ", industry: "B2B SaaS", employees: 110, signal: "Hiring 4 SDRs and 1 Sales Manager", persona: "Head of Sales", location: "London, UK" },
  { id: "sig_002", company: "RevLayer", industry: "B2B SaaS", employees: 75, signal: "Raised Series A (€12M)", persona: "Founder", location: "Berlin, Germany" },
  { id: "sig_003", company: "DemandForge", industry: "Marketing Software", employees: 220, signal: "Launching new outbound motion", persona: "VP Marketing", location: "Dublin, Ireland" },
  { id: "sig_004", company: "OpsPilot", industry: "Operations SaaS", employees: 160, signal: "Expanding into US market", persona: "Head of Sales", location: "Amsterdam, Netherlands" },
  { id: "sig_005", company: "FlowMetrics", industry: "B2B SaaS", employees: 95, signal: "Hiring RevOps Manager", persona: "RevOps", location: "Paris, France" },
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
  if (signal.industry.toLowerCase().includes("saas")) reasons.push("Matches high-performing industry");
  else if (["software", "marketing", "operations"].some((x) => signal.industry.toLowerCase().includes(x))) reasons.push("Close to strong-performing software segment");
  const band = getEmployeeBand(signal.employees);
  if (band === "50-200") reasons.push("Matches ideal company size band");
  else if (band === "201-500") reasons.push("Close to ideal company size band");
  if (signal.signal.toLowerCase().includes("hiring")) reasons.push("Hiring signal suggests demand or pipeline pressure");
  if (signal.signal.toLowerCase().includes("funding")) reasons.push("Funding event suggests growth initiative");
  if (signal.signal.toLowerCase().includes("expanding")) reasons.push("Expansion signal suggests new pipeline creation");
  if (signal.persona.toLowerCase().includes("sales")) reasons.push("Sales leadership is a strong buyer persona");
  if (signal.persona.toLowerCase().includes("revops")) reasons.push("RevOps persona is close to core ICP");
  if (signal.persona.toLowerCase().includes("founder")) reasons.push("Founder persona can be strong in earlier-stage companies");
  return reasons.slice(0, 5);
}

export function getSignalDrivers(signal: Signal) {
  const drivers: string[] = [];
  if (signal.signal.toLowerCase().includes("hiring")) drivers.push("Hiring usually creates pressure to build or manage pipeline faster");
  if (signal.signal.toLowerCase().includes("funding")) drivers.push("Recent funding typically increases pressure to show commercial momentum");
  if (signal.signal.toLowerCase().includes("expanding")) drivers.push("Expansion often creates a need for better prioritisation and pipeline coverage");
  if (signal.industry.toLowerCase().includes("saas")) drivers.push("The company sits in a segment that already aligns with the strongest ICP");
  if (["sales", "revops"].some((x) => signal.persona.toLowerCase().includes(x))) drivers.push("The likely buyer persona is close to the current revenue-backed ICP");
  return drivers.slice(0, 5);
}

export function getSignalReasoning(signal: Signal) {
  const score = scoreSignal(signal);
  const reasons = getSignalReasons(signal);
  const drivers = getSignalDrivers(signal);
  const strength = score >= 80 ? "This looks like a strong net-new opportunity." : score >= 60 ? "This looks like a reasonable ICP match worth testing." : "This is a weaker signal, but there may still be some outbound value.";
  const trigger = `The trigger here is ${signal.signal.toLowerCase()}, which often creates a relevant commercial moment.`;
  const fit = reasons.length > 0 ? `It aligns because ${reasons[0].toLowerCase()}.` : "";
  const driver = drivers.length > 0 ? `The likely commercial pressure is that ${drivers[0].toLowerCase()}.` : "";
  return `${strength} ${trigger} ${fit} ${driver}`.replace(/\s+/g, " ").trim();
}

export function getSignalRecommendedAction(signal: Signal) {
  const score = scoreSignal(signal);
  if (score >= 85) return { label: "Launch outbound now", reason: "Strong ICP match plus a live trigger makes this worth immediate outreach." };
  if (score >= 70) return { label: "Test with short sequence", reason: "Strong enough to work, but best handled with a tight two-step sequence." };
  return { label: "Monitor for stronger signal", reason: "Interesting account, but timing or fit is not yet strong enough for priority outreach." };
}

export function generateSignalEmails(signal: Signal) {
  const introName = "there";
  const roleContext = signal.persona.toLowerCase().includes("revops")
    ? "keeping pipeline coverage and process consistency strong"
    : signal.persona.toLowerCase().includes("sales")
    ? "making sure good-fit pipeline is being worked properly"
    : signal.persona.toLowerCase().includes("founder")
    ? "getting more commercial leverage without adding complexity"
    : signal.persona.toLowerCase().includes("marketing")
    ? "making sure demand turns into qualified pipeline"
    : "working pipeline more effectively";

  return {
    email: `Hi ${introName},\n\nI noticed ${signal.company} is ${signal.signal.toLowerCase()}.\n\nThat usually makes ${roleContext} more important, especially when new demand, expansion or team growth creates more accounts than people have time to work properly.\n\nWe’ve been helping teams identify where good-fit pipeline is being missed and generate more targeted follow-up based on fit and timing.\n\nWorth a quick look?\n\nStephen`,
    followUpEmail: `Hi ${introName},\n\nJust following up on this.\n\nWhen companies hit this stage, the problem is often not a lack of opportunity. It is prioritisation, timing and making sure the right accounts actually get worked.\n\nHappy to send a quick example if useful.\n\nStephen`,
  };
}
