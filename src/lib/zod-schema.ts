// schema.ts
import { z } from "zod";

export const departmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  priority: z.coerce.number(),
  description: z.string().optional(),
  headId: z.string().optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;


export const onboardingTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  order: z.coerce.number().int().min(0),
  isMandatory: z.coerce.boolean().default(true),
});

export type OnboardingTaskInput = z.infer<typeof onboardingTaskSchema>;


export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  departmentId: z.string().min(1, "Department is required"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;