/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

// Create the SocketContext
const SocketContext = createContext();

// Custom hook to use the SocketContext
export const useSocketContext = () => {
  return useContext(SocketContext);
};

// SocketContextProvider component
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuth(); // Call useAuth as a function

  useEffect(() => {
    let newSocket;

    if (authUser) {
      // Connect to the Socket.IO server
      newSocket = io("http://localhost:8000/", {
        query: {
          userId: authUser?.id,
        },
      });
      console.log("Client connected with userId:", authUser?.id);

      // Listen for "getOnlineUsers" event
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Save the socket instance to state
      setSocket(newSocket);
    }

    // Cleanup function to close the socket
    return () => {
      if (newSocket) {
        newSocket.off("getOnlineUsers");
        newSocket.close();
      }
    };
  }, [authUser]); // Only depend on `authUser`

  // Provide the socket and onlineUsers to the context
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
