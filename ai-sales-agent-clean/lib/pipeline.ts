import { normalizeDeals } from "@/lib/deals";

function fallbackStats() {
  return { avgDealSize: 20000, winRate: 0.2 };
}

export function getRevenueStats() {
  if (typeof window === "undefined") return fallbackStats();
  try {
    const stored = localStorage.getItem("uploadedDeals");
    if (!stored) return fallbackStats();
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) return fallbackStats();
    const deals = normalizeDeals(parsed);
    const wonDeals = deals.filter((d) => d.outcome === "won");
    const totalValue = wonDeals.reduce((sum, d) => sum + d.amount_eur, 0);
    const avgDealSize = totalValue / (wonDeals.length || 1);
    const winRate = wonDeals.length / deals.length;
    return { avgDealSize: Math.round(avgDealSize || 20000), winRate: winRate || 0.2 };
  } catch {
    return fallbackStats();
  }
}

export function estimatePipelineImpact(score: number) {
  const { avgDealSize, winRate } = getRevenueStats();
  const expectedDealValue = avgDealSize * winRate;
  let multiplier = 1;
  if (score >= 85) multiplier = 2.5;
  else if (score >= 70) multiplier = 2;
  else multiplier = 1.2;
  return {
    expectedDealValue: Math.round(expectedDealValue),
    pipelineValue: Math.round(expectedDealValue * multiplier),
  };
}
