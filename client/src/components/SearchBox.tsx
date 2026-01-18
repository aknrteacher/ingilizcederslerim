import * as React from "react"
import { Search } from "lucide-react"
import { useLocation } from "wouter"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { type LevelTheme } from "@/context/ThemeContext"

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
      { title: `Kelime Kartları - Ünite ${i}`, href: `/primary-school/grade-3/unit-${i}/vocab`, category: `3. Sınıf - Ünite ${i}`, theme: "primary-school" },
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
      { title: `Kelime Kartları - Ünite ${i}`, href: `/primary-school/grade-4/unit-${i}/vocab`, category: `4. Sınıf - Ünite ${i}`, theme: "primary-school" },
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

  const filteredItems = React.useMemo(() => {
    if (!searchValue.trim()) {
      return searchableItems.slice(0, 20) // Show top 20 items when no search
    }

    const query = searchValue.toLowerCase().trim()
    return searchableItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query)
      const categoryMatch = item.category.toLowerCase().includes(query)
      return titleMatch || categoryMatch
    })
  }, [searchValue])

  // Group items by category
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

  const inputRef = React.useRef<HTMLInputElement>(null)

  // Auto-focus the CommandInput when popover opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure the popover is fully rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative", className)}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <PopoverTrigger asChild>
          <input
            type="text"
            placeholder="Dersleri ara..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            className="h-9 w-48 sm:w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            ref={inputRef}
            placeholder="Dersleri ara..." 
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value)
            }}
          />
          <CommandList>
            <CommandEmpty>
              {searchValue.trim() ? "Sonuç bulunamadı." : "Aramak için yazın..."}
            </CommandEmpty>
            {Object.entries(groupedItems).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={item.title}
                    onSelect={() => handleSelect(item.href)}
                    className="cursor-pointer"
                  >
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

