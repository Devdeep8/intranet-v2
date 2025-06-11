// utils/user-utils.ts

import { prisma } from '@/lib/prisma'


// Check if a user is the head of any department
export async function isUserHeadOfAnyDepartment(userId: string) {
  const department = await prisma.department.findFirst({
    where: { headId: userId },
    select: { id: true },
  })
  return !!department
}

// Get the head of a specific department
export async function getHeadOfDepartment(departmentId: string) {
  const department = await prisma.department.findUnique({
    where: { id: departmentId },
    select: {
      head: {
        select: { id: true, name: true, email: true },
      },
    },
  })
  return department?.head ?? null
}

// Check if the logged-in user is the head of their department
export async function isUserHeadOfTheirDepartment(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { departmentId: true },
  })

  if (!user?.departmentId) return false

  const department = await prisma.department.findUnique({
    where: { id: user.departmentId },
    select: { headId: true },
  })

  return department?.headId === userId
}

// Get all users under a department
export async function getUsersInDepartment(departmentId: string) {
  return prisma.user.findMany({
    where: { departmentId },
    select: { id: true, name: true, email: true },
  })
}

// Get user onboarding status
export async function isUserOnboarded(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isOnboarded: true },
  })
  return user?.isOnboarded ?? false
}

// Get user role
export async function getUserRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: { select: { name: true } } },
  })
  return user?.role?.name ?? null
}

// Get user attendance for today
export async function getUserTodayAttendance(userId: string) {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  return prisma.attendance.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  })
}
