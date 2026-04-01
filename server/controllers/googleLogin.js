import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // 👉 Signup via Google
      user = await User.create({
        username: name,
        email,
        profilePic: picture,
        provider: "google",
      });
    }

    const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Google login successful",
      token: jwtToken,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Google login error" });
  }
};
