import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Server, LineChart, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Institutional Trading Solutions | Virgin Fund",
  description: "Enterprise-grade algorithmic trading platform for institutional investors, hedge funds, and proprietary trading firms.",
};

export default function InstitutionalPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-gray-900 to-background">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-full lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold">
                  Enterprise-Grade Trading Infrastructure
                </h1>
                <p className="text-xl text-muted-foreground">
                  Built for institutional investors, hedge funds, and proprietary trading firms requiring high-performance, reliable trading automation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/contact">Schedule Demo</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/docs/enterprise">Documentation</Link>
                  </Button>
                </div>
              </div>
              <div className="w-full lg:w-1/2 relative h-[500px]">
                <Image
                  src="/images/solutions/institutional-dashboard.jpg"
                  alt="Institutional trading dashboard"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Shield className="h-8 w-8 text-primary" />,
                  title: "Enterprise Security",
                  description: "SOC 2 Type II certified. Multi-factor authentication, role-based access control, and audit logging."
                },
                {
                  icon: <Server className="h-8 w-8 text-primary" />,
                  title: "High-Performance Infrastructure",
                  description: "Sub-millisecond execution, co-located servers, and dedicated infrastructure options."
                },
                {
                  icon: <LineChart className="h-8 w-8 text-primary" />,
                  title: "Advanced Analytics",
                  description: "Real-time risk analytics, performance attribution, and customizable reporting."
                },
                {
                  icon: <Users className="h-8 w-8 text-primary" />,
                  title: "White-Label Solutions",
                  description: "Fully customizable platform branding and dedicated support team."
                }
              ].map((feature, index) => (
                <Card key={index} className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Scale Your Trading Operations?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
              Let's discuss how Virgin Fund can support your institutional trading needs.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
