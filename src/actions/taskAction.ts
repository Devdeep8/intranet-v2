'use server'
import { prisma } from '@/lib/prisma'

export async function createTask(prevState: any, formData: FormData) {
  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dueDate = formData.get('dueDate') as string
    const status = formData.get('status') as string
    const priority = formData.get('priority') as string
    const assigneeId = formData.get('assigneeId') as string
    const projectId = formData.get('projectId') as string

    await prisma.task.create({
  data: {
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : null,
    status,
    priority,
    assignee: { connect: { id: assigneeId } },
    project: { connect: { id: projectId } },
  },
})
    console.log("createTask", title , description,dueDate , status,priority,assigneeId,projectId)
    // revalidatePath('/dashboard') // Change this to your task page path
    return { success: true }
  } catch (err) {
    return { error: 'Failed to create task' }
  }
}



export const getTaskByUserId = async (user_id: string) => {
  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: user_id,
      status: {
        in: ["PENDING", "IN_PRROGRESS"],
      },
    },
  });

  return tasks;
};


export async function markTaskAsDone(taskId: string) {
  // Update task status to COMPLETED in DB
  try {
      await prisma.task.update({
          where: { id: taskId },
          data: { status: "COMPLETED" },
    
        })
        return { success: true }
  } catch (error) {
    console.log(error)
        return { error: 'Failed to create task' }

  }

}
