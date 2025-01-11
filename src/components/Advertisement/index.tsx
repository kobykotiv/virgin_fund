import { cn } from '@/lib/utils';

interface AdvertisementProps {
  className?: string;
  position?: 'sidebar' | 'footer' | 'inline';
}

export function Advertisement({ className, position = 'sidebar' }: AdvertisementProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden glass-card",
        position === 'sidebar' && "w-[300px] h-[600px]",
        position === 'footer' && "w-full h-[90px]",
        position === 'inline' && "w-full h-[250px]",
        "flex items-center justify-center",
        className
      )}
    >
      <div className="text-center p-4">
        <p className="text-sm text-muted-foreground">Advertisement</p>
      </div>
    </div>
  );
}
