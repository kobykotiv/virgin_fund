import React from "react";

export default function BotDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Bot Details</h1>
      <p>Bot ID: {params.id}</p>
      {/* TODO: Implement bot detail view */}
    </div>
  );
}
