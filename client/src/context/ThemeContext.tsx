import React, { createContext, useContext, useState, useEffect } from "react"
import { useLocation } from "wouter"

export type LevelTheme = "pre-school" | "primary-school" | "secondary-school" | "high-school" | "university" | "business-english"
export type Theme = LevelTheme | "default"

interface ThemeContextType {
  currentTheme: LevelTheme
  setCurrentTheme: (theme: LevelTheme) => void
  themeBackground: string
  isDefaultTheme: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getThemeFromPath(path: string): { theme: LevelTheme; isDefault: boolean } {
  // Main landing page uses default/neutral theme
  if (path === "/" || path === "") {
    return { theme: "pre-school", isDefault: true } // Use pre-school as fallback but mark as default
  }
  if (path.includes("pre-school") || path.includes("okul-oncesi") || path.startsWith("/pre-school")) {
    return { theme: "pre-school", isDefault: false }
  }
  if (path.includes("primary-school") || path.includes("grade-2") || path.includes("grade-1")) {
    return { theme: "primary-school", isDefault: false }
  }
  if (path.includes("secondary-school")) {
    return { theme: "secondary-school", isDefault: false }
  }
  if (path.includes("high-school")) {
    return { theme: "high-school", isDefault: false }
  }
  if (path.includes("university")) {
    return { theme: "university", isDefault: false }
  }
  if (path.includes("business-english")) {
    return { theme: "business-english", isDefault: false }
  }
  return { theme: "pre-school", isDefault: false }
}

export const themeBackgrounds: Record<LevelTheme, string> = {
  "pre-school": "bg-amber-50",
  "primary-school": "bg-blue-50",
  "secondary-school": "bg-orange-50",
  "high-school": "bg-green-50",
  "university": "bg-purple-50",
  "business-english": "bg-slate-50",
}

// Neutral theme for main landing page
export const defaultThemeBackground = "bg-white"

export const themeGradients: Record<LevelTheme, string> = {
  "pre-school": "from-amber-500/10 to-yellow-500/10",
  "primary-school": "from-blue-500/10 to-sky-500/10",
  "secondary-school": "from-orange-500/10 to-amber-500/10",
  "high-school": "from-green-500/10 to-emerald-500/10",
  "university": "from-purple-500/10 to-violet-500/10",
  "business-english": "from-slate-500/10 to-gray-500/10",
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation()
  const themeInfo = getThemeFromPath(location)
  const [currentTheme, setCurrentTheme] = useState<LevelTheme>(themeInfo.theme)
  const [isDefaultTheme, setIsDefaultTheme] = useState(themeInfo.isDefault)

  useEffect(() => {
    const themeInfo = getThemeFromPath(location)
    setCurrentTheme(themeInfo.theme)
    setIsDefaultTheme(themeInfo.isDefault)
    // Set data-theme to "default" for main landing page, otherwise use the theme
    document.documentElement.setAttribute("data-theme", themeInfo.isDefault ? "default" : themeInfo.theme)
    
    document.body.classList.remove(
      "bg-amber-50", "bg-blue-50", "bg-orange-50", 
      "bg-green-50", "bg-purple-50", "bg-slate-50", "bg-white"
    )
    if (themeInfo.isDefault) {
      document.body.classList.add(defaultThemeBackground)
    } else {
      document.body.classList.add(themeBackgrounds[themeInfo.theme])
    }
    
    // Apply fallback colors if browser-fallback class is present
    if (document.documentElement.classList.contains('browser-fallback')) {
      const fallbackColors: Record<LevelTheme | "default", { bg: string }> = {
        "pre-school": { bg: "hsl(45, 60%, 97%)" },
        "primary-school": { bg: "hsl(200, 60%, 97%)" },
        "secondary-school": { bg: "hsl(25, 80%, 97%)" },
        "high-school": { bg: "hsl(120, 50%, 97%)" },
        "university": { bg: "hsl(270, 60%, 97%)" },
        "business-english": { bg: "hsl(200, 10%, 97%)" },
        "default": { bg: "hsl(0, 0%, 100%)" }
      }
      
      const theme = themeInfo.isDefault ? "default" : themeInfo.theme
      const colors = fallbackColors[theme]
      
      if (colors) {
        // Apply background color directly to body
        document.body.style.backgroundColor = colors.bg
        
        // Apply to main content areas
        const mainElements = document.querySelectorAll('main, .bg-background')
        mainElements.forEach((el) => {
          (el as HTMLElement).style.backgroundColor = colors.bg
        })
      }
    }
  }, [location])

  useEffect(() => {
    // Only update data-theme if not using default theme
    if (!isDefaultTheme) {
      document.documentElement.setAttribute("data-theme", currentTheme)
    }
  }, [currentTheme, isDefaultTheme])

  const themeBackground = isDefaultTheme ? defaultThemeBackground : themeBackgrounds[currentTheme]

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themeBackground, isDefaultTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const themeFilters: Record<LevelTheme, string> = {
  "pre-school": "hue-rotate(45deg) saturate(1.2) brightness(1.1)",
  "primary-school": "hue-rotate(200deg) saturate(1.3) brightness(1.05)",
  "secondary-school": "hue-rotate(25deg) saturate(1.4) brightness(1.08)",
  "high-school": "hue-rotate(120deg) saturate(1.2) brightness(1.08)",
  "university": "hue-rotate(270deg) saturate(1.3) brightness(0.95)",
  "business-english": "saturate(0.5) brightness(0.9) contrast(1.1)",
}

// Neutral filter for default theme
export const defaultThemeFilter = "none"

export const themeColors: Record<LevelTheme, Record<string, string>> = {
  "pre-school": {
    background: "45 60% 97%",
    foreground: "30 30% 25%",
    primary: "45 100% 70%",
    primary_foreground: "30 30% 25%",
    sidebar: "30 30% 20%",
    sidebar_foreground: "45 100% 97%",
    sidebar_primary: "45 100% 75%",
    sidebar_accent: "30 30% 30%",
  },
  "primary-school": {
    background: "200 60% 97%",
    foreground: "210 20% 20%",
    primary: "200 100% 70%",
    primary_foreground: "210 20% 20%",
    sidebar: "210 30% 12%",
    sidebar_foreground: "200 60% 90%",
    sidebar_primary: "200 100% 75%",
    sidebar_accent: "210 30% 20%",
  },
  "secondary-school": {
    background: "25 80% 97%",
    foreground: "20 30% 25%",
    primary: "25 100% 70%",
    primary_foreground: "20 30% 25%",
    sidebar: "20 40% 15%",
    sidebar_foreground: "25 80% 90%",
    sidebar_primary: "25 100% 75%",
    sidebar_accent: "20 40% 25%",
  },
  "high-school": {
    background: "120 50% 97%",
    foreground: "140 20% 20%",
    primary: "120 80% 65%",
    primary_foreground: "140 20% 20%",
    sidebar: "140 30% 12%",
    sidebar_foreground: "120 50% 90%",
    sidebar_primary: "120 80% 70%",
    sidebar_accent: "140 30% 20%",
  },
  "university": {
    background: "270 60% 97%",
    foreground: "260 20% 20%",
    primary: "270 70% 60%",
    primary_foreground: "0 0% 100%",
    sidebar: "260 30% 12%",
    sidebar_foreground: "270 60% 90%",
    sidebar_primary: "270 70% 65%",
    sidebar_accent: "260 30% 20%",
  },
  "business-english": {
    background: "200 10% 97%",
    foreground: "200 10% 20%",
    primary: "200 20% 60%",
    primary_foreground: "0 0% 100%",
    sidebar: "200 15% 15%",
    sidebar_foreground: "200 10% 90%",
    sidebar_primary: "200 20% 65%",
    sidebar_accent: "200 15% 25%",
  },
}

// Neutral theme colors for main landing page (white with black/dark grey accents)
export const defaultThemeColors: Record<string, string> = {
  background: "0 0% 100%",
  foreground: "0 0% 0%",
  primary: "0 0% 0%",
  primary_foreground: "0 0% 100%",
  sidebar: "0 0% 0%",
  sidebar_foreground: "0 0% 100%",
  sidebar_primary: "0 0% 20%",
  sidebar_accent: "0 0% 15%",
}
