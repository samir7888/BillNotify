import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile to access utility accounts
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkId: userId },
      include: {
        accounts: {
          where: { active: true },
          select: {
            id: true,
            utilityType: true,
            providerName: true,
            customerName: true,
            scNo: true,
            consumerId: true,
            neaLocationCode: true,
          },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      accounts: userProfile.accounts,
    });
  } catch (error) {
    console.error("Error fetching user accounts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
