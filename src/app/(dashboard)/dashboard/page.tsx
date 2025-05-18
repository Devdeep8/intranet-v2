

import { getAllDepartmentsUsers } from "@/actions/getActions"
import { getDepartmentProjects } from "@/actions/getProject"
import { getTaskByUserId } from "@/actions/taskAction"
import { auth } from "@/lib/auth"
import Dashboard from "@/pages/dashboardPage/dashboard"

export default async function DashboardPage() {

  const session = await auth()
  if(!session?.user?.departmentId) return null
  const project = await getDepartmentProjects(session?.user?.departmentId)
  const team = await getAllDepartmentsUsers(session?.user?.departmentId)
  const task = await getTaskByUserId(session?.user?.user_id)

  return (
    <div className="flex min-h-screen flex-col bg-background">
     <Dashboard projects={project} team = {team} task={task}/>
    </div>
  )
}
