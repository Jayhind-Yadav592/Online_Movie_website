"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Movie } from "@/services/movieService";
import { ArrowLeft } from "lucide-react";
import { updateWatchHistory } from "@/services/interactionService";
import { useAuthStore } from "@/store/useAuthStore";

export default function WatchMovie() {
  const { slug } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isAuthenticated } = useAuthStore();
  const lastSyncTime = useRef(0);

  useEffect(() => {
    if (slug) {
      api.get(`/movies/${slug}/`).then((res) => {
        setMovie(res.data);
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
    }
  }, [slug]);

  const handleTimeUpdate = () => {
    if (!videoRef.current || !movie || !isAuthenticated) return;
    
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    
    // Sync every 5 seconds
    if (currentTime - lastSyncTime.current > 5) {
      lastSyncTime.current = currentTime;
      updateWatchHistory(movie.id, Math.floor(currentTime), Math.floor(duration)).catch(console.error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black animate-pulse" />;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Video could not be loaded</h1>
        <button onClick={() => router.back()} className="bg-primary px-4 py-2 rounded-md">Go Back</button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black w-full h-full overflow-hidden group">
      {/* Overlay Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-white hover:text-primary transition-colors">
          <ArrowLeft className="w-8 h-8" />
        </button>
        <h1 className="text-white font-bold text-xl drop-shadow-md">{movie.title}</h1>
      </div>

      <video
        ref={videoRef}
        src={movie.video_url}
        poster={movie.backdrop}
        controls
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-screen object-contain"
      >
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
}
