"use client";

import { useEffect, useState } from "react";
import { getFeaturedMovie, Movie } from "@/services/movieService";
import Link from "next/link";
import { Play, Plus, Info } from "lucide-react";

export default function Hero() {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    getFeaturedMovie().then(setMovie);
  }, []);

  if (!movie) {
    return <div className="h-[70vh] w-full bg-secondary animate-pulse" />;
  }

  return (
    <div className="relative h-[85vh] w-full">
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={movie.backdrop} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-end pb-24 px-4 md:px-16 container mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 max-w-3xl drop-shadow-md">
          {movie.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm md:text-base font-medium text-muted-foreground mb-6">
          {movie.rating > 0 && (
            <span className="text-green-500 font-bold">{movie.rating * 10}% Match</span>
          )}
          <span>{new Date(movie.release_date).getFullYear()}</span>
          {movie.certification && (
            <span className="border border-muted-foreground px-2 py-0.5 rounded text-xs">
              {movie.certification}
            </span>
          )}
          <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/watch/${movie.slug}`} className="flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-md font-semibold hover:bg-foreground/80 transition-colors">
            <Play className="w-5 h-5 fill-current" />
            Watch Now
          </Link>
          <Link href={`/movie/${movie.slug}`} className="flex items-center gap-2 bg-secondary/80 text-foreground px-6 py-3 rounded-md font-semibold hover:bg-secondary transition-colors backdrop-blur-sm">
            <Info className="w-5 h-5" />
            More Info
          </Link>
          <button className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-muted hover:border-foreground transition-colors bg-background/20 backdrop-blur-sm ml-2">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
