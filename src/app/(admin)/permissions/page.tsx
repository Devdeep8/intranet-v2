import { getPermissions } from "@/actions/permission-action";
import Permissions_Table from "@/components/admin-component/permission/permission";

export default async function PermissionsPage(){
    const permissions = await getPermissions()
    return(
        <div>
            <Permissions_Table permissions={permissions} />
        </div>

    )
}