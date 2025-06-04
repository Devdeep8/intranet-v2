"use client";

import { DepartmentDialog } from "@/components/all-form/department-form";


export function SearchBar({ users }: any) {
  return (
    <div className="flex items-center px-4">
      <DepartmentDialog users={users} />

    </div>
  )
  
}
