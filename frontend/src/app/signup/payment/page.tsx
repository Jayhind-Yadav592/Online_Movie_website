"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, CreditCard } from "lucide-react";
import api from "@/lib/axios";

export default function PaymentPage() {
  const [plan, setPlan] = useState('STANDARD');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPlan = localStorage.getItem('selected_plan');
      if (savedPlan) setPlan(savedPlan);
    }
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Sending mock card token "tok_visa"
      await api.post('/subscriptions/checkout/', {
        plan,
        card_token: "tok_visa_mock"
      });
      // Redirect to home/success
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="border-b h-20 flex items-center px-8 justify-between">
        <Link href="/" className="text-[#e50914] text-3xl font-extrabold tracking-tighter">CINEVERSE</Link>
        <Link href="/login" className="font-bold text-lg hover:underline">Sign Out</Link>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <p className="text-sm font-medium mb-1 uppercase">Step 3 of 3</p>
          <h1 className="text-3xl font-bold mb-4">Set up your credit or debit card</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
            <Lock className="w-4 h-4 text-yellow-600" />
            <span>End-to-end encrypted</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-md flex justify-between items-center mb-6 border border-gray-300">
            <div>
              <p className="font-bold text-lg">₹{plan === 'MOBILE' ? '149' : plan === 'BASIC' ? '199' : plan === 'STANDARD' ? '499' : '649'} / month</p>
              <p className="text-gray-500 text-sm">{plan} Plan</p>
            </div>
            <Link href="/signup/planform" className="text-blue-600 font-bold hover:underline">Change</Link>
          </div>

          <div className="relative">
            <input 
              type="text" 
              placeholder="Card number" 
              required
              className="w-full border border-gray-400 rounded-md p-4 text-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all pl-12" 
              defaultValue="4242 4242 4242 4242"
            />
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Expiration date (MM/YY)" 
              required
              className="w-1/2 border border-gray-400 rounded-md p-4 text-lg focus:border-blue-600 outline-none" 
              defaultValue="12/28"
            />
            <input 
              type="text" 
              placeholder="CVV" 
              required
              className="w-1/2 border border-gray-400 rounded-md p-4 text-lg focus:border-blue-600 outline-none" 
              defaultValue="123"
            />
          </div>

          <input 
            type="text" 
            placeholder="First name" 
            required
            className="w-full border border-gray-400 rounded-md p-4 text-lg focus:border-blue-600 outline-none" 
          />
          <input 
            type="text" 
            placeholder="Last name" 
            required
            className="w-full border border-gray-400 rounded-md p-4 text-lg focus:border-blue-600 outline-none" 
          />

          <div className="bg-gray-100 p-4 rounded text-xs text-gray-600 mt-6 mb-6">
            By checking the checkbox below, you agree to our Terms of Use, Privacy Statement, and that you are over 18. CineVerse will automatically continue your membership and bill the membership fee to your payment method until you cancel. You may cancel at any time to avoid future charges.
          </div>

          <div className="flex items-start gap-3 mb-8">
            <input type="checkbox" id="agree" required className="mt-1 w-5 h-5 text-blue-600" />
            <label htmlFor="agree" className="text-gray-700 text-sm">
              I agree.
            </label>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="bg-[#e50914] text-white w-full py-4 rounded font-bold text-2xl hover:bg-[#f6121d] transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Start Membership'}
          </button>
        </form>
      </main>
    </div>
  );
}
