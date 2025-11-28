import { Bell, Search, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as React from "react"

interface HeaderProps {
  mobileMenuTrigger?: React.ReactNode
}

export function Header({ mobileMenuTrigger }: HeaderProps) {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {mobileMenuTrigger && (
          <div className="md:hidden">
            {mobileMenuTrigger}
          </div>
        )}
        <h2 className="text-sm sm:text-lg font-semibold text-foreground/80 hidden sm:block">
          Welcome back, John
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden lg:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search lessons..."
            className="h-9 w-48 sm:w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute top-1 right-1 sm:top-2 sm:right-2 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hidden sm:inline-flex">
          <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </header>
  )
}
