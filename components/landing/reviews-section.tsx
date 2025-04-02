import { StarIcon } from "lucide-react";
import Image from "next/image";

export function ReviewsSection() {
  const reviews = [
    {
      name: "Sarah J.",
      role: "Day Trader",
      avatar: "/placeholder.png",
      rating: 5,
      text: "Virgin Fund completely transformed my trading process. The automated signals save me hours of chart analysis, and the backtesting feature helps me refine strategies with confidence."
    },
    {
      name: "Michael R.",
      role: "Long-term Investor",
      avatar: "/placeholder.png",
      rating: 5,
      text: "I've been using the DCA strategy for 8 months now and my portfolio is up 34%. The platform makes it easy to stay disciplined with my investment plan."
    },
    {
      name: "David L.",
      role: "Algorithmic Trader",
      avatar: "/placeholder.png",
      rating: 4,
      text: "As someone who codes my own trading algorithms, I appreciate the flexibility Virgin Fund offers. The Alpaca API integration is seamless, and I can easily implement my custom signals."
    },
    {
      name: "Elena K.",
      role: "Crypto Enthusiast",
      avatar: "/placeholder.png",
      rating: 5,
      text: "The crypto trading features are outstanding. I can automate my strategies across multiple exchanges and the real-time performance metrics help me stay on top of volatile markets."
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of traders who have improved their results with our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-800 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-700 flex items-center justify-center">
                  <Image 
                    src={review.avatar} 
                    alt={review.name} 
                    width={48} 
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{review.name}</h3>
                  <p className="text-gray-400 text-sm">{review.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    fill={i < review.rating ? "#fbbf24" : "none"} 
                    stroke={i < review.rating ? "#fbbf24" : "#6b7280"}
                    className="w-5 h-5" 
                  />
                ))}
              </div>
              
              <p className="text-gray-300">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
