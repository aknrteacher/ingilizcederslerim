import * as React from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleSidebarClose = () => {
    setMobileOpen(false)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 flex-col flex-shrink-0">
        <Sidebar isMobile={false} />
      </div>

      {/* Mobile and Desktop Content */}
      <div className="flex flex-col flex-1 overflow-hidden md:flex">
        {/* Header with Mobile Menu */}
        <Header mobileMenuTrigger={
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 border-r">
              <Sidebar isMobile={true} onItemClick={handleSidebarClose} />
            </SheetContent>
          </Sheet>
        } />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-secondary/30 p-4 sm:p-6 md:p-8">
          <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
