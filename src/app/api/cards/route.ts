import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const search = searchParams.get("search") || "";
    const rarity = searchParams.get("rarity") || "ALL";
    const sortBy = searchParams.get("sortBy") || "NAME_ASC";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.WrestlerCardWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search } },
                { promotion: { contains: search } },
              ],
            }
          : {},
        rarity !== "ALL" ? { rarity: { equals: rarity } } : {},
      ],
    };

    // Determine sort
    let orderBy: Prisma.WrestlerCardOrderByWithRelationInput[] = [{ imageUrl: "desc" }];

    switch (sortBy) {
      case "NAME_ASC": orderBy.push({ name: "asc" }); break;
      case "NAME_DESC": orderBy.push({ name: "desc" }); break;
      case "HEIGHT_DESC": orderBy.push({ height: "desc" }); break;
      case "WEIGHT_DESC": orderBy.push({ weight: "desc" }); break;
      default: orderBy.push({ name: "asc" });
    }

    // Execute queries in parallel
    const [cards, total] = await Promise.all([
      prisma.wrestlerCard.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy,
      }),
      prisma.wrestlerCard.count({ where }),
    ]);

    return NextResponse.json({
      cards,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "failed to fetch cards" }, { status: 500 });
  }
}

