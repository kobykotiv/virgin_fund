import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcrypt"
import { getUsersCollection } from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const usersCollection = await getUsersCollection()
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      userId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}