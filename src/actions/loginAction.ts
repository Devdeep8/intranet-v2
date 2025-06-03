'use server'

import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function authenticate(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  try {
  const res = await signIn('credentials', {
      redirect: false, // 🔥 prevent server-side redirect
      email: formData.get('email'),
      password: formData.get('password'),
      callbackUrl: '/auth/login', // 🔥
    })
    console.log(res, "res from login action")
    return {
      success: true,
      message: 'Login successful.',
    }
  } catch (error) {
    console.error(error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            message: 'Invalid credentials.',
          }
        default:
          return {
            success: false,
            message: 'Something went wrong.',
          }
      }
    }
    throw error
  }
}

export type AuthResult = {
  success: boolean
  message: string
}
