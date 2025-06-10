"use client";

import { useState, useTransition } from "react";
import { completeOnboarding } from "@/actions/onboarding-action";
import { Button } from "@/components/ui/button";

export default function CompleteOnboardingForm({ userId }: { userId: string }) {
  const [role, setRole] = useState("Employee");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(() => completeOnboarding(userId, role));
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Choose your role</h2>
      <select
        className="border px-3 py-2 rounded w-full"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="Employee">Employee</option>
        <option value="Intern">Intern</option>
      </select>

      <Button onClick={handleSubmit} disabled={isPending}>
        Complete Onboarding
      </Button>
    </div>
  );
}
