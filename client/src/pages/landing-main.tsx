import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { ArrowRight, Sparkles, Clock, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { nowWorkingOnList, lastAddedList, type LandingLevel } from "@/data/landing-updates";

const LEVELS = [
  { title: "Okul Öncesi & 1. Sınıf", href: "/pre-school", color: "bg-amber-200 dark:bg-amber-500/30 text-amber-900 dark:text-amber-100 border-amber-400/50 hover:bg-amber-300 dark:hover:bg-amber-500/40" },
  { title: "İlkokul", href: "/primary-school", color: "bg-sky-200 dark:bg-sky-500/30 text-sky-900 dark:text-sky-100 border-sky-400/50 hover:bg-sky-300 dark:hover:bg-sky-500/40" },
  { title: "Ortaokul", href: "/secondary-school", color: "bg-orange-200 dark:bg-orange-500/30 text-orange-900 dark:text-orange-100 border-orange-400/50 hover:bg-orange-300 dark:hover:bg-orange-500/40" },
  { title: "Lise", href: "/high-school", color: "bg-emerald-200 dark:bg-emerald-500/30 text-emerald-900 dark:text-emerald-100 border-emerald-400/50 hover:bg-emerald-300 dark:hover:bg-emerald-500/40" },
  { title: "Üniversite", href: "/university", color: "bg-violet-200 dark:bg-violet-500/30 text-violet-900 dark:text-violet-100 border-violet-400/50 hover:bg-violet-300 dark:hover:bg-violet-500/40" },
  { title: "İş İngilizcesi", href: "/business-english", color: "bg-slate-200 dark:bg-slate-500/30 text-slate-900 dark:text-slate-100 border-slate-400/50 hover:bg-slate-300 dark:hover:bg-slate-500/40" },
] as const;

/** Accent colors per level for Working On / Last Added cards — match level rectangles. */
const LEVEL_ACCENTS: Record<
  LandingLevel,
  {
    border: string;
    iconBg: string;
    iconText: string;
    label: string;
    link: string;
    blob: string;
    dots: string;
  }
> = {
  "pre-school": {
    border: "border-l-amber-400 dark:border-l-amber-500",
    iconBg: "bg-amber-100 dark:bg-amber-500/40",
    iconText: "text-amber-700 dark:text-amber-200",
    label: "text-amber-600 dark:text-amber-400",
    link: "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300",
    blob: "text-amber-300/40 dark:text-amber-500/30",
    dots: "bg-amber-400/50 dark:bg-amber-500/40",
  },
  "primary-school": {
    border: "border-l-sky-400 dark:border-l-sky-500",
    iconBg: "bg-sky-100 dark:bg-sky-500/40",
    iconText: "text-sky-700 dark:text-sky-200",
    label: "text-sky-600 dark:text-sky-400",
    link: "text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300",
    blob: "text-sky-300/40 dark:text-sky-500/30",
    dots: "bg-sky-400/50 dark:bg-sky-500/40",
  },
  "secondary-school": {
    border: "border-l-orange-400 dark:border-l-orange-500",
    iconBg: "bg-orange-100 dark:bg-orange-500/40",
    iconText: "text-orange-700 dark:text-orange-200",
    label: "text-orange-600 dark:text-orange-400",
    link: "text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300",
    blob: "text-orange-300/40 dark:text-orange-500/30",
    dots: "bg-orange-400/50 dark:bg-orange-500/40",
  },
  "high-school": {
    border: "border-l-emerald-400 dark:border-l-emerald-500",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/40",
    iconText: "text-emerald-700 dark:text-emerald-200",
    label: "text-emerald-600 dark:text-emerald-400",
    link: "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300",
    blob: "text-emerald-300/40 dark:text-emerald-500/30",
    dots: "bg-emerald-400/50 dark:bg-emerald-500/40",
  },
  "university": {
    border: "border-l-violet-400 dark:border-l-violet-500",
    iconBg: "bg-violet-100 dark:bg-violet-500/40",
    iconText: "text-violet-700 dark:text-violet-200",
    label: "text-violet-600 dark:text-violet-400",
    link: "text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300",
    blob: "text-violet-300/40 dark:text-violet-500/30",
    dots: "bg-violet-400/50 dark:bg-violet-500/40",
  },
  "business-english": {
    border: "border-l-slate-400 dark:border-l-slate-500",
    iconBg: "bg-slate-100 dark:bg-slate-500/40",
    iconText: "text-slate-700 dark:text-slate-200",
    label: "text-slate-600 dark:text-slate-400",
    link: "text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
    blob: "text-slate-300/40 dark:text-slate-500/30",
    dots: "bg-slate-400/50 dark:bg-slate-500/40",
  },
};

/** Cute bubble/circle graphics for corner — color via className (e.g. text-amber-300/40). */
function BlobGraphic({ className }: { className?: string }) {
  return (
    <svg
      className={`absolute -right-1 -top-1 h-16 w-16 overflow-visible sm:h-20 sm:w-20 ${className}`}
      viewBox="0 0 80 80"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="55" cy="25" r="18" opacity="0.5" />
      <circle cx="70" cy="45" r="14" opacity="0.35" />
    </svg>
  );
}

/** Small dots for a soft pattern */
function DotsPattern({ dotClass }: { dotClass: string }) {
  return (
    <div className="absolute right-4 top-5 flex gap-1 sm:right-5 sm:top-6 sm:gap-1.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${dotClass}`} />
      ))}
    </div>
  );
}

function UpdateCard({
  item,
  icon: Icon,
  label,
}: {
  item: { title: string; href: string; description?: string; addedAt?: string; level: LandingLevel };
  icon: React.ElementType;
  label?: string;
}) {
  const accent = LEVEL_ACCENTS[item.level];
  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 border-l-4 border-border bg-card p-3 shadow-sm transition-all hover:shadow-md sm:p-4 ${accent.border}`}
    >
      <BlobGraphic className={accent.blob} />
      <DotsPattern dotClass={accent.dots} />
      <div className="relative flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${accent.iconBg} ${accent.iconText}`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0 flex-1">
          {label ? (
            <p className={`text-[10px] font-semibold uppercase tracking-wider sm:text-xs ${accent.label}`}>{label}</p>
          ) : null}
          <h3 className={label ? "mt-0.5 line-clamp-2 text-sm font-semibold text-foreground sm:text-base" : "line-clamp-2 text-sm font-semibold text-foreground sm:text-base"}>{item.title}</h3>
          {item.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
          )}
          {item.addedAt && (
            <p className="mt-1 text-[10px] text-muted-foreground/80">{item.addedAt}</p>
          )}
          <Link href={item.href}>
            <Button variant="ghost" size="sm" className={`mt-1.5 -ml-2 h-8 text-xs sm:mt-2 ${accent.link}`}>
              Git <ArrowRight className="ml-0.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MainLandingPage() {
  const [workingOnIndex, setWorkingOnIndex] = useState(0);
  const [lastAddedIndex, setLastAddedIndex] = useState(0);
  const workingOnItem = nowWorkingOnList[workingOnIndex];
  const lastAddedItem = lastAddedList[lastAddedIndex];

  const prevWorkingOn = () => setWorkingOnIndex((i) => (i - 1 + nowWorkingOnList.length) % nowWorkingOnList.length);
  const nextWorkingOn = () => setWorkingOnIndex((i) => (i + 1) % nowWorkingOnList.length);
  const prevLastAdded = () => setLastAddedIndex((i) => (i - 1 + lastAddedList.length) % lastAddedList.length);
  const nextLastAdded = () => setLastAddedIndex((i) => (i + 1) % lastAddedList.length);

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-5rem)] flex-col gap-3 py-3 sm:gap-4 sm:py-4">
        {/* Now Working On + Last Added — same-size carousels, overlay arrows */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 sm:items-start">
          <div className="flex flex-col gap-1.5 sm:gap-2 min-h-[260px] sm:min-h-[280px]">
            <h2 className="flex items-center gap-1.5 text-base font-bold text-foreground sm:text-lg shrink-0">
              <Sparkles className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
              Üzerinde Çalışılan Bölümler
            </h2>
            <div className="relative flex-1 min-h-[220px] sm:min-h-[240px] rounded-xl border border-border bg-muted/20 overflow-hidden">
              <div className="absolute inset-0 p-2 sm:p-3 flex items-center">
                <UpdateCard item={workingOnItem} icon={Clock} />
              </div>
              <button
                type="button"
                onClick={prevWorkingOn}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/80 dark:bg-black/40 text-foreground/90 hover:bg-white dark:hover:bg-black/60 hover:text-primary shadow-md border border-border/50 backdrop-blur-sm transition-all hover:scale-105"
                aria-label="Önceki"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                type="button"
                onClick={nextWorkingOn}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/80 dark:bg-black/40 text-foreground/90 hover:bg-white dark:hover:bg-black/60 hover:text-primary shadow-md border border-border/50 backdrop-blur-sm transition-all hover:scale-105"
                aria-label="Sonraki"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 sm:gap-2 min-h-[260px] sm:min-h-[280px]">
            <h2 className="flex items-center gap-1.5 text-base font-bold text-foreground sm:text-lg shrink-0">
              <BookOpen className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
              Son Eklenen
            </h2>
            <div className="relative flex-1 min-h-[220px] sm:min-h-[240px] rounded-xl border border-border bg-muted/20 overflow-hidden">
              <div className="absolute inset-0 p-2 sm:p-3 flex items-center">
                <UpdateCard item={lastAddedItem} icon={BookOpen} />
              </div>
              <button
                type="button"
                onClick={prevLastAdded}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/80 dark:bg-black/40 text-foreground/90 hover:bg-white dark:hover:bg-black/60 hover:text-primary shadow-md border border-border/50 backdrop-blur-sm transition-all hover:scale-105"
                aria-label="Önceki"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                type="button"
                onClick={nextLastAdded}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/80 dark:bg-black/40 text-foreground/90 hover:bg-white dark:hover:bg-black/60 hover:text-primary shadow-md border border-border/50 backdrop-blur-sm transition-all hover:scale-105"
                aria-label="Sonraki"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Level rectangles — compact, fits below */}
        <section className="flex min-h-0 flex-1 flex-col gap-2 sm:gap-3">
          <h2 className="text-base font-bold text-foreground sm:text-lg">Seviyeler</h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {LEVELS.map((level) => (
              <Link key={level.href} href={level.href}>
                <div
                  className={`rounded-xl border-2 p-3 text-left text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] sm:p-4 sm:text-base ${level.color}`}
                >
                  {level.title}
                  <ArrowRight className="mt-1 inline-block h-4 w-4 opacity-80 sm:mt-1.5 sm:h-5 sm:w-5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
