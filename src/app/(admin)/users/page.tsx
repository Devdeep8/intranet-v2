import { getRoles } from "@/actions/rolesAction";
import { getAllUsers } from "@/actions/user";
import UserPage from "@/components/admin-component/user-managment/user-mangement";


export default async function Page() {
  const users = await getAllUsers()
  const roles = await getRoles()

  return <UserPage roles={roles} users={users} />;
}

