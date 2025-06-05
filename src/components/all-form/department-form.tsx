"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTransition, useState } from "react"
import { useFormStatus } from "react-dom"
import { createDepartmentAction } from "@/actions/department"
import { toast } from "sonner"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  )
}

type DepartmentFormProps = {
  users: { id: string; name: string }[]
  trigger?: React.ReactNode
  initialData?: {
    id: string
    name: string
    description?: string
    priority?: number
    headId?: string | null
  }
  onSubmit?: (formData: FormData) => Promise<void>
}

export function DepartmentDialog({
  users,
  trigger,
  initialData,
  onSubmit,
}: DepartmentFormProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const isEditing = !!initialData

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{isEditing ? "Edit Department" : "Add Department"}</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Department" : "Add Department"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the department details below."
              : "Fill in the department details below."}
          </DialogDescription>
        </DialogHeader>

        <form
          action={async (formData) => {
            startTransition(async () => {
              const handler = onSubmit || createDepartmentAction
              const result = await handler(formData)

              if ((result as any)?.success) {
                toast.success((result as any).message || "Success")
                setOpen(false)
              } else {
                toast.error((result as any).message || "Operation failed")
              }
            })
          }}
          className="space-y-4"
        >
          {isEditing && (
            <input type="hidden" name="id" value={initialData.id} />
          )}

          <div className="space-y-1">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={initialData?.name}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              defaultValue={initialData?.description || ""}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              name="priority"
              type="number"
              defaultValue={initialData?.priority ?? 99}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="headId">Department Head</Label>
            <Select
              name="headId"
              defaultValue={initialData?.headId ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
