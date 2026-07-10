import * as React from "react"
import { Search } from "lucide-react"
import { useLocation } from "wouter"
import { cn } from "@/lib/utils"
import { type LevelTheme } from "@/context/ThemeContext"
import { grade4VocabHref } from "@/lib/primarySchoolPaths"

// Navigation item structure
type SearchableItem = {
  title: string
  href: string
  category: string
  theme?: LevelTheme
}

// Flatten navigation structure for search
function flattenNavItems(): SearchableItem[] {
  const items: SearchableItem[] = []

  // Pre-school items
  items.push(
    { title: "Okul Öncesi & 1. Sınıf", href: "/pre-school", category: "Seviye", theme: "pre-school" },
    { title: "Kelime Kartları", href: "/pre-school/kelime-kartlari", category: "Okul Öncesi & 1. Sınıf", theme: "pre-school" },
    { title: "Oyunlar", href: "/pre-school/games", category: "Okul Öncesi & 1. Sınıf", theme: "pre-school" },
    { title: "Şarkılar", href: "/pre-school/songs", category: "Okul Öncesi & 1. Sınıf", theme: "pre-school" },
    { title: "Hikayeler", href: "/pre-school/stories", category: "Okul Öncesi & 1. Sınıf", theme: "pre-school" },
    { title: "El İşi", href: "/pre-school/crafts", category: "Okul Öncesi & 1. Sınıf", theme: "pre-school" },
  )

  // Primary school - Grade 2
  items.push(
    { title: "İlkokul", href: "/primary-school", category: "Seviye", theme: "primary-school" },
    { title: "2. Sınıf", href: "/primary-school", category: "İlkokul", theme: "primary-school" },
  )

  // Grade 2 Themes
  for (let i = 1; i <= 6; i++) {
    items.push(
      { title: `Tema ${i}`, href: `/primary-school/grade-2/theme-${i}/games`, category: "2. Sınıf", theme: "primary-school" },
      { title: `Kelime Kartları - Tema ${i}`, href: `/primary-school/grade-2/theme-${i}/2.${i}-vocab`, category: `2. Sınıf - Tema ${i}`, theme: "primary-school" },
      { title: `Oyunlar - Tema ${i}`, href: `/primary-school/grade-2/theme-${i}/games`, category: `2. Sınıf - Tema ${i}`, theme: "primary-school" },
      { title: `Şarkılar - Tema ${i}`, href: `/primary-school/grade-2/theme-${i}/songs`, category: `2. Sınıf - Tema ${i}`, theme: "primary-school" },
      { title: `Hikayeler - Tema ${i}`, href: `/primary-school/grade-2/theme-${i}/stories`, category: `2. Sınıf - Tema ${i}`, theme: "primary-school" },
      { title: `Alıştırmalar - Tema ${i}`, href: `/primary-school/grade-2/theme-${i}/exercises`, category: `2. Sınıf - Tema ${i}`, theme: "primary-school" },
      { title: `Çalışma Kağıtları - Tema ${i}`, href: `/primary-school/grade-2/theme-${i}/worksheets`, category: `2. Sınıf - Tema ${i}`, theme: "primary-school" },
    )
  }

  // Grade 3 Units
  items.push(
    { title: "3. Sınıf", href: "/primary-school", category: "İlkokul", theme: "primary-school" },
  )
  for (let i = 1; i <= 10; i++) {
    items.push(
      { title: `Ünite ${i}`, href: `/primary-school/grade-3/unit-${i}/games`, category: "3. Sınıf", theme: "primary-school" },
      { title: `Kelime Kartları - Ünite ${i}`, href: `/primary-school/grade-3/unit-${i}/3.${i}-vocab`, category: `3. Sınıf - Ünite ${i}`, theme: "primary-school" },
      { title: `Oyunlar - Ünite ${i}`, href: `/primary-school/grade-3/unit-${i}/games`, category: `3. Sınıf - Ünite ${i}`, theme: "primary-school" },
      { title: `Şarkılar - Ünite ${i}`, href: `/primary-school/grade-3/unit-${i}/songs`, category: `3. Sınıf - Ünite ${i}`, theme: "primary-school" },
      { title: `Hikayeler - Ünite ${i}`, href: `/primary-school/grade-3/unit-${i}/stories`, category: `3. Sınıf - Ünite ${i}`, theme: "primary-school" },
      { title: `Alıştırmalar - Ünite ${i}`, href: `/primary-school/grade-3/unit-${i}/exercises`, category: `3. Sınıf - Ünite ${i}`, theme: "primary-school" },
      { title: `Çalışma Kağıtları - Ünite ${i}`, href: `/primary-school/grade-3/unit-${i}/worksheets`, category: `3. Sınıf - Ünite ${i}`, theme: "primary-school" },
    )
  }

  // Grade 4 Units
  items.push(
    { title: "4. Sınıf", href: "/primary-school", category: "İlkokul", theme: "primary-school" },
  )
  for (let i = 1; i <= 10; i++) {
    items.push(
      { title: `Ünite ${i}`, href: `/primary-school/grade-4/unit-${i}/games`, category: "4. Sınıf", theme: "primary-school" },
      { title: `Kelime Kartları - Ünite ${i}`, href: grade4VocabHref(i), category: `4. Sınıf - Ünite ${i}`, theme: "primary-school" },
      { title: `Oyunlar - Ünite ${i}`, href: `/primary-school/grade-4/unit-${i}/games`, category: `4. Sınıf - Ünite ${i}`, theme: "primary-school" },
      { title: `Şarkılar - Ünite ${i}`, href: `/primary-school/grade-4/unit-${i}/songs`, category: `4. Sınıf - Ünite ${i}`, theme: "primary-school" },
      { title: `Hikayeler - Ünite ${i}`, href: `/primary-school/grade-4/unit-${i}/stories`, category: `4. Sınıf - Ünite ${i}`, theme: "primary-school" },
      { title: `Alıştırmalar - Ünite ${i}`, href: `/primary-school/grade-4/unit-${i}/exercises`, category: `4. Sınıf - Ünite ${i}`, theme: "primary-school" },
      { title: `Çalışma Kağıtları - Ünite ${i}`, href: `/primary-school/grade-4/unit-${i}/worksheets`, category: `4. Sınıf - Ünite ${i}`, theme: "primary-school" },
    )
  }

  // Other levels
  items.push(
    { title: "Ortaokul", href: "/secondary-school", category: "Seviye", theme: "secondary-school" },
    { title: "Lise", href: "/high-school", category: "Seviye", theme: "high-school" },
    { title: "Üniversite", href: "/university", category: "Seviye", theme: "university" },
    { title: "İş İngilizcesi", href: "/business-english", category: "Seviye", theme: "business-english" },
  )

  return items
}

const searchableItems = flattenNavItems()

interface SearchBoxProps {
  className?: string
}

export function SearchBox({ className }: SearchBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [, setLocation] = useLocation()
  const containerRef = React.useRef<HTMLDivElement>(null)

  const filteredItems = React.useMemo(() => {
    if (!searchValue.trim()) {
      return searchableItems.slice(0, 20)
    }

    const query = searchValue.toLowerCase().trim()
    return searchableItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query)
      const categoryMatch = item.category.toLowerCase().includes(query)
      return titleMatch || categoryMatch
    })
  }, [searchValue])

  const groupedItems = React.useMemo(() => {
    const groups: Record<string, SearchableItem[]> = {}
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })
    return groups
  }, [filteredItems])

  const handleSelect = (href: string) => {
    setLocation(href)
    setOpen(false)
    setSearchValue("")
  }

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <label htmlFor="site-search" className="sr-only">
        Dersleri ara
      </label>
      <Search
        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none z-10"
        aria-hidden
      />
      <input
        id="site-search"
        type="search"
        placeholder="Dersleri ara..."
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        className="h-9 w-48 sm:w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />

      {open && (
        <div
          role="region"
          aria-label="Arama sonuçları"
          className="absolute top-full left-0 z-50 mt-1 w-full min-w-[12rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredItems.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {searchValue.trim() ? "Sonuç bulunamadı." : "Aramak için yazın..."}
              </p>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="overflow-hidden p-1">
                  <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{category}</p>
                  <ul className="space-y-0.5">
                    {items.map((item) => (
                      <li key={`${item.href}-${item.title}`}>
                        <button
                          type="button"
                          onClick={() => handleSelect(item.href)}
                          className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
