/**
 * API route to proxy DXF file requests from R2
 * This bypasses CORS issues when fetching DXF files from the client
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate that the URL is from our R2 bucket
    const r2PublicUrl = process.env.R2_PUBLIC_URL;
    if (!r2PublicUrl) {
      console.error('R2_PUBLIC_URL not configured');
      return NextResponse.json(
        { error: 'Storage configuration error' },
        { status: 500 }
      );
    }

    if (!url.startsWith(r2PublicUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL - must be from configured storage' },
        { status: 400 }
      );
    }

    // Fetch the DXF file from R2
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch DXF from R2: ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch DXF file: ${response.statusText}` },
        { status: response.status }
      );
    }

    const dxfContent = await response.text();

    // Return the DXF content with appropriate headers
    return new NextResponse(dxfContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year since files don't change
      },
    });
  } catch (error) {
    console.error('Error proxying DXF file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to proxy DXF file: ${errorMessage}` },
      { status: 500 }
    );
  }
}
