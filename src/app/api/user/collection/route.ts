import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userCards = await prisma.userCard.findMany({
    where: { userId: (session.user as any).id },
    include: {
      card: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Flatten the response to match the expected Card[] format but including quantity
  const collection = userCards.map((uc) => ({
    ...uc.card,
    quantity: uc.quantity,
  }));

  return NextResponse.json(collection);
}
