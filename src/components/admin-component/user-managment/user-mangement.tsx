"use client";

import { useState } from "react";
import { Role, User } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import UserForm from "@/components/all-form/user-form";
import { deleteUser } from "@/actions/user";

type UserWithRole = User & { role: Role | null };

type Props = {
  roles: Role[];
  users: UserWithRole[];
};

export default function UserPage({ roles, users: initialUsers }: Props) {
  const [users, setUsers] = useState<UserWithRole[]>(initialUsers);
  const [editing, setEditing] = useState<UserWithRole | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteUser(id); // You can convert to server action too
      if (res) {
        setUsers(prev => prev.filter(user => user.id !== id));
        toast.success("User deleted");
      } else throw new Error();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleSave = (user: UserWithRole) => {
    setUsers(prev =>
      prev.some(u => u.id === user.id)
        ? prev.map(u => (u.id === user.id ? user : u))
        : [...prev, user]
    );
    setEditing(null);
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold">User Management</h2>

      <Card>
        <CardContent className="p-6">
          <UserForm roles={roles} onSave={handleSave} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role?.name ?? "N/A"}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" onClick={() => setEditing(user)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(user.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editing && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Edit User</h3>
            <UserForm user={editing} roles={roles} onSave={handleSave} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
