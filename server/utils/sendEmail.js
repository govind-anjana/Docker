import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Sends an OTP email to the user.
 * @param {string} email - Recipient email
 * @param {string} otp - The OTP code
 */
export const sendOTPEmail = async (email, otp) => {
  // Transporter creation inside the function ensures it uses the latest environment variables
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password
    },
  });

  try {
    console.log(`[EmailService] Attempting to send OTP to: ${email}`);

    // Verify transporter configuration
    await transporter.verify();

    const mailOptions = {
      from: `"Maitri Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Account - OTP Code",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">OTP Verification</h1>
          </div>
          <div style="padding: 30px; line-height: 1.6; color: #333; text-align: center;">
            <p style="font-size: 18px;">Hello,</p>
            <p>Use the following One-Time Password (OTP) to complete your verification. This code is valid for <strong>5 minutes</strong>.</p>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50; border: 1px dashed #4CAF50;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #777;">If you did not request this verification, please ignore this email.</p>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #999;">
            &copy; ${new Date().getFullYear()} Maitri App. All rights reserved.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email sent successfully ✅ (ID: ${info.messageId})`);
    return info;

  } catch (error) {
    console.error("[EmailService] Error occurred ❌:");
    console.error(`- Message: ${error.message}`);

    if (error.code === 'EAUTH') {
      console.error("- Recommendation: Authentication failed. Please check if your Google App Password is correct and without spaces.");
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error("- Recommendation: Connection to SMTP server failed. Check your network/firewall settings (Port 465/587).");
    }

    throw new Error(`Email sending failed: ${error.message}`);
  }
};