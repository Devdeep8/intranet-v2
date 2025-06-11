import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/utils/requireUser";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(); // assumes this returns { id: string }
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.user_id;

    const body = await req.json();
    const dateStr = body.date; // Expecting 'YYYY-MM-DD' from frontend

    if (!dateStr) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 });
    }

    // Convert 'YYYY-MM-DD' to UTC midnight (start of day)
    const today = new Date(`${dateStr}T00:00:00.000Z`);
    const now = new Date(); // current time (check-in time)

    // Check if already marked
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Attendance already marked for today" },
        { status: 400 }
      );
    }

    // Mark attendance
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        date: today,
        checkIn: now,
        status: "PRESENT",
      },
    });

    return NextResponse.json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { message: "Failed to mark attendance" },
      { status: 500 }
    );
  }
}
