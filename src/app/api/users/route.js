import User from "@/models/User";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || !session?.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const users = await User.find({});
    console.log(users);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
