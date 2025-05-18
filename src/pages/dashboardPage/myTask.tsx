"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { AnimatedList } from "@/components/magicui/animated-list"
import { Clock, Check, AlertCircle } from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreateTaskDialog } from "./taskDialog"
import { Project, team } from "./dashboard"
import { Task } from "@prisma/client"
import { markTaskAsDone } from "@/actions/taskAction"
import { toast } from "sonner"

export default function MyTask({
  Project,
  team,
  task,
}: {
  Project: Project[]
  team: team[]
  task: Task[]
}) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const sorted = task
      .filter(
        (t) =>
          (t.status === "PENDING" || t.status === "IN_PROGRESS") && t.dueDate !== null
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )

    setTasks(sorted)
  }, [task])

  async function handleMarkAsDone(taskId: string) {
    try {
      // Call the server function to update status
      const res = await markTaskAsDone(taskId)
      console.log(res)
      if (res?.success){
        toast.success("Task Marked Complete")
          setTasks((prev) => prev.filter((task) => task.id !== taskId))
      }
      // Update local state to remove the completed task from UI
    } catch (error) {
      console.error(error)
      alert("Failed to mark task as done. Please try again.")
    }
  }

  return (
    <div className="w-full lg:w-1/3">
      <Card>
        <div className="flex justify-between px-4 py-2">
          <CardTitle className="px-4 pt-4 font-bold text-xl">Today's Tasks</CardTitle>
          <CreateTaskDialog Project={Project} team={team} />
        </div>
        <CardContent className="h-[500px] overflow-hidden">
          {tasks.length === 0 ? (
            <p className="text-muted-foreground pt-4">No pending tasks.</p>
          ) : (
            <AnimatedList>
              {tasks.map((task) => (
                <figure
                  key={task.id}
                  className={cn(
                    "relative w-full max-w-[400px] mx-auto cursor-pointer overflow-hidden rounded-2xl p-4",
                    "transition-all duration-200 ease-in-out hover:scale-[103%]",
                    "bg-white shadow-sm border dark:bg-zinc-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-muted">
                      {task.status === "PENDING" ? (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      ) : task.status === "IN_PROGRESS" ? (
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex flex-col overflow-hidden flex-1">
                      <figcaption className="flex items-center gap-2 text-sm sm:text-base font-medium dark:text-white">
                        {task.title}
                      </figcaption>
                      {task.dueDate && (
                        <span className="text-xs text-gray-500">
                          · {format(new Date(task.dueDate), "PPP p")}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleMarkAsDone(task.id)}
                    >
                      Mark as Done
                    </Button>
                  </div>
                </figure>
              ))}
            </AnimatedList>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
