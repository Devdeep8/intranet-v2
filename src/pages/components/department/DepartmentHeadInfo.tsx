// components/department/DepartmentHeadInfo.tsx
import MailLink from "@/components/common/MailLink"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type DepartmentHeadInfoProps = {
  head: {
    id: string
    name: string
    email: string
  }
}

export default function DepartmentHeadInfo({ head }: DepartmentHeadInfoProps) {
  return (
    <Card className="w-sm">
      <CardHeader>
        <CardTitle>Department Head</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Name</span>
          <span className="text-sm text-foreground">{head.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Email</span>
         <MailLink email={head.email} className="text-sm text-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
