import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import mime from 'mime';

const BASE_DIR = path.join(process.cwd(), 'public', 'uploads');

const safeJoin = (segments: string[]) => {
  const joined = path.join(BASE_DIR, ...segments);
  if (!joined.startsWith(BASE_DIR)) {
    throw new Error('Invalid path');
  }
  return joined;
};

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const filePath = safeJoin(params.path || []);
    const data = await fs.readFile(filePath);
    const contentType = mime.getType(filePath) || 'application/octet-stream';

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
  }
}
