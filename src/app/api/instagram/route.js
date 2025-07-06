import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Instagram Basic Display API를 사용하여 게시물 가져오기
    if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
      throw new Error('Instagram access token not configured');
    }

    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Instagram posts');
    }
    
    const data = await response.json();
    
    // 실제 Instagram 데이터 반환
    return NextResponse.json({ posts: data.data });
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    );
  }
} 