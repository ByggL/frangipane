import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const rarity = searchParams.get("rarity") || "ALL";
  const sortBy = searchParams.get("sortBy") || "DATE_DESC";

  // Build where clause
  const where: Prisma.UserCardWhereInput = {
    userId: (session.user as any).id,
    card: {
      AND: [
        search ? {
          OR: [
            { name: { contains: search } },
            { promotion: { contains: search } },
          ]
        } : {},
        rarity !== "ALL" ? { rarity: { equals: rarity } } : {},
      ]
    }
  };

  // Determine sort
  let orderBy: Prisma.UserCardOrderByWithRelationInput = {};
  switch (sortBy) {
    case "NAME_ASC": orderBy = { card: { name: "asc" } }; break;
    case "NAME_DESC": orderBy = { card: { name: "desc" } }; break;
    case "DATE_DESC": orderBy = { updatedAt: "desc" }; break;
    default: orderBy = { updatedAt: "desc" };
  }

  try {
    const userCards = await prisma.userCard.findMany({
      where,
      include: {
        card: true,
      },
      orderBy,
    });

    const collection = userCards.map((uc) => ({
      ...uc.card,
      quantity: uc.quantity,
    }));

    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 });
  }
}
