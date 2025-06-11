import { getDepartments } from "@/actions/department";
import { getUser } from "@/actions/user";
import { requireUser } from "@/utils/requireUser";
import ProjectForm from "@/components/all-form/project-form";
export default async function ProjectAdminPage() {
  // Fetch data in parallel
  const [users, departments, currentUser] = await Promise.all([
    getUser(),
    getDepartments(),
    requireUser(),
  ]);

  // Transform departments to match the expected format
  const departmentOptions = departments.map((dept: { id: any; name: any; }) => ({
    id: dept.id,
    name: dept.name,
  }));

  // Transform users to include current user and others


  const userOptions = users.map((user: { id: any; name: any; email: any; }) => ({
    id: user.id,
    name: user?.name || 'Unknown',
    email: user?.email || 'No email',
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Project Admin Page</h1>
      <ProjectForm 
        departments={departmentOptions}
        users={userOptions}
        currentUserId={currentUser?.user_id}
      />
    </div>
  );
}