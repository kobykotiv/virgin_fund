import Image from "next/image";
import { ArrowRight, TrendingUp, BarChart } from "lucide-react";

export function SuccessStoriesSection() {
  const stories = [
    {
      title: "From Manual Trading to Full Automation",
      description: "How James went from spending 6 hours a day watching charts to fully automated trading with Virgin Fund",
      stats: [
        { label: "Time Saved", value: "30+ hours weekly" },
        { label: "Return Increase", value: "27% annually" },
        { label: "Emotional Trades", value: "Reduced by 100%" }
      ],
      image: "/placeholder.png",
      quote: "I used to wake up at 4 AM to check markets. Now my algorithms do the work while I sleep, and my returns have never been better."
    },
    {
      title: "Building a Retirement Portfolio with DCA",
      description: "Sarah's journey using the 1% DCA strategy to build a consistent long-term portfolio",
      stats: [
        { label: "Portfolio Growth", value: "152% in 3 years" },
        { label: "Volatility", value: "Reduced by 40%" },
        { label: "Peace of Mind", value: "Priceless" }
      ],
      image: "/placeholder.png",
      quote: "The automated DCA approach removed my anxiety about market timing. I just set it up once and let it compound over time."
    }
  ];

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real results from real traders using Virgin Fund
          </p>
        </div>

        <div className="space-y-16">
          {stories.map((story, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 items-center`}
            >
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl font-bold mb-3">{story.title}</h3>
                <p className="text-gray-300 mb-6">{story.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {story.stats.map((stat, i) => (
                    <div key={i} className="bg-gray-700/30 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-blue-400">{stat.value}</p>
                    </div>
                  ))}
                </div>
                
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300">
                  "{story.quote}"
                </blockquote>
                
                <button className="mt-6 inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                  Read full case study <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
              
              <div className="w-full lg:w-1/2 relative">
                <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-700 flex items-center justify-center">
                  <Image 
                    src={story.image} 
                    alt={story.title}
                    width={600}
                    height={400}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/80 to-transparent flex items-center justify-center">
                    <div className="bg-gray-800/80 p-4 rounded-lg backdrop-blur-sm flex items-center space-x-4">
                      <TrendingUp className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="text-xs text-gray-400">Performance</p>
                        <p className="text-xl font-bold text-green-500">+{30 + index * 12}%</p>
                      </div>
                      <BarChart className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-400">Win Rate</p>
                        <p className="text-xl font-bold text-white">{68 + index * 7}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
