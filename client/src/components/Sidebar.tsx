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
  const isLevelItem = !!levelItem && depth === 0;

  if (item.items) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-lg p-3 text-sm font-semibold transition-all duration-300",
              "hover:shadow-sm hover:bg-sidebar-accent/60",
              isActive 
                ? "bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 text-sidebar-primary-foreground shadow-md" 
                : "text-sidebar-foreground hover:translate-x-1",
              depth > 0 && "pl-[calc(theme(spacing.4)+var(--depth-offset))]",
              "group"
            )}
            style={{ "--depth-offset": `${depth * 12}px` } as React.CSSProperties}
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <div className={cn(
                  "p-2 rounded-md transition-all duration-300",
                  isActive ? "bg-sidebar-primary-foreground/20" : "bg-sidebar-primary/20 group-hover:bg-sidebar-primary/40"
                )}>
                  <item.icon className={cn("h-4 w-4 transition-transform duration-300", isOpen && "group-hover:rotate-180")} />
                </div>
              )}
              <span>{item.title}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300 group-hover:text-sidebar-primary",
                isOpen ? "rotate-180" : ""
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="mt-2 flex flex-col gap-2 ml-2 border-l-2 border-sidebar-primary/30 pl-2">
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
          "flex w-full items-center gap-3 rounded-lg p-3 text-sm font-semibold transition-all duration-300 group",
          isActive 
            ? "bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 text-sidebar-primary-foreground shadow-md" 
            : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:translate-x-1 hover:shadow-sm",
          depth > 0 && "pl-[calc(theme(spacing.4)+var(--depth-offset))]"
        )}
        style={{ "--depth-offset": `${depth * 12}px` } as React.CSSProperties}
      >
        {item.icon && (
          <div className={cn(
            "p-2 rounded-md transition-all duration-300 flex-shrink-0",
            isActive ? "bg-sidebar-primary-foreground/20" : "bg-sidebar-primary/20 group-hover:bg-sidebar-primary/40"
          )}>
            <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}
        <span className="flex-1">{item.title}</span>
        {isLevelItem && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-sidebar-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Theme
          </span>
        )}
      </a>
    </Link>
  )
}

interface SidebarProps {
  isMobile?: boolean
  onItemClick?: () => void
}

export function Sidebar({ isMobile = false, onItemClick }: SidebarProps) {
  const { currentTheme, setCurrentTheme } = useTheme()
  const logoFilter = themeFilters[currentTheme]

  const handleLevelClick = (theme: LevelTheme) => {
    setCurrentTheme(theme)
    onItemClick?.()
  }

  return (
    <div className={`flex ${isMobile ? 'h-full' : 'h-screen'} w-full flex-col bg-gradient-to-b from-sidebar to-sidebar/95 text-sidebar-foreground transition-colors duration-300`}>
      {/* Logo Section */}
      <div className={`flex items-center justify-center border-b border-sidebar-border/40 px-4 py-4 ${isMobile ? 'h-20' : 'h-32'} bg-gradient-to-b from-sidebar-accent/10 to-transparent`}>
        <img src={logo} alt="LinguaLearn Logo" className="h-full w-auto object-contain transition-all duration-500 hover:scale-105" style={{ filter: logoFilter }} />
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="flex flex-col gap-2">
          {navItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && index === 1 && (
                <div className="my-2 h-px bg-sidebar-primary/20"></div>
              )}
              {index > 0 && index === navItems.length - 1 && (
                <div className="my-2 h-px bg-sidebar-primary/20"></div>
              )}
              <SidebarItem item={item} onLevelClick={handleLevelClick} />
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="border-t border-sidebar-border/40 p-4 bg-gradient-to-t from-sidebar-accent/5 to-transparent">
        <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-sidebar-accent/60 to-sidebar-accent/30 p-3 hover:from-sidebar-accent/80 hover:to-sidebar-accent/50 transition-all duration-300 group cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm flex-shrink-0 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
            JS
          </div>
          <div className="flex flex-col overflow-hidden min-w-0 flex-1">
            <span className="text-xs font-semibold truncate text-sidebar-primary">John Student</span>
            <span className="text-[10px] text-sidebar-foreground/50 truncate group-hover:text-sidebar-foreground/70 transition-colors">Premium Plan</span>
          </div>
        </div>
      </div>
    </div>
  )
}
