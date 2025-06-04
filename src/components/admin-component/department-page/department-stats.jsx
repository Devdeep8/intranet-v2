import { Card, CardContent, CardTitle , CardHeader} from "@/components/ui/card"
import {
  Users,
  Paintbrush,
  Code,
  Megaphone
} from "lucide-react"

export default function Stats() {
  const departments = [
    {
      title: "HR Department",
      value: 120,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Design Department",
      value: 38,
      icon: <Paintbrush className="h-6 w-6 text-pink-500" />,
      color: "bg-pink-100",
    },
    {
      title: "Development Department",
      value: 5,
      icon: <Code className="h-6 w-6 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Marketing Department",
      value: 12,
      icon: <Megaphone className="h-6 w-6 text-yellow-600" />,
      color: "bg-yellow-100",
    },
  ]

  return (
    
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {departments.map((dept , index) => (
            <Card key={index} className="w-full">
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {dept.title}
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{dept.value}</div>
                  <p className='text-muted-foreground text-xs'>
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
        ))}
      </div>
  )
}
