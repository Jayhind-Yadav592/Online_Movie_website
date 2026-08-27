"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, Profile } from "@/store/useAuthStore";
import api from "@/lib/axios";
import { PlusCircle } from "lucide-react";

export default function ProfilesPage() {
  const { user, setActiveProfile, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  
  // Local state to track created profiles in real-time
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (user) {
      setProfiles(user.profiles || []);
    }
  }, [isAuthenticated, isLoading, user, router]);

  const selectProfile = (profile: Profile) => {
    setActiveProfile(profile);
    router.push("/");
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    try {
      const res = await api.post("/auth/sub-profiles/", {
        name: newName,
        is_kids: false
      });
      setProfiles([...profiles, res.data]);
      setShowAdd(false);
      setNewName("");
    } catch (err) {
      console.error("Failed to add profile", err);
    }
  };

  if (isLoading || !user) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground font-sans">
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-3xl md:text-5xl font-medium text-center mb-10 md:mb-16">Who's watching?</h1>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {profiles.map((profile) => (
            <div 
              key={profile.id} 
              className="flex flex-col items-center group cursor-pointer w-24 md:w-32"
              onClick={() => selectProfile(profile)}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden border-[3px] border-transparent group-hover:border-white transition-colors">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-muted-foreground group-hover:text-white mt-4 text-sm md:text-base transition-colors truncate w-full text-center">
                {profile.name}
              </span>
            </div>
          ))}

          {profiles.length < 5 && !showAdd && (
            <div 
              className="flex flex-col items-center group cursor-pointer w-24 md:w-32"
              onClick={() => setShowAdd(true)}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-md border-[3px] border-transparent group-hover:border-white transition-colors flex items-center justify-center bg-transparent group-hover:bg-white/10">
                <PlusCircle className="w-12 h-12 text-muted-foreground group-hover:text-white" />
              </div>
              <span className="text-muted-foreground group-hover:text-white mt-4 text-sm md:text-base transition-colors">
                Add Profile
              </span>
            </div>
          )}
        </div>

        {showAdd && (
          <div className="mt-12 max-w-md mx-auto">
            <h2 className="text-2xl font-medium mb-4">Add Profile</h2>
            <form onSubmit={handleAddProfile} className="flex gap-4">
              <input 
                type="text" 
                placeholder="Name" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 bg-gray-600/50 border border-gray-500 rounded p-3 text-white focus:outline-none focus:border-white"
                autoFocus
              />
              <button 
                type="submit"
                className="bg-white text-black font-semibold px-6 py-3 rounded hover:bg-gray-200 transition-colors"
              >
                Continue
              </button>
              <button 
                type="button"
                onClick={() => setShowAdd(false)}
                className="border border-gray-500 text-gray-400 font-semibold px-6 py-3 rounded hover:border-white hover:text-white transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
        
        {!showAdd && (
          <div className="mt-16 flex justify-center">
            <button className="border border-gray-500 text-gray-400 hover:text-white hover:border-white px-8 py-2 rounded font-medium text-sm md:text-base tracking-widest transition-colors">
              MANAGE PROFILES
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
