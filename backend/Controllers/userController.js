import { validationResult } from "express-validator";
import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from the request body
    const { fullName, email, password, profilePic } = req.body;
    const { firstName, lastName } = fullName;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    // Hash the password
    const hashPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = new User({
      fullName: {
        firstName,
        lastName,
      },
      email,
      password: hashPassword,
      profilePic: profilePic || User.schema.path("profilePic").defaultValue,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = newUser.generateAuthToken();

    // Set the token as a cookie
    res.cookie("jwt", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV !== "development", // Use HTTPS in production
    });

    // Exclude the password from the response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res
      .status(201)
      .json({ message: "User registered successfully", user: userResponse });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract email and password from the request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = user.generateAuthToken();

    // Set the token as a cookie
    res.cookie("token", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV !== "development", // Use HTTPS in production
    });

    // Return success response
    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        profilePic: user.profilePic,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development", // Use HTTPS in production
    });

    // Send success response
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in logoutUser:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
