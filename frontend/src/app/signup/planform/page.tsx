"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

const plans = [
  { id: 'MOBILE', name: 'Mobile', price: '₹149', resolution: '480p', devices: ['Mobile phone', 'Tablet'] },
  { id: 'BASIC', name: 'Basic', price: '₹199', resolution: '720p', devices: ['Phone', 'Tablet', 'Computer', 'TV'] },
  { id: 'STANDARD', name: 'Standard', price: '₹499', resolution: '1080p', devices: ['Phone', 'Tablet', 'Computer', 'TV'] },
  { id: 'PREMIUM', name: 'Premium', price: '₹649', resolution: '4K+HDR', devices: ['Phone', 'Tablet', 'Computer', 'TV'] },
];

export default function PlanForm() {
  const [selectedPlan, setSelectedPlan] = useState('STANDARD');
  const router = useRouter();

  const handleNext = () => {
    // Save selected plan to local storage for the next step
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_plan', selectedPlan);
    }
    router.push('/signup/payment');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="border-b h-20 flex items-center px-8 justify-between">
        <Link href="/" className="text-[#e50914] text-3xl font-extrabold tracking-tighter">CINEVERSE</Link>
        <Link href="/login" className="font-bold text-lg hover:underline">Sign Out</Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <p className="text-sm font-medium mb-1">STEP 2 OF 3</p>
          <h1 className="text-3xl font-bold mb-4">Choose the plan that's right for you</h1>
          <ul className="space-y-2 mb-8">
            <li className="flex gap-2 items-center text-lg"><Check className="text-[#e50914] w-6 h-6" /> Watch all you want. Ad-free.</li>
            <li className="flex gap-2 items-center text-lg"><Check className="text-[#e50914] w-6 h-6" /> Recommendations just for you.</li>
            <li className="flex gap-2 items-center text-lg"><Check className="text-[#e50914] w-6 h-6" /> Change or cancel your plan anytime.</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedPlan === plan.id 
                  ? 'border-[#e50914] shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-400 opacity-70'
              }`}
            >
              <div className={`h-24 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4 ${
                selectedPlan === plan.id ? 'bg-[#e50914] shadow-md' : 'bg-[#e50914]/80'
              }`}>
                {plan.name}
              </div>
              <div className="text-center font-semibold text-lg border-b pb-4 mb-4">{plan.price} / mo</div>
              <div className="text-center text-sm border-b pb-4 mb-4">
                <div className="text-gray-500 mb-1">Video Quality</div>
                <div className="font-bold">{plan.resolution}</div>
              </div>
              <div className="text-center text-sm">
                <div className="text-gray-500 mb-1">Supported Devices</div>
                <div className="font-bold flex flex-col gap-1">
                  {plan.devices.map(d => <span key={d}>{d}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500 mb-8 max-w-2xl mx-auto">
          HD (720p), Full HD (1080p), Ultra HD (4K) and HDR availability subject to your internet service and device capabilities. Not all content is available in all resolutions.
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleNext}
            className="bg-[#e50914] text-white px-24 py-4 rounded text-2xl font-semibold hover:bg-[#f6121d] transition-colors w-full md:w-auto"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
