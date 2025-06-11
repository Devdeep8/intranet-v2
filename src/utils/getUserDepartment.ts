// lib/getUserDepartment.ts
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/utils/requireUser";

export const getUserDepartment = async () => {
  const user = await requireUser();
  if (!user) return null;

  const userData = await prisma.user.findUnique({
    where: { id: user.user_id },
    include: { department: true },
  });

  return {
    id: userData?.department?.id || null,
    name: userData?.department?.name || null,
  };
};
