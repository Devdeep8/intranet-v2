"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { PlusCircle, CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createProject } from "@/actions/getProject" // You must define this
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"
import SubmitBtn from "@/components/reauable-button-from/submitBtn"

export function CreateProjectDialog() {
    const {data :session} = useSession()
  const [open, setOpen] = useState(false)
  const [endDate, setEndDate] = useState<Date>()
  const formRef = useRef<HTMLFormElement>(null)



  if(!session || !session?.user  ){
    return null
  }
  const mockDepartments = [
    { id: "dep1", name: "Engineering" },
    { id: "dep2", name: "Marketing" },
  ]

  const handleSubmit = async (formData: FormData) => {
    if (!endDate) {
      toast.error("Please select an end date")
      return
    }

    formData.set("endDate", endDate.toISOString())
    formData.set("departmentId", session?.user?.departmentId.toString())
    formData.set("projectManagerId", session?.user?.user_id.toString())
    try {
      const result = await createProject( {}, formData)
      if (result.success) {
        toast.success("Project created!")
        setEndDate(undefined)
        setOpen(false)
        formRef.current?.reset()
      } else {
        toast.error(result.error || "Failed to create project")
      }
    } catch (error) {
      toast.error("Unexpected error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="w-4 h-4 mr-1" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" name="name" required />
          </div>
         
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left", !endDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
         <SubmitBtn text="Create Project" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
