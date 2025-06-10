"use server";

import { onboardingTaskSchema } from "@/lib/zod-schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


type TaskFormErrors = {
  title?: string[];
  description?: string[];
  order?: string[];
  isMandatory?: string[];
  _form?: string[];
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  isMandatory: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type FormState = {
  success: boolean;
  errors: TaskFormErrors;
  task?: Task;
};

export async function createOnboardingTask(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = onboardingTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    order: formData.get("order"),
    isMandatory: formData.get("isMandatory") === "on",
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    const task = await prisma.onboardingTask.create({ data });

    return { success: true, task, errors: {} };
  } catch (err) {
    console.error(err);
    return { success: false, errors: { _form: ["Something went wrong."] } };
  }
}



export async function getOnboardingTasks() {
  try {
    const tasks = await prisma.onboardingTask.findMany({
      orderBy: {
        order: 'asc'
      },
      include: {
        assignedTo: true // Include related UserOnboardingTask records if needed
      }
    });
    
    return tasks;
  } catch (error) {
    console.error('Error fetching onboarding tasks:', error);
    throw new Error('Failed to fetch onboarding tasks');
  }
}// lib/actions/onboarding-tasks.js


export async function updateTaskOrder(taskUpdates : any) {
  try {
    // Use transaction to update multiple tasks atomically
    const result = await prisma.$transaction(
      taskUpdates.map(({ id, order } : any) =>
        prisma.onboardingTask.update({
          where: { id },
          data: { order }
        })
      )
    );

    return result;
  } catch (error) {
    console.error('Error updating task order:', error);
    throw new Error('Failed to update task order');
  }
}

export async function updateOnboardingTask({id, data} : any) {
  try {
    const task = await prisma.onboardingTask.update({
      where: { id },
      data
    });

    return task;
  } catch (error) {
    console.error('Error updating onboarding task:', error);
    throw new Error('Failed to update onboarding task');
  }
}

export async function deleteOnboardingTask(id : string) {
  try {
    const deletedTask = await prisma.onboardingTask.delete({
      where: { id }
    });

    // Reorder remaining tasks to fill the gap
    const remainingTasks = await prisma.onboardingTask.findMany({
      where: {
        order: {
          gt: deletedTask.order
        }
      },
      orderBy: { order: 'asc' }
    });

    // Update order for remaining tasks
    await prisma.$transaction(
      remainingTasks.map((task, index) =>
        prisma.onboardingTask.update({
          where: { id: task.id },
          data: { order: deletedTask.order + index }
        })
      )
    );

    return deletedTask;
  } catch (error) {
    console.error('Error deleting onboarding task:', error);
    throw new Error('Failed to delete onboarding task');
  }
}


export async function markTaskComplete(userTaskId: string) {
  await prisma.userOnboardingTask.update({
    where: { id: userTaskId },
    data: { status: "COMPLETED" }
  });

  revalidatePath("/onboarding");
}

export async function completeOnboarding(userId: string, roleName: string) {
  const role = await prisma.role.findUnique({ where: { name: roleName } });

  if (!role) throw new Error(`Role '${roleName}' not found`);

  await prisma.user.update({
    where: { id: userId },
    data: {
      isOnboarded: true,
      roleId: role.id
    }
  });

  redirect("/dashboard"); // adjust route as needed
}