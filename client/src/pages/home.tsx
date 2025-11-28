import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock, Trophy, Star } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your progress and continue where you left off.
            </p>
          </div>
          <Button size="lg" className="gap-2 shadow-lg">
            Resume Learning <ArrowRight className="h-4 w-4" />
          </Button>
        </section>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5h</div>
              <p className="text-xs text-muted-foreground">+2.5h from last week</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">85% accuracy rate</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 Days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,450</div>
              <p className="text-xs text-muted-foreground">Top 10% of students</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Split */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Current Course - Takes up 2 columns */}
          <Card className="lg:col-span-2 shadow-md border-none ring-1 ring-black/5">
            <CardHeader>
              <CardTitle>Current Course: Business English B1</CardTitle>
              <CardDescription>Module 3: Email Etiquette & Formal Communication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Module Progress</span>
                  <span className="text-muted-foreground">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4 hover:bg-secondary/50 transition-colors cursor-pointer group">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    1
                  </div>
                  <h3 className="font-semibold">Formal Greetings</h3>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="rounded-lg border p-4 hover:bg-secondary/50 transition-colors cursor-pointer group">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    2
                  </div>
                  <h3 className="font-semibold">Structuring Requests</h3>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div className="rounded-lg border p-4 hover:bg-secondary/50 transition-colors cursor-pointer opacity-60">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    3
                  </div>
                  <h3 className="font-semibold">Sign-offs</h3>
                  <p className="text-sm text-muted-foreground">Locked</p>
                </div>
                <div className="rounded-lg border p-4 hover:bg-secondary/50 transition-colors cursor-pointer opacity-60">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    4
                  </div>
                  <h3 className="font-semibold">Final Quiz</h3>
                  <p className="text-sm text-muted-foreground">Locked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar - Recommended */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Daily Vocabulary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-secondary p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-primary">Ubiquitous</h4>
                      <span className="text-xs italic text-muted-foreground">/juːˈbɪk.wɪ.təs/ • Adjective</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-foreground/80">
                    Present, appearing, or found everywhere.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground border-l-2 border-primary/30 pl-2">
                    "Mobile phones are becoming ubiquitous in daily life."
                  </p>
                </div>
                <Button variant="outline" className="w-full">View Past Words</Button>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Pro Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90">
                  Listening to English podcasts for just 15 minutes a day can improve your comprehension by 40% over a month.
                </p>
                <Button variant="secondary" className="mt-4 w-full text-primary hover:bg-white/90">
                  Browse Podcasts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
