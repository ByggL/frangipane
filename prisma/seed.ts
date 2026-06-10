import fs from "fs";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { calculateScore } from "@/lib/utils";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

// string parsing utilities for inconsistent data
const parseDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "Unknown";
  // transforms "06251988" to "06/25/1988"
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 2)}/${dateStr.slice(2, 4)}/${dateStr.slice(4)}`;
  }
  return dateStr;
};

const cleanText = (text: string | undefined): string => {
  if (!text) return "Unknown";
  return text.replace(/;\s*$/, "").trim();
};

async function main() {
  const rawData = fs.readFileSync("data/output.json", "utf-8");
  const jsonData = JSON.parse(rawData);

  // json root is an object with "item_XXX" keys, extract the values into an array
  const wrestlers = Object.values(jsonData);

  console.log(`Parsing complete, seeding ${wrestlers.length} wrestlers.`);

  for (const item of wrestlers as any[]) {
    if (!item.name) continue;

    const attr = item.attr || {};

    // extract promotion array to comma-separated string
    const currentPromotions = attr["Current Promotion"] || [];
    const promotion = (() => {
      if (Array.isArray(currentPromotions) && currentPromotions.length > 0) return currentPromotions.join(", ");
      if (!Array.isArray(currentPromotions) && currentPromotions) return currentPromotions || "";

      return "";
    })();

    // standardizing metrics: converting lbs to kg for the integer field
    const rawWeightLbs = parseInt(attr["Weight (lbs)"], 10) || 200;
    const weightKg = Math.round(rawWeightLbs * 0.453592);
    const heightCm = parseInt(attr["Height (cm)"], 10) || 180;

    // validate alignment enum equivalent
    const alignmentRaw = attr["Face / Heel"]?.toUpperCase();
    const alignment = ["FACE", "HEEL", "TWEENER"].includes(alignmentRaw) ? alignmentRaw : "FACE";

    const genderRaw = attr["Gender"] || "Male";
    const gender = ["Male", "Female"].includes(genderRaw) ? genderRaw : "Male";

    const finalScore = calculateScore(attr);

    let rarity = "COMMON";
    if (finalScore > 90)
      rarity = "LEGENDARY"; // Adjusted thresholds for multiplier scaling
    else if (finalScore > 75) rarity = "EPIC";
    else if (finalScore > 55) rarity = "RARE";
    else if (finalScore > 35) rarity = "UNCOMMON";

    const cardData = {
      name: item.name,
      description: attr["Finishing Moves"] ? `Finishers: ${cleanText(attr["Finishing Moves"])}` : null,
      height: heightCm,
      weight: weightKg,
      birthdate: parseDate(attr["Birthday"]),
      birthplace: cleanText(attr["Billed From (Location)"]),
      rarity,
      gender,
      alignment,
      promotion,
      imageUrl: item.thumbnail || null,
    };

    await prisma.wrestlerCard.upsert({
      where: { name: cardData.name },
      update: cardData,
      create: cardData,
    });
  }

  console.log("Database seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
