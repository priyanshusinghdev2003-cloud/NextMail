import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    let hashToken = await bcryptjs.hash(userId.toString(), 10);
    hashToken = hashToken.replace(".", "");

    if (emailType == "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType == "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: "priyanshusinghthakur7600@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your email address"
          : "Reset your password",
      html: `
  <div style="
    max-width: 600px;
    margin: 0 auto;
    padding: 24px;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f9fafb;
  ">
    <div style="
      background-color: #ffffff;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    ">
      <h2 style="
        margin-top: 0;
        color: #111827;
        text-align: center;
      ">
        ${
          emailType === "VERIFY"
            ? "Verify your email address"
            : "Reset your password"
        }
      </h2>

      <p style="
        color: #374151;
        font-size: 15px;
        line-height: 1.6;
      ">
        Hi 👋 <br /><br />
        ${
          emailType === "VERIFY"
            ? "Thanks for signing up! Please confirm your email address by clicking the button below."
            : "You requested to reset your password. Click the button below to proceed."
        }
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a 
          href="${process.env.domain}/verifyemail?token=${hashToken}"
          style="
            background-color: #2563eb;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            display: inline-block;
          "
        >
          ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
        </a>
      </div>

      <p style="
        color: #6b7280;
        font-size: 13px;
        line-height: 1.6;
      ">
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="
        word-break: break-all;
        background-color: #f3f4f6;
        padding: 12px;
        border-radius: 4px;
        font-size: 13px;
        color: #111827;
      ">
        ${process.env.domain}/verifyemail?token=${hashToken}
      </p>

      <p style="
        margin-top: 32px;
        font-size: 12px;
        color: #9ca3af;
        text-align: center;
      ">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
  </div>
`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.log(error);
    throw new Error(error?.message);
  }
};
