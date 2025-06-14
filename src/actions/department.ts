"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { departmentSchema } from "@/lib/zod-schema";

export async function createDepartmentAction(data: FormData) {
  try {
    const rawData = {
      name: data.get("name"),
      description: data.get("description"),
      priority: data.get("priority"),
      headId: data.get("headId") || null,
    };

    const parsed = departmentSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed: " + JSON.stringify(parsed.error.format()),
      };
    }

    const departmentData = parsed.data;

    await prisma.department.create({
      data: {
        name: departmentData.name,
        description: departmentData.description || null,
        priority: Number(departmentData.priority),
        headId: departmentData.headId,
      },
    });

    revalidatePath("/departments");

    return {
      success: true,
      message: "Department created successfully.",
    };
  } catch (error) {
    console.error("Error creating department:", error);
    return {
      
      success: false,
    };
  }
}


export async function getDepartments() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        priority: "asc",
      },
      include: {
        head: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return departments;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return [];
  }
}

export async function getUsersByDepartment(departmentId: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        departmentId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error("Failed to fetch users by department:", error);
    return {
      success: false,
      message: "Error fetching users from the department.",
      users: [],
    };
  }
}


export async function deleteDepartments(id: string) {
  try {
    // Attempt to delete the department with cascade
    const deleted = await prisma.department.delete({
      where: { id },
    })

    return {
      success: true,
      message: `Department ${deleted.name} deleted successfully.`,
    }
  } catch (error) {
    console.error("Error deleting department:", error)

    return {
      success: false,
      message: "Failed to delete department. It may not exist or is already deleted.",
    }
  }
}

export async function updateDepartment(payload : FormData) {
  try {
    const rawData = {
      id: payload.get("id"),
      name: payload.get("name"),
      description: payload.get("description"),
      priority: payload.get("priority"),
      headId: payload.get("headId") || null,
    };

    const parsed = departmentSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed: " + JSON.stringify(parsed.error.format()),
      };
    }

    const departmentData = parsed.data;

    await prisma.department.update({
      where: {
        id: departmentData.id,
      },
      data: {
        name: departmentData.name,
        description: departmentData.description || null,
        priority: Number(departmentData.priority),
        headId: departmentData.headId,
      },
    });

    revalidatePath("/departments");

    return {
      success: true,
      message: "Department updated successfully.",
    };
  }  catch (error) {
    console.error("Error updating department:", error)
    return {
      success: false,
      message: "Failed to update department. It may not exist or is already deleted.",
    }
  }
}



export async function getProjectsByDepartment(departmentId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        departmentId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        status: true,
        billable: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
       
      },
    });

    return {
      success: true,
      projects,
    };
  } catch (error) {
    console.error("Failed to fetch projects by department:", error);
    return {
      success: false,
      message: "Error fetching projects from the department.",
      projects: [],
    };
  }
}