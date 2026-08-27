"use client";

import Link from "next/link";
import { Search, Bell, User, Menu, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import SearchInput from "@/components/search/SearchInput";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, activeProfile, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "Series", href: "/series" },
    { name: "My List", href: "/watchlist" },
  ];

  return (
    <header className={clsx(
      "fixed top-0 w-full z-50 transition-colors duration-300",
      isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border/40" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter">
            <Play fill="currentColor" className="w-6 h-6" />
            CineVerse
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={clsx(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <SearchInput />
          
        {/* User Profile */}
        <div className="flex items-center gap-4 relative group">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded overflow-hidden">
                <img 
                  src={activeProfile?.avatar || user?.avatar || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden group-hover:flex absolute top-full right-0 mt-4 bg-black/90 border border-gray-800 rounded-md shadow-xl flex-col min-w-[200px] z-50">
                <div className="p-4 border-b border-gray-800 flex flex-col gap-3">
                  {user?.profiles?.map(p => (
                    <Link href="/profiles" key={p.id} className="flex items-center gap-3 hover:underline">
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded" />
                      <span className={activeProfile?.id === p.id ? "font-bold text-white" : "text-gray-300"}>{p.name}</span>
                    </Link>
                  ))}
                  <Link href="/profiles" className="text-gray-300 hover:underline mt-2">Manage Profiles</Link>
                </div>
                <div className="p-4 flex flex-col gap-3 text-sm">
                  <Link href="/my-list" className="hover:underline">My List</Link>
                  <Link href="/account" className="hover:underline">Account</Link>
                  <button onClick={logout} className="text-left hover:underline">Sign out of CineVerse</button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="bg-primary text-white px-4 py-1.5 rounded text-sm font-semibold">
              Sign In
            </Link>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
