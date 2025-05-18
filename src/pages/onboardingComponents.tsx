'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { toast } from 'sonner'
import SubmitBtn from '@/components/reauable-button-from/submitBtn'
import { Input } from '@/components/ui/input'
import { Department } from '@/types/types'
import { handleOnboardingSubmit } from '@/actions/onboarding'
import { Label } from '@/components/ui/label'
import { Card, CardHeader , CardTitle , CardContent} from '@/components/ui/card'
import { Select , SelectTrigger ,SelectValue , SelectContent, SelectItem} from '@/components/ui/select'
import { redirect } from 'next/navigation'

interface OnBoardingClientProps {
  departments: Department[]
}

export default function OnBoardingClient({ departments }: OnBoardingClientProps) {
  const [state, formAction] = useActionState(handleOnboardingSubmit, {
    message: '',
    success: false || true,
  })

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
        redirect('/auth/login')
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  return (
    <div className="container flex flex-col justify-center items-center h-screen mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6">🧭 Onboarding</h1>

      <form action={formAction}  className="w-full max-w-xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>✅ Submit Your Official Email, Name, Department & Password</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">

            <div>
              <Label htmlFor="email">Official Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="yourname.prabisha@gmail.com"
                className="focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your full name"
                className="focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Select name="department" required>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Create a password"
                className="focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
          </CardContent>
        </Card>

        <SubmitBtn text="Submit" />
      </form>
    </div>
  )
}
