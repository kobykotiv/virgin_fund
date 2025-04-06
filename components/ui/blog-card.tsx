interface BlogCardProps {
  title: string
  excerpt: string
  date: string
  image?: string
  category: string
}

export function BlogCard({ title, excerpt, date, image, category }: BlogCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-2">
      {image && (
        <div className="aspect-video overflow-hidden rounded-md">
          <img
            src={image}
            alt={title}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <p className="text-sm text-muted-foreground">{category}</p>
        <h3 className="mt-2 text-lg font-semibold">{title}</h3>
        <p className="mt-2 line-clamp-3 text-muted-foreground">{excerpt}</p>
        <p className="mt-4 text-sm text-muted-foreground">{date}</p>
      </div>
    </div>
  )
}
