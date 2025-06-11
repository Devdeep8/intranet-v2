import { getProjectsByDepartment } from "@/actions/department";
import DepartmentHeadInfo from "@/components/department/DepartmentHeadInfo";
import { ProjectDepartment } from "@/components/department/project-department";
import { getHeadOfDepartment,  } from "@/utils/all-utility";

export default async function DepartmentPage({ params }: any) {
  const { departmentId } = await params;

  const getHead = await getHeadOfDepartment(departmentId);
  if (!getHead) {
    return <div className="container mx-auto p-4">Department not found.</div>;
  }

  const projects = await getProjectsByDepartment(departmentId);

  // Handle possible undefined/null cases gracefully
  const safeProjects = projects?.projects ?? [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Department Page</h1>
      <DepartmentHeadInfo head={getHead} />
      <ProjectDepartment projects={safeProjects} />
    </div>
  );
}
