import * as React from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeContext"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { themeBackground } = useTheme()

  const handleSidebarClose = () => {
    setMobileOpen(false)
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden ${themeBackground}`}>
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
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menüyü aç">
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 border-r">
              <Sidebar isMobile={true} onItemClick={handleSidebarClose} />
            </SheetContent>
          </Sheet>
        } />
        
        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 ${themeBackground}`}>
          <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>

        <footer className="shrink-0 border-t border-border/50 px-4 py-2 text-center text-xs text-muted-foreground sm:px-6">
          Ingilizce Derslerim · v2026.07.09
        </footer>
      </div>
    </div>
  )
}
