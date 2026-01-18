import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, ArrowRight } from "lucide-react";
import { stories } from "@/data/stories";

export default function PrimarySchoolLandingPage() {
  return (
    <Layout>
      <div className="min-h-[60vh] py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Primary School</h1>
            <p className="text-lg text-muted-foreground">
              Interactive English learning for primary school students
            </p>
          </div>

          {/* Stories Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Interactive Stories
                </h2>
                <p className="text-muted-foreground mt-1">
                  Read stories with color-coded translations and audio
                </p>
              </div>
              <Link href="/primary-school/stories">
                <Button variant="outline" className="gap-2">
                  View All Stories
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Story Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stories.slice(0, 3).map((story) => (
                <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={story.thumbnailUrl}
                      alt={story.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg mb-1">{story.title}</h3>
                      <p className="text-white/90 text-sm">{story.titleTurkish}</p>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                    {story.description && (
                      <CardDescription>{story.descriptionTurkish || story.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Link href={`/primary-school/stories/${story.id}`}>
                      <Button className="w-full gap-2">
                        <BookOpen className="h-4 w-4" />
                        Read Story
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {stories.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Stories coming soon!</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}
