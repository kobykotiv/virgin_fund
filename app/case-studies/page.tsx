import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies | Virgin Fund",
  description: "Discover how leading traders and institutions achieve success with Virgin Fund's automated trading platform.",
};

const caseStudies = [
  {
    id: "hedge-fund-optimization",
    title: "How a Hedge Fund Optimized Their Trading with Virgin Fund",
    description: "Learn how a $500M hedge fund improved their Sharpe ratio by 0.4 using our platform.",
    metrics: {
      improvement: "45% reduction in operational costs",
      timeline: "3 months to full implementation",
      result: "28% increase in risk-adjusted returns"
    },
    image: "/images/case-studies/hedge-fund.jpg",
    category: "Institutional"
  },
  {
    id: "crypto-market-maker",
    title: "Building a Successful Crypto Market Making Operation",
    description: "A cryptocurrency trading firm's journey to automated market making.",
    metrics: {
      improvement: "200% increase in daily volumes",
      timeline: "6 weeks to deployment",
      result: "Consistent profits in volatile markets"
    },
    image: "/images/case-studies/crypto-trading.jpg",
    category: "Crypto"
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="container py-16 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Real results from traders and institutions using Virgin Fund.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {caseStudies.map((study) => (
          <Card key={study.id} className="flex flex-col">
            <div className="relative h-48 w-full">
              <Image
                src={study.image}
                alt={study.title}
                fill
                className="object-cover rounded-t-lg"
              />
              <span className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                {study.category}
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-xl mb-2">{study.title}</CardTitle>
              <p className="text-muted-foreground">{study.description}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2 mb-6">
                {Object.entries(study.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <Button asChild className="w-full">
                <Link href={`/case-studies/${study.id}`}>
                  Read Case Study
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
