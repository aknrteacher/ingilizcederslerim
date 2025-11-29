import * as React from "react"
import { ChevronDown, ChevronLeft, LayoutDashboard, Settings, User, UserCircle, TrendingUp, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "@assets/generated_images/modern_english_learning_logo_with_speech_bubble_and_book.png"
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
const activityItems = [
  { title: "Kelime Kartları", href: "vocabulary-cards" },
  { title: "Şarkılar", href: "songs" },
  { title: "Oyunlar", href: "games" },
  { title: "Hikayeler", href: "stories" },
  { title: "Alıştırmalar", href: "exercises" },
  { title: "Çalışma Kağıtları", href: "worksheets" },
]

const grade2Themes = Array.from({ length: 6 }, (_, i) => ({
  title: `Tema ${i + 1}`,
  items: activityItems.map(act => ({ ...act, href: `/primary-school/grade-2/theme-${i + 1}/${act.href}` }))
}))

const grade3Units = Array.from({ length: 10 }, (_, i) => ({
  title: `Ünite ${i + 1}`,
  items: activityItems.map(act => ({ ...act, href: `/primary-school/grade-3/unit-${i + 1}/${act.href}` }))
}))

const grade4Units = Array.from({ length: 10 }, (_, i) => ({
  title: `Ünite ${i + 1}`,
  items: activityItems.map(act => ({ ...act, href: `/primary-school/grade-4/unit-${i + 1}/${act.href}` }))
}))

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
      { title: "2. Sınıf", items: grade2Themes },
      { title: "3. Sınıf", items: grade3Units },
      { title: "4. Sınıf", items: grade4Units },
    ]
  },
  { title: "Ortaokul", theme: "secondary-school" as LevelTheme },
  { title: "Lise", theme: "high-school" as LevelTheme },
  { title: "Üniversite", theme: "university" as LevelTheme },
  { title: "İş İngilizcesi", theme: "business-english" as LevelTheme },
]

// --- Theme Color Mapping ---
const levelColors: Record<LevelTheme, { bg: string; text: string; dark: string; light: string; darkText: string }> = {
  "pre-school": { bg: "from-yellow-300 to-yellow-400", text: "text-amber-900", dark: "bg-yellow-700", light: "border-yellow-200", darkText: "text-yellow-100" },
  "primary-school": { bg: "from-blue-300 to-blue-400", text: "text-blue-900", dark: "bg-blue-700", light: "border-blue-200", darkText: "text-blue-100" },
  "secondary-school": { bg: "from-orange-300 to-orange-400", text: "text-orange-900", dark: "bg-orange-700", light: "border-orange-200", darkText: "text-orange-100" },
  "high-school": { bg: "from-green-300 to-green-400", text: "text-green-900", dark: "bg-green-700", light: "border-green-200", darkText: "text-green-100" },
  "university": { bg: "from-purple-300 to-purple-400", text: "text-purple-900", dark: "bg-purple-700", light: "border-purple-200", darkText: "text-purple-100" },
  "business-english": { bg: "from-gray-400 to-gray-500", text: "text-gray-900", dark: "bg-gray-700", light: "border-gray-200", darkText: "text-gray-100" },
}

const navItems: NavItem[] = [
  ...levelItems.map(item => ({
    title: item.title,
    theme: item.theme,
    href: item.items ? undefined : `/${item.theme}`,
    items: item.items,
  })),
]

interface SidebarProps {
  isMobile?: boolean
  onItemClick?: () => void
}

export function Sidebar({ isMobile = false, onItemClick }: SidebarProps) {
  const { currentTheme, setCurrentTheme } = useTheme()
  const logoFilter = themeFilters[currentTheme]
  const [location] = useLocation()
  // Stack for nested menus
  const [menuStack, setMenuStack] = React.useState<{ title: string, items: NavItem[], theme?: LevelTheme }[]>([])

  const handleLevelClick = (theme: LevelTheme) => {
    setCurrentTheme(theme)
    onItemClick?.()
  }

  const handleOpenSubmenu = (item: NavItem) => {
    if (item.items && item.items.length > 0) {
      setMenuStack(prev => [...prev, { 
        title: item.title, 
        items: item.items!, 
        theme: item.theme || (prev.length > 0 ? prev[prev.length - 1].theme : undefined)
      }])
      
      if (item.theme) {
        setCurrentTheme(item.theme)
      }
    }
  }

  const handleBack = () => {
    setMenuStack(prev => prev.slice(0, -1))
  }

  const handleSubmenuItemClick = (item: NavItem) => {
    if (item.items && item.items.length > 0) {
      // If item has sub-items, open them instead of navigating
      handleOpenSubmenu(item)
    } else {
      // Regular navigation
      if (item.theme) {
        handleLevelClick(item.theme)
      }
      onItemClick?.()
    }
  }

  // Derived state for rendering
  const activeMenu = menuStack.length > 0 ? menuStack[menuStack.length - 1] : null
  const activeSubmenu = !!activeMenu
  const submenuTitle = activeMenu?.title || ""
  const submenuItems = activeMenu?.items || []
  const activeSubmenuTheme = activeMenu?.theme

  return (
    <div className={`flex ${isMobile ? 'h-full' : 'h-screen'} w-full flex-col bg-gradient-to-b from-sidebar/90 via-sidebar/95 to-sidebar text-sidebar-foreground transition-colors duration-300 backdrop-blur-xl`}>
      {/* Logo Section */}
      <div className={`flex items-center justify-center border-b border-sidebar-primary/20 px-4 py-4 ${isMobile ? 'h-20' : 'h-32'} bg-gradient-to-b from-sidebar-accent/5 via-transparent to-transparent backdrop-blur-md`}>
        <h1 className={cn(
          "text-3xl font-black text-center leading-none transition-all duration-500 hover:scale-105 cursor-pointer font-serif tracking-tight",
          levelColors[currentTheme] ? `bg-clip-text text-transparent bg-gradient-to-br ${levelColors[currentTheme].bg}` : "text-primary"
        )}>
          ingilizce<br/>derslerim
        </h1>
      </div>

      {/* Top Icon Buttons */}
      <div className="flex items-center justify-center gap-1 px-2 sm:px-3 py-2 border-b border-sidebar-primary/20">
        <Link href="/account/profile">
          <a className="p-1.5 rounded-md transition-all duration-300 hover:bg-sidebar-primary/25 group" title="Hesabım">
            <User className="h-4 w-4 text-sidebar-foreground group-hover:scale-110 transition-transform" />
          </a>
        </Link>
        <button 
          onClick={() => {
            setMenuStack([])
          }}
          className="p-1.5 rounded-md transition-all duration-300 hover:bg-sidebar-primary/25 group" 
          title="Ana Sayfa"
        >
          <Home className="h-4 w-4 text-sidebar-foreground group-hover:scale-110 transition-transform" />
        </button>
        <button 
          onClick={handleBack}
          disabled={menuStack.length === 0}
          className="p-1.5 rounded-md transition-all duration-300 hover:bg-sidebar-primary/25 group disabled:opacity-50 disabled:cursor-not-allowed" 
          title="Geri"
        >
          <ChevronLeft className="h-4 w-4 text-sidebar-foreground group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Sliding Navigation */}
      <div className="flex-1 overflow-hidden p-2 sm:p-3">
        <div className="relative w-full h-full">
          {/* Main Menu */}
          <div className={cn(
            "absolute inset-0 transition-all duration-500 ease-out",
            activeSubmenu ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
          )}>
            <nav className="flex flex-col gap-1 h-full overflow-y-auto overflow-x-hidden">
              {navItems.map((item, index) => (
                <React.Fragment key={index}>
                  {index === 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-sidebar-primary/20 to-transparent my-1"></div>
                  )}
                  {index === navItems.length - 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-sidebar-primary/20 to-transparent my-1"></div>
                  )}
                  
                  {item.items && !item.href ? (
                     // Item with submenu (Level items or items with children)
                    <button
                      onClick={() => handleOpenSubmenu(item)}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2 rounded-lg font-bold text-sm",
                        "transition-all duration-300 group",
                         item.theme 
                          ? `${levelColors[item.theme].dark} ${levelColors[item.theme].darkText} border-4 ${levelColors[item.theme].light} shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm bg-opacity-80`
                          : "bg-sidebar-primary/10 text-sidebar-foreground border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40",
                        "cursor-pointer"
                      )}
                    >
                      <span className="truncate flex-1 text-left">{item.title}</span>
                      <ChevronDown className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    // Regular link item
                    <Link href={item.href || "#"}>
                      <a className={cn(
                        "flex w-full items-center gap-3 rounded-lg transition-all duration-300 group",
                        item.theme 
                          ? `px-4 py-2 font-bold text-sm justify-center ${levelColors[item.theme].dark} ${levelColors[item.theme].darkText} border-4 ${levelColors[item.theme].light} shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm bg-opacity-80`
                          : `px-4 py-2 font-medium text-sm backdrop-blur-sm hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 ${
                              location === item.href
                                ? "bg-sidebar-primary/40 text-sidebar-primary-foreground shadow-lg border border-sidebar-primary/60"
                                : "bg-sidebar-primary/10 text-sidebar-foreground border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40"
                            }`
                      )}
                      onClick={() => item.theme && handleLevelClick(item.theme)}
                      >
                        {item.icon && <item.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />}
                        <span className={cn("truncate", item.theme ? "" : "flex-1")}>{item.title}</span>
                      </a>
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Submenu (Recursive / Stack) */}
          {activeSubmenu && (
            <div className={cn(
              "absolute inset-0 transition-all duration-700 ease-out",
              activeSubmenu ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            )}>
              <div className="flex flex-col h-full">
                {/* Submenu Header */}
                <button
                  onClick={handleBack}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm mb-4 transition-all duration-300 group",
                    activeSubmenuTheme && levelColors[activeSubmenuTheme] 
                      ? `${levelColors[activeSubmenuTheme].dark} ${levelColors[activeSubmenuTheme].darkText} border-4 ${levelColors[activeSubmenuTheme].light} shadow-lg backdrop-blur-sm bg-opacity-80 hover:shadow-xl`
                      : "bg-sidebar-primary/20 text-sidebar-primary-foreground hover:bg-sidebar-primary/30"
                  )}
                >
                  <ChevronLeft className="h-5 w-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                  <span className="flex-1 text-left truncate">{submenuTitle}</span>
                </button>

                {/* Submenu Items */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-1">
                  {submenuItems.map((subItem, index) => (
                    <React.Fragment key={index}>
                      {subItem.items ? (
                         // Nested Submenu Item
                         <button
                           onClick={() => handleSubmenuItemClick(subItem)}
                           className={cn(
                             "flex w-full items-center justify-between px-4 py-2 rounded-lg font-bold text-sm",
                             "transition-all duration-300 group submenu-item",
                             activeSubmenuTheme && levelColors[activeSubmenuTheme]
                               ? `${levelColors[activeSubmenuTheme].dark} ${levelColors[activeSubmenuTheme].darkText} border-4 ${levelColors[activeSubmenuTheme].light} shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm bg-opacity-80`
                               : "bg-sidebar-primary/10 text-sidebar-foreground border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40",
                             "cursor-pointer"
                           )}
                           style={{ animationDelay: `${index * 50}ms` }}
                         >
                           <span className="truncate flex-1 text-left">{subItem.title}</span>
                           <ChevronDown className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                         </button>
                      ) : (
                        // Link Item
                        <Link href={subItem.href || "#"}>
                          <a 
                            onClick={() => handleSubmenuItemClick(subItem)}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-2 rounded-lg font-bold text-sm",
                              "transition-all duration-300 group submenu-item",
                              "hover:shadow-lg hover:scale-105 hover:-translate-y-0.5",
                              activeSubmenuTheme && levelColors[activeSubmenuTheme]
                                ? `${levelColors[activeSubmenuTheme].dark} ${levelColors[activeSubmenuTheme].darkText} border-4 ${levelColors[activeSubmenuTheme].light} shadow-lg hover:shadow-2xl backdrop-blur-sm bg-opacity-80`
                                : (location === subItem.href
                                    ? "bg-sidebar-primary/40 text-sidebar-primary-foreground shadow-lg border border-sidebar-primary/60"
                                    : "bg-sidebar-primary/10 text-sidebar-foreground border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40")
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {subItem.icon && <subItem.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />}
                            <span className="flex-1 truncate">{subItem.title}</span>
                          </a>
                        </Link>
                      )}
                    </React.Fragment>
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
