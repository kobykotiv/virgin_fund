import Image from "next/image"
import { User, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Virgin Fund's automated trading platform completely transformed my investment strategy. The bot builder is intuitive and the performance has exceeded my expectations.",
      name: "Sophia Rodriguez",
      role: "Full-time Trader",
      image: "/images/testimonials/sophia.jpg"
    },
    {
      quote: "As someone with limited time to manage my investments, the platform's automation tools have been invaluable. I've seen consistent returns with minimal time investment.",
      name: "James Wilson",
      role: "Software Engineer & Part-time Investor",
      image: "/images/testimonials/james.jpg"
    },
    {
      quote: "The backtesting engine is best-in-class. I've tested strategies across multiple market conditions with confidence before deploying actual capital.",
      name: "Michael Chen",
      role: "Quantitative Analyst",
      image: "/images/testimonials/michael.jpg"
    }
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Are Saying</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join thousands of investors who have transformed their trading experience with our platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 text-primary">
                  <Quote size={32} />
                </div>
                <blockquote className="text-lg mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="mr-4 relative w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {testimonial.image ? (
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
