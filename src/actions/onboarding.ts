'use server'

import bcrypt from 'bcrypt'
import {prisma} from '@/lib/prisma' // Adjust the import to your prisma client location
import { redirect } from 'next/navigation'
import { sendWelcomeEmail } from '@/services/sendEmail'


export async function handleOnboardingSubmit(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const name = (formData.get('name') as string)?.trim()
  const departmentId = (formData.get('department') as string)
  const password = (formData.get('password') as string)

  if (!email || !email.endsWith('@gmail.com') || !email.includes('.prabisha')) {
    return { success: false, message: 'Email must follow the format: yourname.prabisha@gmail.com' }
  }
  if (!name || name.length < 2) {
    return { success: false, message: 'Please enter a valid name' }
  }
  if (!departmentId) {
    return { success: false, message: 'Please select a department' }
  }
  if (!password || password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long' }
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { success: false, message: 'Email is already registered' }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Get the employee role from DB
    const employeeRole = await prisma.role.findUnique({ where: { name: 'Employee' } })
    if (!employeeRole) {
      return { success: false, message: 'Employee role not found. Contact admin.' }
    }

    // Send welcome email first
    await sendWelcomeEmail(email, name)

    console.log(departmentId , email )

    const department = await prisma.department.findUnique({
      where:{id : departmentId}
    })

    console.log(department , "deb check ")
    // After successful email send, create user in DB, connect role and department
    await prisma.user.create({
      data: {
        email,
        name,
        password: passwordHash,
        department: {
          connect: { id: departmentId },
        },
        role: {
          connect: { id: employeeRole.id },
        },
      },
    })

    // Redirect user to login page after successful creation

    // This return won't be reached if redirect works correctly, but keep for fallback
    return { success: true, message: 'Account created successfully! Please login.' }
  } catch (error: any) {
    console.error('Onboarding submit error:', error)
    return {
      success: false,
      message: error?.message || 'An error occurred during onboarding. Please try again.',
    }
  }
}
