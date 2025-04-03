import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, TrendingUp, Clock, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Hedge Fund Case Study | Virgin Fund",
  description: "How a $500M hedge fund improved their Sharpe ratio by 0.4 using Virgin Fund's automated trading platform.",
};

export default function HedgeFundCaseStudyPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <Link href="/case-studies" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Case Studies
      </Link>

      {/* Case Study Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1>How a $500M Hedge Fund Optimized Their Trading with Virgin Fund</h1>
        
        <div className="my-8 grid grid-cols-3 gap-4">
          {[
            {
              icon: <TrendingUp className="h-6 w-6 text-primary" />,
              label: "Performance Improvement",
              value: "28% increase"
            },
            {
              icon: <Clock className="h-6 w-6 text-primary" />,
              label: "Implementation Time",
              value: "3 months"
            },
            {
              icon: <DollarSign className="h-6 w-6 text-primary" />,
              label: "Cost Reduction",
              value: "45%"
            }
          ].map((stat, index) => (
            <Card key={index} className="p-4 text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="font-bold">{stat.value}</div>
            </Card>
          ))}
        </div>

        <h2>The Challenge</h2>
        <p>
          A mid-sized hedge fund managing $500M in assets was facing several operational challenges...
        </p>

        {/* Continue with the rest of the case study content */}
      </div>

      {/* CTA Section */}
      <div className="mt-16 border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">Ready to achieve similar results?</h3>
        <p className="mb-6">Schedule a demo to see how Virgin Fund can help optimize your trading operations.</p>
        <Button asChild>
          <Link href="/contact">Schedule Demo</Link>
        </Button>
      </div>
    </div>
  );
}
