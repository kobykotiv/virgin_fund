import { Server, Shield, Database, Code, GitBranch, Terminal } from "lucide-react";

export function SelfHostingSection() {
  const benefits = [
    {
      title: "Complete Privacy",
      description: "Keep all your trading data and API keys on your own infrastructure. No data ever leaves your server.",
      icon: <Shield className="w-10 h-10 text-green-400" />
    },
    {
      title: "Full Customization",
      description: "Modify the source code to meet your specific needs. Implement custom strategies without limitations.",
      icon: <Code className="w-10 h-10 text-blue-400" />
    },
    {
      title: "No Usage Limits",
      description: "Run as many trading bots and backtests as your hardware can handle, with no artificial restrictions.",
      icon: <Database className="w-10 h-10 text-purple-400" />
    },
    {
      title: "Own Your Infrastructure",
      description: "Deploy on your preferred cloud provider or run locally for complete control over your trading environment.",
      icon: <Server className="w-10 h-10 text-yellow-400" />
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-blue-900/30 text-blue-400 py-1 px-3 rounded-full text-sm font-medium mb-4 inline-block">SELF-HOSTED SOLUTION</span>
          <h2 className="text-3xl font-bold mb-4">Host It Yourself</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Take full control by deploying Virgin Fund on your own servers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="bg-gray-700/20 p-8 rounded-xl border border-gray-700/50">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Quick Installation</h3>
            <div className="font-mono text-sm bg-gray-900 p-4 rounded-lg overflow-auto">
              <pre className="text-green-400 whitespace-pre-wrap">
{`# Clone the repository
git clone https://github.com/virginfund/trading-platform.git

# Install dependencies
cd trading-platform
npm install

# Configure your environment
cp .env.example .env
nano .env

# Start the application
npm run start`}
              </pre>
            </div>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="mt-1 mr-4">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-bold mb-1">{benefit.title}</h4>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gray-700/20 inline-flex items-center py-2 px-4 rounded-lg text-gray-300 mb-6">
            <GitBranch className="w-5 h-5 mr-2 text-gray-400" />
            <span className="text-sm">Our GitHub repo has <span className="font-bold text-white">2.8k</span> stars and counting!</span>
          </div>
          <div>
            <a 
              href="https://github.com/virginfund/trading-platform" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-all"
            >
              <Terminal className="w-5 h-5 mr-2" />
              View Deployment Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
