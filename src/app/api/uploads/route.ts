import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';

const allowedTypes = {
  avatar: ['image/jpeg', 'image/png', 'image/jpg'],
  poster: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  image: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
};

const sizeLimits = {
  avatar: 5 * 1024 * 1024, // 5MB
  poster: 15 * 1024 * 1024, // 15MB
  image: 15 * 1024 * 1024
};

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const formData = await request.formData();
    const file = formData.get('file');
    const uploadType = (formData.get('type') as string) || 'files';

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const allowed = allowedTypes[uploadType as keyof typeof allowedTypes] ||
      Array.from(new Set([...allowedTypes.avatar, ...allowedTypes.poster]));

    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    const maxSize = sizeLimits[uploadType as keyof typeof sizeLimits] || sizeLimits.poster;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeFolder = ['avatar', 'poster', 'image'].includes(uploadType) ? uploadType : 'files';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    const extension = path.extname(file.name) ||
      (file.type === 'application/pdf' ? '.pdf' : file.type.startsWith('image/') ? '.jpg' : '');
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    // Always return a web-friendly path (forward slashes)
    const publicPath = `/uploads/${safeFolder}/${fileName}`;

    return NextResponse.json({
      success: true,
      path: publicPath
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'Authentication required' || error.message === 'Forbidden')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.message === 'Forbidden' ? 403 : 401 }
      );
    }
    console.error('File upload failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
