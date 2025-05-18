import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// prisma/seed.js

async function main() {
  // Seed Departments
  const departments = [
    { name: 'HR' },
    { name: 'IT' },
    { name: 'Marketing' },
    { name: 'Sales' },
  ];

  const createdDepartments = [];
  for (const dept of departments) {
    const d = await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
    createdDepartments.push(d);
  }

  // Seed Roles
  const roles = [
    { name: 'Admin' },
    { name: 'Manager' },
    { name: 'Employee' },
  ];

  const createdRoles = [];
  for (const role of roles) {
    const r = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    createdRoles.push(r);
  }

  // Seed Permissions
  const permissions = [
    { name: 'manage_users', label: 'Manage Users' },
    { name: 'manage_tasks', label: 'Manage Tasks' },
    { name: 'view_reports', label: 'View Reports' },
    { name: 'edit_profile', label: 'Edit Profile' },
  ];

  const createdPermissions = [];
  for (const perm of permissions) {
    const p = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
    createdPermissions.push(p);
  }

  // Link RolePermissions (simple: Admin gets all, Manager some, Employee minimal)
  // Clear existing RolePermissions first (optional)
  await prisma.rolePermission.deleteMany();

  // Admin: all permissions
  const adminRole = createdRoles.find(r => r.name === 'Admin');
  if (adminRole) {
    for (const perm of createdPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      });
    }
  }

  // Manager: manage_tasks, view_reports
  const managerRole = createdRoles.find(r => r.name === 'Manager');
  const managerPerms = ['manage_tasks', 'view_reports'];


  if (managerRole) {
    for (const permName of managerPerms) {
      const perm = createdPermissions.find(p => p.name === permName);
      if (perm) {
        await prisma.rolePermission.create({
          data: {
            roleId: managerRole.id,
            permissionId: perm.id,
          },
        });
      }
    }
  }

  // Employee: edit_profile only
  const employeeRole = createdRoles.find(r => r.name === 'Employee');
  const employeePerm = createdPermissions.find(p => p.name === 'edit_profile');
  if (employeeRole && employeePerm) {
    await prisma.rolePermission.create({
      data: {
        roleId: employeeRole.id,
        permissionId: employeePerm.id,
      },
    });
  }

  // Seed Users
  
  console.log('✅ Seed data inserted successfully!');

}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
