import User from "../Models/userModel.js";
import Conversation from "../Models/conversationModel.js";

export const getUserBySearch = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const currentUserId = req.user._id;
    console.log("Search Query:", search); // Debugging
    console.log("Current User ID:", currentUserId); // Debugging

        // If search is empty, return an empty array
        if (!search) {
          return res.status(200).json({ success: true, users: [] });
        }

    // Define the search query
    const query = {
      $and: [
        {
          $or: [
            { email: { $regex: ".*" + search + ".*", $options: "i" } }, // Case-insensitive email search
            { fullName: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        },
        {
          _id: { $ne: currentUserId }, // Exclude the current user
        },
      ],
    };

    // Find users matching the query and exclude the password field
    const users = await User.find(query).select("-password");
    console.log("Found Users:", users); // Debugging


    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUserBySearch:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Fetch conversations where the current user is a participant
    const currentChatter = await Conversation.find({
      participant: currentUserId,
    }).sort({ updatedAt: -1 }); // Sort by most recent conversations first

    // If no conversations exist, return an empty array
    if (!currentChatter.length) return res.status(200).json([]);

    // Extract unique IDs of other participants
    const participantId = currentChatter.reduce((ids, conversation) => {
      const otherParticipant = conversation.participant.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
      return [...ids, ...otherParticipant];
    }, []); // Initialize the accumulator with an empty array

    // Fetch details of other participants (exclude password)
    const user = await User.find({ _id: { $in: participantId } }).select(
      "-password"
    );

    // Create a lookup object for efficient mapping
    const userLookup = user.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    // Map IDs to user objects
    const users = participantId.map((id) => userLookup[id.toString()]);

    // Send the response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getCurrentUser:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
