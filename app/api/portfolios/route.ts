import { NextRequest, NextResponse } from 'next/server';
import { getPortfoliosCollection, syncPortfolio } from '../../../lib/mongodb';

export async function GET() {
  try {
    const collection = await getPortfoliosCollection();
    const portfolios = await collection.find({}).toArray();
    return NextResponse.json(portfolios);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const portfolio = await req.json();
    const result = await syncPortfolio(portfolio, true);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 });
  }
}
