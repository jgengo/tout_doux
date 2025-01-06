import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Task from "@/models/Task";
import connectMongo from "@/libs/mongoose";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams);

  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const tasks = await Task.find({ userId: session.user.id })
      .sort({ createdAt: -1 }) // Most recent first
      .exec();

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
