import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  // This is a placeholder for the dashboard page
  const session = await auth()
  console.log("Session:", session);
  // You can fetch any necessary data here and pass it to your components
  return (
    <div className="">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard! Here you can manage your tasks, view analytics, and more.</p>
      {/* Add your dashboard components here */}
    </div>
  );
}