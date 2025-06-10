"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { OnboardingTaskForm } from "@/components/all-form/onboarding-tasks-form";
import { getOnboardingTasks, updateTaskOrder } from "@/actions/onboarding-action";
import { Button } from "@/components/ui/button";

// Define Task type
interface Task {
  id: string;
  order: number;
  title: string;
  description?: string;
  isMandatory?: boolean;
}

export default function OnboardingTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getOnboardingTasks();
      setTasks(data as any);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetTask: Task) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.id === targetTask.id) {
      setDraggedTask(null);
      return;
    }

    const draggedIndex = tasks.findIndex(task => task.id === draggedTask.id);
    const targetIndex = tasks.findIndex(task => task.id === targetTask.id);

    // Create new array with reordered tasks
    const newTasks = [...tasks];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    // Update order values based on new positions
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index + 1
    }));

    setTasks(updatedTasks);

    try {
      // Update database with new order
      await updateTaskOrder(updatedTasks.map(task => ({
        id: task.id,
        order: task.order
      })));
    } catch (error) {
      console.error('Error updating task order:', error);
      // Revert to original order on error
      await fetchTasks();
    }

    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Onboarding Tasks</h1>
        </div>
        <div className="text-center py-8">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Onboarding Tasks</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="px-4 py-2">
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg sm:w-full">
            <DialogHeader>
              <DialogTitle>Create Onboarding Task</DialogTitle>
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                ×
              </DialogClose>
            </DialogHeader>
            <OnboardingTaskForm onSuccess={fetchTasks} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No onboarding tasks found. Create your first task!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task)}
              onDragEnd={handleDragEnd}
              className={`p-4 bg-white border rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow ${
                draggedTask?.id === task.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-500 font-mono">
                      #{task.order}
                    </span>
                    <h3 className="font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    {task.isMandatory && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        Mandatory
                      </span>
                    )}
                  </div>
                  
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
