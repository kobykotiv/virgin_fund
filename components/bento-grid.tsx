"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CalendarDays, Clock, User, ChevronRight, Bookmark, Share2, TrendingUp, TrendingDown, BookOpen, BarChart2 } from "lucide-react"

interface Article {
  id: string | number;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
  image: string;
  slug: string;
  featured?: boolean;
}

interface BentoGridProps {
  items: Article[];
  title: string;
  description?: string;
}

interface BentoGridItemProps {
  item: Article;
  className?: string;
  featured?: boolean;
}

export function BentoGrid({ items, title, description }: BentoGridProps) {
  // Mark the first item as featured if none are explicitly featured
  const hasExplicitFeatured = items.some(item => item.featured);
  const processedItems = hasExplicitFeatured 
    ? items 
    : [{ ...items[0], featured: true }, ...items.slice(1)];

  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col gap-4 md:gap-8 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {processedItems.map((item, index) => {
            // Determine the layout based on position and featured status
            const isFeatured = item.featured;
            const isSecondary = index === 1 || index === 2;
            
            let className = "";
            
            if (isFeatured) {
              className = "md:col-span-3 md:row-span-2";
            } else if (isSecondary) {
              className = "md:col-span-1 md:row-span-1";
            } else {
              className = index % 3 === 0 
                ? "md:col-span-2 md:row-span-1" 
                : "md:col-span-1 md:row-span-1";
            }
            
            return (
              <BentoGridItem 
                key={item.id} 
                item={item} 
                className={className}
                featured={isFeatured}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function BentoGridItem({ item, className = "", featured = false }: BentoGridItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine which icon to use based on category
  const getCategoryIcon = () => {
    const category = item.category.toLowerCase();
    if (category.includes("market") || category.includes("stocks") || category.includes("economy")) {
      return <TrendingUp className="h-4 w-4" />;
    } else if (category.includes("education") || category.includes("learn") || category.includes("basics")) {
      return <BookOpen className="h-4 w-4" />;
    } else if (category.includes("analysis") || category.includes("research")) {
      return <BarChart2 className="h-4 w-4" />;
    }
    return null;
  };
  
  if (featured) {
    return (
      <Card 
        className={`overflow-hidden ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-[300px] w-full">
          <Image 
            src={item.image} 
            alt={item.title}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
              <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-white/10 flex items-center gap-1">
                {getCategoryIcon()}
                {item.category}
              </Badge>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {item.title}
            </h3>
            <p className="text-white/80 mb-4 line-clamp-2">
              {item.excerpt}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-white/70 text-sm gap-3">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {item.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.readTime}
                </span>
              </div>
              <Link href={`/blog/${item.slug}`}>
                <Button variant="secondary" size="sm" className="gap-1">
                  Read <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card 
      className={`overflow-hidden flex flex-col h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <Image 
          src={item.image} 
          alt={item.title}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </div>
      <CardHeader className="flex-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {getCategoryIcon()}
            {item.category}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-lg">
          <Link href={`/blog/${item.slug}`} className="hover:underline">
            {item.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 mt-2">{item.excerpt}</CardDescription>
      </CardHeader>
      <CardFooter className="border-t p-4 flex justify-between">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="mr-1 h-3 w-3" />
          {item.date}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Bookmark className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
