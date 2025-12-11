import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    connectToDB();
    const { value: token } = request.cookies.get("token");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
