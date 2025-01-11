import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Task from "@/models/Task";
import User from "@/models/User";
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

export async function POST(req) {
  try {
    const { text, date } = await req.json();

    if (!text || !date) {
      return NextResponse.json(
        { error: "Text and date are required" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const user = await User.findById(session.user.id);

    // Format date to YYYY-MM-DD and find highest position for tasks on this date
    const formattedDate = new Date(date).toISOString().split("T")[0];
    const tasksOnDate = await Task.find({
      userId: user._id,
      date: formattedDate,
    })
      .sort({ position: -1 })
      .limit(1);

    const position = tasksOnDate.length > 0 ? tasksOnDate[0].position + 1 : 1;

    const task = await Task.create({
      userId: user._id,
      text,
      date: formattedDate,
      position,
    });

    user.tasks.push(task._id);
    await user.save();

    return NextResponse.json(
      { message: "Task created successfully" },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
