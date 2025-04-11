import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/lib/utils/crypto';
import { AlpacaClient, AlpacaOrder } from '@/lib/alpaca-client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Extract query parameters for filtering orders
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as 'open' | 'closed' | 'all' | null;
  const limit = searchParams.get('limit');
  const after = searchParams.get('after');
  const until = searchParams.get('until');
  const direction = searchParams.get('direction') as 'asc' | 'desc' | null;
  const symbols = searchParams.get('symbols');

  const params: any = {};
  if (status && ['open', 'closed', 'all'].includes(status)) params.status = status;
  if (limit) params.limit = parseInt(limit, 10);
  if (after) params.after = after;
  if (until) params.until = until;
  if (direction && ['asc', 'desc'].includes(direction)) params.direction = direction;
  if (symbols) params.symbols = symbols.split(',');

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

    // Fetch orders data with parameters
    const ordersData: AlpacaOrder[] = await alpaca.getOrders(params);

    // Optional: Transform data if needed
    const transformedOrders = ordersData.map(order => ({
      ...order,
      qty: order.qty ? parseFloat(order.qty) : undefined,
      notional: order.notional ? parseFloat(order.notional) : undefined,
      limit_price: order.limit_price ? parseFloat(order.limit_price) : undefined,
      stop_price: order.stop_price ? parseFloat(order.stop_price) : undefined,
      filled_avg_price: order.filled_avg_price ? parseFloat(order.filled_avg_price) : undefined,
      filled_qty: order.filled_qty ? parseFloat(order.filled_qty) : undefined,
      trail_price: order.trail_price ? parseFloat(order.trail_price) : undefined,
      trail_percent: order.trail_percent ? parseFloat(order.trail_percent) : undefined,
    }));

    return NextResponse.json(transformedOrders);

  } catch (error) {
    console.error('Error fetching Alpaca orders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Alpaca orders data.';
    const status = errorMessage.includes('Unauthorized') || errorMessage.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

// Optional: POST handler if you want to create orders via this route
// export async function POST(request: NextRequest) { ... }
