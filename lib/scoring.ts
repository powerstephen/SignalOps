import { Lead, ICPFit, LeadState, Persona } from "@/lib/types";

export function getPersona(title: string): Persona {
  const lower = title.toLowerCase();
  if (lower.includes("revops") || lower.includes("revenue operations")) return "RevOps";
  if (lower.includes("sales") || lower.includes("account executive")) return "Sales Leader";
  if (lower.includes("founder") || lower.includes("ceo") || lower.includes("co-founder")) return "Founder";
  if (lower.includes("marketing") || lower.includes("growth")) return "Marketing Leader";
  return "Other";
}

export function getICPFit(lead: Lead): ICPFit {
  const lowerIndustry = lead.companyData.industry.toLowerCase();
  const isSoftware =
    lowerIndustry.includes("saas") ||
    lowerIndustry.includes("software") ||
    lowerIndustry.includes("marketing") ||
    lowerIndustry.includes("operations");
  const rightSize = lead.companyData.employees >= 50 && lead.companyData.employees <= 500;

  if (isSoftware && rightSize) return "High";
  if (isSoftware || rightSize) return "Medium";
  return "Low";
}

export function getLeadState(lead: Lead): LeadState {
  const recentEngagement = lead.activities.some((a) => a.daysAgo <= 30);
  if (lead.lastContactedDays > 45 && recentEngagement) return "Warm but Neglected";
  if (lead.lastContactedDays > 60) return "Dormant";
  if (lead.lastContactedDays > 30) return "At Risk";
  return "Active";
}

export function getPriority(lead: Lead): "High" | "Medium" | "Low" {
  const icp = getICPFit(lead);
  const state = getLeadState(lead);
  if (icp === "High" && (state === "Dormant" || state === "Warm but Neglected")) return "High";
  if (icp === "High" || state === "At Risk") return "Medium";
  return "Low";
}

export function getAngle(lead: Lead): string {
  const persona = getPersona(lead.title);
  if (persona === "RevOps") return "Efficiency and pipeline coverage";
  if (persona === "Sales Leader") return "Pipeline generation and rep productivity";
  if (persona === "Founder") return "Revenue leverage and commercial efficiency";
  if (persona === "Marketing Leader") return "Lead quality and conversion efficiency";
  return "Relevant re-engagement based on timing and fit";
}

export function getLeadScore(lead: Lead): number {
  let score = 0;
  const icp = getICPFit(lead);
  if (icp === "High") score += 30;
  else if (icp === "Medium") score += 15;

  const persona = getPersona(lead.title);
  if (persona === "RevOps" || persona === "Sales Leader") score += 15;
  else if (persona === "Founder" || persona === "Marketing Leader") score += 10;

  if (lead.activities.some((a) => a.daysAgo <= 30)) score += 20;
  if (lead.lastContactedDays > 60) score += 15;
  else if (lead.lastContactedDays > 30) score += 10;

  const signal = lead.companyData.signal.toLowerCase();
  if (signal.includes("hiring") || signal.includes("funding") || signal.includes("expanding") || signal.includes("launch")) score += 10;

  const noteText = lead.activities.map((a) => a.note.toLowerCase()).join(" ");
  if (["stretched", "challenge", "problem", "coverage", "efficiency", "pipeline"].some((x) => noteText.includes(x))) score += 10;

  return Math.min(score, 100);
}

export function getSignalCards(lead: Lead) {
  const noteText = lead.activities.map((a) => a.note.toLowerCase()).join(" ");
  return [
    { label: "ICP Match", active: getICPFit(lead) === "High" },
    { label: "Senior Persona", active: ["RevOps", "Sales Leader", "Founder", "Marketing Leader"].includes(getPersona(lead.title)) },
    { label: "Recent Engagement", active: lead.activities.some((a) => a.daysAgo <= 30) },
    { label: "Webinar Attended", active: lead.activities.some((a) => a.type === "webinar") },
    { label: "Dormant Opportunity", active: lead.lastContactedDays > 60 },
    { label: "Team Growth", active: lead.companyData.signal.toLowerCase().includes("hiring") },
    { label: "Business Growth", active: ["funding", "expanding", "launch"].some((x) => lead.companyData.signal.toLowerCase().includes(x)) },
    { label: "Pain Point Identified", active: ["stretched", "challenge", "problem", "coverage", "efficiency", "pipeline"].some((x) => noteText.includes(x)) },
  ];
}
