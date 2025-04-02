import { Bitcoin, CreditCard, Heart } from "lucide-react";

export function DonationSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Support Virgin Fund</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Help us keep this project free and open source with your contribution
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-800/50 p-8 rounded-xl">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Fair Code License</h3>
            <p className="text-gray-300">
              Virgin Fund is provided under a fair code license. This means it's free for personal and educational use, with certain limitations for commercial applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700/50 p-6 rounded-lg text-center">
              <CreditCard className="w-10 h-10 mx-auto mb-4 text-blue-400" />
              <h4 className="font-bold mb-2">One-time Donation</h4>
              <p className="text-sm text-gray-400 mb-4">Support the project with a one-time contribution of any amount.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-all">
                Donate Now
              </button>
            </div>
            
            <div className="bg-blue-900/30 p-6 rounded-lg text-center border border-blue-500/50">
              <Heart className="w-10 h-10 mx-auto mb-4 text-red-400" />
              <h4 className="font-bold mb-2">Monthly Sponsor</h4>
              <p className="text-sm text-gray-400 mb-4">Become a monthly sponsor and get recognized in our GitHub repo.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-all">
                Become a Sponsor
              </button>
            </div>
            
            <div className="bg-gray-700/50 p-6 rounded-lg text-center">
              <Bitcoin className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
              <h4 className="font-bold mb-2">Crypto Donation</h4>
              <p className="text-sm text-gray-400 mb-4">Donate using cryptocurrency of your choice.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-all">
                Donate Crypto
              </button>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm">
            <p>Your support helps us develop new features, fix bugs, and maintain the infrastructure.</p>
            <p className="mt-2">100% of donations go directly to supporting development and server costs.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
