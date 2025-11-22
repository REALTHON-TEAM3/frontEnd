import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }

  if (message.startsWith("http") || message.startsWith("https")) {
    return NextResponse.json({ reply: "Link received" });
  } else {
    return NextResponse.json({ reply: `Keyword received: ${message}` });
  }
}
