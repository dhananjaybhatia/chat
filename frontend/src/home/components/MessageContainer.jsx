/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setMessage, addMessage } from "../../redux/messageSlice";
import { useAuth } from "../../context/AuthContext";
import SendIcon from "@mui/icons-material/Send";
import { useSocketContext } from "../../context/SocketContext";
import notify from "../../asset/audio.wav";

export default function MessageContainer() {
  const [sendData, setSendData] = useState("");
  const { socket } = useSocketContext();
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.selectedUser.selectedUser); // Get the selected user from Redux
  const messages = useSelector((state) => state.message.message); // Get messages from Redux
  const { authUser } = useAuth();

  const messagesContainerRef = useRef();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.preload = "auto";

      // Attempt to play the notification sound
      sound.play().catch((error) => {
        console.error("Audio playback failed:", error.message);
      });

      // Dispatch the addMessage action to add the new message to Redux
      dispatch(addMessage(newMessage));
    });

    return () => socket?.off("newMessage");
  }, [socket, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sendData.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please log in.");
        return;
      }

      // Send the message to the API
      const response = await axios.post(
        `${baseUrl}/api/message/send/${selectedUser._id}`,
        { message: sendData }, // Correctly pass the message in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data) {
        // Update the Redux messages state
        dispatch(setMessage([...messages, data]));

        // Clear the input field
        setSendData("");
      } else {
        toast.error("Failed to send the message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred while sending the message.");
    }
  };

  // Fetch messages when the selected user changes
  useEffect(() => {
    // Explicitly check if selectedUser._id exists
    if (!selectedUser?._id) {
      return; // Exit early if no user is selected
    }

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You are not authenticated. Please log in.");
          return;
        }

        const response = await axios.get(
          `${baseUrl}/api/message/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.data;

        dispatch(setMessage(data)); // Update Redux with messages
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("An error occurred while fetching messages.");
      }
    };

    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]); // Runs whenever `messages` updates

  return (
    <div className="p-4 relative h-full flex flex-col">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-4">
        {selectedUser && selectedUser.fullName ? (
          <>
            <img
              src={selectedUser.profilePic || "https://via.placeholder.com/150"}
              alt={`${selectedUser.fullName.firstName} ${selectedUser.fullName.lastName}`}
              className="h-12 w-12 rounded-full"
            />
            {`${selectedUser.fullName.firstName} ${selectedUser.fullName.lastName}`}
          </>
        ) : (
          <div className="h-full w-full flex justify-center items-center">
            <div className="flex items-center flex-col">
              <h1 className="text-3xl">Welcome!!</h1>
              <span className="text-xl">Select a chat to start messaging</span>
            </div>
          </div>
        )}
      </h2>

      {/* Conditional Rendering */}
      {selectedUser ? (
        messages.length > 0 ? (
          // Attach the ref to this div
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto mb-20"
          >
            {messages.map((message) => (
              <div
                key={message._id}
                className={`mb-4 flex ${
                  message.senderId === authUser.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="max-w-[70%]">
                  {/* Date and Time */}
                  <div className="text-gray-900 text-xs mb-1">
                    {new Date(message.createdAt).toLocaleDateString("en-AU")}{" "}
                    {new Date(message.createdAt).toLocaleTimeString("en-AU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {/* Message Content */}
                  <div
                    className={`p-4 rounded-lg ${
                      message.senderId === authUser.id
                        ? "bg-blue-200" // Authenticated user's messages (right)
                        : "bg-white" // Other users' messages (left)
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 h-full w-full flex justify-center items-center">
            <div className="flex items-center flex-col">
              <h1 className="text-3xl">Let&apos;s start the conversation!</h1>
            </div>
          </div>
        )
      ) : (
        <div className="flex-1 h-full w-full flex justify-center items-center">
          <div className="flex items-center flex-col">
            <h1 className="text-3xl">Welcome!!</h1>
            <span className="text-xl">Select a chat to start messaging</span>
          </div>
        </div>
      )}

      {/* Input Form */}
      {selectedUser && selectedUser._id && (
        <form
          onSubmit={handleSubmit}
          className="absolute bottom-0 left-0 w-full px-4 py-4 border-t"
        >
          <div className="relative flex items-center w-full">
            <input
              value={sendData}
              required
              id="message"
              type="text"
              className="w-full text-gray-700 p-4 pr-12 rounded-full border-2 border-orange-400 focus:outline-none bg-transparent"
              placeholder="Type your message..."
              onChange={(e) => setSendData(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-500"
            >
              <SendIcon />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
