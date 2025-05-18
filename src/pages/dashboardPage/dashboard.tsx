import { auth } from "@/lib/auth";
import { GreetingBanner } from "./GreetingBanner";
import MyTask from "./myTask";
import { ProjectDeadlineCard } from "./ProjectDeadlineCard";
import { Task } from "@prisma/client";

export type Project = {
  id: string
  name: string
  endDate: string | null
  department: { name: string }
}
export type team = {
    id: string,
    name : string
}
export default async function Dashboard({projects , team , task} : {projects : Project[] , team : team[] , task : Task[]} ) {
    const session = await auth()
    if(!session?.user) return null


  return (
      <div>
        <div className=" mb-4">
        <GreetingBanner user={session?.user}/>

        </div>
      <div className="flex gap-4">
      <MyTask Project={projects} team = {team}  task= {task}/>
      <ProjectDeadlineCard projects={projects}/>
      </div>
    </div>
  );
}