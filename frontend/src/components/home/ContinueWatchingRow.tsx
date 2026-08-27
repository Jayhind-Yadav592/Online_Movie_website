"use client";

import { useEffect, useState } from "react";
import { getWatchHistory } from "@/services/interactionService";
import Link from "next/link";
import { Play } from "lucide-react";

export default function ContinueWatchingRow() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    getWatchHistory().then(data => setHistory(data.results || data)).catch(console.error);
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="py-6 px-4 md:px-16 group/row relative z-20">
      <h2 className="text-xl md:text-2xl font-bold text-foreground/90 hover:text-foreground transition-colors mb-4">Continue Watching for You</h2>
      
      <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x">
        {history.map((item) => (
          <div key={item.id} className="relative min-w-[200px] md:min-w-[280px] aspect-video rounded-md overflow-hidden group snap-start bg-secondary transition-transform duration-300 hover:scale-105 hover:z-20 origin-center cursor-pointer">
            <img src={item.movie_details.backdrop} alt={item.movie_details.title} className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={`/watch/${item.movie_details.slug}`} className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors text-white">
                <Play className="w-6 h-6 fill-current ml-1" />
              </Link>
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-black/60 p-2">
              <h3 className="font-semibold text-sm text-white mb-2 line-clamp-1">{item.movie_details.title}</h3>
              <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 rounded-full" 
                  style={{ width: `${Math.min(100, (item.progress_seconds / item.duration_seconds) * 100)}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
