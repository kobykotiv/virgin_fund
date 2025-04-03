"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BlogLayoutProps {
  children: React.ReactNode;
  title: string;
  date?: string;
  author?: string;
  readTime?: string;
  category?: string;
  className?: string;
}

export function BlogLayout({
  children,
  title,
  date,
  author = "Virgin Fund Team",
  readTime = "5 min read",
  category = "Trading",
  className,
}: BlogLayoutProps) {
  return (
    <div className={cn("container py-10 max-w-4xl", className)}>
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="p-0 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all articles
          </Button>
        </Link>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
        
        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-2 md:gap-4">
          {category && (
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1">
              {category}
            </span>
          )}
          {date && <span>{date}</span>}
          {author && <span>By {author}</span>}
          {readTime && <span>{readTime}</span>}
        </div>
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {children}
      </div>
      
      <div className="mt-16 border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">Want to learn more?</h3>
        <p className="mb-6">Discover how Virgin Fund can transform your trading strategy with automation.</p>
        <Button asChild>
          <Link href="/signup">Get Started for Free</Link>
        </Button>
      </div>
    </div>
  );
}
