import { Bell, Search, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground/80 hidden md:block">
          Welcome back, John
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search lessons..."
            className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
