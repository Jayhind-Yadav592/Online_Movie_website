"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/services/movieService";
import Link from "next/link";
import { Play, Plus, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface MovieRowProps {
  title: string;
  params?: any;
  isTop10?: boolean;
}

export default function MovieRow({ title, params = {}, isTop10 = false }: MovieRowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/services/movieService").then(({ getMovies }) => {
      getMovies(params).then((data) => {
        setMovies(data);
        setLoading(false);
      });
    });
  }, [JSON.stringify(params)]);

  if (loading) {
    return (
      <div className="py-6 px-4 md:px-16">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="min-w-[160px] md:min-w-[220px] aspect-[2/3] bg-secondary animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <div className="py-6 px-4 md:px-16 group/row relative z-20">
      <div className="flex items-center gap-2 mb-4 cursor-pointer">
        <h2 className="text-xl md:text-2xl font-bold text-foreground/90 hover:text-foreground transition-colors">{title}</h2>
        <ChevronRight className="w-5 h-5 opacity-0 group-hover/row:opacity-100 transition-opacity text-primary" />
      </div>
      
      <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x items-center">
        {movies.map((movie, idx) => (
          <div key={movie.id} className={clsx("relative flex items-center shrink-0 snap-start", isTop10 ? "w-[200px] md:w-[280px]" : "w-[140px] md:w-[200px]")}>
            
            {isTop10 && (
              <div className="absolute -left-4 md:-left-8 bottom-0 z-10 font-black tracking-tighter text-[100px] md:text-[140px] leading-none select-none text-black drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]" style={{ WebkitTextStroke: '2px #595959' }}>
                {idx + 1}
              </div>
            )}

            <div className={clsx("relative aspect-[2/3] rounded-md overflow-hidden group bg-secondary transition-transform duration-300 hover:scale-105 hover:z-20 origin-center cursor-pointer w-full ml-auto", isTop10 ? "w-[75%]" : "")}>
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-sm line-clamp-2 mb-2">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <span className="border border-muted-foreground/50 px-1 rounded">{movie.certification || 'U'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/watch/${movie.slug}`} className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </Link>
                    <button className="w-8 h-8 rounded-full border border-muted-foreground text-muted-foreground flex items-center justify-center hover:border-foreground hover:text-foreground transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
