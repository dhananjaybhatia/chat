import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUsers } from "../../redux/selectedUserSlice"; // Import the setSelectedUser action

export default function SideBar() {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.selectedUser.selectedUser); // Get the selected user from Redux

  const [searchQuery, setSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState([]);
  const [chatUser, setChatUser] = useState([]); // List of users to chat with
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { authUser } = useAuth();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Memoize fetchUsers with useCallback
  const fetchUsers = useCallback(
    async (query) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You are not authenticated. Please log in.");
          return;
        }

        setLoading(true);

        const response = await axios.get(
          `${baseUrl}/api/user/search?search=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        console.log("API Response:", data);

        if (data.length === 0) {
          toast.info("User not found.");
          setFoundUser([]); // Clear previous results
        } else {
          setFoundUser(data); // Update state with the found users
        }
      } catch (error) {
        console.error("Error searching user:", error);
        toast.error("An error occurred while searching.");
      } finally {
        setLoading(false);
      }
    },
    [baseUrl] // Add dependencies here (e.g., baseUrl)
  );

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get(`${baseUrl}/api/user/currentChatter`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        if (!data) {
          throw new Error("No data received from the server.");
        }

        setChatUser(data); // Initialize chatUser with current chatters
        console.log("Chat User:", data);
      } catch (error) {
        console.error("Error fetching current chatter:", error);
        toast.error(error.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    chatUserHandler();
  }, [baseUrl]);

  useEffect(() => {
    // Create the debounced function
    const debouncedFetchUsers = debounce((query) => {
      if (query.trim().length >= 3) {
        fetchUsers(query);
      } else {
        setFoundUser([]); // Clear users if searchQuery is too short
      }
    }, 300);

    // Call the debounced function
    debouncedFetchUsers(searchQuery);

    // Cleanup debounce on unmount or when searchQuery changes
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [searchQuery, fetchUsers]); // Only searchQuery is a dependency

  // Handle click on a found user
  const handleUserClick = (user) => {
    console.log("User clicked:", user);

    // Check if the user is already in the chat list
    if (!chatUser.some((u) => u._id === user._id)) {
      setChatUser((prev) => [...prev, user]); // Add the user to the chat list
      console.log("Chat User List Updated:", chatUser);
    }

    // Dispatch the selected user to Redux
    dispatch(setSelectedUsers(user));
    console.log("Selected User Dispatched to Redux:", user);

    setFoundUser([]); // Clear the search results
    setSearchQuery(""); // Clear the search query 
  };

  const handleChatUserClick = (user) => {
    dispatch(setSelectedUsers(user)); // Set the clicked user as the selected user
  };

  return (
    <div className="relative min-h-screen px-8">
      <div className="h-full w-auto p-6 flex gap-4 items-center">
        <form
          onSubmit={(e) => e.preventDefault()} // Prevent form submission
          className="flex items-center border-2 border-purple-400 rounded-full py-2 px-4 text-white"
        >
          <input
            className="flex-1 bg-transparent outline-none text-xl placeholder-gray-400"
            type="text"
            value={searchQuery}
            placeholder="Search user"
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
          <button
            type="button" // Prevent form submission
            className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-orange-700 hover:bg-orange-500 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <SearchIcon />
            )}
          </button>
        </form>
        <img
          onClick={() => navigate(`/profile/${authUser?.id}`)}
          className="h-20 w-20 rounded-full bg-cover"
          src={authUser?.profilePic || "https://via.placeholder.com/150"} // Fallback image
          alt="Profile"
        />
      </div>

      {/* Display found users if there are search results */}
      {foundUser.length > 0 && (
        <div className="p-4">
          {foundUser.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className="flex items-center gap-3 p-4 hover:bg-yellow-300 bg-yellow-200 cursor-pointer rounded-2xl mb-3"
            >
              <img
                src={user.profilePic || "https://via.placeholder.com/150"}
                alt={user.fullName.firstName}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-lg">
                  {user.fullName.firstName} {user.fullName.lastName}
                </span>
                <span className="text-sm text-orange-700">{user.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display chat users */}
      <div className="overflow-y-auto scrollbar min-h-[70%]">
        {foundUser.length === 0 && chatUser.length === 0 ? (
          <div className="font-mono items-center flex flex-col text-2xl text-black">
            <h1>Let us find someone to talk..</h1>
          </div>
        ) : (
          <>
            {chatUser.map((user) => (
              <div
                key={user._id}
                onClick={() => handleChatUserClick(user)}
                className={`flex items-center gap-3 p-4 hover:bg-yellow-300 ${
                  selectedUser?._id === user._id
                    ? "bg-green-200"
                    : "bg-yellow-200"
                } cursor-pointer rounded-2xl mb-3`}
              >
                <img
                  src={user.profilePic || "https://via.placeholder.com/150"}
                  alt={user.fullName.firstName}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-lg">
                    {user.fullName.firstName} {user.fullName.lastName}
                  </span>
                  <span className="text-sm text-orange-700">{user.email}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="absolute top-0 right-0 h-full w-[1px] bg-purple-100"></div>
    </div>
  );
}
