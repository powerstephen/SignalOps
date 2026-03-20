import { getAngle, getICPFit, getLeadScore, getLeadState, getPersona, getPriority } from "@/lib/scoring";
import { buildICP, calculateICPMatchScore, getICPMatchReasons } from "@/lib/icp";
import { leads } from "@/lib/data";
import { Lead, LeadAnalysis } from "@/lib/types";

type LeadAnalysisWithFollowUp = LeadAnalysis & {
  followUpEmail: string;
  icpMatchScore: number;
  icpMatchReasons: string[];
  recommendedActionLabel: string;
  recommendedActionReason: string;
};

function getRecentSignals(lead: Lead): string[] {
  const signals: string[] = [];
  const recentOpen = lead.activities.find((a) => a.type === "email_open" && a.daysAgo <= 30);
  const recentClick = lead.activities.find((a) => a.type === "email_click" && a.daysAgo <= 30);
  const recentWebinar = lead.activities.find((a) => a.type === "webinar" && a.daysAgo <= 45);
  const recentMeeting = lead.activities.find((a) => a.type === "meeting" && a.daysAgo <= 120);
  if (recentOpen) signals.push(`Opened a prior email ${recentOpen.daysAgo} days ago`);
  if (recentClick) signals.push(`Clicked prior content ${recentClick.daysAgo} days ago`);
  if (recentWebinar) signals.push(`Attended a webinar ${recentWebinar.daysAgo} days ago`);
  if (recentMeeting) signals.push("There was a prior qualified conversation");
  return signals;
}

function getPainPoints(lead: Lead): string[] {
  const text = lead.activities.map((a) => a.note.toLowerCase()).join(" ");
  const painPoints: string[] = [];
  if (text.includes("stretched")) painPoints.push("team capacity is stretched");
  if (text.includes("coverage")) painPoints.push("pipeline coverage was mentioned");
  if (text.includes("efficiency")) painPoints.push("commercial efficiency is a concern");
  if (text.includes("problem") || text.includes("challenge")) painPoints.push("a concrete challenge was identified");
  if (text.includes("timing")) painPoints.push("the earlier objection looked like timing, not fit");
  if (text.includes("interested")) painPoints.push("there was prior interest, but momentum faded");
  return painPoints;
}

function buildWhyNow(lead: Lead, icpMatchReasons: string[]): string[] {
  const whyNow: string[] = [];
  if (lead.lastContactedDays > 60) whyNow.push(`No contact for ${lead.lastContactedDays} days despite a plausible fit`);
  else if (lead.lastContactedDays > 30) whyNow.push(`Momentum has faded with no contact for ${lead.lastContactedDays} days`);
  if (lead.companyData.signal) whyNow.push(`Company trigger: ${lead.companyData.signal}`);
  const recentSignals = getRecentSignals(lead);
  if (recentSignals.length > 0) whyNow.push(...recentSignals.slice(0, 2));
  const painPoints = getPainPoints(lead);
  if (painPoints.length > 0) whyNow.push(`Pain signal: ${painPoints[0]}`);
  if (icpMatchReasons.length > 0) whyNow.push(icpMatchReasons[0]);
  return whyNow.slice(0, 5);
}

function buildReasoning(lead: Lead, icpMatchScore: number, icpMatchReasons: string[]): string {
  const persona = getPersona(lead.title);
  const painPoints = getPainPoints(lead);
  const recentSignals = getRecentSignals(lead);
  const personaContext = persona === "RevOps"
    ? "pipeline discipline and commercial efficiency"
    : persona === "Sales Leader"
    ? "coverage, prioritisation and rep productivity"
    : persona === "Founder"
    ? "commercial leverage without needing more headcount"
    : persona === "Marketing Leader"
    ? "better conversion from demand already in the system"
    : "commercial execution";
  const fitLine = icpMatchScore >= 80
    ? "This lead is a strong fit for the current revenue-backed ICP."
    : icpMatchScore >= 60
    ? "This lead is a reasonable fit for the current ICP and still worth working."
    : "This lead is a weaker fit, but it still has some useful signals.";
  const timingLine = lead.lastContactedDays > 60
    ? `The gap since last contact (${lead.lastContactedDays} days) suggests the account may have been neglected rather than fully disqualified.`
    : "The account still shows enough recency to justify a targeted re-engagement.";
  const engagementLine = recentSignals.length > 0 ? "There are recent or historical engagement cues that suggest this is not a dead account." : "";
  const painLine = painPoints.length > 0 ? `Previous activity suggests the issue was likely ${painPoints[0]}, which makes the outreach angle more concrete.` : "";
  const icpLine = icpMatchReasons.length > 0 ? `It aligns because ${icpMatchReasons[0].toLowerCase()}.` : "";
  return `${fitLine} This contact is likely to care about ${personaContext}. ${timingLine} ${engagementLine} ${painLine} ${icpLine}`.replace(/\s+/g, " ").trim();
}

function buildInitialEmail(lead: Lead): string {
  const firstName = lead.name.split(" ")[0];
  const persona = getPersona(lead.title);
  const painPoints = getPainPoints(lead);
  const roleContext = persona === "RevOps"
    ? "keeping pipeline coverage and follow-up quality consistent"
    : persona === "Sales Leader"
    ? "making sure good-fit pipeline is actually being worked"
    : persona === "Founder"
    ? "getting more value from the pipeline already in the CRM"
    : persona === "Marketing Leader"
    ? "making sure existing demand converts properly"
    : "working pipeline more effectively";
  const painLine = painPoints.length > 0
    ? `From the earlier activity, it looks like ${painPoints[0]}.`
    : "Usually at this stage, good-fit opportunities are sitting there but not being prioritised properly.";
  return `Hi ${firstName},\n\nI noticed ${lead.company} is ${lead.companyData.signal.toLowerCase()}.\n\nThat usually makes ${roleContext} more important, especially when teams are busy and good-fit accounts get missed.\n\n${painLine}\n\nWe’ve been helping teams surface the strongest dormant opportunities in the CRM and generate the right follow-up based on fit, timing and prior activity.\n\nWorth a quick look?\n\nStephen`;
}

function buildFollowUpEmail(lead: Lead): string {
  const firstName = lead.name.split(" ")[0];
  const persona = getPersona(lead.title);
  const angle = persona === "RevOps"
    ? "coverage and process consistency"
    : persona === "Sales Leader"
    ? "rep focus and pipeline efficiency"
    : persona === "Founder"
    ? "commercial leverage"
    : persona === "Marketing Leader"
    ? "conversion efficiency"
    : "pipeline recovery";
  return `Hi ${firstName},\n\nJust circling back on this.\n\nA lot of teams already have opportunities in the CRM that could move, but they get lost because nobody has time to analyse every account properly.\n\nThat is usually a ${angle} problem before it is a top-of-funnel problem.\n\nHappy to share a quick example if useful.\n\nStephen`;
}

function getRecommendedAction(score: number, icpMatchScore: number) {
  if (score >= 85 && icpMatchScore >= 80) return { label: "Send now", reason: "Strong fit, strong timing, and enough signal to justify immediate outreach." };
  if (score >= 70) return { label: "Send + 5 day follow-up", reason: "Worth working now, but better with a short sequence rather than one touch." };
  return { label: "Nurture first", reason: "The fit or timing is weaker, so this is better handled through lighter follow-up." };
}

export async function analyzeLead(lead: Lead): Promise<LeadAnalysisWithFollowUp> {
  const icpFit = getICPFit(lead);
  const persona = getPersona(lead.title);
  const state = getLeadState(lead);
  const priority = getPriority(lead);
  const angle = getAngle(lead);
  const score = getLeadScore(lead);
  const icp = buildICP(leads);
  const icpMatchScore = calculateICPMatchScore(lead, icp);
  const icpMatchReasons = getICPMatchReasons(lead, icp);
  const whyNow = buildWhyNow(lead, icpMatchReasons);
  const reasoning = buildReasoning(lead, icpMatchScore, icpMatchReasons);
  const email = buildInitialEmail(lead);
  const followUpEmail = buildFollowUpEmail(lead);
  const recommendedAction = getRecommendedAction(score, icpMatchScore);

  return {
    icpFit,
    persona,
    state,
    priority,
    score,
    reasoning,
    whyNow,
    angle,
    suggestedAction: priority === "High" ? "Re-engage now" : priority === "Medium" ? "Assign to SDR" : "Push to nurture",
    email,
    followUpEmail,
    icpMatchScore,
    icpMatchReasons,
    recommendedActionLabel: recommendedAction.label,
    recommendedActionReason: recommendedAction.reason,
  };
}
