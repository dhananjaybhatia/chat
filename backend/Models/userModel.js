import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        minlength: [3, "First name must be at least 3 characters long"],
        required: [true, "First name is required"],
        trim: true,
      },
      lastName: {
        type: String,
        minlength: [3, "Last name must be at least 3 characters long"],
        required: [true, "Last name is required"],
        trim: true,
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true, // Ensure emails are unique
      lowercase: true, // Convert email to lowercase
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

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// userSchema.statics.hashPassword = async function (password) {
//   return await bcrypt.hash(password, 10);
// };

const User = mongoose.model("User", userSchema);

export default User;
