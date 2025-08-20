import React from "react";

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Portfolio Details</h1>
      <p>Portfolio ID: {params.id}</p>
      {/* TODO: Implement portfolio detail view */}
    </div>
  );
}
