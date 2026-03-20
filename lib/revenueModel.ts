import { normalizeDeals, buildICPFromDeals } from "@/lib/deals";

type RevenueSignalInput = {
  industry: string;
  employees: number;
  persona: string;
};

function getEmployeeBand(size: number): string {
  if (size < 50) return "1-49";
  if (size <= 200) return "50-200";
  if (size <= 500) return "201-500";
  return "500+";
}

function mapSignalPersonaToComparablePersona(persona: string): string {
  const lower = persona.toLowerCase();
  if (lower.includes("revops") || lower.includes("revenue operations")) return "RevOps";
  if (lower.includes("sales")) return "Sales Leader";
  if (lower.includes("founder") || lower.includes("ceo")) return "Founder";
  if (lower.includes("marketing") || lower.includes("growth")) return "Marketing Leader";
  return "Other";
}

function fallbackScore(signal: RevenueSignalInput): number {
  let score = 0;
  if (signal.industry.toLowerCase().includes("saas")) score += 40;
  else if (["software", "operations", "marketing"].some((x) => signal.industry.toLowerCase().includes(x))) score += 25;
  const band = getEmployeeBand(signal.employees);
  if (band === "50-200") score += 25;
  else if (band === "201-500") score += 15;
  const persona = signal.persona.toLowerCase();
  if (persona.includes("sales") || persona.includes("revops")) score += 25;
  else if (persona.includes("founder") || persona.includes("marketing")) score += 12;
  return Math.min(score, 100);
}

export function scoreSignalWithRevenueICP(signal: RevenueSignalInput): number {
  if (typeof window === "undefined") return 60;
  try {
    const storedDeals = localStorage.getItem("uploadedDeals");
    if (!storedDeals) return fallbackScore(signal);
    const parsed = JSON.parse(storedDeals);
    if (!Array.isArray(parsed) || parsed.length === 0) return fallbackScore(signal);
    const normalizedDeals = normalizeDeals(parsed);
    const icp = buildICPFromDeals(normalizedDeals);
    if (!icp) return fallbackScore(signal);

    let score = 0;
    const signalIndustry = signal.industry.toLowerCase();
    const icpIndustry = icp.industry.toLowerCase();
    if (signalIndustry === icpIndustry) score += 40;
    else if (signalIndustry.includes("saas") && icpIndustry.includes("saas")) score += 30;
    else if (["software", "marketing", "operations"].some((x) => signalIndustry.includes(x))) score += 15;

    const signalBand = getEmployeeBand(signal.employees);
    if (signalBand === icp.employeeBand) score += 30;
    else if ((signalBand === "201-500" && icp.employeeBand === "50-200") || (signalBand === "50-200" && icp.employeeBand === "201-500")) score += 18;

    const comparablePersona = mapSignalPersonaToComparablePersona(signal.persona);
    if (comparablePersona === icp.persona) score += 30;
    else if ((comparablePersona === "RevOps" && icp.persona === "Sales Leader") || (comparablePersona === "Sales Leader" && icp.persona === "RevOps")) score += 20;
    else if (comparablePersona === "Founder" || comparablePersona === "Marketing Leader") score += 10;

    return Math.min(score, 100);
  } catch {
    return fallbackScore(signal);
  }
}
