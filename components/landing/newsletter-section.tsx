"use client"

import { useState } from "react";
import { Bell, ChevronRight } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally connect to a newsletter service
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-10 rounded-2xl border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-full md:w-2/3">
              <div className="inline-flex items-center bg-blue-900/30 py-1 px-3 rounded-full mb-4">
                <Bell className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm text-blue-400">Strategy Updates</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Stay Updated on Trading Strategies</h3>
              <p className="text-gray-300 mb-6">
                Join our newsletter to receive updates on new trading strategies, feature releases, and educational content to improve your trading results.
              </p>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full bg-gray-800/80 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button 
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg flex items-center transition-colors"
                    >
                      Subscribe
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              ) : (
                <div className="bg-green-900/20 border border-green-700/50 text-green-400 p-4 rounded-lg">
                  Thank you for subscribing! Check your inbox to confirm your subscription.
                </div>
              )}
            </div>
            
            <div className="w-full md:w-1/3">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-bold mb-2">What you'll receive:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="bg-blue-600 rounded-full p-1 mr-3 mt-1">
                      <ChevronRight className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">New strategy templates</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 rounded-full p-1 mr-3 mt-1">
                      <ChevronRight className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">Market analysis and insights</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 rounded-full p-1 mr-3 mt-1">
                      <ChevronRight className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">Educational content for traders</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 rounded-full p-1 mr-3 mt-1">
                      <ChevronRight className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">Product updates and new features</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
