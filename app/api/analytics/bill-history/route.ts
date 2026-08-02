import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    // Verify that the account belongs to the user
    const account = await prisma.utilityAccount.findFirst({
      where: {
        id: accountId,
        user: { clerkId: userId },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get bill history for the account, ordered by month
    const billHistory = await prisma.billHistory.findMany({
      where: {
        accountId: accountId,
      },
      select: {
        id: true,
        amount: true,
        billMonth: true,
        status: true,
        detectedAt: true,
        createdAt: true,
      },
      orderBy: {
        billMonth: "asc",
      },
    });

    return NextResponse.json({
      billHistory,
    });
  } catch (error) {
    console.error("Error fetching bill history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
