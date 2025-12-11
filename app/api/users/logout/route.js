import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
