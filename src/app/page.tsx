import {  buttonVariants } from "@/components/ui/button";
import { getRoleById } from "@/utils/getRole";
import { requireUser } from "@/utils/requireUser";
import Link from "next/link";

export default async function Home() {
  const user = await requireUser()
  console.log(user, "user from home page")
  const role = await getRoleById(user?.roleId as string)
  console.log(role, "role from home page")
  return (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-4xl font-bold mb-8">Welcome to the Intranet</h1>
    <Link className={buttonVariants({variant:"default",size:"lg"})} href={`dashboard`}>Get Started</Link>
  </div>
  );
}
