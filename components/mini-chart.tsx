interface MiniChartProps {
  variant: 'up' | 'volatile' | 'down';
}

export function MiniChart({ variant }: MiniChartProps) {
  // Placeholder implementation
  return (
    <div className={`w-full h-full bg-muted rounded-md ${
      variant === 'up' ? 'bg-green-100' : 
      variant === 'down' ? 'bg-red-100' : 
      'bg-yellow-100'
    }`}>
    </div>
  );
}