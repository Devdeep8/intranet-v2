import { getRolesWithPermissions } from "@/actions/roles-permission";
import RolesPermissionsManager from "@/components/admin-component/roles-permission/roles-component";
export default async function Page() {

    const {roles: rolesData , permissions} = await getRolesWithPermissions()
    const roles = rolesData.map(role => ({
      ...role,
      RolePermission: role.permissions
    }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Roles & Permissions</h1>
      <RolesPermissionsManager roles={roles} permissions={permissions} />
    </div>
  );
}
