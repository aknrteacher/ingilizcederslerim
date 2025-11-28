import * as React from "react"
import { ChevronDown, ChevronLeft, LayoutDashboard, Settings, User, UserCircle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
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
  { 
    title: "Okul Öncesi & 1. Sınıf", 
    theme: "pre-school" as LevelTheme,
    items: [
      { title: "Oyunlar", href: "/pre-school/games" },
      { title: "Şarkılar", href: "/pre-school/songs" },
      { title: "Hikayeler", href: "/pre-school/stories" },
      { title: "El İşi", href: "/pre-school/crafts" },
    ]
  },
  { 
    title: "İlkokul", 
    theme: "primary-school" as LevelTheme,
    items: [
      { title: "2. Sınıf", href: "/primary-school/grade-2" },
      { title: "3. Sınıf", href: "/primary-school/grade-3" },
      { title: "4. Sınıf", href: "/primary-school/grade-4" },
    ]
  },
  { title: "Ortaokul", theme: "secondary-school" as LevelTheme },
  { title: "Lise", theme: "high-school" as LevelTheme },
  { title: "Üniversite", theme: "university" as LevelTheme },
  { title: "İş İngilizcesi", theme: "business-english" as LevelTheme },
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
    title: "Kontrol Paneli",
    href: "/",
    icon: LayoutDashboard,
  },
  ...levelItems.map(item => ({
    title: item.title,
    theme: item.theme,
    href: item.items ? undefined : `/${item.theme}`,
    items: item.items,
  })),
  {
    title: "Hesabım",
    icon: User,
    items: [
      { title: "Profil", href: "/account/profile", icon: UserCircle },
      { title: "İlerleme", href: "/account/progress", icon: TrendingUp },
      { title: "Ayarlar", icon: Settings, href: "/account/settings" },
    ],
  },
]

interface SidebarProps {
  isMobile?: boolean
  onItemClick?: () => void
}

export function Sidebar({ isMobile = false, onItemClick }: SidebarProps) {
  const { currentTheme, setCurrentTheme } = useTheme()
  const logoFilter = themeFilters[currentTheme]
  const [location] = useLocation()
  const [activeSubmenu, setActiveSubmenu] = React.useState<string | null>(null)
  const [submenuTitle, setSubmenuTitle] = React.useState<string>("")
  const [submenuItems, setSubmenuItems] = React.useState<NavItem[]>([])

  const [activeSubmenuTheme, setActiveSubmenuTheme] = React.useState<LevelTheme | null>(null)

  const handleLevelClick = (theme: LevelTheme) => {
    setCurrentTheme(theme)
    onItemClick?.()
  }

  const handleOpenSubmenu = (item: NavItem) => {
    if (item.items && item.items.length > 0) {
      setActiveSubmenu(item.title)
      setSubmenuTitle(item.title)
      setSubmenuItems(item.items)
      if (item.theme) {
        setActiveSubmenuTheme(item.theme)
      }
    }
  }

  const handleBackToMain = () => {
    setActiveSubmenu(null)
    setSubmenuTitle("")
    setSubmenuItems([])
    setActiveSubmenuTheme(null)
  }

  const handleSubmenuItemClick = (item: NavItem) => {
    if (item.theme) {
      handleLevelClick(item.theme)
    }
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

      {/* Sliding Navigation */}
      <div className="flex-1 overflow-hidden p-3 sm:p-4">
        <div className="relative w-full h-full">
          {/* Main Menu */}
          <div className={cn(
            "absolute inset-0 transition-all duration-500 ease-out",
            activeSubmenu ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
          )}>
            <nav className="flex flex-col gap-2 h-full overflow-y-auto">
              {navItems.map((item, index) => (
                <React.Fragment key={index}>
                  {index === 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-sidebar-primary/20 to-transparent my-2"></div>
                  )}
                  {index === navItems.length - 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-sidebar-primary/20 to-transparent my-2"></div>
                  )}
                  
                  {item.href ? (
                    <Link href={item.href}>
                      <a className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm",
                        "transition-all duration-300 backdrop-blur-sm group",
                        "hover:shadow-lg hover:scale-105 hover:-translate-y-0.5",
                        location === item.href
                          ? "bg-sidebar-primary/40 text-sidebar-primary-foreground shadow-lg border border-sidebar-primary/60"
                          : "bg-sidebar-primary/10 text-sidebar-foreground border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40"
                      )}>
                        {item.icon && <item.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />}
                        <span className="flex-1 truncate">{item.title}</span>
                      </a>
                    </Link>
                  ) : item.theme ? (
                    // Level item with submenu
                    <button
                      onClick={() => handleOpenSubmenu(item)}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-4 rounded-xl font-bold text-sm",
                        "transition-all duration-300 group",
                        `bg-gradient-to-r ${levelColors[item.theme].bg} ${levelColors[item.theme].text}`,
                        "border-2 border-opacity-30 hover:border-opacity-60",
                        "hover:shadow-lg hover:scale-105 hover:-translate-y-0.5",
                        item.items && item.items.length > 0 && "cursor-pointer"
                      )}
                    >
                      <span className="truncate flex-1">{item.title}</span>
                      {item.items && item.items.length > 0 && (
                        <ChevronDown className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                      )}
                    </button>
                  ) : (
                    // Regular item with submenu
                    <button
                      onClick={() => handleOpenSubmenu(item)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-4 py-3 rounded-xl font-medium text-sm",
                        "transition-all duration-300 backdrop-blur-sm",
                        "hover:shadow-lg hover:scale-105",
                        location?.startsWith(`/${item.title.toLowerCase().replace(/\s/g, '-')}`) 
                          ? "bg-sidebar-primary/40 text-sidebar-primary-foreground shadow-lg border border-sidebar-primary/60"
                          : "bg-sidebar-primary/10 text-sidebar-foreground border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                        <span className="truncate">{item.title}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform duration-300 flex-shrink-0" />
                    </button>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Submenu */}
          {activeSubmenu && (
            <div className={cn(
              "absolute inset-0 transition-all duration-500 ease-out",
              activeSubmenu ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            )}>
              <div className="flex flex-col h-full">
                {/* Submenu Header */}
                <button
                  onClick={handleBackToMain}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm mb-4 transition-all duration-300 group",
                    activeSubmenuTheme && levelColors[activeSubmenuTheme] 
                      ? `bg-gradient-to-r ${levelColors[activeSubmenuTheme].bg} ${levelColors[activeSubmenuTheme].text} border-2 border-opacity-30`
                      : "bg-sidebar-primary/20 text-sidebar-primary-foreground hover:bg-sidebar-primary/30"
                  )}
                >
                  <ChevronLeft className="h-5 w-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                  <span className="flex-1 text-left truncate">{submenuTitle}</span>
                </button>

                {/* Submenu Items */}
                <nav className="flex-1 overflow-y-auto flex flex-col gap-2">
                  {submenuItems.map((subItem, index) => (
                    <Link key={index} href={subItem.href || "#"}>
                      <a 
                        onClick={() => handleSubmenuItemClick(subItem)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm",
                          "transition-all duration-300 backdrop-blur-sm group",
                          "hover:shadow-lg hover:scale-105 hover:-translate-y-0.5",
                          activeSubmenuTheme && levelColors[activeSubmenuTheme]
                            ? `bg-gradient-to-r ${levelColors[activeSubmenuTheme].bg} ${levelColors[activeSubmenuTheme].text} bg-opacity-10 hover:bg-opacity-20 border-2 border-transparent hover:border-opacity-30`
                            : (location === subItem.href
                                ? "bg-sidebar-primary/40 text-sidebar-primary-foreground shadow-lg border border-sidebar-primary/60"
                                : "bg-sidebar-primary/10 text-sidebar-foreground border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40")
                        )}
                        style={activeSubmenuTheme && levelColors[activeSubmenuTheme] ? {
                          backgroundSize: "200% 200%",
                          opacity: 0.9,
                        } : {}}
                      >
                        {subItem.icon && <subItem.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />}
                        <span className="flex-1 truncate">{subItem.title}</span>
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
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
