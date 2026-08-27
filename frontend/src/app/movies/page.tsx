import Header from "@/components/layout/Header";
import MovieRow from "@/components/home/MovieRow";

export default function MoviesPage() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Header />
      <div className="container mx-auto px-4 md:px-16 mb-8">
        <h1 className="text-3xl font-bold mb-2">Movies</h1>
        <p className="text-muted-foreground">Browse all movies by genre and category.</p>
      </div>

      <div className="space-y-6">
        <MovieRow title="Action & Adventure" params={{ genres__slug: 'action' }} />
        <MovieRow title="Sci-Fi & Fantasy" params={{ genres__slug: 'sci-fi' }} />
        <MovieRow title="Comedies" params={{ genres__slug: 'comedy' }} />
        <MovieRow title="Dramas" params={{ genres__slug: 'drama' }} />
      </div>
    </main>
  );
}
