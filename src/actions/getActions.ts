import { prisma } from '@/lib/prisma'
import { Department } from '@/types/types'
export const getAllDepartments = async (): Promise<Department[]> => {
  try {
    const response = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
      },
    })
    return response
  } catch (error) {
    console.error(error)
    return [] // Ensure we return a valid array
  }
}
