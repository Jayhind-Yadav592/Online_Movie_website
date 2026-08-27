"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Movie } from "@/services/movieService";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Play, Plus, Share2 } from "lucide-react";

export default function MovieDetails() {
  const { slug } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      api.get(`/movies/${slug}/`).then((res) => {
        setMovie(res.data);
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="h-[70vh] w-full bg-secondary animate-pulse" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Header />
        <h1 className="text-2xl font-bold">Movie not found</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="relative h-[80vh] w-full">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={movie.backdrop} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>

        <div className="relative h-full flex flex-col justify-end pb-12 px-4 md:px-16 container mx-auto">
          <div className="max-w-4xl flex flex-col md:flex-row gap-8 items-end">
            <img src={movie.poster} alt={movie.title} className="hidden md:block w-64 rounded-lg shadow-2xl shadow-black/50" />
            
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 drop-shadow-md">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-muted-foreground mb-6">
                <span className="text-green-500 font-bold">{movie.rating * 10}% Match</span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
                {movie.certification && (
                  <span className="border border-muted-foreground px-2 py-0.5 rounded text-xs text-foreground">
                    {movie.certification}
                  </span>
                )}
                <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                <span className="text-primary border border-primary px-2 py-0.5 rounded text-xs">HD</span>
              </div>

              <p className="text-lg text-foreground/90 max-w-2xl mb-8 leading-relaxed">
                {movie.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-muted-foreground">Genres:</span>
                {movie.genres.map(g => (
                  <Link key={g.id} href={`/movies?genre=${g.slug}`} className="text-foreground hover:text-primary transition-colors">
                    {g.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Link href={`/watch/${movie.slug}`} className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </Link>
                <button className="flex items-center gap-2 bg-secondary text-foreground px-6 py-3 rounded-md font-semibold hover:bg-secondary/80 transition-colors">
                  <Plus className="w-5 h-5" />
                  Add to Watchlist
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-md bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ML Recommendation Engine: More Like This */}
      <div className="container mx-auto px-4 md:px-16 py-12">
        <h2 className="text-2xl font-bold mb-6">More Like This</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MLRecommendations slug={movie.slug} />
        </div>
      </div>
    </main>
  );
}

function MLRecommendations({ slug }: { slug: string }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call the independent Python ML Microservice running on port 8002
    fetch(`http://127.0.0.1:8002/api/v1/recommend/similar/${slug}`)
      .then(res => res.json())
      .then(data => {
        setRecommendations(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("ML Engine Error:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <>
        {[1,2,3,4,5].map(i => <div key={i} className="aspect-[2/3] bg-secondary animate-pulse rounded-md" />)}
      </>
    );
  }

  if (recommendations.length === 0) {
    return <p className="text-muted-foreground col-span-full">No recommendations available at this time.</p>;
  }

  return (
    <>
      {recommendations.map(movie => (
        <Link href={`/movie/${movie.slug}`} key={movie.id} className="group relative aspect-[2/3] rounded-md overflow-hidden bg-secondary transition-transform duration-300 hover:scale-105 hover:z-10 cursor-pointer">
          <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4">
            <Play className="w-12 h-12 fill-white text-white mb-2" />
            <h3 className="font-bold text-center text-sm">{movie.title}</h3>
            <span className="text-green-500 text-xs font-bold mt-1">{movie.rating * 10}% Match</span>
          </div>
        </Link>
      ))}
    </>
  );
}
