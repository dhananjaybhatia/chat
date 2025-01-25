import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
      ],
      default: [], // Initialize messages as an empty array by default
    },
  },
  { timestamps: true }
);

// // Add validation to ensure at least two participants
// conversationSchema.path("participants").validate(function (value) {
//   return value.length >= 2; // At least two participants are required
// }, "A conversation must have at least two participants.");

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
