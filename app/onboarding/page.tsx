"use client";
import { useContext } from "react";
import { AuthContext } from "@/providers/auth-provider";

export default function OnboardingPage() {
  const { user } = useContext(AuthContext) || {};
  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email || "Trader"}!</h1>
      <p className="mb-4">Let's get your account set up for trading success.</p>
      <ul className="list-disc ml-6 mb-6">
        <li>Connect your brokerage account</li>
        <li>Create your first trading bot</li>
        <li>Explore analytics and leaderboard</li>
      </ul>
      <a href="/bots/create-bot" className="bg-blue-600 text-white px-4 py-2 rounded">Start Now</a>
    </div>
  );
}
