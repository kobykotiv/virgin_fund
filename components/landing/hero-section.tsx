"use client";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-blue-900 to-gray-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Unleash Your Inner Algorithmic Alpha: Open-Source Trading, No Bull.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Take control of your trading strategies with our free, open-source
          platform. Featuring DCA, custom indicators, signal-based trading, and
          optional self-hosting.
        </p>
        <Button
          asChild
          variant="default"
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <a href="https://github.com/virgin-fund" target="_blank">
            Download the Code (GitHub)
          </a>
        </Button>
        <div className="mt-12">
          <video
            autoPlay
            loop
            muted
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
