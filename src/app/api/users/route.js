import { NextResponse } from "next/server";

import { auth } from "@/auth";
import User from "@/models/User";
import connectMongo from "@/libs/mongoose";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const users = await User.find({});

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
