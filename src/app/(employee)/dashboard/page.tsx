"use server"
import { getFiveDaysAttendance } from "@/actions/attendance-action";
import { AttendanceComponent } from "@/components/employee-component/empolyee-sidebar/attendance-component";
import { requireUser } from "@/utils/requireUser";

export default async function DashboardPage() {
  // This is a placeholder for the dashboard page
  const user = await requireUser()
  const getAttendance  = await getFiveDaysAttendance(user?.user_id );

  // You can fetch any necessary data here and pass it to your components
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AttendanceComponent attendanceData={Array.isArray(getAttendance) ? getAttendance : []}  />

      </div>
    </div>
  );
}