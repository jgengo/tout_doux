import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Task from "@/models/Task";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const user = await User.findById(session.user.id);

    // Allow deletion if user owns the task or is admin
    if (!user.tasks.includes(task._id) && !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove task from user's tasks array
    user.tasks = user.tasks.filter((taskId) => !taskId.equals(task._id));
    await user.save();

    await Task.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    // Validate request
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate body
    const { text, position, isCompleted } = await req.json();

    if (text !== undefined && text.trim() === "") {
      return NextResponse.json(
        { error: "Task text cannot be empty" },
        { status: 400 }
      );
    }

    if (!text && position === undefined && isCompleted === undefined) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Connect and fetch data
    await connectMongo();
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const user = await User.findById(session.user.id);
    if (!user.tasks.includes(task._id) && !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prepare update fields
    const updateFields = {
      ...(text !== undefined && { text }),
      ...(isCompleted !== undefined && { isCompleted }),
      ...(position !== undefined && { position }),
    };

    // Handle position updates if needed
    if (position !== undefined) {
      const query = {
        userId: user._id,
        date: task.date,
      };

      if (position < task.position) {
        await Task.updateMany(
          {
            ...query,
            position: { $gte: position, $lt: task.position },
          },
          { $inc: { position: 1 } }
        );
      } else if (position > task.position) {
        await Task.updateMany(
          {
            ...query,
            position: { $gt: task.position, $lte: position },
          },
          { $inc: { position: -1 } }
        );
      }
    }

    // Update and return task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
