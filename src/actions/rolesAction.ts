"use server"
import { prisma } from '@/lib/prisma'

export async function getRoles() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true, // includes the actual Permission data
          },
        },
        users: true,
      },
    })

    return roles
  } catch (error) {
    console.error('Failed to fetch roles:', error)
    return []
  }
}

export async function createRoles(name:string) {
  try {
    const role = await prisma.role.create({
      data: {
        name: name,
      },
    })
    return {success : true , role }
  } catch (error) {
    console.error('Failed to create role:', error)
    return null
  }
    
}