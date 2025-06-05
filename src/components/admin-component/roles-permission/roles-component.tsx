"use client";

import { useState, useTransition } from "react";
import { Role, Permission, RolePermission } from "@prisma/client";
import { toast } from "sonner";

interface Props {
  roles: (Role & { RolePermission: RolePermission[] })[];
  permissions: Permission[];
}

export default function RolesPermissionsManager({ roles, permissions }: Props) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(roles);

const handleToggle = (roleId: string, permissionId: string, checked: boolean) => {
  startTransition(async () => {
    try {
      await fetch("/api/roles-permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId,
          permissionId,
          action: checked ? "assign" : "remove",
        }),
      });

      // Optimistically update UI
      setData(prev =>
        prev.map(role =>
          role.id === roleId
            ? {
                ...role,
                RolePermission: checked
                  ? [...role.RolePermission, { roleId, permissionId }]
                  : role.RolePermission.filter(rp => rp.permissionId !== permissionId),
              }
            : role
        )
      );

      toast.success("Updated successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  });
};
  return (
    <div className="overflow-auto">
      <table className="min-w-full border rounded-lg text-sm">
        <thead>
          <tr>
            <th className="p-2 border">Role</th>
            {permissions.map((p) => (
              <th key={p.id} className="p-2 border text-center">{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((role) => (
            <tr key={role.id}>
              <td className="p-2 border font-medium">{role.name}</td>
              {permissions.map((perm) => {
                const hasPerm = role.RolePermission.some(rp => rp.permissionId === perm.id);
                return (
                  <td key={perm.id} className="p-2 border text-center">
                    <input
                      type="checkbox"
                      checked={hasPerm}
                      disabled={isPending}
                      onChange={(e) => handleToggle(role.id, perm.id, e.target.checked)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
