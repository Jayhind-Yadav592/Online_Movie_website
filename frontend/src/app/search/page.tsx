"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import api from "@/lib/axios";
import Link from "next/link";
import { Play } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    fetchResults();
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/search/?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (error) {
      console.error("Failed to fetch search results", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 px-4 md:px-16 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-white/50 animate-pulse">Searching for "{query}"...</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-[2/3] bg-white/10 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="pt-32 px-4 md:px-16 min-h-screen text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Search CineVerse</h1>
        <p className="text-white/70">Type something in the search bar to find movies, series, and people.</p>
      </div>
    );
  }

  if (results && results.count === 0) {
    return (
      <div className="pt-32 px-4 md:px-16 min-h-screen text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">No results found for "{query}"</h1>
        <p className="text-white/70">Try searching for another movie, actor, genre, or language.</p>
      </div>
    );
  }

  const showMovies = filter === "all" || filter === "movies";
  const showSeries = filter === "all" || filter === "series";

  return (
    <div className="pt-24 px-4 md:px-16 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Search results for: "{query}"
        </h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("movies")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "movies" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
          >
            Movies
          </button>
          <button 
            onClick={() => setFilter("series")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "series" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
          >
            Series
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {showMovies && results?.movies?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white/90 mb-4">Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.movies.map((movie: any) => (
                <Link href={`/movie/${movie.slug}`} key={movie.id} className="group relative aspect-[2/3] rounded-md overflow-hidden bg-secondary transition-transform duration-300 hover:scale-105 hover:z-10 shadow-lg">
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center p-4">
                      {movie.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-12 h-12 text-white fill-white" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {showSeries && results?.series?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white/90 mb-4">Series</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.series.map((series: any) => (
                <Link href={`/series/${series.slug}`} key={series.id} className="group relative aspect-[2/3] rounded-md overflow-hidden bg-secondary transition-transform duration-300 hover:scale-105 hover:z-10 shadow-lg">
                  {series.poster ? (
                    <img src={series.poster} alt={series.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center p-4">
                      {series.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-12 h-12 text-white fill-white" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {filter === "all" && results?.people?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white/90 mb-4">People</h2>
            <div className="flex flex-wrap gap-4">
              {results.people.map((person: any) => (
                <div key={person.id} className="flex items-center gap-3 bg-white/5 rounded-full pr-6 p-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                    {person.name.charAt(0)}
                  </div>
                  <span className="text-white font-medium">{person.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <SearchContent />
      </Suspense>
    </main>
  );
}
