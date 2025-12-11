import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectToDB();

    const { token } = await request.json();

    if (!token) {
      return request.json(
        { error: "Invalid token", success: false },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return request.json(
        { error: "Invalid token", success: false },
        { status: 400 }
      );
    }
    if (user.isVerified) {
      return NextResponse.json(
        {
          message: "Email Already Verified",
        },
        {
          status: 400,
        }
      );
    }
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    console.log(user);
    return NextResponse.json(
      { message: "Email verified successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error?.message, success: false },
      { status: 500 }
    );
  }
}
