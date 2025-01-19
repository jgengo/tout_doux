"use server";

import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

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
