import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    connectToDB();
    const { email, password } = await request.json();

    if (!email || !password)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect)
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.NEXT_PUBLIC_JWT_SECRET, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
