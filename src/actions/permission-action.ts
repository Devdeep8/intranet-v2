"use server"

import { prisma } from "@/lib/prisma"

export async function getPermissions() {
    try {
        const permissions = await prisma.permission.findMany()
        return permissions
    } catch (error) {
        console.error('Failed to fetch permissions:', error)
        return []
    }
}

export async function createPermissions(payload : any) {
     try {
        const newPermission = await prisma.permission.create({
            data: payload,
          })    
        return {success : true , permission : newPermission}
     } catch (error) {
        console.error('Failed to create permission:', error)
        return null     
     }
}