import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Dump from "@/models/Dump";
import User from "@/models/User";
import connectMongo from "@/libs/mongoose";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const dumps = await Dump.find({ userId: session.user.id }).exec();

    return NextResponse.json(dumps, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch dumps:", error);
    return NextResponse.json(
      { error: "Failed to fetch dumps" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Find highest position for current user's dumps
    const lastDump = await Dump.findOne({ userId: session.user.id })
      .sort({ position: -1 })
      .limit(1);

    const position = lastDump ? lastDump.position + 1 : 1;

    const dump = await Dump.create({
      userId: session.user.id,
      text: text.trim(),
      position,
    });

    await User.findByIdAndUpdate(session.user.id, {
      $push: { dumps: dump._id },
    });

    return NextResponse.json(
      { message: "Dump created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create dump:", error);
    return NextResponse.json(
      { error: "Failed to create dump" },
      { status: 500 }
    );
  }
}
