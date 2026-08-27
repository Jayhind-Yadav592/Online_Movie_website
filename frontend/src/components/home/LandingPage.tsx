"use client";

import Link from "next/link";
import { ChevronRight, Tv, Download, MonitorSmartphone, Smile } from "lucide-react";
import Header from "@/components/layout/Header";
import MovieRow from "@/components/home/MovieRow";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden text-white font-sans">
      <div className="relative min-h-[85vh] flex flex-col">
        <Header />
        
        {/* Arch Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg-netflix.jpg" 
            alt="Background" 
            className="w-full h-full object-cover opacity-40"
          />
          {/* The New Netflix Arch Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-16 pb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
            Unlimited movies, TV shows and more
          </h1>
          <p className="text-lg md:text-xl font-medium mb-8">
            Starts at ₹149. Cancel at any time.
          </p>
          <p className="text-base md:text-lg mb-4">
            Ready to watch? Enter your email to create or restart your membership.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-2xl mt-2 justify-center">
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-1 px-4 py-3 md:py-4 bg-black/60 border border-gray-500 rounded text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-base md:text-lg backdrop-blur-sm sm:max-w-[400px]"
            />
            <Link 
              href="/register" 
              className="bg-[#e50914] text-white px-6 py-3 md:px-8 md:py-4 rounded font-bold text-xl flex items-center justify-center gap-2 hover:bg-[#c11119] transition-colors whitespace-nowrap"
            >
              Get Started
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* NEW: Trending Now Section right on landing page */}
      <div className="relative z-20 -mt-16 bg-black pb-12">
         <div className="max-w-[90%] mx-auto">
            <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4 px-4 md:px-16 pt-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Trending Now</h2>
              <div className="flex bg-white/10 rounded border border-white/20 p-1 w-fit">
                <button className="px-4 py-1.5 bg-black/80 text-white rounded shadow-sm text-sm font-medium">India</button>
                <button className="px-4 py-1.5 text-white/70 hover:text-white rounded text-sm font-medium transition-colors">Global</button>
              </div>
              <div className="flex bg-white/10 rounded border border-white/20 p-1 w-fit">
                <button className="px-4 py-1.5 bg-black/80 text-white rounded shadow-sm text-sm font-medium">Movies</button>
                <button className="px-4 py-1.5 text-white/70 hover:text-white rounded text-sm font-medium transition-colors">TV Shows</button>
              </div>
            </div>
            {/* Reusing MovieRow with isTop10 styling */}
            <MovieRow title="" params={{ trending: true }} isTop10={true} />
         </div>
      </div>
      
      {/* NEW: More Reasons to Join (Cards Grid) */}
      <div className="bg-black py-16 px-4">
        <div className="max-w-[90%] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">More Reasons to Join</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-[#192247] to-[#210e17] p-6 rounded-2xl flex flex-col relative overflow-hidden min-h-[260px]">
              <h3 className="text-xl md:text-2xl font-bold mb-4 z-10">Enjoy on your TV</h3>
              <p className="text-white/80 text-sm md:text-base z-10">Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.</p>
              <div className="absolute bottom-4 right-4 text-[#e50914]">
                 <Tv className="w-12 h-12 opacity-80" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-[#192247] to-[#210e17] p-6 rounded-2xl flex flex-col relative overflow-hidden min-h-[260px]">
              <h3 className="text-xl md:text-2xl font-bold mb-4 z-10">Download your shows to watch offline</h3>
              <p className="text-white/80 text-sm md:text-base z-10">Save your favourites easily and always have something to watch.</p>
              <div className="absolute bottom-4 right-4 text-[#e50914]">
                 <Download className="w-12 h-12 opacity-80" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-[#192247] to-[#210e17] p-6 rounded-2xl flex flex-col relative overflow-hidden min-h-[260px]">
              <h3 className="text-xl md:text-2xl font-bold mb-4 z-10">Watch everywhere</h3>
              <p className="text-white/80 text-sm md:text-base z-10">Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</p>
              <div className="absolute bottom-4 right-4 text-[#e50914]">
                 <MonitorSmartphone className="w-12 h-12 opacity-80" />
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-gradient-to-br from-[#192247] to-[#210e17] p-6 rounded-2xl flex flex-col relative overflow-hidden min-h-[260px]">
              <h3 className="text-xl md:text-2xl font-bold mb-4 z-10">Create profiles for kids</h3>
              <p className="text-white/80 text-sm md:text-base z-10">Send children on adventures with their favourite characters in a space made just for them—free with your membership.</p>
              <div className="absolute bottom-4 right-4 text-[#e50914]">
                 <Smile className="w-12 h-12 opacity-80" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Email Section */}
      <div className="bg-black py-16 px-4 border-b-8 border-[#232323]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white md:text-lg mb-6 font-medium">
            Ready to watch? Enter your email to create or restart your membership.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-2xl mx-auto justify-center">
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-1 px-4 py-3 md:py-4 bg-black/60 border border-gray-500 rounded text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-base md:text-lg backdrop-blur-sm sm:max-w-[400px]"
            />
            <Link 
              href="/register" 
              className="bg-[#e50914] text-white px-6 py-3 md:px-8 md:py-4 rounded font-bold text-xl flex items-center justify-center gap-2 hover:bg-[#c11119] transition-colors whitespace-nowrap"
            >
              Get Started
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
      
    </main>
  );
}
