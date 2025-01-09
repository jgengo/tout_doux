import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Dump from "@/models/Dump";
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
