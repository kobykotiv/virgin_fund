"use client";

import { BarChart3, Cpu, TrendingUp, Server } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "1% Trading & DCA",
      description:
        "Automate your trades with Dollar-Cost Averaging (DCA) and 1% trading strategies. Minimize risk and maximize returns.",
      icon: <TrendingUp className="h-8 w-8 text-blue-400" />,
    },
    {
      title: "Custom Indicators & Signals",
      description:
        "Develop and integrate your own indicators and signals. Tailor the platform to your unique trading style.",
      icon: <Cpu className="h-8 w-8 text-green-400" />,
    },
    {
      title: "Alpaca Markets API Integration",
      description:
        "Seamlessly connect to Alpaca Markets for real-time trading and data. Enjoy commission-free trading.",
      icon: <BarChart3 className="h-8 w-8 text-purple-400" />,
    },
    {
      title: "Self-Hosting Option",
      description:
        "Host the platform on your own servers for maximum control and privacy. Ideal for white-label solutions.",
      icon: <Server className="h-8 w-8 text-amber-400" />,
    },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 text-center shadow-lg"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
