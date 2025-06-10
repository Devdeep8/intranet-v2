// app/teams/page.tsx or wherever your route lives
import { requireUser } from "@/utils/requireUser";
import { use } from "react";
import { Badge } from "@/components/ui/badge";

interface User {
  role: any;
  id: string;
  name: string;
  email: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
}

interface TeamData {
  department: Department;
  coworkers: User[];
}

// Fetch function (must be declared outside the component)
async function fetchTeamData(): Promise<TeamData> {
  const user = await requireUser();
  const userId = user?.user_id;

  // Get base URL from request context
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // fallback
  const res = await fetch(`${baseUrl}/api/teams?userId=${userId}`, {
    cache: "no-store",
  });

  const data = await res.json();
  console.log("Fetched team data:", data);
  if (!res.ok) {
    throw new Error("Failed to fetch team data");
  }

  return data;
}

// Server Component
export default function Teams() {
  const data = use(fetchTeamData());

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Teams Page</h1>

      <h2 className="text-lg font-semibold mb-2">
        Department: {data.department.name}
      </h2>

      <ul className="w-full max-w-md space-y-2">
        {data.coworkers.map((user) => (
          <li key={user.id} className="p-3 border rounded shadow-sm">
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>

            {user?.role?.name && (
              <Badge className="mt-1 w-fit">{user.role.name}</Badge>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
