import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
<<<<<<< Updated upstream
=======
import { auth } from "@/lib/auth";
>>>>>>> Stashed changes

export async function GET() {
  try {
<<<<<<< Updated upstream
=======
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and check money
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
    });

    if (!user || user.money < PULL_COST) {
      return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }

>>>>>>> Stashed changes
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
