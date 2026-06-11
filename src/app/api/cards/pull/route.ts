import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PULL_COST = 100;
const CARDS_PER_PULL = 10;
const GENDER_RATIO = 5; // 5 Male, 5 Female

const RARITY_WEIGHTS = {
  COMMON: 0.3,
  UNCOMMON: 0.2,
  RARE: 0.2,
  EPIC: 0.1,
  LEGENDARY: 0.1,
};

const RARE_PLUS = ["RARE", "EPIC", "LEGENDARY"];

function getRandomRarity(availableRarities: string[]): string {
  const totalWeight = availableRarities.reduce((sum, r) => sum + (RARITY_WEIGHTS as any)[r], 0);
  let random = Math.random() * totalWeight;

  for (const rarity of availableRarities) {
    const weight = (RARITY_WEIGHTS as any)[rarity];
    if (random < weight) {
      return rarity;
    }
    random -= weight;
  }
  return availableRarities[availableRarities.length - 1];
}

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get user and check money
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.money < PULL_COST) {
      return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }

    // 1. Fetch all cards metadata
    const allCards = await (prisma.wrestlerCard.findMany({
      select: {
        id: true,
        rarity: true,
        gender: true,
      } as any,
    }) as any);

    // 2. Separate into pools
    const pools: Record<string, Record<string, string[]>> = {
      Male: { COMMON: [], UNCOMMON: [], RARE: [], EPIC: [], LEGENDARY: [] },
      Female: { COMMON: [], UNCOMMON: [], RARE: [], EPIC: [], LEGENDARY: [] },
    };

    allCards.forEach((card: any) => {
      if (pools[card.gender] && pools[card.gender][card.rarity]) {
        pools[card.gender][card.rarity].push(card.id);
      }
    });

    // 3. Define slots
    const slots: { gender: string; rarity: string }[] = [];

    // 5 Male, 5 Female
    for (let i = 0; i < GENDER_RATIO; i++) {
      slots.push({ gender: "Male", rarity: "" });
      slots.push({ gender: "Female", rarity: "" });
    }

    // 4. Determine rarities
    let hasRarePlus = false;
    const rarities = Object.keys(RARITY_WEIGHTS);

    slots.forEach((slot) => {
      // Filter rarities that actually have cards in the pool for this gender
      const availableRarities = rarities.filter((r) => pools[slot.gender][r].length > 0);
      slot.rarity = getRandomRarity(availableRarities);
      if (RARE_PLUS.includes(slot.rarity)) {
        hasRarePlus = true;
      }
    });

    // 5. Guarantee at least one Rare+
    if (!hasRarePlus) {
      const lastSlot = slots[slots.length - 1];
      const availableRarePlus = RARE_PLUS.filter((r) => pools[lastSlot.gender][r].length > 0);
      if (availableRarePlus.length > 0) {
        lastSlot.rarity = getRandomRarity(availableRarePlus);
      }
    }

    // 6. Select card IDs
    const selectedIds: string[] = slots.map((slot) => {
      const pool = pools[slot.gender][slot.rarity];
      return pool[Math.floor(Math.random() * pool.length)];
    });

    // 7. Shuffle selected IDs
    for (let i = selectedIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selectedIds[i], selectedIds[j]] = [selectedIds[j], selectedIds[i]];
    }

    // 8. Fetch full card details
    const pulledCards = await prisma.wrestlerCard.findMany({
      where: {
        id: { in: selectedIds },
      },
    });

    // Map to maintain order after findMany
    const orderedCards = selectedIds.map((id) => pulledCards.find((c) => c.id === id)).filter(Boolean);

    // 9. Update user money and add to collection in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { money: { decrement: PULL_COST } },
      }),
      ...orderedCards.map((card) =>
        prisma.userCard.upsert({
          where: {
            userId_cardId: {
              userId: userId,
              cardId: card!.id,
            },
          },
          update: { quantity: { increment: 1 } },
          create: {
            userId: userId,
            cardId: card!.id,
            quantity: 1,
          },
        }),
      ),
    ]);

    return NextResponse.json(orderedCards);
  } catch (error) {
    console.error("Pull Error:", error);
    return NextResponse.json({ error: "failed to pull cards" }, { status: 500 });
  }
}
