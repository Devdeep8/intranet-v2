"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Info, ListChecks } from "lucide-react";

interface ProjectDepartmentProps {
  projects: any[]; // Temporarily using any for flexibility during development
}

export function ProjectDepartment({ projects }: ProjectDepartmentProps) {
    console.log("Projects in ProjectDepartment:", projects);
    if (!Array.isArray(projects) || projects.length === 0) {
    return <p>No projects available.</p>;
  }

  return (
   <div className="space-y-6">
  <h1 className="text-2xl font-bold flex items-center gap-2">
    <Briefcase className="w-6 h-6 text-primary" />
    Projects by Department
  </h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {projects.map((project) => (
      <Card key={project.id} className="hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-muted-foreground" />
            {project.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <Separator />
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-1 text-muted-foreground" />
            <span>{project.description || "No description provided."}</span>
          </div>

          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-xs">
              Status: {project.status}
            </Badge>
            {project.billable && (
              <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                Billable
              </Badge>
            )}
          </div>

          {/* Project Manager */}
          {project.createdBy?.name && (
            <div className="text-xs text-muted-foreground pt-2">
              <span className="font-semibold text-gray-800">Project Manager:</span>{" "}
              {project.createdBy.name}
            </div>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
</div>
  );
}

export default ProjectDepartment;
