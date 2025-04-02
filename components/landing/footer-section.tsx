import Link from "next/link";
import { Github, Twitter, Discord, Mail, Bitcoin } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="bg-gray-900 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h3 className="text-xl font-bold mb-4">Virgin Fund</h3>
            <p className="text-gray-400 mb-4">
              Open-source algorithmic trading platform for everyone.
            </p>
            <div className="flex space-x-4">
              <Link href="https://github.com/virginfund" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="https://twitter.com/virginfund" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="https://discord.gg/virginfund" className="text-gray-400 hover:text-white transition-colors">
                <Discord className="w-5 h-5" />
              </Link>
              <Link href="mailto:info@virginfund.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
              <Link href="bitcoin:3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5" className="text-gray-400 hover:text-white transition-colors">
                <Bitcoin className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/changelog" className="text-gray-400 hover:text-white transition-colors">Changelog</Link></li>
              <li><Link href="/roadmap" className="text-gray-400 hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/strategies" className="text-gray-400 hover:text-white transition-colors">Strategy Library</Link></li>
              <li><Link href="/tutorials" className="text-gray-400 hover:text-white transition-colors">Tutorials</Link></li>
              <li><Link href="/api" className="text-gray-400 hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contribute" className="text-gray-400 hover:text-white transition-colors">Contribute</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
            
            <div className="mt-6">
              <h4 className="font-bold mb-2">Donate Bitcoin</h4>
              <p className="text-xs text-gray-500 break-all">3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Virgin Fund. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</Link>
            <Link href="/license" className="text-gray-500 hover:text-gray-400 text-sm">Fair Code License</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
