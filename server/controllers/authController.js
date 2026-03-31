import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";
export const signup = async (req, res) => {
  try {
    const { username, email, number, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = new User({
      username,
      email,
      number,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        number: newUser.number,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error during login" });
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
