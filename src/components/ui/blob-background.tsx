// import React from 'react';

export function BlobBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-0 left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
    </div>
  );
}