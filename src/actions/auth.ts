"use server";

import { User } from "@/models/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";

export async function loginUser(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("loginUser formData:", { email, password });

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  let userRole = "";

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid email or password." };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Invalid email or password." };
    }

    userRole = user.role;

    const accessToken = jwt.sign(
      { userId: user._id, role: userRole },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "30m" },
    );

    const refreshToken = jwt.sign(
      { userId: user._id, role: userRole },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    user.refreshToken = refreshToken;
    await user.save();

    (await cookies()).set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 60,
      path: "/",
      sameSite: "lax",
    });

    (await cookies()).set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  redirect(userRole === "admin" ? "/admin" : "/employee");
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  redirect("/login");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string, role: string };
    await connectDB();
    const user = await User.findById(decoded.userId).select("name role").lean();
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
