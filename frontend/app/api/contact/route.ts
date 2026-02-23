import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://strapi:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, content } = body;

    if (!name || !email || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const strapiResponse = await fetch(`${STRAPI_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        data: {
          name,
          email,
          subject,
          content,
        },
      }),
    });

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json().catch(() => ({}));
      console.error('Strapi Error in Contact Form Submission:', {
        status: strapiResponse.status,
        errorData,
      });
      return NextResponse.json(
        { error: 'Failed to submit to Strapi' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact Form Submission Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
