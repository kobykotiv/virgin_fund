import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Assuming authOptions are in lib/auth.ts
import { PrismaClient } from '@prisma/client';
import { encrypt } from '@/lib/utils/crypto';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for saving credentials
const credentialsSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  secretKey: z.string().min(1, "Secret Key is required"),
  isPaper: z.boolean().default(true),
});

// POST handler to save/update credentials
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = credentialsSchema.parse(body);

    const encryptedApiKey = encrypt(validatedData.apiKey);
    const encryptedSecretKey = encrypt(validatedData.secretKey);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        alpacaApiKey: encryptedApiKey,
        alpacaSecretKey: encryptedSecretKey,
        alpacaIsPaper: validatedData.isPaper,
        // Optionally set tradingEnabled to true here, or require separate user action
        // tradingEnabled: true, 
      },
    });

    return NextResponse.json({ success: true, message: 'Credentials saved successfully' });

  } catch (error) {
    console.error('Error saving Alpaca credentials:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save credentials' }, { status: 500 });
  }
}

// GET handler to check if credentials exist
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { alpacaApiKey: true }, // Only select one key field to check existence
    });

    const hasKeys = !!user?.alpacaApiKey; // Check if the field is not null/empty

    return NextResponse.json({ hasKeys });

  } catch (error) {
    console.error('Error checking Alpaca credentials status:', error);
    return NextResponse.json({ error: 'Failed to check credentials status' }, { status: 500 });
  }
}
