import * as React from "react"
import { ChevronDown, LayoutDashboard, Settings, User, UserCircle, TrendingUp } from "lucide-react"
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
  theme?: LevelTheme
}

// --- Navigation Data ---
const levelItems = [
  { title: "Pre-School", theme: "pre-school" as LevelTheme },
  { title: "Primary School", theme: "primary-school" as LevelTheme },
  { title: "Secondary School", theme: "secondary-school" as LevelTheme },
  { title: "High School", theme: "high-school" as LevelTheme },
  { title: "University", theme: "university" as LevelTheme },
  { title: "Business English", theme: "business-english" as LevelTheme },
]

// --- Theme Color Mapping ---
const levelColors: Record<LevelTheme, { bg: string; text: string }> = {
  "pre-school": { bg: "from-yellow-300 to-yellow-400", text: "text-amber-900" },
  "primary-school": { bg: "from-blue-300 to-blue-400", text: "text-blue-900" },
  "secondary-school": { bg: "from-orange-300 to-orange-400", text: "text-orange-900" },
  "high-school": { bg: "from-green-300 to-green-400", text: "text-green-900" },
  "university": { bg: "from-purple-300 to-purple-400", text: "text-purple-900" },
  "business-english": { bg: "from-gray-400 to-gray-500", text: "text-gray-900" },
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  ...levelItems.map(item => ({
    title: item.title,
    theme: item.theme,
    href: `/${item.theme}`,
  })),
  {
    title: "My Account",
    icon: User,
    items: [
      { title: "Profile", href: "/account/profile", icon: UserCircle },
      { title: "Progress", href: "/account/progress", icon: TrendingUp },
      { title: "Settings", icon: Settings, href: "/account/settings" },
    ],
  },
]

// --- Floating Button Item Component ---
const FloatingNavItem = ({ item, depth = 0, onLevelClick }: { item: NavItem; depth?: number; onLevelClick?: (theme: LevelTheme) => void }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [location] = useLocation();
  const isActive = item.href === location || (item.items && item.items.some(subItem => subItem.href === location));

  React.useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  const isLevelItem = item.theme && levelColors[item.theme];

  if (item.items) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between gap-2 px-4 py-3 rounded-xl font-medium text-sm",
              "transition-all duration-300 backdrop-blur-sm",
              "hover:shadow-lg hover:scale-105",
              isActive
                ? "bg-sidebar-primary/40 text-sidebar-primary-foreground shadow-lg border border-sidebar-primary/60"
                : "bg-sidebar-primary/10 text-sidebar-foreground border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40"
            )}
          >
            <div className="flex items-center gap-2 flex-1">
              {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
              <span className="truncate">{item.title}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300 flex-shrink-0",
                isOpen ? "rotate-180" : ""
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="mt-2 ml-4 flex flex-col gap-2 border-l-2 border-sidebar-primary/30 pl-2">
            {item.items.map((subItem, index) => (
              <FloatingNavItem key={index} item={subItem} depth={depth + 1} onLevelClick={onLevelClick} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  const handleClick = () => {
    if (item.theme && onLevelClick) {
      onLevelClick(item.theme);
    }
  }

  // Level items with theme colors
  if (isLevelItem) {
    const colors = levelColors[item.theme!];
    return (
      <Link href={item.href || "#"}>
        <a
          onClick={handleClick}
          className={cn(
            "flex w-full items-center justify-center px-4 py-4 rounded-xl font-bold text-sm",
            "transition-all duration-300 group",
            "hover:shadow-lg hover:scale-105 hover:-translate-y-0.5",
            `bg-gradient-to-r ${colors.bg} ${colors.text}`,
            "border-2 border-opacity-30 hover:border-opacity-60",
            isActive && "ring-2 ring-offset-2 ring-opacity-50"
          )}
        >
          <span className="truncate">{item.title}</span>
        </a>
      </Link>
    )
  }

  // Regular items with icons
  return (
    <Link href={item.href || "#"}>
      <a
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm",
          "transition-all duration-300 backdrop-blur-sm group",
          "hover:shadow-lg hover:scale-105 hover:-translate-y-0.5",
          isActive
            ? "bg-sidebar-primary/40 text-sidebar-primary-foreground shadow-lg border border-sidebar-primary/60"
            : "bg-sidebar-primary/10 text-sidebar-foreground border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40"
        )}
      >
        {item.icon && <item.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />}
        <span className="flex-1 truncate">{item.title}</span>
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
    <div className={`flex ${isMobile ? 'h-full' : 'h-screen'} w-full flex-col bg-gradient-to-b from-sidebar/90 via-sidebar/95 to-sidebar text-sidebar-foreground transition-colors duration-300 backdrop-blur-xl`}>
      {/* Logo Section */}
      <div className={`flex items-center justify-center border-b border-sidebar-primary/20 px-4 py-4 ${isMobile ? 'h-20' : 'h-32'} bg-gradient-to-b from-sidebar-accent/5 via-transparent to-transparent backdrop-blur-md`}>
        <img 
          src={logo} 
          alt="LinguaLearn Logo" 
          className="h-full w-auto object-contain transition-all duration-500 hover:scale-105 drop-shadow-lg" 
          style={{ filter: logoFilter }} 
        />
      </div>

      {/* Floating Navigation Buttons */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        <nav className="flex flex-col gap-2">
          {navItems.map((item, index) => (
            <React.Fragment key={index}>
              {index === 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-sidebar-primary/20 to-transparent my-2"></div>
              )}
              {index === navItems.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-sidebar-primary/20 to-transparent my-2"></div>
              )}
              <FloatingNavItem item={item} onLevelClick={handleLevelClick} />
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* User Profile Floating Card */}
      <div className="border-t border-sidebar-primary/20 p-3 sm:p-4 bg-gradient-to-t from-sidebar-accent/5 via-transparent to-transparent backdrop-blur-md">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm group hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 bg-sidebar-primary/10 border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm flex-shrink-0 group-hover:shadow-lg transition-all duration-300">
            JS
          </div>
          <div className="flex flex-col overflow-hidden min-w-0 flex-1 text-left">
            <span className="text-xs font-semibold truncate text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">John Student</span>
            <span className="text-[10px] text-sidebar-foreground/50 truncate group-hover:text-sidebar-foreground/70 transition-colors">Premium Plan</span>
          </div>
        </button>
      </div>
    </div>
  )
}
