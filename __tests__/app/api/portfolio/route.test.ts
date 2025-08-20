// Unit tests for the /api/portfolio endpoint

import { POST } from '@/app/api/portfolio/route';
import { NextRequest } from 'next/server';

describe('/api/portfolio POST', () => {
  it('returns quotes for valid symbols with mock credentials', async () => {
    const req = {
      json: async () => ({
        credentials: { keyId: 'mock', secretKey: 'mock', paper: true },
        symbols: ['AAPL', 'TSLA'],
      }),
    } as unknown as NextRequest;

    const res = await POST(req);
    const json = await res.json();
    expect(json.data).toBeDefined();
    expect(json.data.AAPL).toBeDefined();
    expect(json.data.TSLA).toBeDefined();
  });

  it('returns error for missing symbols', async () => {
    const req = {
      json: async () => ({
        credentials: { keyId: 'mock', secretKey: 'mock', paper: true },
      }),
    } as unknown as NextRequest;

    const res = await POST(req);
    const json = await res.json();
    expect(json.data).toEqual({});
  });

  it('returns error for invalid request', async () => {
    const req = {
      json: async () => {
        throw new Error('Invalid JSON');
      },
    } as unknown as NextRequest;

    const res = await POST(req);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });
});
