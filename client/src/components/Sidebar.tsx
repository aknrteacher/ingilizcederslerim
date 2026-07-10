import * as React from "react"
import { ChevronDown, ChevronLeft, LayoutDashboard, Settings, User, UserCircle, TrendingUp, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "@assets/generated_images/modern_english_learning_logo_with_speech_bubble_and_book.png"
import { Link, useLocation } from "wouter"
import { useTheme, type LevelTheme, themeFilters, defaultThemeFilter } from "@/context/ThemeContext"
import { grade2VocabHref, grade3VocabHref, grade4VocabHref } from "@/lib/primarySchoolPaths"

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
  { title: "Kelime Kartları", href: "vocab" }, // Will be replaced with theme-specific href
  { title: "Şarkılar", href: "songs" },
  { title: "Oyunlar", href: "games" },
  { title: "Hikayeler", href: "stories" },
  { title: "Alıştırmalar", href: "exercises" },
  { title: "Çalışma Kağıtları", href: "worksheets" },
]

const grade2Themes = Array.from({ length: 6 }, (_, i) => ({
  title: `Tema ${i + 1}`,
  items: activityItems.map(act => {
    // For vocab, use theme-specific format (2.1-vocab, 2.2-vocab, etc.)
    return {
      ...act,
      href: act.href === "vocab" ? grade2VocabHref(i + 1) : `/primary-school/grade-2/theme-${i + 1}/${act.href}`,
    };
  })
}))

const grade3Units = Array.from({ length: 10 }, (_, i) => ({
  title: `Ünite ${i + 1}`,
  items: activityItems.map(act => {
    // For vocab, use unit-specific format (3.1-vocab, 3.2-vocab, etc.)
    return {
      ...act,
      href: act.href === "vocab" ? grade3VocabHref(i + 1) : `/primary-school/grade-3/unit-${i + 1}/${act.href}`,
    };
  })
}))

const grade4Units = Array.from({ length: 10 }, (_, i) => ({
  title: `Ünite ${i + 1}`,
  items: activityItems.map(act => {
    // For vocab, use unit-specific format (4.1-vocab, 4.2-vocab, etc.)
    return {
      ...act,
      href: act.href === "vocab" ? grade4VocabHref(i + 1) : `/primary-school/grade-4/unit-${i + 1}/${act.href}`,
    };
  })
}))

const levelItems = [
  { 
    title: "Okul Öncesi & 1. Sınıf", 
    theme: "pre-school" as LevelTheme,
    items: [
      { title: "Kelime Kartları", href: "/pre-school/kelime-kartlari" },
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
      { title: "Test Kelime Kartları", href: "/primary-school/test-vocab" },
      { title: "Test Colour This", href: "/primary-school/test-color-sound" },
    ]
  },
  { title: "Ortaokul", theme: "secondary-school" as LevelTheme },
  { title: "Lise", theme: "high-school" as LevelTheme },
  { title: "Üniversite", theme: "university" as LevelTheme },
  { title: "İş İngilizcesi", theme: "business-english" as LevelTheme },
]

// --- Theme Color Mapping ---
// Using theme-aware CSS variables instead of hardcoded colors
// darkText uses sidebar-primary color (same as border) for maximum readability
const levelColors: Record<LevelTheme, { bg: string; text: string; dark: string; light: string; darkText: string }> = {
  "pre-school": { bg: "from-primary/20 to-primary/30", text: "text-foreground", dark: "bg-sidebar-primary", light: "border-sidebar-primary/40", darkText: "text-sidebar-primary" },
  "primary-school": { bg: "from-primary/20 to-primary/30", text: "text-foreground", dark: "bg-sidebar-primary", light: "border-sidebar-primary/40", darkText: "text-sidebar-primary" },
  "secondary-school": { bg: "from-primary/20 to-primary/30", text: "text-foreground", dark: "bg-sidebar-primary", light: "border-sidebar-primary/40", darkText: "text-sidebar-primary" },
  "high-school": { bg: "from-primary/20 to-primary/30", text: "text-foreground", dark: "bg-sidebar-primary", light: "border-sidebar-primary/40", darkText: "text-sidebar-primary" },
  "university": { bg: "from-primary/20 to-primary/30", text: "text-foreground", dark: "bg-sidebar-primary", light: "border-sidebar-primary/40", darkText: "text-sidebar-primary" },
  "business-english": { bg: "from-primary/20 to-primary/30", text: "text-foreground", dark: "bg-sidebar-primary", light: "border-sidebar-primary/40", darkText: "text-sidebar-primary" },
}

// Inline styles for fallback mode (older browsers like Chrome 109)
// These use actual color values, not CSS variables
const fallbackInlineStyles: Record<LevelTheme, { backgroundColor: string; color: string; borderColor: string }> = {
  "pre-school": { backgroundColor: "hsl(45, 100%, 75%)", color: "hsl(45, 100%, 75%)", borderColor: "hsl(45, 100%, 75%)" },
  "primary-school": { backgroundColor: "hsl(200, 100%, 75%)", color: "hsl(200, 100%, 75%)", borderColor: "hsl(200, 100%, 75%)" },
  "secondary-school": { backgroundColor: "hsl(25, 100%, 75%)", color: "hsl(25, 100%, 75%)", borderColor: "hsl(25, 100%, 75%)" },
  "high-school": { backgroundColor: "hsl(120, 80%, 70%)", color: "hsl(120, 80%, 70%)", borderColor: "hsl(120, 80%, 70%)" },
  "university": { backgroundColor: "hsl(270, 70%, 65%)", color: "hsl(270, 70%, 65%)", borderColor: "hsl(270, 70%, 65%)" },
  "business-english": { backgroundColor: "hsl(200, 20%, 65%)", color: "hsl(200, 20%, 65%)", borderColor: "hsl(200, 20%, 65%)" },
}

// Check if browser needs fallback (set by index.html script)
const needsFallback = typeof window !== 'undefined' && document.documentElement.classList.contains('browser-fallback')

// Get inline styles for a theme (returns empty object if fallback not needed)
const getFallbackStyles = (theme: LevelTheme | undefined): React.CSSProperties => {
  if (!needsFallback || !theme) return {}
  return fallbackInlineStyles[theme] || {}
}

const navItems: NavItem[] = [
  ...levelItems.map(item => ({
    title: item.title,
    theme: item.theme,
    // Always provide href for level items to navigate to landing pages
    href: `/${item.theme}`,
    items: item.items,
  })),
]

interface SidebarProps {
  isMobile?: boolean
  onItemClick?: () => void
}

export function Sidebar({ isMobile = false, onItemClick }: SidebarProps) {
  const { currentTheme, setCurrentTheme, isDefaultTheme } = useTheme()
  const logoFilter = isDefaultTheme ? defaultThemeFilter : themeFilters[currentTheme]
  const [location, setLocation] = useLocation()
  // Stack for nested menus
  const [menuStack, setMenuStack] = React.useState<{ title: string, items: NavItem[], theme?: LevelTheme }[]>([])

  // Function to find menu path based on current location
  const findMenuPathForLocation = React.useCallback((path: string): { title: string, items: NavItem[], theme?: LevelTheme }[] => {
    const stack: { title: string, items: NavItem[], theme?: LevelTheme }[] = []

    // Helper function to check if a path is a child of a menu item
    // e.g., /primary-school/grade-2/theme-2/2.2-matching-game is a child of /primary-school/grade-2/theme-2/games
    const isChildOfMenu = (childPath: string, menuHref: string): boolean => {
      if (!menuHref) return false
      // Exact match
      if (childPath === menuHref) return true
      // Direct child (e.g., /games/child)
      if (childPath.startsWith(menuHref + '/')) return true
      
      // For same-level pages (e.g., /theme-2/games vs /theme-2/2.2-matching-game)
      // Extract the base path up to theme/unit (e.g., /primary-school/grade-2/theme-2)
      const extractBasePath = (p: string): string | null => {
        // Match primary-school paths: /primary-school/grade-X/theme-Y or /primary-school/grade-X/unit-Y
        const primaryMatch = p.match(/^(\/primary-school\/grade-\d+\/(?:theme|unit)-\d+)/)
        if (primaryMatch) return primaryMatch[1]
        
        // Match pre-school paths: /pre-school/...
        const preSchoolMatch = p.match(/^(\/pre-school)/)
        if (preSchoolMatch) return preSchoolMatch[1]
        
        return null
      }
      
      const menuBase = extractBasePath(menuHref)
      const childBase = extractBasePath(childPath)
      
      // If they're in the same theme/unit/base, and menu is a parent category (games, vocab, etc.)
      if (menuBase && childBase && menuBase === childBase) {
        // Check if menuHref is a category page (ends with /games, /vocab, etc.)
        const menuCategory = menuHref.split('/').pop()
        if (menuCategory && ['games', 'vocab', 'songs', 'stories', 'exercises', 'worksheets', 'kelime-kartlari'].includes(menuCategory)) {
          return true
        }
      }
      return false
    }

    // Recursive function to find the matching path and build the stack
    const findPathRecursive = (items: NavItem[], currentPath: { title: string, items: NavItem[], theme?: LevelTheme }[] = [], parentTheme?: LevelTheme): boolean => {
      for (const item of items) {
        // Check if this item's href matches the path
        if (item.href && isChildOfMenu(path, item.href)) {
          // Found a match - add current path to stack (all parent menus)
          // For game pages and other activity pages, we want to keep the parent submenu open
          // (e.g., if we're on a game page, show the theme submenu, not the games submenu)
          // So we always add the currentPath which includes all parent menus
          if (currentPath.length > 0) {
            stack.push(...currentPath)
          }
          
          // Only add the current item if it has items and we want to show its submenu
          // (This is for cases where the matched item itself is a submenu container)
          if (item.items && item.items.length > 0) {
            stack.push({
              title: item.title,
              items: item.items,
              theme: item.theme || parentTheme
            })
          }
          return true
        }

        // Check nested items recursively
        if (item.items) {
          // Add current item to the path before checking children
          const newPath = [...currentPath, {
            title: item.title,
            items: item.items,
            theme: item.theme || parentTheme
          }]
          const hasMatch = findPathRecursive(item.items, newPath, item.theme || parentTheme)
          if (hasMatch) {
            return true
          }
        }
      }
      return false
    }

    // Start searching from top-level nav items
    findPathRecursive(navItems)

    return stack
  }, [])

  // Initialize menu stack based on current location
  React.useEffect(() => {
    if (location && location !== '/') {
      const pathParts = location.split('/').filter(Boolean)
      
      // Check if we're on any activity/end page by checking the entire path
      // Activity indicators: -game, -vocab, crossword, spell-quest, word-pop, catch-that
      // Also check for vocab pages like /kelime-kartlari/0.1colors
      const activityIndicators = [
        '-game', '-matching-game', '-vocab', 'vocab', 'crossword', 
        'spell-quest', 'word-pop', 'catch-that', 'kelime-kartlari',
        'songs', 'stories', 'exercises', 'worksheets'
      ]
      
      // Exclude menu pages (not activity pages)
      // Check if the last path part is a menu category
      const lastPathPart = pathParts[pathParts.length - 1]
      const menuCategories = ['games', 'vocab', 'songs', 'stories', 'exercises', 'worksheets', 'kelime-kartlari']
      const isMenuPage = menuCategories.includes(lastPathPart) && 
        !lastPathPart.includes('-game') && 
        !lastPathPart.includes('-vocab') &&
        !lastPathPart.includes('crossword') &&
        !lastPathPart.includes('spell-quest') &&
        !lastPathPart.includes('word-pop') &&
        !lastPathPart.includes('catch-that')
      
      // Check if any path part contains an activity indicator
      const hasActivityIndicator = pathParts.some(part => 
        activityIndicators.some(indicator => part.includes(indicator))
      )
      
      // It's an activity page if it has an activity indicator and is not a menu page
      const isActivityPage = hasActivityIndicator && !isMenuPage
      
      // Check if we're on a menu page that needs full menu stack preserved
      // Menu pages are intermediate pages like /games, /vocab, etc. that should also show full path
      const needsFullMenuStack = isActivityPage || isMenuPage
      
      // For activity/end pages AND menu pages, always use fallback logic to ensure full menu stack
      if (needsFullMenuStack) {
        const contextLevelItem = navItems.find(item => {
          if (!item.theme) return false
          return location.startsWith(`/${item.theme}`)
        })
        
        if (contextLevelItem && contextLevelItem.items && contextLevelItem.items.length > 0) {
          // For primary-school, we need at least 3 parts: primary-school, grade-X, theme-X
          // For pre-school, we just need the level
          const isPrimarySchool = contextLevelItem.theme === 'primary-school'
          const hasEnoughParts = isPrimarySchool ? pathParts.length >= 3 : pathParts.length >= 1
          
          if (pathParts.length >= 1 && pathParts[0] === contextLevelItem.theme && hasEnoughParts) {
            // Handle pre-school structure (no grade/theme, just level -> activities)
            if (contextLevelItem.theme === 'pre-school') {
              // For pre-school, just show the level menu
              setMenuStack([{
                title: contextLevelItem.title,
                items: contextLevelItem.items!,
                theme: contextLevelItem.theme
              }])
              if (contextLevelItem.theme) {
                setCurrentTheme(contextLevelItem.theme)
              }
              return
            }
            
            // Handle primary-school structure (level -> grade -> theme -> activities)
            let currentItems = contextLevelItem.items
            let foundSubmenu: NavItem | null = null
            let foundThemeSubmenu: NavItem | null = null
            
            const gradeMatch = pathParts[1]?.match(/grade-(\d+)/)
            if (gradeMatch) {
              const gradeIndex = parseInt(gradeMatch[1]) - 2
              if (gradeIndex >= 0 && gradeIndex < currentItems.length) {
                foundSubmenu = currentItems[gradeIndex]
                currentItems = foundSubmenu.items || []
                
                if (pathParts.length >= 3 && currentItems.length > 0) {
                  const themeMatch = pathParts[2]?.match(/(?:theme|unit)-(\d+)/)
                  if (themeMatch) {
                    const themeIndex = parseInt(themeMatch[1]) - 1
                    if (themeIndex >= 0 && themeIndex < currentItems.length) {
                      foundThemeSubmenu = currentItems[themeIndex]
                    }
                  }
                }
              }
            }
            
            // Build menu stack based on what we found
            if (foundThemeSubmenu && foundSubmenu) {
              // We found both grade and theme - show full path
              setMenuStack([
                {
                  title: contextLevelItem.title,
                  items: contextLevelItem.items!,
                  theme: contextLevelItem.theme
                },
                {
                  title: foundSubmenu.title,
                  items: foundSubmenu.items || [],
                  theme: contextLevelItem.theme
                },
                {
                  title: foundThemeSubmenu.title,
                  items: foundThemeSubmenu.items || [],
                  theme: contextLevelItem.theme
                }
              ])
              if (contextLevelItem.theme) {
                setCurrentTheme(contextLevelItem.theme)
              }
              return
            } else if (foundSubmenu) {
              // We found grade but not theme - show grade submenu
              setMenuStack([
                {
                  title: contextLevelItem.title,
                  items: contextLevelItem.items!,
                  theme: contextLevelItem.theme
                },
                {
                  title: foundSubmenu.title,
                  items: foundSubmenu.items || [],
                  theme: contextLevelItem.theme
                }
              ])
              if (contextLevelItem.theme) {
                setCurrentTheme(contextLevelItem.theme)
              }
              return
            } else {
              // If we couldn't find grade/theme but we're on a menu/activity page,
              // at least show the level menu to preserve context
              setMenuStack([{
                title: contextLevelItem.title,
                items: contextLevelItem.items!,
                theme: contextLevelItem.theme
              }])
              if (contextLevelItem.theme) {
                setCurrentTheme(contextLevelItem.theme)
              }
              return
            }
          }
        }
      }
      
      // For other pages, use the normal path finding logic
      const path = findMenuPathForLocation(location)
      if (path.length > 0) {
        setMenuStack(path)
        // Set theme if found
        const lastMenu = path[path.length - 1]
        if (lastMenu.theme) {
          setCurrentTheme(lastMenu.theme)
        }
      } else {
        // If we're on a level landing page (e.g., /pre-school, /primary-school), open its submenu
        const levelItem = navItems.find(item => item.href === location && item.items && item.items.length > 0)
        if (levelItem) {
          setMenuStack([{
            title: levelItem.title,
            items: levelItem.items!,
            theme: levelItem.theme
          }])
          if (levelItem.theme) {
            setCurrentTheme(levelItem.theme)
          }
        } else {
          // If we can't find a match but we're still within a known navigation context,
          // try to preserve the menu stack by finding the appropriate level and submenu
          // This handles cases like game end pages where the path might not match exactly
          const contextLevelItem = navItems.find(item => {
            if (!item.theme) return false
            // Check if location starts with this level's path
            return location.startsWith(`/${item.theme}`)
          })
          
          if (contextLevelItem && contextLevelItem.items && contextLevelItem.items.length > 0) {
            // Try to find a matching submenu based on the path structure
            const pathParts = location.split('/').filter(Boolean)
            
            if (pathParts.length >= 1 && pathParts[0] === contextLevelItem.theme) {
              // Handle pre-school structure (no grade/theme, just level -> activities)
              if (contextLevelItem.theme === 'pre-school') {
                // For pre-school, just show the level menu
                setMenuStack([{
                  title: contextLevelItem.title,
                  items: contextLevelItem.items!,
                  theme: contextLevelItem.theme
                }])
                if (contextLevelItem.theme) {
                  setCurrentTheme(contextLevelItem.theme)
                }
              } else {
                // Handle primary-school structure (level -> grade -> theme -> activities)
                let currentItems = contextLevelItem.items
                let foundSubmenu: NavItem | null = null
                let foundThemeSubmenu: NavItem | null = null
                
                // Look for grade/class match (e.g., "grade-2" in path)
                const gradeMatch = pathParts[1]?.match(/grade-(\d+)/)
                if (gradeMatch) {
                  const gradeIndex = parseInt(gradeMatch[1]) - 2 // grade-2 is index 0, grade-3 is index 1, etc.
                  if (gradeIndex >= 0 && gradeIndex < currentItems.length) {
                    foundSubmenu = currentItems[gradeIndex]
                    currentItems = foundSubmenu.items || []
                    
                    // Look for theme/unit match (e.g., "theme-2" in path)
                    if (pathParts.length >= 3 && currentItems.length > 0) {
                      const themeMatch = pathParts[2]?.match(/(?:theme|unit)-(\d+)/)
                      if (themeMatch) {
                        const themeIndex = parseInt(themeMatch[1]) - 1 // theme-1 is index 0, theme-2 is index 1, etc.
                        if (themeIndex >= 0 && themeIndex < currentItems.length) {
                          foundThemeSubmenu = currentItems[themeIndex]
                        }
                      }
                    }
                  }
                }
                
                // Build the menu stack based on what we found
                // Always preserve the full path when we have theme/unit information
                if (foundThemeSubmenu && foundSubmenu) {
                  // We found both grade and theme - show full path to preserve submenu context
                  setMenuStack([
                    {
                      title: contextLevelItem.title,
                      items: contextLevelItem.items!,
                      theme: contextLevelItem.theme
                    },
                    {
                      title: foundSubmenu.title,
                      items: foundSubmenu.items || [],
                      theme: contextLevelItem.theme
                    },
                    {
                      title: foundThemeSubmenu.title,
                      items: foundThemeSubmenu.items || [],
                      theme: contextLevelItem.theme
                    }
                  ])
                  if (contextLevelItem.theme) {
                    setCurrentTheme(contextLevelItem.theme)
                  }
                } else if (foundSubmenu) {
                  // We found grade but not theme - show grade submenu
                  setMenuStack([
                    {
                      title: contextLevelItem.title,
                      items: contextLevelItem.items!,
                      theme: contextLevelItem.theme
                    },
                    {
                      title: foundSubmenu.title,
                      items: foundSubmenu.items || [],
                      theme: contextLevelItem.theme
                    }
                  ])
                  if (contextLevelItem.theme) {
                    setCurrentTheme(contextLevelItem.theme)
                  }
                } else {
                  // If we couldn't find a specific match but we're in this level's context,
                  // at least show the level's main submenu to preserve navigation context
                  setMenuStack([{
                    title: contextLevelItem.title,
                    items: contextLevelItem.items!,
                    theme: contextLevelItem.theme
                  }])
                  if (contextLevelItem.theme) {
                    setCurrentTheme(contextLevelItem.theme)
                  }
                }
              }
            } else {
              // If we're in the level's context but path structure doesn't match,
              // still preserve the level's main submenu
              setMenuStack([{
                title: contextLevelItem.title,
                items: contextLevelItem.items!,
                theme: contextLevelItem.theme
              }])
              if (contextLevelItem.theme) {
                setCurrentTheme(contextLevelItem.theme)
              }
            }
          }
        }
      }
    } else {
      // Reset to main menu on home page
      setMenuStack([])
    }
  }, [location, findMenuPathForLocation, setCurrentTheme])

  const handleLevelClick = (theme: LevelTheme, href?: string) => {
    setCurrentTheme(theme)
    if (href) {
      // Navigate to landing page
      setLocation(href)
    }
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
        // Navigate to landing page when opening submenu
        const landingHref = `/${item.theme}`
        setLocation(landingHref)
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
    <div className={`flex ${isMobile ? 'h-full' : 'h-screen'} w-full flex-col ${isDefaultTheme ? 'bg-sidebar' : 'bg-gradient-to-b from-sidebar/90 via-sidebar/95 to-sidebar'} text-sidebar-foreground transition-colors duration-300 ${isDefaultTheme ? '' : 'backdrop-blur-xl'}`}>
      {/* Logo Section */}
      <div className={`flex items-center justify-center border-b border-sidebar-primary/20 px-4 py-4 ${isMobile ? 'h-20' : 'h-32'} ${isDefaultTheme ? '' : 'bg-gradient-to-b from-sidebar-accent/5 via-transparent to-transparent backdrop-blur-md'}`}>
        <Link
          href="/"
          className="relative group block text-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          aria-label="Ingilizce Derslerim — Ana sayfa"
        >
          <h1 className={cn(
            "logo-jump text-3xl font-black text-center leading-none transition-all duration-500 font-serif tracking-tight group-hover:drop-shadow-lg",
            isDefaultTheme 
              ? "text-white" 
              : (levelColors[currentTheme] ? `bg-clip-text text-transparent bg-gradient-to-br ${levelColors[currentTheme].bg}` : "text-primary")
          )}>
            ingilizce<br/>derslerim
          </h1>
          <span className="beta-wiggle absolute top-full left-1/2 -translate-x-1/2 -mt-1 bg-black text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-lg" aria-hidden>
            -beta-
          </span>
        </Link>
      </div>

      {/* Top Icon Buttons */}
      <div className="flex items-center justify-center gap-1 px-2 sm:px-3 py-2 border-b border-sidebar-primary/20">
        <Link
          href="/account/profile"
          className="p-1.5 rounded-md transition-all duration-300 hover:bg-sidebar-primary/25 group"
          aria-label="Hesabım"
        >
          <User className="h-4 w-4 text-sidebar-foreground group-hover:scale-110 transition-transform" aria-hidden />
        </Link>
        <button 
          type="button"
          onClick={() => {
            setMenuStack([])
            setLocation("/")
            onItemClick?.()
          }}
          className="p-1.5 rounded-md transition-all duration-300 hover:bg-sidebar-primary/25 group" 
          aria-label="Ana Sayfa"
        >
          <Home className="h-4 w-4 text-sidebar-foreground group-hover:scale-110 transition-transform" aria-hidden />
        </button>
        <button 
          type="button"
          onClick={handleBack}
          disabled={menuStack.length === 0}
          className="p-1.5 rounded-md transition-all duration-300 hover:bg-sidebar-primary/25 group disabled:opacity-50 disabled:cursor-not-allowed" 
          aria-label="Geri"
        >
          <ChevronLeft className="h-4 w-4 text-sidebar-foreground group-hover:scale-110 transition-transform" aria-hidden />
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
                  
                  {item.items && item.items.length > 0 ? (
                     // Item with submenu (Level items or items with children) - navigate to landing page
                    <Link
                      href={item.href!}
                      onClick={() => {
                        if (item.theme && item.href) {
                          handleLevelClick(item.theme, item.href)
                        }
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2 rounded-lg font-bold text-sm",
                        "transition-all duration-300 group",
                         item.theme 
                          ? `${levelColors[item.theme].dark} ${levelColors[item.theme].darkText} border-4 ${levelColors[item.theme].light} shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm bg-opacity-80`
                          : "bg-sidebar-primary/10 text-sidebar-foreground border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40",
                        "cursor-pointer"
                      )}
                      style={getFallbackStyles(item.theme)}
                    >
                      <span className="truncate flex-1 text-left" style={item.theme && needsFallback ? { color: fallbackInlineStyles[item.theme].color } : undefined}>{item.title}</span>
                      <ChevronDown className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" style={item.theme && needsFallback ? { color: fallbackInlineStyles[item.theme].color } : undefined} aria-hidden />
                    </Link>
                  ) : (
                    // Regular link item
                    <Link
                      href={item.href!}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg transition-all duration-300 group",
                        item.theme 
                          ? `px-4 py-2 font-bold text-sm justify-center ${levelColors[item.theme].dark} ${levelColors[item.theme].darkText} border-4 ${levelColors[item.theme].light} shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm bg-opacity-80`
                          : `px-4 py-2 font-medium text-sm backdrop-blur-sm hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 ${
                              location === item.href
                                ? "bg-sidebar-primary/40 text-sidebar-primary-foreground shadow-lg border border-sidebar-primary/60"
                                : "bg-sidebar-primary/10 text-sidebar-foreground border border-sidebar-primary/20 hover:bg-sidebar-primary/25 hover:border-sidebar-primary/40"
                            }`
                      )}
                      onClick={() => item.theme && handleLevelClick(item.theme, item.href)}
                      style={getFallbackStyles(item.theme)}
                    >
                      {item.icon && <item.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" aria-hidden />}
                      <span className={cn("truncate", item.theme ? "" : "flex-1")} style={item.theme && needsFallback ? { color: fallbackInlineStyles[item.theme].color } : undefined}>{item.title}</span>
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
                  style={getFallbackStyles(activeSubmenuTheme)}
                >
                  <ChevronLeft className="h-5 w-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" style={activeSubmenuTheme && needsFallback ? { color: fallbackInlineStyles[activeSubmenuTheme].color } : undefined} />
                  <span className="flex-1 text-left truncate" style={activeSubmenuTheme && needsFallback ? { color: fallbackInlineStyles[activeSubmenuTheme].color } : undefined}>{submenuTitle}</span>
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
                           style={{ animationDelay: `${index * 50}ms`, ...getFallbackStyles(activeSubmenuTheme) }}
                         >
                           <span className="truncate flex-1 text-left" style={activeSubmenuTheme && needsFallback ? { color: fallbackInlineStyles[activeSubmenuTheme].color } : undefined}>{subItem.title}</span>
                           <ChevronDown className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" style={activeSubmenuTheme && needsFallback ? { color: fallbackInlineStyles[activeSubmenuTheme].color } : undefined} />
                         </button>
                      ) : (
                        // Link Item
                        <Link
                          href={subItem.href!}
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
                          style={{ animationDelay: `${index * 50}ms`, ...getFallbackStyles(activeSubmenuTheme) }}
                        >
                          {subItem.icon && <subItem.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" aria-hidden />}
                          <span className="flex-1 truncate" style={activeSubmenuTheme && needsFallback ? { color: fallbackInlineStyles[activeSubmenuTheme].color } : undefined}>{subItem.title}</span>
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
        <Link
          href="/account/profile"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm group hover:shadow-lg hover:scale-[1.02] bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30"
          onClick={() => onItemClick?.()}
        >
            <div
              aria-hidden="true"
              className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-1 ring-white/20 group-hover:shadow-lg transition-all duration-300"
            >
              JS
            </div>
            <div className="flex flex-col overflow-hidden min-w-0 flex-1 text-left">
            <span className="text-xs font-semibold truncate text-white">Misafir Kullanıcı</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
