import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // retrieve all cards
    const cards = await prisma.wrestlerCard.findMany();

    // return payload
    return NextResponse.json(cards);
  } catch (error) {
    // return server error, catch block
    return NextResponse.json({ error: "failed to fetch cards" }, { status: 500 });
  }
}
