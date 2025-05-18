"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"

import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { createTask } from "@/actions/taskAction"
import SubmitBtn from "@/components/reauable-button-from/submitBtn"
import { Project, team } from "./dashboard"

const mockUsers = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
]

export function CreateTaskDialog({Project , team} : {Project : Project[] , team : team[]}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [date, setDate] = useState<Date>()
    const [open, setOpen] = useState(false)

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (date) {
      formData.set("dueDate", date.toISOString())
    } else {
      toast.error("Please select a due date")
      return
    }

    try {
      const result = await createTask({}, formData)
      if (result.success) {
        formRef.current?.reset()
        setDate(undefined)
        toast.success("Task created successfully!")
           setOpen(false)
      } else {
        toast.error(result.error || "Failed to create task")
      }
    } catch (error) {
      toast.error("Unexpected error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Plus className="w-4 h-4 mr-1" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
        >
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm font-semibold">
              Title
            </Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dueDate" className="text-sm font-semibold">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea id="description" name="description" required rows={3} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="status" className="text-sm font-semibold">
              Status
            </Label>
            <Select name="status" defaultValue="PENDING">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="priority" className="text-sm font-semibold">
              Priority
            </Label>
            <Select name="priority" defaultValue="MEDIUM">
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="assigneeId" className="text-sm font-semibold">
              Assignee
            </Label>
            <Select name="assigneeId">
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {team.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="projectId" className="text-sm font-semibold">
              Project
            </Label>
            <Select name="projectId">
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {Project.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="sm:col-span-2 pt-4">
           <SubmitBtn text="Create task" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
