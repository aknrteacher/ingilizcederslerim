import React, { createContext, useContext, useState } from "react"

export type LevelTheme = "pre-school" | "primary-school" | "secondary-school" | "high-school" | "university" | "business-english"

interface ThemeContextType {
  currentTheme: LevelTheme
  setCurrentTheme: (theme: LevelTheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<LevelTheme>("pre-school")

  // Apply theme to document
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme)
  }, [currentTheme])

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
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

export const themeLogos: Record<LevelTheme, string> = {
  "pre-school": "/attached_assets/generated_images/logo_in_pastel_yellow.png",
  "primary-school": "/attached_assets/generated_images/logo_in_pastel_blue.png",
  "secondary-school": "/attached_assets/generated_images/logo_in_pastel_orange.png",
  "high-school": "/attached_assets/generated_images/logo_in_pastel_green.png",
  "university": "/attached_assets/generated_images/logo_in_purple.png",
  "business-english": "/attached_assets/generated_images/logo_in_gray.png",
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
