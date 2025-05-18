import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
export default async function Page() {
    const session  = await auth()
  return (
    <div>
      <h1>Dashboard</h1>
      <p>{session?.user.email}</p>
      <button type="submit"  >Sign Out</button>
      </div>
  )
}