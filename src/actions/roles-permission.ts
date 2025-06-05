
"use server"

import { prisma } from "@/lib/prisma"; // adjust the import path as per your project structure

export async function getRolesWithPermissions() {
  const roles = await prisma.role.findMany({
    include: {
      permissions: true, // this fetches RolePermission[]
    },
  });

  const permissions = await prisma.permission.findMany();

  return { roles, permissions };
}
