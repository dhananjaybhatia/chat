import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setMessage } from "../../redux/messageSlice";

export default function MessageContainer() {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.selectedUser.selectedUser); // Get the selected user from Redux
  const messages = useSelector((state) => state.message.message); // Get messages from Redux

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Log the selected user for debugging
  console.log("Selected User in MessageContainer:", selectedUser);

  // Fetch messages when the selected user changes
  useEffect(() => {
    if (!selectedUser?._id) {
      console.log("No user selected. Skipping message fetch.");
      return; // Exit if no selected user
    }

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You are not authenticated. Please log in.");
          return;
        }

        console.log("Fetching messages for user ID:", selectedUser._id);

        const response = await axios.get(
          `${baseUrl}/api/message/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        console.log("Fetched messages:", data); // Log the fetched messages

        dispatch(setMessage(data)); // Update Redux with messages
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("An error occurred while fetching messages.");
      }
    };

    fetchMessages();
  }, [selectedUser, baseUrl, dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-4">
        {selectedUser && selectedUser.fullName ? (
          <>
            <img
              src={selectedUser.profilePic || "https://via.placeholder.com/150"}
              alt={`${selectedUser.fullName.firstName} ${selectedUser.fullName.lastName}`}
              className="h-12 w-12 rounded-full"
            />
            {`${selectedUser.fullName.firstName.toUpperCase()} ${selectedUser.fullName.lastName.toUpperCase()}`}
          </>
        ) : (
          <>
            <div className="h-screen w-full flex justify-center items-center">
              <h1 className="text-3xl">Click and Check the messages</h1>
            </div>
          </>
        )}
      </h2>

      {messages.length > 0 ? (
        messages.map((message) => (
          <div key={message._id} className="mb-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-800">{message.message}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="h-screen w-full flex justify-center items-center">
          <h1 className="text-3xl">Start your Conversation</h1>
        </p>
      )}
    </div>
  );
}
