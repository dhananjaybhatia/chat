import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
      },
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true, // Ensure usernames are unique
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true, // Ensure emails are unique
      lowercase: true, // Convert email to lowercase
      validate: {
        validator: (value) => {
          // Simple email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    profilePic: {
      type: String,
      default:
        "https://cdn.domestika.org/c_fill,dpr_auto,f_auto,q_auto,w_1200/v1700126092/blog-post-open-graph-covers/000/011/864/11864-original.png?1700126092", // Default profile picture
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const User = mongoose.model("User", userSchema);

export default User;
