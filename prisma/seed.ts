import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  for (const perm of createdPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: createdRoles.find(r => r.name === 'Admin')!.id,
        permissionId: perm.id,
      },
    });
  }

  // Manager: manage_tasks, view_reports
  const managerRole = createdRoles.find(r => r.name === 'Manager')!;
  const managerPerms = ['manage_tasks', 'view_reports'];
  for (const permName of managerPerms) {
    const perm = createdPermissions.find(p => p.name === permName)!;
    await prisma.rolePermission.create({
      data: {
        roleId: managerRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Employee: edit_profile only
  const employeeRole = createdRoles.find(r => r.name === 'Employee')!;
  const employeePerm = createdPermissions.find(p => p.name === 'edit_profile')!;
  await prisma.rolePermission.create({
    data: {
      roleId: employeeRole.id,
      permissionId: employeePerm.id,
    },
  });

  // Seed Users
  // NOTE: Password is plain text here, hash in real apps!
  const users = [
    {
      name: 'Alice Admin',
      email: 'alice.admin@example.com',
      password: 'password123',
      officialEmail: 'alice.admin@company.com',
      departmentId: createdDepartments.find(d => d.name === 'IT')!.id,
      roleId: createdRoles.find(r => r.name === 'Admin')!.id,
    },
    {
      name: 'Bob Manager',
      email: 'bob.manager@example.com',
      password: 'password123',
      officialEmail: 'bob.manager@company.com',
      departmentId: createdDepartments.find(d => d.name === 'Marketing')!.id,
      roleId: createdRoles.find(r => r.name === 'Manager')!.id,
    },
    {
      name: 'Charlie Employee',
      email: 'charlie.employee@example.com',
      password: 'password123',
      officialEmail: 'charlie.employee@company.com',
      departmentId: createdDepartments.find(d => d.name === 'Sales')!.id,
      roleId: createdRoles.find(r => r.name === 'Employee')!.id,
    },
  ];

  const createdUsers = [];
  for (const user of users) {
    const u = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    createdUsers.push(u);
  }

  // Seed Onboarding Steps
  const onboardingSteps = [
    {
      title: 'Join WhatsApp Groups',
      description: `Please join the Prabisha Consulting WhatsApp Group using the following link
Prabisha Consulting WhatsApp Group
Prabisha IT Projects WhatsApp Group`,
      order: 1,
    },
    {
      title: 'Introduce Yourself',
      description: `Once you've joined the groups, we encourage you to give a brief introduction. Share key information such as your skills, experience, education, current location, and your role at Prabisha.`,
      order: 2,
    },
    {
      title: 'Corporate Overview',
      description: `Please take some time to go through the Prabisha Consulting Presentation available here:
https://workdrive.zoho.in/pg4n38c3a20dfdeed40648bc24b81ff5ac0f7/teams/pg4n38c3a20dfdeed40648bc24b81ff5ac0f7/ws/vjl6084923f5ac8c74763a5331351c50dcd2e/folders/srbmt9d6f1e81214e4fca864348676c2a0b60
It provides an in-depth look at our company's mission, values, and goals.`,
      order: 3,
    },
    {
      title: 'Explore Our Website and Social Media',
      description: `Visit our official website - Prabisha Consulting: www.prabisha.co.uk to familiarize yourself with our company's work, culture, and values. Also, check out our social media pages linked on the website for updates and insights.`,
      order: 4,
    },
    {
      title: 'Set Up Your Official Email',
      description: `Format: FirstName.prabisha@gmail.com 
Test email sent to prabishait@gmail.com`,
      order: 5,
    },
    {
      title: 'Access Prabisha Intranet',
      description: `Create a new email address using the format FirstName.prabisha@gmail.com. This email address will be used for all official communication. Send a test email to prabishait@gmail.com to ensure it's working correctly.`,
      order: 6,
    },
    {
      title: 'Connect with Your Mentor and Guide',
      description: `Please reach out to your assigned mentor.`,
      order: 7,
    },
  ];

  const createdOnboardingSteps = [];
  for (const step of onboardingSteps) {
    const s = await prisma.onboardingStep.upsert({
      where: { order: step.order },
      update: {},
      create: step,
    });
    createdOnboardingSteps.push(s);
  }

  // Assign onboarding steps to users so no null payload error for assigned steps
  for (const user of createdUsers) {
    for (const step of createdOnboardingSteps) {
      await prisma.assignedStep.upsert({
        where: {
          userId_stepId: {
            userId: user.id,
            stepId: step.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          stepId: step.id,
          completed: false,
        },
      });
    }
  }

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
