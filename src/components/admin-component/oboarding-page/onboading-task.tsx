"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { OnboardingTaskForm } from "@/components/all-form/onboarding-tasks-form";

export default function OnboardingTasksPage() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          New Task
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg sm:w-full">
        <DialogHeader>
          <DialogTitle>Create Onboarding Task</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            ×
          </DialogClose>
        </DialogHeader>
        <OnboardingTaskForm />
      </DialogContent>
    </Dialog>
  );
}
