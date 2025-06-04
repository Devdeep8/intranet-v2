import { getRoles } from "@/actions/rolesAction";
import Roles from "@/components/admin-component/roles/roles-management";

export default async function Page() {
    const roles = await getRoles();
    console.log(roles, "roles")     
  

    return (
        <div>
            <h1>Roles</h1>
            <Roles roles={roles}/>
        </div>
    );
}