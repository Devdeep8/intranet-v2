"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AttendanceComponent({ attendanceData }: { attendanceData: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Filter out weekends from attendance data
  const filteredData = attendanceData
    .filter((entry) => {
      const day = new Date(entry.date).getDay();
      return day !== 0 && day !== 6; // Exclude weekends
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort from Monday → Friday

  // Check today's record - Fixed comparison
  console.log(attendanceData, today, "attendance data");
  const todayRecord = useMemo(() => {
    return attendanceData.find((entry) => {
      // Convert both to the same format for comparison
      const entryDate = new Date(entry.date).toISOString().split("T")[0];
      return entryDate === today;
    });
  }, [attendanceData, today]);


  const hasCheckedIn = !!todayRecord?.checkIn;
  const hasCheckedOut = !!todayRecord?.checkOut;
  const isTodayPresent = todayRecord?.status === "PRESENT";

  const handleMarkAttendance = async (type: "check-in" | "check-out") => {
    setIsSubmitting(true);
    const endpoint = type === "check-in" ? "/api/attendance/mark" : "/api/attendance/checkout";

    const attendancePromise = fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today }),
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed");
      }
      return res.json();
    });

    toast.promise(attendancePromise, {
      loading: type === "check-in" ? "Marking attendance..." : "Checking out...",
      success: (data) => data.message || "Success",
      error: (err) => err.message || "Error",
    });

    try {
      await attendancePromise;
      // Optionally trigger a refetch of attendance data here
      window.location.reload(); // Quick fix - you might want to use a more elegant state update
    } catch {
      // Already handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"].map((status, i) => ({
    status,
    count: filteredData.filter((entry) => entry.status === status).length,
    fill: `var(--chart-${i + 1})`,
  }));

  const chartConfig = {
    count: { label: "Days" },
    PRESENT: { label: "Present", color: "var(--chart-1)" },
    ABSENT: { label: "Absent", color: "var(--chart-2)" },
    HALF_DAY: { label: "Half Day", color: "var(--chart-3)" },
    LEAVE: { label: "Leave", color: "var(--chart-4)" },
  } satisfies ChartConfig;

  const displayList = filteredData.slice(-5); // Chronological Mon–Fri view

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Attendance Summary</CardTitle>
        <CardDescription>Last 5 Working Days</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={60} outerRadius={90} />
          </PieChart>
        </ChartContainer>

        {/* <div className="mt-6 space-y-1">
          {displayList.map((entry) => (
            <div key={entry.date} className="text-center text-sm">
              {new Date(entry.date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}{" "}
              – {entry.status}
            </div>
          ))}
        </div> */}

        {!isWeekend && (
          <div className="mt-6 flex justify-center">
            {!hasCheckedIn && (
              <Button onClick={() => handleMarkAttendance("check-in")} disabled={isSubmitting}>
                {isSubmitting ? "Marking..." : "Mark My Attendance"}
              </Button>
            )}
            {isTodayPresent && !hasCheckedOut && (
              <Button onClick={() => handleMarkAttendance("check-out")} disabled={isSubmitting}>
                {isSubmitting ? "Checking out..." : "Check Out & Pack Your Bags"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}