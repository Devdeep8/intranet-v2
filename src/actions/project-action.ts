"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProject(data: FormData) {
  try {
    const name = data.get("name") as string;
    const description = data.get("description") as string;
    const startDate = data.get("startDate") as string;
    const endDate = data.get("endDate") as string | null;
    const status = data.get("status") as string;
    const billable = data.get("billable") === "true";
    const departmentId = data.get("departmentId") as string;
    const createdById = data.get("createdById") as string;
    const contributors = data.getAll("contributors") as string[];

    if (!name || !startDate || !departmentId || !createdById) {
      return {
        success: false,
        message: "Required fields are missing.",
      };
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status as any,
        billable,
        departmentId,
        createdById,
        contributors: {
          create: contributors.map((userId) => ({
            userId,
          })),
        },
      },
    });

    revalidatePath("/projects");

    return {
      success: true,
      message: "Project created successfully.",
      project,
    };
  } catch (error: any) {
    console.error("Error creating project:", error);
    return {
      success: false,
      message: "Failed to create project.",
    };
  }
}
