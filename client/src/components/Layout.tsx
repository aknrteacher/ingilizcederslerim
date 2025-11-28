import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-secondary/30 p-8">
          <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
