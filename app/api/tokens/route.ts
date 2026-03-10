import { NextResponse } from "next/server";

import { mapPrismaTokenToTokenRow } from "@/lib/token-mapper";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tokens = await prisma.token.findMany({
      include: {
        metrics: true,
        classification: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      tokens: tokens.map(mapPrismaTokenToTokenRow),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to load tokens" },
      {
        status: 500,
      },
    );
  }
}
