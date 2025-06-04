"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"

export function DeleteDepartmentDialog({
  departmentName,
  onConfirm,
  children,
}: {
  departmentName: string
  onConfirm: () => void
  children: React.ReactNode
}) {
  const [inputValue, setInputValue] = useState("")

  const isMatch = inputValue === departmentName

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Delete Department
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{departmentName}</strong> and all associated records (employees, tickets, etc).
            <br />
            To confirm, type: <strong>{departmentName}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          placeholder="Type department name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!isMatch}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
