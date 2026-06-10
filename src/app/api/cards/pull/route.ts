import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const PULL_COST = 100;

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and check money
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.money < PULL_COST) {
      return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }

    // Get total count of cards
    const count = await prisma.wrestlerCard.count();
    
    // Generate 10 random offsets
    const randomOffsets = Array.from({ length: 10 }, () => Math.floor(Math.random() * count));

    // Fetch cards
    const cards = await Promise.all(
      randomOffsets.map(offset => 
        prisma.wrestlerCard.findFirst({
          skip: offset,
          take: 1,
        })
      )
    );

    const validCards = cards.filter(card => card !== null);

    // Update user money and add to collection in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { money: { decrement: PULL_COST } },
      }),
      ...validCards.map(card => 
        prisma.userCard.upsert({
          where: {
            userId_cardId: {
              userId: user.id,
              cardId: card.id,
            },
          },
          update: { quantity: { increment: 1 } },
          create: {
            userId: user.id,
            cardId: card.id,
            quantity: 1,
          },
        })
      )
    ]);

    return NextResponse.json(validCards);
  } catch (error) {
    console.error("Pull Error:", error);
    return NextResponse.json({ error: "failed to pull cards" }, { status: 500 });
  }
}
