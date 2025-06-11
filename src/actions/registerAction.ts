'use server';

import { redirect } from "next/navigation";
import { registerSchema } from "@/lib/zod-schema";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { signIn } from "@/lib/auth";

export async function registerUser(formData: FormData): Promise<void> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    departmentId: formData.get("departmentId"),
  });

  if (!parsed.success) {
    redirect("/auth/register?error=validation");
  }

  const { name, email, password, departmentId } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    redirect("/auth/register?error=exists");
  }

  const hashedPassword = await hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      departmentId,
      isOnboarded: false,
    },
  });

  // Assign all onboarding tasks to this user
  const tasks = await prisma.onboardingTask.findMany();
  if (tasks.length > 0) {
    await prisma.userOnboardingTask.createMany({
      data: tasks.map((task: { id: any; }) => ({
        userId: user.id,
        onboardingTaskId: task.id,
        status: "PENDING",
      })),
    });
  }

  // Sign in the user
  await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  // Redirect to onboarding
  redirect("/onboarding");
}
