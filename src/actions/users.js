"use server";

import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Task from "@/models/Task";
import Dump from "@/models/Dump";

export async function getUsers() {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectMongo();
    const users = await User.find({}).lean();

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function deleteMe() {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const id = session?.user?.id;

    await connectMongo();
    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    await Promise.all([
      User.findByIdAndDelete(id),
      Task.deleteMany({ userId: id }),
      Dump.deleteMany({ userId: id }),
    ]);

    return { message: "User deleted successfully" };
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw new Error("Failed to delete user");
  }
}
