"use client";

import { useEffect, useState } from "react";
import { getWatchlist } from "@/services/interactionService";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Play } from "lucide-react";

export default function MyList() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWatchlist().then(data => {
      setWatchlist(data.results || data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4 md:px-16 min-h-screen pb-20">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">My List</h1>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[2/3] bg-white/10 animate-pulse rounded-md" />
            ))}
          </div>
        ) : watchlist.length === 0 ? (
          <div className="text-center py-20 text-white/50">
            <h2 className="text-xl mb-2">Your list is empty</h2>
            <p>Add movies and TV shows to your list so you can easily find them later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((item) => (
              <Link href={`/movie/${item.movie_details.slug}`} key={item.id} className="group relative aspect-[2/3] rounded-md overflow-hidden bg-secondary transition-transform duration-300 hover:scale-105 hover:z-10 shadow-lg">
                <img src={item.movie_details.poster} alt={item.movie_details.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white fill-white" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
