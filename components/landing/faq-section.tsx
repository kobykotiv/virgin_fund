"use client"

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is Virgin Fund really free to use?",
      answer: "Yes, Virgin Fund is open source under a fair code license. You can use the basic features completely free. We sustain development through optional donations and premium features for professional traders."
    },
    {
      question: "Do I need an Alpaca account to use Virgin Fund?",
      answer: "While an Alpaca account is recommended for live trading, you can use Virgin Fund's paper trading and backtesting features without one. This lets you test strategies before connecting to a real brokerage account."
    },
    {
      question: "What trading strategies are supported?",
      answer: "Virgin Fund supports DCA (Dollar Cost Averaging), indicator-based strategies (RSI, MACD, Bollinger Bands, etc.), custom signals, and more. You can also create your own custom strategies using our builder interface."
    },
    {
      question: "Is my trading data secure?",
      answer: "Absolutely. We use industry-standard encryption and security practices. Your API keys are encrypted and we never store your private keys on our servers. We also offer local-only mode where all data stays on your computer."
    },
    {
      question: "Can I run Virgin Fund on my own server?",
      answer: "Yes! As an open-source project, you can deploy Virgin Fund on your own infrastructure. We provide detailed documentation for self-hosting, including Docker configurations and deployment guides."
    },
    {
      question: "How do I contribute to the project?",
      answer: "We welcome contributions! You can contribute by submitting pull requests on GitHub, reporting bugs, suggesting features, improving documentation, or making a donation to support ongoing development."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about Virgin Fund
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleFaq(index)}
                className={`w-full text-left p-4 flex justify-between items-center transition-all ${
                  openIndex === index ? "bg-gray-700 rounded-t-lg" : "bg-gray-700/50 rounded-lg hover:bg-gray-700/80"
                }`}
              >
                <span className="font-medium">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="bg-gray-700/30 p-4 rounded-b-lg">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
