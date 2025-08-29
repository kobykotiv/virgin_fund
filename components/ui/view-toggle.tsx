"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

export type ViewMode = 'table' | 'card';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewToggle({ viewMode, onViewModeChange, className = '' }: ViewToggleProps) {
  return (
    <div className={`flex items-center gap-1 p-1 bg-muted rounded-lg ${className}`}>
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('table')}
        className="h-8 px-3"
      >
        📊 Table
      </Button>
      <Button
        variant={viewMode === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('card')}
        className="h-8 px-3"
      >
        🎯 Cards
      </Button>
    </div>
  );
}