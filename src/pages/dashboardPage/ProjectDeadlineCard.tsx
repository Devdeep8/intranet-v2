"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNowStrict } from "date-fns"
import { CalendarClock, FolderKanban, Building, Clock9 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateProjectDialog } from "./CreateProjectDialog"
import { Project } from "./dashboard"
import { AnimatedList, AnimatedListItem } from "@/components/magicui/animated-list"  // import your animated list

export function ProjectDeadlineCard({ projects }: { projects: Project[] }) {
  const [sortedProjects, setSortedProjects] = useState<Project[]>([])

  useEffect(() => {
    const sorted = [...projects]
      .filter((p) => p.endDate)
      .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())
    setSortedProjects(sorted.slice(0, 5))
  }, [projects])

  if (projects.length === 0) {
    return <p className="text-muted-foreground">No project in the department</p>
  }

  return (
    <Card className="shadow-md w-full max-w-2xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CalendarClock className="w-5 h-5" />
          Projects Near Deadline
        </CardTitle>
        <CreateProjectDialog />
      </CardHeader>

      <CardContent className="space-y-4">
        <AnimatedList delay={500} className="w-full flex-col">
          {sortedProjects.map((project) => (
            <AnimatedListItem key={project.id}>
              <div className="flex items-center justify-between p-3 rounded-lg transition">
                <div className="flex items-start gap-3">
                  <FolderKanban className="w-5 h-5 mt-1" />
                  <div>
                    <p className="font-semibold">{project.name}</p>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building className="w-3.5 h-3.5" />
                      {project.department.name}
                    </div>
                  </div>
                </div>
                <Badge className="font-medium flex items-center gap-1">
                  <Clock9 className="w-4 h-4" />
                  {formatDistanceToNowStrict(new Date(project.endDate!), {
                    addSuffix: true,
                  })}
                </Badge>
              </div>
            </AnimatedListItem>
          ))}
        </AnimatedList>

        {sortedProjects.length === 0 && (
          <p className="text-muted-foreground text-sm">No upcoming project deadlines.</p>
        )}
      </CardContent>
    </Card>
  )
}
