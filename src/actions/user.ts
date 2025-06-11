"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function getUser() {
  try {
    const session = await auth();
    const currentUserId = session?.user?.user_id;

    if (!currentUserId) {
      console.error("No logged in user found.");
      return [];
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId, // exclude current user
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function getAllUsers() {
  try {
    const session = await auth();
    const currentUserId = session?.user?.user_id;

    if (!currentUserId) {
      console.error("No logged in user found.");
      return [];
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId, // exclude current user
        },
      },
      include: {
        role: true,
      },
    });

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  roleId: string;
  departmentId?: string | null;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      roleId: data.roleId,
      departmentId: data.departmentId ?? null,  // Add departmentId or null
    },
    include: { role: true },
  });

  return user;
}

export async function updateUser(
  id: string,
  data: {
    name: string;
    email: string;
    password?: string;
    roleId: string;
    departmentId?: string | null;
  }
) {
  let updateData: any = {
    name: data.name,
    email: data.email,
    roleId: data.roleId,
    departmentId: data.departmentId ?? null,  // Add departmentId or null
  };

  if (data.password && data.password.length > 0) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    include: { role: true },
  });

  return user;
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
  return true;
}
