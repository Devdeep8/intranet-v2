import SidebarWrapper from "@/components/server-sidebar/SidebarWrapper";
import { navLinks } from "@/components/server-sidebar/nav-links";
import { auth } from "@/lib/auth";



export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user  = session?.user

  if(!user ) return   
  return (
    <SidebarWrapper user={user}>
      {children}
    </SidebarWrapper>
  );
}
