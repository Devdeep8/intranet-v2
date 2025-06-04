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
