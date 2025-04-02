import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const runtime = 'edge';
export const revalidate = 31536000; // Cache for 1 year

export async function GET() {
  const headersList = headers();
  const ifNoneMatch = headersList.get('if-none-match');

  // Generate a stable ETag for caching
  const etag = '"placeholder-static-1"';

  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': etag,
      },
    });
  }

  const imageBuffer = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': etag,
      'Last-Modified': new Date(0).toUTCString(),
    },
  });
}
