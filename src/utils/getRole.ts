import { prisma } from "@/lib/prisma"



export async function getRoleById(roleId: string) {
    const res = await prisma.role.findUnique( {
        where : {
            id : roleId
        }
    })

    return res?.name
}