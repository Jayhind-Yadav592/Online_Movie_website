"use client";

import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import MovieRow from "@/components/home/MovieRow";
import ContinueWatchingRow from "@/components/home/ContinueWatchingRow";
import Header from "@/components/layout/Header";
import LandingPage from "@/components/home/LandingPage";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <main className="min-h-screen pb-20">
      <Header />
      <Hero />
      
      <div className="-mt-32 relative z-20">
        <ContinueWatchingRow />
        <MovieRow title="Trending Now" params={{ trending: true }} />
        <MovieRow title="New Releases" params={{ ordering: '-release_date' }} />
        <MovieRow title="Top Rated" params={{ ordering: '-rating' }} />
        <MovieRow title="Action Movies" params={{ genres__slug: 'action' }} />
        <MovieRow title="Comedy" params={{ genres__slug: 'comedy' }} />
      </div>
    </main>
  );
}
