import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token found" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as jwt.JwtPayload;

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 403 },
      );
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "30m" },
    );

    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 60,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }
}
