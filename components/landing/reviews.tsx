import { Star, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ReviewsSection() {
  const reviews = [
    {
      title: "A game-changer for my retirement portfolio",
      content: "I've tried multiple trading platforms over the years, but nothing compares to the ease of use and powerful features of Virgin Fund. The automated strategies have helped me achieve consistent returns while keeping risk in check.",
      rating: 5,
      author: "Robert K.",
      category: "Retirement Investor",
      date: "March 15, 2024",
      highlights: ["Ease of use", "Risk management", "Consistent returns"]
    },
    {
      title: "Professional-grade tools for the everyday investor",
      content: "The platform offers institutional-level tools that were previously unavailable to retail investors. The backtesting engine is incredibly accurate, and the portfolio analytics give me insights I couldn't get elsewhere.",
      rating: 5,
      author: "Jennifer M.",
      category: "Active Trader",
      date: "February 28, 2024",
      highlights: ["Advanced analytics", "Accurate backtesting", "Portfolio insights"]
    },
    {
      title: "Excellent customer support and continuous improvements",
      content: "What impresses me most is how the platform keeps evolving. Every month there are new features and improvements based on user feedback. The customer support team is responsive and knowledgeable.",
      rating: 4,
      author: "David L.",
      category: "Part-time Investor",
      date: "March 5, 2024",
      highlights: ["Responsive support", "Regular updates", "User-focused"]
    }
  ]

  // Render stars for ratings
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
    ))
  }

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-lg font-semibold ml-2">{averageRating.toFixed(1)}/5.0</span>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Read what our customers have to say about their experience with our platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((review, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{review.title}</CardTitle>
                  <Badge variant="outline" className="ml-2">{review.category}</Badge>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{review.content}</p>
                <div className="flex flex-wrap gap-2">
                  {review.highlights.map((highlight, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground border-t pt-4 mt-auto">
                <div className="flex justify-between w-full">
                  <span>{review.author}</span>
                  <span>{review.date}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
