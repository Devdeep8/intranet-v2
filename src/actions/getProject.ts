'use server'
import { prisma } from '@/lib/prisma'
import { Project } from "@/pages/dashboardPage/dashboard"
 
export const getUserProjectsAndPendingTasks = async (departmentId: string) => {
  try {
    // Step 2: Get projects from the user's department with pending tasks
    const projects = await prisma.project.findMany({
      where: {
        departmentId: departmentId,
      },
      include: {
        tasks: {
          where: {
            status: 'pending',
          },
        },
      },
    });

    return projects;
  } catch (error) {
    console.error('Failed to fetch user projects and tasks:', error);
    return [];
  }
};




export async function getDepartmentProjects(departmentId: string): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: { departmentId },
    include: {
      department: { select: { name: true } },
    },
    orderBy: {
      endDate: "asc",
    },
  })

  // Map to match the Project type
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    endDate: project.endDate?.toISOString() || null,
    department: {
      name: project.department.name,
    },
  }))
}

// app/actions/createTask.ts




export async function createProject(prevState : any, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const departmentId = formData.get("departmentId") as string
    const endDateRaw = formData.get("endDate") as string
    const endDate = endDateRaw ? new Date(endDateRaw) : null
    const projectMangerId = formData.get("projectManagerId") as string
    // For now we’ll use a hardcoded project manager ID — replace with actual logic from session/user

    if (!name || !departmentId || !projectMangerId) {
      return { success: false, error: "Missing required fields" }
    }

    console.log(name, departmentId, endDate, projectMangerId)
    await prisma.project.create({
      data: {
        name,
        endDate,
        startDate: new Date(),
        department :{
          connect: { id: departmentId }
        },
        projectManger : {
          connect : { id  : projectMangerId}
        }
      },
    })

    return { success: true }
  } catch (error) {
    console.error("[CREATE_PROJECT_ERROR]", error)
    return { success: false, error: "Something went wrong while creating the project" }
  }
}