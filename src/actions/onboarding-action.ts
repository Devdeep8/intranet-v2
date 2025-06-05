"use server";

import { onboardingTaskSchema } from "@/lib/zod-schema";
import { prisma } from "@/lib/prisma";

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
