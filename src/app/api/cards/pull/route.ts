import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get total count of cards
    const count = await prisma.wrestlerCard.count();
    
    // Generate 10 random offsets
    const randomOffsets = Array.from({ length: 10 }, () => Math.floor(Math.random() * count));

    // Fetch cards at those offsets
    // Note: SQLite/Prisma doesn't have a very efficient "ORDER BY RANDOM()" for large datasets
    // so we fetch them individually or use a trick. 
    // For 10 cards, fetching in a loop or with multiple queries is acceptable.
    const cards = await Promise.all(
      randomOffsets.map(offset => 
        prisma.wrestlerCard.findFirst({
          skip: offset,
          take: 1,
        })
      )
    );

    // Filter out any potential nulls (though unlikely)
    const validCards = cards.filter(card => card !== null);

    return NextResponse.json(validCards);
  } catch (error) {
    console.error("Pull Error:", error);
    return NextResponse.json({ error: "failed to pull cards" }, { status: 500 });
  }
}
