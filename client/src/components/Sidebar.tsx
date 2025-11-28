import * as React from "react"
import { ChevronRight, ChevronDown, BookOpen, GraduationCap, Globe, LayoutDashboard, Settings, User, FileText, Headphones, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import logo from "@assets/logo1_1764347479542.png"
import { Link, useLocation } from "wouter"
import { useTheme, type LevelTheme, themeFilters } from "@/context/ThemeContext"

// --- Types ---
type NavItem = {
  title: string
  icon?: React.ElementType
  href?: string
  items?: NavItem[]
}

// --- Navigation Data ---
const levelItems = [
  { title: "Pre-School", icon: BookOpen, theme: "pre-school" as LevelTheme },
  { title: "Primary School", icon: BookOpen, theme: "primary-school" as LevelTheme },
  { title: "Secondary School", icon: BookOpen, theme: "secondary-school" as LevelTheme },
  { title: "High School", icon: GraduationCap, theme: "high-school" as LevelTheme },
  { title: "University", icon: GraduationCap, theme: "university" as LevelTheme },
  { title: "Business English", icon: Globe, theme: "business-english" as LevelTheme },
]

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  ...levelItems.map(item => ({
    title: item.title,
    icon: item.icon,
    href: `/${item.theme}`,
  })),
  {
    title: "My Account",
    icon: User,
    items: [
      { title: "Profile", href: "/account/profile" },
      { title: "Progress", href: "/account/progress" },
      { title: "Settings", icon: Settings, href: "/account/settings" },
    ],
  },
]

// --- Recursive Sidebar Item Component ---
const SidebarItem = ({ item, depth = 0, onLevelClick }: { item: NavItem; depth?: number; onLevelClick?: (theme: LevelTheme) => void }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [location] = useLocation();
  const isActive = item.href === location || (item.items && item.items.some(subItem => subItem.href === location));

  // Auto-expand if child is active
  React.useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  // Check if this is a level item
  const levelItem = levelItems.find(l => item.title === l.title);

  if (item.items) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-md p-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive && "text-sidebar-primary-foreground",
              depth > 0 && "pl-[calc(theme(spacing.4)+var(--depth-offset))]"
            )}
            style={{ "--depth-offset": `${depth * 12}px` } as React.CSSProperties}
          >
            <div className="flex items-center gap-2">
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.title}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen ? "rotate-180" : ""
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="mt-1 flex flex-col gap-1">
            {item.items.map((subItem, index) => (
              <SidebarItem key={index} item={subItem} depth={depth + 1} onLevelClick={onLevelClick} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  const handleClick = () => {
    if (levelItem && onLevelClick) {
      onLevelClick(levelItem.theme);
    }
  }

  return (
    <Link href={item.href || "#"}>
      <a
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground",
          depth > 0 && "pl-[calc(theme(spacing.4)+var(--depth-offset))]"
        )}
        style={{ "--depth-offset": `${depth * 12}px` } as React.CSSProperties}
      >
        {item.icon && <item.icon className="h-4 w-4" />}
        <span>{item.title}</span>
      </a>
    </Link>
  )
}

export function Sidebar() {
  const { currentTheme, setCurrentTheme } = useTheme()
  const logoFilter = themeFilters[currentTheme]

  const handleLevelClick = (theme: LevelTheme) => {
    setCurrentTheme(theme)
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-colors duration-300">
      <div className="flex h-32 items-center justify-center border-b border-sidebar-border px-4 py-4">
        <img src={logo} alt="LinguaLearn Logo" className="h-full w-auto object-contain transition-all duration-500" style={{ filter: logoFilter }} />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item, index) => (
            <SidebarItem key={index} item={item} onLevelClick={handleLevelClick} />
          ))}
        </nav>
      </div>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-md bg-sidebar-accent/50 p-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold">
            JS
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-medium truncate">John Student</span>
            <span className="text-[10px] text-sidebar-foreground/60 truncate">Premium Plan</span>
          </div>
        </div>
      </div>
    </div>
  )
}
