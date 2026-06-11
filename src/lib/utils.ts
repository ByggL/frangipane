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
  baseScore += Math.min(promoCount * 3, 20);

  // 3. Technical Versatility (Max 20)
  const finisherString = attr["Finishing Moves"] || "";
  const finishers = finisherString.split(";").filter((f: string) => f.trim().length > 0);
  baseScore += Math.min(finishers.length * 4, 20);

  // 4. Role (Max 10)
  if (attr["Current Role"] === "Wrestler") baseScore += 15;

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

export const getRarityStyles = (rarity: string) => {
  switch (rarity?.toUpperCase()) {
    case "COMMON":
      return {
        border: "border-zinc-700",
        glow: "shadow-zinc-900/50",
        text: "text-zinc-400",
        accent: "bg-zinc-800",
        bg: "bg-zinc-900",
      };
    case "UNCOMMON":
      return {
        border: "border-emerald-500/50",
        glow: "shadow-emerald-900/40",
        text: "text-emerald-400",
        accent: "bg-emerald-900/30",
        bg: "bg-zinc-900",
      };
    case "RARE":
      return {
        border: "border-blue-500/50",
        glow: "shadow-blue-900/40",
        text: "text-blue-400",
        accent: "bg-blue-900/30",
        bg: "bg-slate-900",
      };
    case "EPIC":
      return {
        border: "border-purple-500/50",
        glow: "shadow-purple-900/40",
        text: "text-purple-400",
        accent: "bg-purple-900/30",
        bg: "bg-neutral-900",
      };
    case "LEGENDARY":
      return {
        border: "border-amber-500/60",
        glow: "shadow-amber-900/40",
        text: "text-amber-400",
        accent: "bg-amber-900/30",
        bg: "bg-stone-900",
      };
    default:
      return {
        border: "border-zinc-800",
        glow: "shadow-black",
        text: "text-zinc-500",
        accent: "bg-zinc-900",
        bg: "bg-black",
      };
  }
};

export const getAlignmentBadge = (alignment: string) => {
  return alignment?.toUpperCase() === "FACE"
    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
    : "bg-rose-500/20 text-rose-400 border border-rose-500/30";
};
