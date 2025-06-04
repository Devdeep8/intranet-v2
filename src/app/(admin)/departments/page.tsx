import { getDepartments } from "@/actions/department"
import { getUser } from "@/actions/user"
import Stats from "@/components/admin-component/department-page/department-stats"
import { DepartmentTable } from "@/components/admin-component/department-page/department-table"
export default async function DepartmentsPage() {
    const user = await getUser()
    const departments = await getDepartments()
    return (
        <div className="p-4 w-full">
           
            <h1 className="text-2xl font-bold mb-4">Departments</h1>
            <Stats />
            <DepartmentTable users={user} departments={departments}/>
            </div>
    )
}