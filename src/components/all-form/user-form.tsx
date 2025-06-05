"use client";

import { useState, useTransition } from "react";
import { Role, User } from "@prisma/client";
import { createUser, updateUser } from "@/actions/user"
import { toast } from "sonner";
type UserFormProps = {
  roles: Role[];
  user?: User & { role: Role | null };
  onSave: (user: User & { role: Role | null }) => void;
};

export default function UserForm({ roles, user, onSave }: UserFormProps) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(user?.roleId || "");

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        let savedUser;
        if (user) {
          savedUser = await updateUser(user.id, {
            name,
            email,
            password,
            roleId,
          });
          toast.success("User updated");
        } else {
          savedUser = await createUser({
            name,
            email,
            password,
            roleId,
          });
          toast.success("User created");
        }

        onSave(savedUser);
        setName("");
        setEmail("");
        setPassword("");
        setRoleId("");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block font-medium">Name</label>
        <input
          className="border px-3 py-2 rounded w-full"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <input
          type="email"
          className="border px-3 py-2 rounded w-full"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium">
          {user ? "New Password (optional)" : "Password"}
        </label>
        <input
          type="password"
          className="border px-3 py-2 rounded w-full"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required={!user}
        />
      </div>

      <div>
        <label className="block font-medium">Role</label>
        <select
          className="border px-3 py-2 rounded w-full"
          value={roleId}
          onChange={e => setRoleId(e.target.value)}
          required
        >
          <option value="">Select a role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {user ? "Update User" : "Create User"}
      </button>
    </form>
  );
}
