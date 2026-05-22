import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

const results: any[] = [];

// derive tcg stats from physical data, map variables to game balance
const calculateStats = (row: {
  Weight_kg: string;
  Height_cm: string;
  Rating: string;
  Name: any;
  Birthdate: any;
  Birthplace: any;
  Promotion: any;
}) => {
  const weight = parseFloat(row.Weight_kg) || 100;
  const height = parseFloat(row.Height_cm) || 180;
  const rating = parseFloat(row.Rating) || 5.0;

  let rarity = "COMMON";

  if (rating >= 9.5) {
    rarity = "LEGENDARY";
  } else if (rating >= 9.0) {
    rarity = "EPIC";
  } else if (rating >= 8.0) {
    rarity = "RARE";
  } else if (rating >= 7.0) {
    rarity = "UNCOMMON";
  }

  return {
    name: row.Name,
    description: null,
    height,
    weight,
    birthdate: row.Birthdate,
    birthplace: row.Birthplace,
    rarity,
    alignment: "FACE",
    promotion: row.Promotion || "Independent",
  };
};

async function seed() {
  fs.createReadStream("prisma/cagematch_clean.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      console.log(`parsing complete, seeding ${results.length} wrestlers`);

      for (const row of results) {
        if (!row.Name) continue;

        const cardData = calculateStats(row);

        // upsert prevents duplicate entries on re-runs
        await prisma.wrestlerCard.upsert({
          where: { name: cardData.name },
          update: cardData,
          create: cardData,
        });
      }

      console.log("database seeded");
      await prisma.$disconnect();
    });
}

seed().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
