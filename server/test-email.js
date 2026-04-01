import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config({ path: 'c:/Users/INTEL/Desktop/ThreeSyntax/Docker Project/DockerFirst/server/.env' });

console.log("Testing with Email User:", process.env.EMAIL_USER);
console.log("Testing with Email Pass:", process.env.EMAIL_PASS ? "****" : "NOT SET");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function testMail() {
    try {
        console.log("Attempting to send test email...");
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Send to self
          subject: "SMTP Test",
          text: "If you see this, the SMTP configuration is correct.",
        });
        console.log("Email sent successfully:", info.response);
    } catch (error) {
        console.error("Email error Details:", error);
    }
}

testMail();
