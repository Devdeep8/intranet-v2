"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Sun,
  Moon,
  Sunrise,
  Clock as ClockIcon,
} from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type GreetingBannerProps = {
  user: { name: string; email: string }
  streakCount?: number
}


export function GreetingBanner({
  user,
  streakCount = 0,
}: GreetingBannerProps) {
  const [greeting, setGreeting] = useState({ text: "", icon: null as React.ReactNode })
  const [time, setTime] = useState(new Date())

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12)
      return { text: "Good Morning", icon: <Sun className="w-5 h-5 text-yellow-500" /> }
    if (h < 17)
      return { text: "Good Afternoon", icon: <Sunrise className="w-5 h-5 text-orange-500" /> }
    return { text: "Good Evening", icon: <Moon className="w-5 h-5 text-indigo-500" /> }
  }

  useEffect(() => {
    setGreeting(getGreeting())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className={cn(
      "border-none shadow-lg transition-colors duration-1000",
      time.getHours() < 6 || time.getHours() > 18
        ? "bg-gradient-to-br from-indigo-900 to-black text-white"
        : "bg-gradient-to-br from-yellow-200 to-orange-100"
    )}>
      <CardContent className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Avatar & Greeting */}
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12"><AvatarFallback className="bg-blue-600 text-white text-lg">
            {user.name[0].toUpperCase()}
          </AvatarFallback></Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">{greeting.text}, {user.name}</h2>
              <Badge variant="secondary" className="px-2 py-1">{greeting.icon}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Widgets */}
        <div className="flex flex-col sm:flex-row gap-6">
         

      

          <Tooltip><TooltipTrigger asChild>
            <Badge variant="destructive" className="text-lg px-4 py-2 rounded-full">
              🔥 {streakCount}-day streak
            </Badge>
          </TooltipTrigger><TooltipContent>Keep your streak going!</TooltipContent></Tooltip>
        </div>

        {/* Time & Actions */}
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-2 font-mono text-lg">
            <ClockIcon className="w-5 h-5" /> {time.toLocaleTimeString()}
          </div>
    
        </div>
      </CardContent>
    </Card>
  )
}
