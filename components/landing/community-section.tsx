import { Users, Github, MessageSquare, BookOpen } from "lucide-react";

export function CommunitySection() {
  const communities = [
    {
      title: "GitHub Discussions",
      description: "Join our open source community to contribute, report bugs, or request features.",
      icon: <Github className="w-6 h-6" />,
      link: "https://github.com/virginfund/discussions",
      members: "2.8k+ contributors"
    },
    {
      title: "Discord Community",
      description: "Chat with other traders, share strategies, and get help in real-time.",
      icon: <MessageSquare className="w-6 h-6" />,
      link: "https://discord.gg/virginfund",
      members: "12k+ members"
    },
    {
      title: "Documentation",
      description: "Comprehensive guides, API references, and strategy examples.",
      icon: <BookOpen className="w-6 h-6" />,
      link: "https://docs.virginfund.com",
      members: "Updated weekly"
    }
  ];

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-900/30 py-1 px-3 rounded-full mb-4">
            <Users className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm text-blue-400">Growing Community</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Join Our Trading Community</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Connect with fellow traders and developers to share strategies and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {communities.map((community, index) => (
            <div key={index} className="bg-gray-700/20 p-8 rounded-xl border border-gray-700/50 hover:bg-gray-700/40 transition-all">
              <div className="bg-blue-900/30 p-4 rounded-full inline-block mb-6">
                {community.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{community.title}</h3>
              <p className="text-gray-400 mb-4">{community.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{community.members}</span>
                <a 
                  href={community.link}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Join →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-gray-900/50 p-8 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Weekly Community Calls</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Join our weekly video calls where we discuss market trends, new trading strategies, and answer your questions.
          </p>
          <a 
            href="https://meet.virginfund.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg inline-block transition-colors"
          >
            Join Next Call
          </a>
          <p className="text-sm text-gray-500 mt-4">Every Thursday at 4PM UTC</p>
        </div>
      </div>
    </section>
  );
}
