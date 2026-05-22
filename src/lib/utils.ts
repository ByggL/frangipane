const PROMOTION_WEIGHTS: Record<string, number> = {
  WWE: 1.5,
  AEW: 1.4,
  NJPW: 1.3,
  WCW: 1.3,
  ECW: 1.2,
  TNA: 1.2,
  ROH: 1.2,
  PROGRESS: 1.1,
  PWG: 1.1,
  REVPRO: 1.1,
};

export function calculateScore(attr: any): number {
  let baseScore = 0;

  // 1. Physical Presence (Max 20)
  const weight = parseInt(attr["Weight (lbs)"]) || 200;
  const height = parseInt(attr["Height (cm)"]) || 180;
  baseScore += (weight / 400) * 10;
  baseScore += (height / 220) * 10;

  // 2. Experience Density (Max 30) - Lowered slightly to make room for multiplier
  const promoCount = Array.isArray(attr["All-Time Promotions"]) ? attr["All-Time Promotions"].length : 0;
  baseScore += Math.min(promoCount * 3, 30);

  // 3. Technical Versatility (Max 20)
  const finisherString = attr["Finishing Moves"] || "";
  const finishers = finisherString.split(";").filter((f: string) => f.trim().length > 0);
  baseScore += Math.min(finishers.length * 4, 20);

  // 4. Role (Max 10)
  if (attr["Current Role"] === "Wrestler") baseScore += 10;

  // 5. Promotion Multiplier Logic
  const allPromos = attr["All-Time Promotions"] || [];
  let multiplier = 1.0;

  if (Array.isArray(allPromos)) {
    allPromos.forEach((p) => {
      const weight = PROMOTION_WEIGHTS[p.toUpperCase()];
      if (weight && weight > multiplier) {
        multiplier = weight; // Keep only the highest weight found
      }
    });
  }

  // Apply multiplier to the base score
  const finalScore = baseScore * multiplier;

  // Cap at 100 for balance
  return Math.min(finalScore, 100);
}
