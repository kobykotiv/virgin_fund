import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  hcaptchaToken: z.string().min(1, "CAPTCHA verification required"),
  mathProblem: z.object({
    num1: z.number().int().min(100).max(999),
    num2: z.number().int().min(100).max(999),
    num3: z.number().int().min(100).max(999),
  }),
  mathAnswer: z.number().int()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    // Verify hCaptcha
    const hcaptchaResponse = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY || "",
        response: validatedData.hcaptchaToken,
      }),
    });

    const hcaptchaData = await hcaptchaResponse.json();
    if (!hcaptchaData.success) {
      return NextResponse.json(
        { error: "CAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Verify math problem
    const { num1, num2, num3 } = validatedData.mathProblem;
    const expectedAnswer = (num1 * num2 * num3) - 7;

    if (validatedData.mathAnswer !== expectedAnswer) {
      return NextResponse.json(
        { error: "Incorrect math answer" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        alpacaIsPaper: true, // Start with paper trading
        tradingEnabled: false, // Require API key setup to enable trading
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        userId: newUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}