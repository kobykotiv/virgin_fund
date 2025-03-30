import { NextRequest, NextResponse } from "next/server"

// Temporary in-memory storage for demo purposes
let portfolios = [
  {
    id: "p1",
    userId: "u1",
    name: "Growth Portfolio",
    description: "Long-term growth focused investments",
    type: "standard",
    strategy: "passive",
    risk: "moderate",
    assets: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  // In a real app, we would authenticate the user and get their portfolios
  try {
    // Mock delay to simulate database query
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return NextResponse.json(portfolios)
  } catch (error) {
    console.error("Error fetching portfolios:", error)
    return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.name) {
      return NextResponse.json({ error: "Portfolio name is required" }, { status: 400 })
    }
    
    const newPortfolio = {
      id: `p${Date.now()}`,
      userId: "u1", // In a real app, we would get this from the authenticated user
      name: body.name,
      description: body.description || "",
      type: body.type || "standard",
      strategy: body.strategy || "passive",
      risk: body.risk || "moderate",
      assets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Add to our in-memory "database"
    portfolios.push(newPortfolio)
    
    return NextResponse.json(newPortfolio, { status: 201 })
  } catch (error) {
    console.error("Error creating portfolio:", error)
    return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 })
  }
}
