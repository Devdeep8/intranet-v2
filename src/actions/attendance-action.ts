"use server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const getFiveDaysAttendance = async (user_id: string) => {
  if (!user_id) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get Monday of the current week
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const monday = new Date(today);
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days
    monday.setDate(today.getDate() + diff);

    const weekdays: any[] = [];

    for (let i = 0; i < 5; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      
      // Use the same date format as your API - local timezone date
      const queryDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());

      const record = await prisma.attendance.findUnique({
        where: {
          userId_date: {
            userId: user_id,
            date: queryDate, // Use local timezone date same as API
          },
        },
      });

      weekdays.push({
        date: current.toISOString().split("T")[0], // Return date in YYYY-MM-DD format
        status: record?.status || "ABSENT",
        checkIn: record?.checkIn?.toISOString() || null,
        checkOut: record?.checkOut?.toISOString() || null,
        totalHours: record?.totalHours ? Number(record.totalHours) : null,
      });
    }

    return weekdays;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }
};