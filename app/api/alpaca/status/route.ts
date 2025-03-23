import { NextResponse } from "next/server"

export async function GET() {
  // In a real app, this would check if API keys are stored in your database or environment variables
  // For demo purposes, we'll return a mock response with configuration details

  return NextResponse.json({
    configured: true, // Set to true to skip the API key form
    message: "API keys configured",
    config: {
      keyId: "PKABCDEFGHIJKLMNOPQRS",
      secretKey: "****************************************",
      baseUrl: "https://paper-api.alpaca.markets",
      isPaper: true,
    },
  })
}

