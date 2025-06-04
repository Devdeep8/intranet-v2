"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
      },
    });

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}


