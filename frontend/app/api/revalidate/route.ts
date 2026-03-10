import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath('/journals');
  revalidatePath('/authors');
  revalidatePath('/news');

  return NextResponse.json({ revalidated: true });
}
