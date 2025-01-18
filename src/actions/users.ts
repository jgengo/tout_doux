"use server";

import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function getUsers() {
    try {
        await connectMongo();
        const users = await User.find({});
        return users;
    } catch (error) {
        console.error(error);
        return [];
    }
}
