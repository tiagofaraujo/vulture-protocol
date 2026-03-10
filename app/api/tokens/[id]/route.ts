import { NextResponse } from "next/server";

import { mapPrismaTokenToTokenRow } from "@/lib/token-mapper";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const token = await prisma.token.findUnique({
      where: { id },
      include: {
        metrics: true,
        classification: true,
      },
    });

    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    return NextResponse.json({
      token: mapPrismaTokenToTokenRow(token),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to load token" },
      {
        status: 500,
      },
    );
  }
}
