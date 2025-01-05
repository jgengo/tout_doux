import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Task from "@/models/Task";

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

    // Find highest position for tasks on this date
    const tasksOnDate = await Task.find({
      userId: user._id,
      date: date,
    })
      .sort({ position: -1 })
      .limit(1);

    const position = tasksOnDate.length > 0 ? tasksOnDate[0].position + 1 : 1;

    const task = await Task.create({
      userId: user._id,
      text,
      date,
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
