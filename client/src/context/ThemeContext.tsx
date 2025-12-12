import React, { createContext, useContext, useState, useEffect } from "react"
import { useLocation } from "wouter"

export type LevelTheme = "pre-school" | "primary-school" | "secondary-school" | "high-school" | "university" | "business-english"

interface ThemeContextType {
  currentTheme: LevelTheme
  setCurrentTheme: (theme: LevelTheme) => void
  themeBackground: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getThemeFromPath(path: string): LevelTheme {
  if (path.includes("pre-school") || path.includes("okul-oncesi") || path.startsWith("/pre-school")) {
    return "pre-school"
  }
  if (path.includes("primary-school") || path.includes("grade-2") || path.includes("grade-1")) {
    return "primary-school"
  }
  if (path.includes("secondary-school")) {
    return "secondary-school"
  }
  if (path.includes("high-school")) {
    return "high-school"
  }
  if (path.includes("university")) {
    return "university"
  }
  if (path.includes("business-english")) {
    return "business-english"
  }
  return "pre-school"
}

export const themeBackgrounds: Record<LevelTheme, string> = {
  "pre-school": "bg-amber-50",
  "primary-school": "bg-blue-50",
  "secondary-school": "bg-orange-50",
  "high-school": "bg-green-50",
  "university": "bg-purple-50",
  "business-english": "bg-slate-50",
}

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
  const [currentTheme, setCurrentTheme] = useState<LevelTheme>(() => getThemeFromPath(location))

  useEffect(() => {
    const newTheme = getThemeFromPath(location)
    setCurrentTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    
    document.body.classList.remove(
      "bg-amber-50", "bg-blue-50", "bg-orange-50", 
      "bg-green-50", "bg-purple-50", "bg-slate-50"
    )
    document.body.classList.add(themeBackgrounds[newTheme])
  }, [location])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme)
  }, [currentTheme])

  const themeBackground = themeBackgrounds[currentTheme]

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themeBackground }}>
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
