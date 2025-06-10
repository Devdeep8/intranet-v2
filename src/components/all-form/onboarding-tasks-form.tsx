"use client";

import { useActionState } from "react";
import { createOnboardingTask } from "@/actions/onboarding-action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import SubmitBtn from "@/components/reauable-button-from/submitBtn";

type TaskFormErrors = {
  title?: string[];
  description?: string[];
  order?: string[];
  isMandatory?: string[];
  _form?: string[];
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  isMandatory: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type FormState = {
  success: boolean;
  errors: TaskFormErrors;
  task?: Task;
};

const initialState: FormState = {
  success: false,
  errors: {},
};

export function OnboardingTaskForm({onSuccess} : any) {
  const [state, formAction] = useActionState<FormState, FormData>(
    createOnboardingTask,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input name="title" id="title" />
        {Array.isArray(state.errors.title) && state.errors.title.length > 0 && (
          <p className="text-sm text-red-500">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" id="description" />
      </div>

      <div>
        <Label htmlFor="order">Order</Label>
        <Input name="order" id="order" type="number" />
        {Array.isArray(state.errors.order) && state.errors.order.length > 0 && (
          <p className="text-sm text-red-500">{state.errors.order[0]}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isMandatory" name="isMandatory" defaultChecked />
        <Label htmlFor="isMandatory">Is Mandatory</Label>
      </div>

      {Array.isArray(state.errors._form) && state.errors._form.length > 0 && (
        <p className="text-sm text-red-500">{state.errors._form[0]}</p>
      )}

      {state.success && (
        <p className="text-sm text-green-600">Task created successfully!</p>
      )}

      <SubmitBtn text="Create Task"/>
    </form>
  );
}
