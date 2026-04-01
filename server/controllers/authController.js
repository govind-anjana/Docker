import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendOTPEmail } from "../utils/sendEmail.js";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

// Email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
};

export const signup = async (req, res) => {
  try {
    const { username, email, number, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;

    if (existingUser) {
      // Update existing unverified user
      user = existingUser;
      user.username = username;
      user.password = hashedPassword;
      user.number = number;
    } else {
      user = new User({
        username,
        email,
        number,
        password: hashedPassword,
        provider: "local",
      });
    }

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min
    user.isVerified = false;

    await user.save();

    // Send email before responding to client
    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully",
      otp: otp // Keep for debugging if user depends on it
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup error" });
  }
};
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "OTP verification error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    //  2. Find user (include password)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
       if (!user || user.provider !== "local") {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //  3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    //  4. Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //  5. Remove password from response
    const { password: pwd, ...userData } = user._doc;

    //  6. Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};
export const allUser = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password from results
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT,       // GOOGLE CLIENT ID
//       clientSecret: process.env.GOOGLE_SECRET,   // GOOGLE CLIENT SECRET
//       callbackURL: "https://teezines-project.onrender.com/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;
//         let user = await UserModel.findOne({ email });

//         // If user does not exist → signup
//         if (!user) {
//           user = await UserModel.create({
//             username: profile.displayName,
//             email: email,
//             password: null,    // Google users ka password null
//             isVerified: true,
//             googleId: profile.id,
//             authType: "google",
//           });
//         }

//         done(null, user);
//       } catch (err) {
//         done(err, null);

//       }
//     }
//   )
// );

// // -------------------------
// //  Route: Start Google login
// // -------------------------
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // -------------------------
// //  Route: Google callback
// // -------------------------
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     const token = jwt.sign(
//       { id: req.user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Send token & user to frontend popup
//     res.send(`
//       <script>
//         window.opener.postMessage(
//           ${JSON.stringify({ token, user: req.user })},
//           "http://localhost:5173"
//         );
//         window.close();
//       </script>
//     `);
//   }
// );
