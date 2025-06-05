"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { PlusCircle } from "lucide-react"
import { createPermissions } from "@/actions/permission-action"
import { useRouter } from "next/navigation"
export default function Permissions_Table({ permissions }: { permissions: any[] }) {
  const [open, setOpen] = useState(false)
  const [newPermission, setNewPermission] = useState({ name: "", label: "" })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const handleCreatePermission = async () => {
    const { name, label } = newPermission
    if (!name.trim() || !label.trim()) return toast.error("Name and label are required")

    try {
      const payload  = {
       name,
       label
      } 
      const res = await createPermissions(payload)
      if (res?.success) {
        toast.success("Permission created successfully")
        router.refresh()
        setNewPermission({ name: "", label: "" })
        setOpen(false)
      } else {
        toast.error("Failed to create permission")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Permissions</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Create Permission</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Permission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="perm-name">Name</Label>
                <Input
                  id="perm-name"
                  value={newPermission.name}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., manage_users"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="perm-label">Label</Label>
                <Input
                  id="perm-label"
                  value={newPermission.label}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Manage Users"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreatePermission}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? <Skeleton className="h-6 w-20" /> : `${permissions.length} permissions`}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Permissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Assigned Roles</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ) : permissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No permissions found.
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((permission: any) => (
                  <TableRow key={permission.id}>
                    <TableCell>{permission.name}</TableCell>
                    <TableCell>{permission.label}</TableCell>
                    <TableCell>{permission.roles?.length || 0}</TableCell>
                    <TableCell>{new Date(permission.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
