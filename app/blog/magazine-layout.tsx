import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CalendarDays, Clock, User, ChevronRight, Bookmark, Share2 } from "lucide-react"

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
}

interface MagazineHeroProps {
  article: Article;
}

export function MagazineHero({ article }: MagazineHeroProps) {
  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl">
      <Image 
        src={article.image} 
        alt={article.title}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
        <Badge className="w-fit mb-3">{article.category}</Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {article.title}
        </h1>
        <p className="text-white/90 text-lg max-w-3xl mb-6">
          {article.excerpt}
        </p>
        <div className="flex items-center text-white/80 mb-4">
          <User className="mr-2 h-4 w-4" />
          <span className="mr-4">{article.author}</span>
          <CalendarDays className="mr-2 h-4 w-4" />
          <span className="mr-4">{article.date}</span>
          <Clock className="mr-2 h-4 w-4" />
          <span>{article.readTime}</span>
        </div>
        <Link href={`/blog/${article.slug}`}>
          <Button variant="secondary" size="lg">
            Read Article <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface MagazineGridProps {
  articles: Article[];
  title: string;
  description?: string;
}

export function MagazineGrid({ articles, title, description }: MagazineGridProps) {
  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col gap-4 md:gap-8 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-48 w-full">
                <Image 
                  src={article.image} 
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="outline">{article.category}</Badge>
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                </div>
                <CardTitle className="line-clamp-2">
                  <Link href={`/blog/${article.slug}`} className="hover:underline">
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-1 h-3 w-3" />
                  {article.author}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

interface MagazineFeatureProps {
  article: Article;
}

export function MagazineFeature({ article }: MagazineFeatureProps) {
  return (
    <div className="w-full py-12 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="relative w-full md:w-1/2 h-[350px] overflow-hidden rounded-xl">
            <Image 
              src={article.image} 
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <Badge className="mb-2">{article.category}</Badge>
            <h2 className="text-3xl font-bold">{article.title}</h2>
            <p className="text-muted-foreground">{article.excerpt}</p>
            <div className="flex items-center text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              <span className="mr-4">{article.author}</span>
              <CalendarDays className="mr-2 h-4 w-4" />
              <span className="mr-4">{article.date}</span>
              <Clock className="mr-2 h-4 w-4" />
              <span>{article.readTime}</span>
            </div>
            <Link href={`/blog/${article.slug}`}>
              <Button>
                Read Article <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
