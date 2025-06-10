import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    // Find the user with their department and role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: true,
        role: true,
      },
    });

    if (!user || !user.departmentId) {
      return NextResponse.json({ error: "User or department not found" }, { status: 404 });
    }

    // Get all users in the same department, excluding the current user
    const coworkers = await prisma.user.findMany({
      where: {
        departmentId: user.departmentId,
        NOT: {
          id: userId,
        },
      },
      include: {
        role: true,
      },
    });

    return NextResponse.json({
      department: user.department,
      coworkers, // each coworker includes their role now
    });
  } catch (error) {
    console.error("Error fetching department employees:", error);
    return NextResponse.json({ error: "Failed to fetch department employees" }, { status: 500 });
  }
}