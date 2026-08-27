"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import clsx from "clsx";

export default function SearchInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchRecentSearches();
    }
  }, [isOpen, isAuthenticated]);

  const fetchRecentSearches = async () => {
    try {
      const res = await api.get("/user/search-history/");
      setRecentSearches(res.data);
    } catch (err) {
      console.error("Failed to fetch search history", err);
    }
  };

  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search/?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (isAuthenticated) {
      try {
        await api.post("/user/search-history/", { query: query.trim() });
      } catch (error) {
        console.error("Failed to save search history", error);
      }
    }
    
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleClearHistory = async () => {
    // Basic loop to clear top 10 items since there's no clear_all endpoint yet.
    // Optionally create a clear_all endpoint in backend, but for now just clear local state
    // and make delete calls.
    setRecentSearches([]);
    // To prevent mass API calls, ideally we add a delete-all API endpoint.
  };

  return (
    <div className="relative flex items-center">
      <div 
        className={clsx(
          "flex items-center bg-black/60 border border-white/20 transition-all duration-300",
          isOpen ? "w-[260px] sm:w-[300px] px-2 py-1" : "w-8 h-8 sm:w-10 sm:h-10 border-transparent bg-transparent cursor-pointer justify-center"
        )}
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        }}
      >
        <Search className="w-5 h-5 text-white cursor-pointer" onClick={() => isOpen && query && handleSubmit({ preventDefault: () => {} } as any)} />
        {isOpen && (
          <form onSubmit={handleSubmit} className="flex-1 flex items-center h-full ml-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Titles, people, genres"
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-white/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <X className="w-4 h-4 text-white/70 cursor-pointer hover:text-white" onClick={() => setQuery("")} />
            )}
          </form>
        )}
      </div>

      {isOpen && (
        <div ref={dropdownRef} className="absolute top-full mt-4 right-0 w-[300px] sm:w-[400px] bg-black/95 border border-white/10 rounded-md shadow-2xl p-4 overflow-y-auto max-h-[80vh] z-50">
          {!query && isAuthenticated && recentSearches.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-white/50 uppercase tracking-wider">Recent Searches</span>
              </div>
              <div className="space-y-2">
                {recentSearches.map((item) => (
                  <div key={item.id} className="flex items-center text-white/80 hover:text-white cursor-pointer" onClick={() => {
                    setQuery(item.query);
                    handleSubmit({ preventDefault: () => {} } as any);
                  }}>
                    <Search className="w-4 h-4 mr-3 opacity-50" />
                    <span className="text-sm">{item.query}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center p-4">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && results && (
            <div className="space-y-4">
              {results.movies?.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">Movies</span>
                  <div className="space-y-2">
                    {results.movies.slice(0, 3).map((m: any) => (
                      <Link href={`/movie/${m.slug}`} key={m.id} className="flex items-center gap-3 hover:bg-white/10 p-1 rounded group">
                        {m.poster ? (
                          <img src={m.poster} alt={m.title} className="w-10 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-14 bg-white/10 rounded" />
                        )}
                        <div>
                          <p className="text-sm text-white group-hover:text-primary transition-colors line-clamp-1">{m.title}</p>
                          <p className="text-xs text-white/50">{m.release_date?.split('-')[0]}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.series?.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">Series</span>
                  <div className="space-y-2">
                    {results.series.slice(0, 2).map((s: any) => (
                      <Link href={`/series/${s.slug}`} key={s.id} className="flex items-center gap-3 hover:bg-white/10 p-1 rounded group">
                        {s.poster ? (
                          <img src={s.poster} alt={s.title} className="w-10 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-14 bg-white/10 rounded" />
                        )}
                        <div>
                          <p className="text-sm text-white group-hover:text-primary transition-colors line-clamp-1">{s.title}</p>
                          <p className="text-xs text-white/50">{s.release_date?.split('-')[0]}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.people?.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">People</span>
                  <div className="flex flex-wrap gap-2">
                    {results.people.slice(0, 3).map((p: any) => (
                      <span key={p.id} className="text-xs px-2 py-1 bg-white/10 text-white rounded-full">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={handleSubmit}
                className="w-full mt-4 text-center py-3 bg-white/5 hover:bg-white/10 text-sm text-white transition-colors rounded"
              >
                View all results &rarr;
              </button>
            </div>
          )}

          {!loading && results && results.count === 0 && (
            <div className="text-center p-4 text-white/50 text-sm">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
