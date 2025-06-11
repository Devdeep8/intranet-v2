import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/utils/requireUser";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const dateStr: string = body.date; // "YYYY-MM-DD"

    if (!dateStr) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 });
    }

    const userId = user.user_id;
    const date = new Date(`${dateStr}T00:00:00.000Z`);
    const now = new Date();

    // Fetch the existing attendance for that day
    const attendance = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    if (!attendance) {
      return NextResponse.json(
        { message: "No attendance record found for today" },
        { status: 404 }
      );
    }

    if (attendance.status !== "PRESENT") {
      return NextResponse.json(
        { message: "Cannot check out unless marked as PRESENT" },
        { status: 400 }
      );
    }

    if (attendance.checkOut) {
      return NextResponse.json(
        { message: "Already checked out" },
        { status: 400 }
      );
    }

    // Calculate total hours
    if (!attendance.checkIn) {
      return NextResponse.json({ message: "Check-in time not found" }, { status: 400 });
    }
    const checkInTime = new Date(attendance.checkIn);
    const totalHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60); // in hours

    const updated = await prisma.attendance.update({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      data: {
        checkOut: now,
        totalHours,
      },
    });

    return NextResponse.json({
      message: "Checked out successfully",
      attendance: updated,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    return NextResponse.json(
      { message: "Failed to check out" },
      { status: 500 }
    );
  }
}
