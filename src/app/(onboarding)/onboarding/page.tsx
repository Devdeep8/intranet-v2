import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CompleteOnboardingForm from "@/components/all-form/complete-form";
import TaskList from "./task-list";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const userId = session.user.user_id;

  // Fetch onboarding tasks assigned to this user
  const tasks = await prisma.userOnboardingTask.findMany({
    where: { userId },
    include: { onboardingTask: true },
    orderBy: { onboardingTask: { order: "asc" } }
  });

  const allCompleted = tasks.length > 0 && tasks.every((t: { status: string; }) => t.status === "COMPLETED");

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Complete your Onboarding</h1>

      <TaskList tasks={tasks} />

      {allCompleted && <CompleteOnboardingForm userId={userId} />}
    </div>
  );
}
