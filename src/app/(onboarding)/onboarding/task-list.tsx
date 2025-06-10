"use client";

import { useTransition } from "react";
import { markTaskComplete } from "@/actions/onboarding-action";
import { Button } from "@/components/ui/button";

export default function TaskList({ tasks }: { tasks: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = (taskId: string) => {
    startTransition(() => markTaskComplete(taskId));
  };

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="border p-4 rounded shadow-sm">
          <h2 className="font-medium">{task.onboardingTask.title}</h2>
          <p className="text-sm truncate text-muted-foreground">
            {task.onboardingTask.description || "No description"}
          </p>
          {task.status === "COMPLETED" ? (
            <span className="text-green-600 text-sm">✔ Completed</span>
          ) : (
            <Button
              size="sm"
              onClick={() => handleComplete(task.id)}
              disabled={isPending}
            >
              Mark as Done
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
