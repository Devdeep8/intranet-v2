'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'
import { toast } from 'sonner'
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SubmitBtn from "@/components/reauable-button-from/submitBtn"
import { authenticate, AuthResult } from '@/actions/loginAction'
import { redirect } from 'next/navigation'

interface LoginFormProps extends React.ComponentPropsWithoutRef<'form'> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [state, formAction] = useActionState<AuthResult, FormData>(
    authenticate,
    { success: false, message: '' }
  )
  console.log(state)

  useEffect(() => {
    if (!state?.message) return

    console.log(state , "work")
    if (state.success) {
      toast.success(state.message)
     redirect('/dashboard')
    } else {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form
      action={formAction}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email & password below
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>

        <SubmitBtn text="Sign in" />
      </div>
    </form>
  )
}
