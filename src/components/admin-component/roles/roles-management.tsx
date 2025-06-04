"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { createRoles } from "@/actions/rolesAction";
import { useRouter } from "next/navigation";
export default function Roles({ roles }: any) {
  const [open, setOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return toast.error("Role name is required");

    setIsSubmitting(true);
    try {
      const res = await createRoles( newRoleName)

      if (res?.success) {
        toast.success(`Role created successfully ${res?.role} `);
        setNewRoleName("");
        router.refresh()
        setOpen(false);
      } else {
        toast.error("Failed to create role");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Roles</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Enter role name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Role Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {roles ? (
              `${roles.length} Roles`
            ) : (
              <Skeleton className="h-6 w-24" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Roles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="w-[150px]">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-6"
                  >
                    No roles found.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role: any) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <Badge variant="default" className=" px-2 py-1">
                        {role.name}
                      </Badge>
                    </TableCell>
                    <TableCell>{role.users.length}</TableCell>
                    <TableCell className="flex flex-wrap gap-1">
                      {role.permissions.map((p: any) => (
                        <Badge
                          key={p.permission.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {p.permission.label}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      {new Date(role.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
