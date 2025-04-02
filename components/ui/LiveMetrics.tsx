import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  useTheme, 
  Skeleton,
  CircularProgress,
  LinearProgress,
  Tooltip
} from '@mui/material';
import { TrendingUp, TrendingDown, ChevronsRight } from 'lucide-react';

interface MetricItem {
  label: string;
  value: number;
  previousValue?: number;
  unit?: string;
  precision?: number;
  isPercentage?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

interface LiveMetricsProps {
  metrics: MetricItem[];
  autoUpdate?: boolean;
  updateInterval?: number; // in milliseconds
  refreshing?: boolean;
  showTrend?: boolean;
  variant?: 'default' | 'compact' | 'cards' | 'minimal';
  animation?: 'fade' | 'count' | 'pulse' | 'slide';
}

const formatValue = (value: number, precision: number = 2, isPercentage: boolean = false, unit: string = ''): string => {
  const formattedValue = isPercentage 
    ? `${value.toFixed(precision)}%` 
    : value.toLocaleString(undefined, { 
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
      });
  
  return unit ? `${formattedValue} ${unit}` : formattedValue;
};

const AnimatedNumber: React.FC<{
  value: number;
  precision?: number;
  duration?: number;
  isPercentage?: boolean;
  unit?: string;
  animation?: 'count' | 'fade' | 'pulse' | 'slide';
}> = ({ 
  value, 
  precision = 2, 
  duration = 1000, 
  isPercentage = false, 
  unit = '',
  animation = 'count'
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  
  useEffect(() => {
    // Clean up any previous animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (animation === 'count') {
      const startValue = previousValueRef.current;
      const endValue = value;
      const startTime = performance.now();
      startTimeRef.current = startTime;
      
      const animateValue = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function - easeOutQuad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        
        const currentValue = startValue + (endValue - startValue) * easeProgress;
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateValue);
        } else {
          previousValueRef.current = endValue;
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animateValue);
    } else {
      // For other animation types, just set the final value
      setDisplayValue(value);
      previousValueRef.current = value;
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration, animation]);

  return (
    <Box 
      sx={{
        display: 'inline-block',
        opacity: animation === 'fade' ? 0 : 1,
        animation: animation === 'fade' 
          ? 'fadeIn 0.5s forwards' 
          : animation === 'pulse' 
            ? 'pulse 0.5s' 
            : animation === 'slide'
              ? 'slideIn 0.5s'
              : 'none',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        },
        '@keyframes slideIn': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        }
      }}
    >
      {formatValue(displayValue, precision, isPercentage, unit)}
    </Box>
  );
};

export default function LiveMetrics({
  metrics,
  autoUpdate = false,
  updateInterval = 5000,
  refreshing = false,
  showTrend = true,
  variant = 'default',
  animation = 'count',
}: LiveMetricsProps) {
  const theme = useTheme();
  const [localMetrics, setLocalMetrics] = useState<MetricItem[]>(metrics);
  
  // Update local metrics when props change
  useEffect(() => {
    // Fetch or calculate data related to metrics
    setLocalMetrics(metrics);
  }, [metrics]);
  
  // Auto-update simulation
  useEffect(() => {
    // Auto-update logic or periodic refresh
    if (!autoUpdate) return;
    
    const interval = setInterval(() => {
      setLocalMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          previousValue: metric.value,
          value: metric.value * (1 + (Math.random() * 0.1 - 0.05)), // +/- 5% change
        }))
      );
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [autoUpdate, updateInterval]);
  
  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous || previous === current) return <ChevronsRight size={16} />;
    return current > previous ? <TrendingUp size={16} color="green" /> : <TrendingDown size={16} color="red" />;
  };
  
  const getTrendColor = (current: number, previous?: number): string => {
    if (!previous || previous === current) return theme.palette.text.primary;
    return current > previous 
      ? theme.palette.success.main 
      : theme.palette.error.main;
  };
  
  const getChangePercentage = (current: number, previous?: number): string => {
    if (!previous) return '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  };
  
  if (variant === 'compact') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        position: 'relative'
      }}>
        {refreshing && (
          <LinearProgress 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%',
              height: '2px',
              borderRadius: '2px'
            }} 
          />
        )}
        
        {localMetrics.map((metric, index) => (
          <Box 
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: '150px',
            }}
          >
            {metric.icon && (
              <Box sx={{ color: metric.color || theme.palette.primary.main }}>
                {metric.icon}
              </Box>
            )}
            
            <Box>
              <Typography variant="caption" color="textSecondary">
                {metric.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {metric.isLoading ? (
                  <Skeleton width={60} />
                ) : (
                  <Typography 
                    variant="body1" 
                    fontWeight="bold"
                    sx={{ 
                      color: metric.color || 
                        (showTrend ? getTrendColor(metric.value, metric.previousValue) : theme.palette.text.primary)
                    }}
                  >
                    <AnimatedNumber 
                      value={metric.value}
                      precision={metric.precision}
                      isPercentage={metric.isPercentage}
                      unit={metric.unit}
                      animation={animation}
                    />
                  </Typography>
                )}
                
                {showTrend && metric.previousValue && !metric.isLoading && (
                  <Tooltip title={getChangePercentage(metric.value, metric.previousValue)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                      {getTrendIcon(metric.value, metric.previousValue)}
                    </Box>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
  
  if (variant === 'cards') {
    return (
      <Grid container spacing={2} sx={{ position: 'relative' }}>
        {refreshing && (
          <LinearProgress 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%',
              height: '2px',
              borderRadius: '2px',
              zIndex: 1
            }} 
          />
        )}
        
        {localMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                borderTop: '3px solid',
                borderColor: metric.color || theme.palette.primary.main,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  {metric.label}
                </Typography>
                {metric.icon && (
                  <Box sx={{ color: metric.color || theme.palette.primary.main }}>
                    {metric.icon}
                  </Box>
                )}
              </Box>
              
              {metric.isLoading ? (
                <Skeleton width="80%" height={40} />
              ) : (
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: metric.color || 
                      (showTrend ? getTrendColor(metric.value, metric.previousValue) : theme.palette.text.primary)
                  }}
                >
                  <AnimatedNumber 
                    value={metric.value}
                    precision={metric.precision}
                    isPercentage={metric.isPercentage}
                    unit={metric.unit}
                    animation={animation}
                  />
                </Typography>
              )}
              
              {showTrend && metric.previousValue && !metric.isLoading && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 1,
                  color: getTrendColor(metric.value, metric.previousValue)
                }}>
                  {getTrendIcon(metric.value, metric.previousValue)}
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {getChangePercentage(metric.value, metric.previousValue)}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 3,
          position: 'relative'
        }}
      >
        {refreshing && (
          <LinearProgress 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%',
              height: '2px',
              borderRadius: '2px'
            }} 
          />
        )}
        
        {localMetrics.map((metric, index) => (
          <Box key={index}>
            <Typography 
              variant="h5" 
              fontWeight="bold"
              sx={{ 
                color: metric.color || 
                  (showTrend ? getTrendColor(metric.value, metric.previousValue) : theme.palette.text.primary)
              }}
            >
              {metric.isLoading ? (
                <Skeleton width={80} />
              ) : (
                <AnimatedNumber 
                  value={metric.value}
                  precision={metric.precision}
                  isPercentage={metric.isPercentage}
                  unit={metric.unit}
                  animation={animation}
                />
              )}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {metric.label}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  
  // Default variant
  return (
    <Box sx={{ position: 'relative' }}>
      {refreshing && (
        <LinearProgress 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%',
            height: '2px',
            borderRadius: '2px'
          }} 
        />
      )}
      
      <Grid container spacing={2}>
        {localMetrics.map((metric, index) => (
          <Grid item xs={12} key={index}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 1.5,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {metric.icon && (
                  <Box sx={{ color: metric.color || theme.palette.primary.main }}>
                    {metric.icon}
                  </Box>
                )}
                <Typography variant="body1">{metric.label}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {metric.isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <Typography 
                    variant="body1" 
                    fontWeight="bold"
                    sx={{ 
                      color: metric.color || 
                        (showTrend ? getTrendColor(metric.value, metric.previousValue) : theme.palette.text.primary)
                    }}
                  >
                    <AnimatedNumber 
                      value={metric.value}
                      precision={metric.precision}
                      isPercentage={metric.isPercentage}
                      unit={metric.unit}
                      animation={animation}
                    />
                  </Typography>
                )}
                
                {showTrend && metric.previousValue && !metric.isLoading && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: getTrendColor(metric.value, metric.previousValue)
                  }}>
                    {getTrendIcon(metric.value, metric.previousValue)}
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {getChangePercentage(metric.value, metric.previousValue)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
