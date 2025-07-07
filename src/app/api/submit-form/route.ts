import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body.token;

  if (!token) {
    return NextResponse.json({ success: false, message: "No token provided" }, { status: 400 });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY!;
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      { method: "POST" }
    );

    const data = await verifyRes.json();

    if (!data.success) {
      return NextResponse.json({ success: false, message: "Failed captcha verification" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch{
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
