import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/lib/utils/crypto';
import { AlpacaClient } from '@/lib/alpaca-client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch user with encrypted keys
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { alpacaApiKey: true, alpacaSecretKey: true, alpacaIsPaper: true },
    });

    if (!user || !user.alpacaApiKey || !user.alpacaSecretKey) {
      return NextResponse.json({ error: 'Alpaca credentials not configured.' }, { status: 400 });
    }

    // Decrypt keys
    let apiKey: string;
    let secretKey: string;
    try {
      apiKey = decrypt(user.alpacaApiKey);
      secretKey = decrypt(user.alpacaSecretKey);
    } catch (decryptError) {
      console.error("Decryption failed for user:", session.user.id, decryptError);
      return NextResponse.json({ error: 'Failed to decrypt credentials.' }, { status: 500 });
    }

    // Instantiate Alpaca client
    const alpaca = new AlpacaClient({
      apiKey,
      secretKey,
      isPaper: user.alpacaIsPaper,
    });

    // Fetch positions data
    const positionsData = await alpaca.getPositions();

    // Optional: Transform data if needed before sending to client
    // e.g., convert string numbers to actual numbers if the frontend expects them
    const transformedPositions = positionsData.map(pos => ({
      ...pos,
      qty: parseFloat(pos.qty),
      market_value: parseFloat(pos.market_value),
      cost_basis: parseFloat(pos.cost_basis),
      unrealized_pl: parseFloat(pos.unrealized_pl),
      current_price: parseFloat(pos.current_price),
      avg_entry_price: parseFloat(pos.avg_entry_price),
    }));


    return NextResponse.json(transformedPositions);

  } catch (error) {
    console.error('Error fetching Alpaca positions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Alpaca positions data.';
    const status = errorMessage.includes('Unauthorized') || errorMessage.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
