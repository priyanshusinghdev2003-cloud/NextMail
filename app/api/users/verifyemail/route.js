import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

export async function POST(request) {
  try {
    await connectToDB();

    const { token } = await request.json();

    if (!token) {
      return request.json({ error: "Invalid token" }, { status: 400 });
    }
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return request.json({ error: "Invalid token" }, { status: 400 });
    }
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    console.log(user);
    return request.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    return request.json({ error: error.message }, { status: 500 });
  }
}
